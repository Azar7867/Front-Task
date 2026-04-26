# DaivAI - AI Chat Web Application

## Project Overview
DaivAI is a modern, responsive React-based AI chat application designed to replicate a ChatGPT-like interface. It allows users to manage multiple chat sessions, switch between different AI engines (mocked functionality), send messages, and edit or delete their message history.

## Features Implemented
- **Chat Management**: Create new chats, switch between existing chats, edit chat titles, and delete chats with confirmation.
- **Message System**: Send messages and display them in a clean, scrollable interface. Simulates AI responses with a typing delay.
- **Message Actions**: Edit or delete specific user messages with hover actions.
- **AI Engine Selection**: A dropdown to select between different AI personas (Neural Nexus, Cerebral Prime, etc.).
- **Data Persistence**: All chats, titles, and messages are persisted in the browser's `localStorage` so they remain after a page reload.
- **Responsive Layout**: A 2-column layout that collapses gracefully on smaller screens, using a mobile hamburger menu for the sidebar.
- **Markdown Support**: Renders AI and user messages using React Markdown for structured text output.

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd "FrontEnd Task"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit the local URL provided by Vite (usually `http://localhost:5173`).

## Technologies Used
- **React 18** (Functional Components + Hooks)
- **Vite** (Build tool)
- **Tailwind CSS** (Utility-first styling, clean white minimal theme)
- **Lucide React** (Clean SVG icons)
- **React Markdown** (Markdown rendering)
- **UUID** (Unique ID generation for chats and messages)
