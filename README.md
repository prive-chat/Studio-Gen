# StudioGen AI - Intelligent Visual Creative Studio

StudioGen AI is a state-of-the-art visual generation platform that leverages Google's Gemini models to turn simple ideas into professional-grade images and cinematic concepts.

## 🚀 Features

- **Full-Stack Architecture**: Secure Node.js/Express backend that keeps API keys hidden from the client.
- **AI-Powered Prompt Engineering**: Integrated prompt refiner that transforms basic descriptions into high-detail artistic instructions.
- **Dynamic Image Generation**: Powered by the latest Imagen models, supporting multiple aspect ratios and professional styles.
- **Cinematic Storyboarding**: Automatically generates narrative scripts and visual previews based on user concepts.
- **Responsive Design**: Fluid, mobile-first interface built with Tailwind CSS and Framer Motion.
- **Session Gallery**: Interactive history of generated assets with one-click restoration and download.
- **Safe Full-Screen Mode**: Immersive, clutter-free viewing for high-definition asset inspection.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion (Lucide Icons).
- **Backend**: Express, Node.js (TSX runtime).
- **AI Engine**: Google Gemini (Imagen-3 for Images, Gemini-2.0 for Text/Refinement).
- **Styling**: Modern dark theme with Glassmorphism and Cinematic effects.

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed.
- A Google Gemini API Key.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd studiogen-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=development
```

### 4. Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 🔐 Security
This project uses a server-side proxy for all AI requests. **NEVER** commit your `.env` file to your repository. The `server.ts` handles the API Key safely on the server side.

## 📜 License
Apache-2.0
