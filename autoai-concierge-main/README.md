# AutoAI Concierge

A premium, AI-powered car dealership landing page and chatbot experience.

## Features
- **Landing Page**: Modern, responsive design using React, Tailwind CSS, and shadcn/ui.
- **AI Chatbot**: "Kevin", a context-aware sales assistant powered by Hugging Face Inference (Qwen 2.5).
- **Inventory Integration**: Real-time car data access and dynamic card rendering.

## fast Setup

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Run Development Server**:
   ```sh
   npm run dev
   ```

3. **Build for Production**:
   ```sh
   npm run build
   ```

## Project Structure
- `src/pages/Demo.tsx`: Main chatbot interface.
- `src/api/chat.js`: AI logic and system prompt.
- `src/components/chat/`: Chat-specific UI components.
- `src/data/cars.js`: Mock inventory data.
