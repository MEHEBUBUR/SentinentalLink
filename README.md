# SentinelLink - Enterprise URL Intelligence

An advanced AI-powered URL analysis tool that detects phishing, malware, and malicious links using deep heuristic scanning and Google Gemini intelligence.

## Prerequisites

- [Node.js](https://nodejs.org/) (Version 16 or higher)
- A Google Gemini API Key

## Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure API Key:**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_actual_api_key_here
    ```

## Commands

### Start Development Server
Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
```bash
npm run dev
```

### Build for Production
Builds the app for production to the `dist` folder.
```bash
npm run build
```

### Preview Production Build
Locally preview the production build.
```bash
npm run preview
```

## Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS (via CDN)
- **AI Model:** Google Gemini (@google/genai)
- **Visualization:** Recharts
- **Icons:** Lucide React
