import google.generativeai as genai

# --- YOUR KEY ---
GEMINI_API_KEY = "AIzaSyA1jboZoiYvNAESsBly8AdQCy11DqBJLI4"

genai.configure(api_key=GEMINI_API_KEY)

print("🔍 Checking available Gemini models for your API key...")

try:
    available_models = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - Found: {m.name}")
            available_models.append(m.name)
            
    if not available_models:
        print("❌ No models found! Your API key might be invalid or restricted.")
    else:
        print("\n✅ SUCCESS! Pick one of the names above and put it in main.py")
        
except Exception as e:
    print(f"CRITICAL ERROR: {e}")