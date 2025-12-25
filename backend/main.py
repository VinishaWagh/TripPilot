from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import requests
import random
import os
from dotenv import load_dotenv # Import the security tool

# --- LOAD SECRETS ---
load_dotenv() # This reads your hidden .env file

# --- CREDENTIALS ---
CLIENT_ID = 'manaspathak11041-api-client'
CLIENT_SECRET = 'kRIXvc1OIrircnJEnxZd8c3QbdJz6hK1' 

# 🔒 Securely load the key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ CRITICAL ERROR: GEMINI_API_KEY not found! Did you create the .env file?")

# --- CONFIGURATION ---
TOKEN_URL = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
API_URL = "https://opensky-network.org/api/states/all"
CURRENT_TOKEN = None

# Configure Gemini
try:
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        # using the 'latest' alias which is definitely supported
        model = genai.GenerativeModel('gemini-flash-latest') 
        print("✅ Gemini Configured Successfully (Secure Mode)")
    else:
        model = None
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
    print("⚠️ USING SIMULATION DATA (API Limit or Error) ⚠️")
    flights = []
    routes = [(28.55, 77.10), (19.09, 72.87), (12.97, 77.59), (13.08, 80.27), (22.57, 88.36)]
    airlines = ["IGO", "AIC", "VTI", "SEJ"]
    
    for i in range(25):
        start = random.choice(routes)
        flights.append({
            "icao24": f"sim_{i}",
            "callsign": f"{random.choice(airlines)}{random.randint(100,999)}",
            "lat": start[0] + random.uniform(-6, 6),
            "lon": start[1] + random.uniform(-6, 6),
            "heading": random.randint(0, 360),
            "altitude": random.randint(5000, 12000),
            "velocity": random.randint(200, 280),
            "status": "In Air"
        })
    return flights

# --- OAUTH HELPER ---
def get_access_token():
    global CURRENT_TOKEN
    payload = {'grant_type': 'client_credentials', 'client_id': CLIENT_ID, 'client_secret': CLIENT_SECRET}
    try:
        response = requests.post(TOKEN_URL, data=payload, timeout=5)
        if response.status_code == 200:
            CURRENT_TOKEN = response.json().get('access_token')
            return CURRENT_TOKEN
    except:
        return None
    return None

def get_opensky_data(params):
    global CURRENT_TOKEN
    if not CURRENT_TOKEN: get_access_token()
    
    headers = {'Authorization': f'Bearer {CURRENT_TOKEN}'}
    try:
        response = requests.get(API_URL, headers=headers, params=params, timeout=5)
        
        if response.status_code == 429: # Rate Limit
            print("❌ OpenSky Rate Limit (429) Hit!")
            return None
            
        if response.status_code == 401: # Token expired
            get_access_token()
            return None 

        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Connection Error: {e}")
    return None

# --- ENDPOINTS ---

@app.get("/api/flights/active")
def get_active_flights_india():
    params = {'lamin': 6.0, 'lomin': 68.0, 'lamax': 37.0, 'lomax': 97.0}
    data = get_opensky_data(params)
    
    if not data or 'states' not in data or data['states'] is None:
        return {"flights": generate_simulation()}

    flights = []
    for s in data['states']: 
        if s[5] is None or s[6] is None: continue
        flights.append({
            "icao24": s[0],
            "callsign": s[1].strip() if s[1] else "Unknown",
            "lat": s[6], "lon": s[5],
            "heading": s[10] or 0, "altitude": s[7] or 0, "velocity": s[9] or 0,
            "status": "In Air" 
        })
        
    if len(flights) == 0: return {"flights": generate_simulation()}
    return {"flights": flights}

@app.post("/api/track-flight")
def track_flight(request: FlightRequest):
    return {
        "flight_info": {"live": True, "altitude": 32000, "velocity": 850},
        "ai_analysis": "**Analysis:** Flight is on standard approach path. Weather conditions are clear."
    }

@app.post("/api/chat")
def chat_with_copilot(request: ChatRequest):
    print(f"DEBUG: Chat Query: {request.message}")
    print(f"DEBUG: Context: {request.context}") # See what the frontend is sending
    
    if not model:
        return {"response": "AI System Offline (Check API Key)."}

    # Enhanced System Prompt for Context & Jargon
    system_instruction = """
    You are 'Captain Gemini', an expert pilot assistant for TripPilot.
    
    YOUR SUPERPOWERS:
    1. CONTEXT AWARENESS: Use the 'Current Context' provided below to answer questions about specific flights. 
       - If the user asks "Is it delayed?", check the context status.
       - If the user asks "How high are we?", check the context altitude.
    
    2. JARGON TRANSLATOR: If the user uses aviation terms (like 'Turbulence', 'Crosswind', 'Taxiing', 'Squawk'), 
       explain them in simple, fun terms for a passenger.
    
    TONE: Professional, reassuring, but concise (max 3 sentences).
    """
    
    try:
        # Combine System Prompt + Context + User Query
        full_prompt = f"{system_instruction}\n\nCURRENT CONTEXT: {request.context}\n\nUSER QUESTION: {request.message}"
        
        response = model.generate_content(full_prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"response": "I'm experiencing radio interference. Please ask again."}