# Vazhikaatti 🌿
### *Navigate Smarter. Stay Safer.*

> A community-driven safety map that helps you discover nearby hazards, report issues, and make informed travel decisions in real time.

---

## 🗺️ Project Description

**Vazhikaatti** (Malayalam for *"one who shows the way"*) is a community-powered public safety web platform that allows users to view real-time safety alerts around them, report local hazards, and plan safer routes based on crowd-sourced data. It acts as a live hyperlocal safety layer on top of city maps.

In cities, people face everyday risks — stray dogs, poor lighting, flooded roads, potholes — that are rarely reported officially in real time. Vazhikaatti bridges the gap between hazard occurrence and public awareness by turning every citizen into a safety contributor.

**Think:** Google Maps + Community Safety Alerts, focused purely on hyperlocal hazards and civic safety.

---

## ✨ Features

- 🗺️ **Live Hazard Map** — Interactive map powered by Leaflet.js and OpenStreetMap showing community-reported hazard markers in real time
- 📍 **Report an Issue** — Submit hazard reports with photo, description, category, severity, and GPS location
- 🧭 **Journey Mode** — Plan routes from point A to B and see hazard markers along your path via OpenRouteService API
- 🖼️ **AI Image Validation** — CLIP model (OpenAI) used for intelligent image validation of uploaded hazard photos
- ✏️ **My Reports** — View, edit, and delete your own submitted reports with a swipeable card interface


