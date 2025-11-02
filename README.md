# 🚀 Advanced Radar System 

A **real-time radar simulation system** with enhanced object detection, audio alerts, text-to-speech notifications, and image capture capabilities.

**GitHub Description:**  
> Real-time radar simulation with object detection, audio alerts, TTS notifications, and image capture for monitoring and analysis.

---

## ✨ Features

- **Real-time Radar Display** – 180-degree scanning with dynamic object detection  
- **Audio Alerts** – Multi-level beeps with critical object warnings  
- **Text-to-Speech** – Voice announcements for detected objects via ElevenLabs API  
- **Object Tracking** – Tracks objects across scans  
- **Image Capture** – Save radar screenshots with detected objects  
- **Extended Range** – Up to 500cm with distance classification  
- **Responsive Design** – Works on desktop and mobile devices  

---

## 🏗️ Tech Stack

- **Frontend:** React 18 + TypeScript  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS  
- **UI Components:** shadcn/ui  
- **Voice:** ElevenLabs Text-to-Speech API  
- **Routing:** React Router  

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+  
- npm or yarn  
- ElevenLabs API key (optional; falls back to browser TTS)  

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project folder
cd <your-project-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

1. Launch the app  
2. Enter ElevenLabs API key in the API Key Input panel (optional)  
3. Toggle scanning to start the radar  

---

## 🛠️ Usage

### Control Panel

- **Start/Stop Scanning** – Toggle radar scanning  
- **Beep Sounds** – Enable/disable audio alerts  
- **Object Tracking** – Enable/disable persistent object tracking  
- **Alert System** – Enable/disable critical distance alerts  

### Detection Zones

| Zone      | Distance | Alert Type         |
|-----------|----------|-----------------|
| Critical  | < 80cm   | Red alert       |
| Close     | 80-150cm | Detection beep  |
| Medium    | 150-250cm| Visual only     |
| Distant   | 250-350cm| Visual only     |
| Remote    | 350-500cm| Visual only     |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ApiKeyInput.tsx      # API key configuration
│   ├── ControlPanel.tsx     # Scan controls
│   ├── DataPanel.tsx        # Real-time data display
│   ├── ImageCapture.tsx     # Screenshot functionality
│   └── RadarDisplay.tsx     # Main radar visualization
├── hooks/
│   └── useTextToSpeech.ts   # ElevenLabs integration
├── pages/
│   └── Index.tsx            # Main application page
└── utils/
    └── audioUtils.ts        # Audio beep generation
```

---

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

