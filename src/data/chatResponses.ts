interface ChatResponse {
  keywords: string[];
  response: string;
  type: 'weather' | 'flight' | 'amenity' | 'general' | 'help';
}

export const chatResponses: ChatResponse[] = [
  {
    keywords: ['weather', 'delhi', 'del'],
    response: "🌫️ **Delhi Weather Alert**\n\nCurrent conditions at DEL:\n- Temperature: 12°C\n- Condition: Dense Fog\n- Visibility: 200m\n\n⚠️ **Alert:** Dense fog advisory in effect. Expect significant delays for morning departures. Visibility expected to improve after 10 AM IST.",
    type: 'weather'
  },
  {
    keywords: ['weather', 'mumbai', 'bom'],
    response: "🌧️ **Mumbai Weather Update**\n\nCurrent conditions at BOM:\n- Temperature: 28°C\n- Condition: Monsoon Showers\n- Visibility: 3km\n\n⚠️ **Alert:** Heavy monsoon rains expected. Some evening flights may experience delays. Stay updated with your airline.",
    type: 'weather'
  },
  {
    keywords: ['weather', 'bangalore', 'blr', 'bengaluru'],
    response: "⛅ **Bangalore Weather**\n\nCurrent conditions at BLR:\n- Temperature: 24°C\n- Condition: Partly Cloudy\n- Visibility: 8km\n\n✅ All flights operating normally. Pleasant weather expected throughout the day.",
    type: 'weather'
  },
  {
    keywords: ['ai101', 'flight ai101'],
    response: "✈️ **Flight AI101 Status**\n\n**Air India** | Delhi → Mumbai\n\n- Departure: 06:30 IST (On Time)\n- Expected Arrival: 08:45 IST\n- Status: **In Air** 🔵\n- Current Position: Over Madhya Pradesh\n- Altitude: 35,000 ft\n- Speed: 520 knots\n\nThe flight is currently en route and expected to arrive on schedule.",
    type: 'flight'
  },
  {
    keywords: ['6e234', 'flight 6e234', 'indigo 234'],
    response: "✈️ **Flight 6E234 Status**\n\n**IndiGo** | Bangalore → Delhi\n\n- Departure: 07:15 IST\n- Expected Arrival: 10:00 IST\n- Status: **In Air** 🔵\n- Current Position: Over Maharashtra\n- Altitude: 38,000 ft\n\nFlight is progressing smoothly. No delays expected.",
    type: 'flight'
  },
  {
    keywords: ['sg456', 'flight sg456', 'spicejet 456'],
    response: "⚠️ **Flight SG456 Status**\n\n**SpiceJet** | Kolkata → Mumbai\n\n- Scheduled Departure: 08:00 IST\n- Status: **DELAYED** 🟡\n- New Estimated Departure: 09:30 IST\n- Gate: T2-28\n\n**Reason:** Weather conditions at Kolkata. Haze reducing visibility.\n\nPlease check with SpiceJet customer service for updates.",
    type: 'flight'
  },
  {
    keywords: ['delay', 'delayed', 'risk'],
    response: "📊 **Delay Risk Analysis**\n\nBased on current weather conditions:\n\n🔴 **High Risk:**\n- Delhi (DEL): Dense fog - 85% delay probability\n\n🟡 **Moderate Risk:**\n- Mumbai (BOM): Monsoon - 40% delay probability\n- Kolkata (CCU): Haze - 35% delay probability\n- Kochi (COK): Rain - 25% delay probability\n\n🟢 **Low Risk:**\n- Bangalore, Hyderabad, Chennai, Goa - Normal operations",
    type: 'weather'
  },
  {
    keywords: ['restaurant', 'food', 'eat', 'blr', 'bangalore'],
    response: "🍽️ **Restaurants at BLR Airport**\n\n1. **Karavalli** ⭐ 4.4\n   Coastal Karnataka cuisine | T1 | 6AM-10PM\n\n2. **The Beer Café** ⭐ 4.3\n   Craft beers & pub food | T2 | 11AM-11PM\n\n3. **Plaza Premium Lounge** ⭐ 4.5\n   Buffet dining | T1 | 24/7\n\nWould you like recommendations for a specific terminal?",
    type: 'amenity'
  },
  {
    keywords: ['restaurant', 'food', 'eat', 'del', 'delhi'],
    response: "🍽️ **Restaurants at DEL Airport**\n\n1. **Punjab Grill** ⭐ 4.5\n   North Indian | T3 | 6AM-11PM\n\n2. **Café Coffee Day** ⭐ 4.0\n   Coffee & snacks | T1 | 5AM-12AM\n\n3. **Maharaja Lounge** ⭐ 4.8\n   Premium dining | T3 | 24/7\n\nT3 has the best dining options!",
    type: 'amenity'
  },
  {
    keywords: ['lounge', 'waiting', 'rest'],
    response: "🛋️ **Premium Lounges Available**\n\nTop-rated lounges across Indian airports:\n\n1. **Maharaja Lounge** - DEL T3 ⭐ 4.8\n   Spa services, premium dining\n\n2. **GVK Lounge** - BOM T2 ⭐ 4.7\n   Art-themed, world-class amenities\n\n3. **Encalm Lounge** - HYD T1 ⭐ 4.6\n   Hyderabadi cuisine specialty\n\nMost lounges offer Priority Pass access.",
    type: 'amenity'
  },
  {
    keywords: ['duty free', 'shopping', 'shop'],
    response: "🛍️ **Shopping at Indian Airports**\n\n**Best Duty-Free Stores:**\n- DEL T3: DFS Duty Free - Luxury brands, spirits\n- BOM T2: World-class international brands\n\n**Bookstores:**\n- WHSmith available at most major airports\n\n**Tip:** Prices are generally 20-30% lower than retail. Pre-order online for additional discounts!",
    type: 'amenity'
  },
  {
    keywords: ['atm', 'money', 'cash', 'currency', 'forex'],
    response: "💰 **Banking Services**\n\n**ATMs available 24/7 at all terminals:**\n- SBI, HDFC, ICICI, Axis Bank\n\n**Currency Exchange:**\n- Thomas Cook & BookMyForex at major airports\n- Best rates at T3 DEL and T2 BOM\n\n**Tip:** Airport forex rates are usually 2-3% higher than city centers.",
    type: 'amenity'
  },
  {
    keywords: ['help', 'what can', 'how to', 'commands'],
    response: "👋 **Welcome to SkyPort AI!**\n\nI can help you with:\n\n✈️ **Flight Information**\n- \"What's the status of AI101?\"\n- \"Is 6E234 on time?\"\n\n🌤️ **Weather Updates**\n- \"Weather in Delhi\"\n- \"Is there fog at DEL?\"\n\n🍽️ **Airport Amenities**\n- \"Restaurants at BLR\"\n- \"Lounges in Mumbai\"\n\n📊 **Delay Predictions**\n- \"Delay risk for my flight\"\n\nJust type your question naturally!",
    type: 'help'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good'],
    response: "👋 **Hello! Welcome to SkyPort AI**\n\nI'm your intelligent aviation assistant for Indian airports.\n\nHow can I help you today? You can ask me about:\n- Flight status and tracking\n- Weather conditions and alerts\n- Airport amenities and services\n- Delay predictions\n\n✈️ Happy travels!",
    type: 'general'
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    response: "✨ You're welcome! Have a safe and pleasant journey!\n\nFeel free to ask if you need any more assistance. SkyPort AI is here 24/7 for all your travel needs. ✈️",
    type: 'general'
  }
];

export const findResponse = (query: string): string => {
  const q = query.toLowerCase();
  
  for (const response of chatResponses) {
    if (response.keywords.some(keyword => q.includes(keyword))) {
      return response.response;
    }
  }
  
  return "🤔 I'm not sure about that specific query.\n\nTry asking me about:\n- Flight status (e.g., \"AI101 status\")\n- Weather (e.g., \"weather in Delhi\")\n- Airport amenities (e.g., \"restaurants at BLR\")\n- Delay predictions\n\nType **help** for more options!";
};