---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (TypeScript) |
| Backend | FastAPI (Python) |
| AI / ML | CLIP Model (OpenAI) |
| Map Rendering | Leaflet.js |
| Map Data | OpenStreetMap |
| Routing | OpenRouteService API |
| Auth | Google OAuth |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.jpg)
*Vazhikaatti — Navigate Smarter. Stay Safer.*
![Screenshot_20260228_071202](https://github.com/user-attachments/assets/caf7032a-a465-4689-9bef-d263cf69afa4)

### Sign In
![Sign In](screenshots/signin.jpg)
*Google OAuth login screen with the Vazhikaatti mascot*
![Screenshot_20260228_071221](https://github.com/user-attachments/assets/8f722068-64ae-4055-a54f-5c97155b266f)

### Profile Setup
![Profile Setup](screenshots/profile.jpg)
*Onboarding profile completion screen guided by the Vazhikaatti owl*
![Screenshot_20260228_071314](https://github.com/user-attachments/assets/d6a42fab-9d21-48bd-b155-4295461677d1)

### Live Hazard Map
![Hazard Map](screenshots/map_overview.jpg)
*![Screenshot_20260228_071334](https://github.com/user-attachments/assets/90856a7a-04f0-4bdc-8cb5-c8f8b236fb18)
Dashboard map showing live hazard markers across Kalamassery, Kochi*

### Location Enabled View
![Location Enabled](screenshots/map_location.jpg)
*User location shown with proximity radius and nearby hazard markers*
![Screenshot_20260228_071347](https://github.com/user-attachments/assets/6e0a9545-adda-48f4-9956-568acb79ae43)

### Journey Mode – Route Planning
![Plan Route](screenshots/plan_route.jpg)
*Pl![Screenshot_20260228_071353](https://github.com/user-attachments/assets/eb7dc213-63c6-4219-bc11-68d3f61d6071)
an Rout![Screenshot_20260228_071425](https://github.com/user-attachments/assets/694beedc-69d1-4cc4-9c66-90cea2890aa7)
e dialog with start and destination input*

### Journey Mode – Route Results
![Route Results](screenshots/route_results.jpg)
*3 routes found with![Screenshot_20260228_071432](https://github.com/user-attachments/assets/ca3e6834-9a04-4ae1-a02a-8948e4086cc2)
 distance, duration, and steps displayed*

### Journey Mode – Route on Map
![Route Map](screenshots/route_map.jpg)
*Routes rendered on map with hazard markers along the path*
![Screenshot_20260228_071440](https://github.com/user-attachments/assets/2b78384f-ceaa-4ccb-8345-69174f133218)

### Hazard Popup – Stray Dogs
![Stray Dogs Popup](screenshots/popup_dogs.jpg)
*Report popup sho![Screenshot_20260228_071511](https://github.com/user-attachments/assets/e4ab6f7c-784b-46c2-b4e0-922ea9d4c854)
wing stray dog sighting with severity rating*

### Hazard Popup – Poor Lighting
![Poor Lighting Popup](screenshots/popup_lighting.jpg)
*Report popup showing poor lighting alert along a route*
![Screenshot_20260228_071522](https://github.com/user-attachments/assets/942d219b-09d9-4665-8be7-f3e8afa5a1ca)

### My Reports – Card View
![My Repo![Screenshot_20260228_073224](https://github.com/user-attachments/assets/8cf789cf-43f4-4d4e-bad7-acd4e935785b)
rts](screenshots/my_reports_1.jpg)
*User's submitted reports with category tag, severity stars, and location*

### My Reports – Edit/Delete
![My Reports Edit](screenshots/my_reports_2.jpg)
*Report management with Edit and Delete actions*
![Screenshot_20260228_073231](https://github.com/user-attachments/assets/131ea10c-d331-4dce-a542-defafd206887)

---

## 🎥 Demo Video

> 📹 [Watch Demo on YouTube](#) *(add your link here)*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER BROWSER                     │
│                                                     │
│   Next.js 14 (TypeScript) + Leaflet.js              │
│   ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│   │  Map UI  │  │ Report   │  │  Journey Mode   │  │
│   │(Leaflet) │  │  Form    │  │  (Route Plan)   │  │
│   └────┬─────┘  └────┬─────┘  └────────┬────────┘  │
└────────┼─────────────┼─────────────────┼────────────┘
         │             │                 │
         ▼             ▼                 ▼
┌─────────────────────────────────────────────────────┐
│               FastAPI Backend (Python)              │
│                                                     │
│   ┌──────────────┐     ┌────────────────────────┐  │
│   │  Report API  │     │  CLIP Model (OpenAI)   │  │
│   │  (CRUD ops)  │     │  Image Classification  │  │
│   └──────┬───────┘     └────────────────────────┘  │
│          │                                          │
│   ┌──────▼───────┐     ┌────────────────────────┐  │
│   │   Database   │     │  Safety Score Engine   │  │
│   │  (Reports,   │     │  (Proximity + Severity │  │
│   │   Users)     │     │   + Recency)           │  │
│   └──────────────┘     └────────────────────────┘  │
└────────────────────────────┬────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌──────────┐ ┌────────────────┐
     │ OpenStreetMap│ │ ORS API  │ │  Google OAuth  │
     │  (Map Tiles) │ │ (Routes) │ │    (Auth)      │
     └──────────────┘ └──────────┘ └────────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip

---

### Frontend (Next.js)

```bash
# Clone the repository
git clone https://github.com/bonitoflakesorg/vazhikaatti.git
cd vazhikaatti/client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your keys to .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_ORS_API_KEY=your_openrouteservice_key
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Start the development server
npm run dev
```

### Backend (FastAPI)

```bash
cd vazhikaatti/server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your keys to .env:
# DATABASE_URL=your_db_url
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# Start the backend server
uvicorn app.main:app --reload
```

---

## ▶️ Run Commands

```bash
# Frontend
cd client && npm run dev        # http://localhost:3000

# Backend
cd server && uvicorn app.main:app --reload   # http://localhost:8000

# API Docs (auto-generated by FastAPI)
# http://localhost:8000/docs
```

---

## 👩‍💻 Team Members

| Name | Role | College |
|------|------|---------|
| Mehrin Fathima Shamim | Backend (FastAPI) + Auth | Government Model Engineering College, Thrikkakara |
| Diya Jojo | Frontend (Next.js) + Map Integration | Government Model Engineering College, Thrikkakara |


---

## 🎯 Target Audience

Daily commuters, students, women traveling alone, delivery drivers, elderly citizens, and urban residents who want safer, more informed travel.

---

## 🌍 Future Roadmap

- AI-based hazard clustering and heatmaps
- SMS alert system for high-severity zones
- Government / NGO dashboard integration
- Verified report badges
- Predictive risk zones using historical data

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Made with ❤️ at TinkerHub — *Tink-Her-Hack 4.0*
