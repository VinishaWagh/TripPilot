from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import random
import os
from dotenv import load_dotenv
from FlightRadar24 import FlightRadar24API

# --- LOAD SECRETS ---
load_dotenv()

# --- CONFIGURATION ---
fr_api = FlightRadar24API()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# --- SMART SORTING DATA ---
# We use sets for O(1) lookups. "Frozenset" handles both directions (DEL->BOM or BOM->DEL).
BUSY_ROUTES = {
    frozenset(["DEL", "BOM"]), frozenset(["BOM", "DEL"]),
    frozenset(["DEL", "BLR"]), frozenset(["BLR", "DEL"]),
    frozenset(["BOM", "BLR"]), frozenset(["BLR", "BOM"]),
    frozenset(["DEL", "CCU"]), frozenset(["CCU", "DEL"]),
    frozenset(["DEL", "HYD"]), frozenset(["HYD", "DEL"]),
    frozenset(["BOM", "GOI"]), frozenset(["GOI", "BOM"]),
    frozenset(["MAA", "DEL"]), frozenset(["DEL", "MAA"]),
}

MAJOR_HUBS = {"DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "GOI", "PNQ", "AMD", "COK"}

# Configure Gemini
try:
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest') 
        print("✅ Gemini Configured Successfully")
    else:
        model = None
        print("⚠️ Gemini Key Missing - AI will be offline")
except Exception as e:
    print(f"Gemini Config Error: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FlightRequest(BaseModel):
    icao24: str 

class ChatRequest(BaseModel):
    message: str
    context: str = "General Query"

# --- SIMULATION FALLBACK ---
def generate_simulation():
    print("⚠️ USING SIMULATION DATA (Connection Error or No Flights) ⚠️")
    flights = []
    # Realistic backup routes matching our "Busy" logic
    backup_routes = [
        ("DEL", "BOM", "IGO202", "IndiGo"),
        ("BOM", "BLR", "AIC405", "Air India"),
        ("CCU", "DEL", "VTI707", "Vistara"),
        ("BLR", "GOI", "IGO55", "IndiGo"),
        ("HYD", "MAA", "SEJ332", "SpiceJet")
    ]
    
    for i in range(25):
        route = random.choice(backup_routes)
        flights.append({
            "id": f"sim_{i}",
            "flightNumber": route[2],
            "airline": route[3],
            "origin": route[0],
            "destination": route[1],
            "lat": 20.59 + random.uniform(-8, 8),
            "lon": 78.96 + random.uniform(-8, 8),
            "heading": random.randint(0, 360),
            "altitude": random.randint(15000, 38000),
            "speed": random.randint(250, 480),
            "status": "In Air"
        })
    return flights

# --- ENDPOINTS ---

@app.get("/api/flights/active")
def get_active_flights_india():
    try:
        # 1. Define Area: Box around India (North 37, South 6, West 68, East 97)
        bounds = "37,6,68,97" 
        
        # 2. Fetch Real Flights
        real_flights = fr_api.get_flights(bounds=bounds)
        
        processed_flights = []
        
        for f in real_flights:
            # --- CRASH PREVENTION CHECKS ---
            flight_num = getattr(f, 'callsign', 'Unknown')
            
            # Safe Airline Name Extraction
            airline_name = "Unknown Airline"
            if hasattr(f, 'airline_short_name'):
                airline_name = f.airline_short_name
            elif hasattr(f, 'airline_icao'):
                airline_name = f.airline_icao
            
            # Safe Route Extraction
            origin = getattr(f, 'origin_airport_iata', 'N/A')
            dest = getattr(f, 'destination_airport_iata', 'N/A')
            
            # FILTER: Must have valid route
            if origin == 'N/A' or dest == 'N/A':
                continue

            # --- SMART SCORING LOGIC ---
            # Calculate a "Importance Score" for sorting
            priority_score = 0
            
            # Check if it's a BUSY ROUTE (e.g. DEL-BOM) -> Score 3
            if frozenset([origin, dest]) in BUSY_ROUTES:
                priority_score = 3
            # Check if both ends are MAJOR HUBS -> Score 2
            elif origin in MAJOR_HUBS and dest in MAJOR_HUBS:
                priority_score = 2
            # Check if at least one end is a HUB -> Score 1
            elif origin in MAJOR_HUBS or dest in MAJOR_HUBS:
                priority_score = 1
            
            processed_flights.append({
                "id": f.id,
                "flightNumber": flight_num,
                "airline": airline_name,
                "origin": origin,
                "destination": dest,
                "lat": f.latitude,
                "lon": f.longitude,
                "heading": f.heading,
                "altitude": f.altitude,
                "speed": f.ground_speed, 
                "status": "In Air",
                "priority": priority_score # Used for sorting
            })
            
        if not processed_flights:
            return {"flights": generate_simulation()}
            
        # 3. SORTING: 
        # First by Priority (Score), Then by Altitude (Signal Quality)
        # We take top 50, but since they are sorted by popularity, the top 20 will be the best ones.
        sorted_flights = sorted(
            processed_flights, 
            key=lambda x: (x['priority'], x['altitude']), 
            reverse=True
        )[:50]
        
        return {"flights": sorted_flights}

    except Exception as e:
        print(f"FlightRadar Error: {e}")
        return {"flights": generate_simulation()}

@app.post("/api/track-flight")
def track_flight(request: FlightRequest):
    return {
        "flight_info": {"live": True, "altitude": 32000, "velocity": 450},
        "ai_analysis": "**Analysis:** Flight is on standard approach path."
    }

@app.post("/api/chat")
def chat_with_copilot(request: ChatRequest):
    if not model: return {"response": "AI Offline."}
    
    system_instruction = """
    You are 'Captain Gemini', an expert pilot assistant for TripPilot.
    
    YOUR SUPERPOWERS:
    1. REAL DATA: The 'Current Context' now contains REAL routes.
       - If asked "Where is this going?", read the destination.
    2. JARGON TRANSLATOR: Explain terms like "Knots" simply.
    3. TONE: Professional, reassuring, but concise.
    """
    try:
        full_prompt = f"{system_instruction}\n\nCURRENT CONTEXT: {request.context}\n\nUSER QUESTION: {request.message}"
        response = model.generate_content(full_prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"response": "I'm experiencing radio interference."}