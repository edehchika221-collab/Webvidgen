# WebVidGen 🎥

> **Turn any website URL into a stunning AI-generated video preview instantly using Google Gemini Veo.**

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="WebVidGen Banner" width="100%" />
</div>

## ✨ Features

- **🚀 Instant Video Generation**: Paste a URL and get a high-quality video preview in seconds.
- **🎨 Smart Theme Extraction**: Automatically analyzes the website's color palette and vibe to match the video style.
- **🗣️ AI Voiceover**: Optional narration in multiple languages (English, Spanish, French, etc.) with various voice styles.
- **📝 Prompt Editor**: Review and fine-tune the AI-generated prompt before video creation for perfect results.
- **💎 Premium UI**: A beautiful, glassmorphism-inspired interface with smooth animations and dark mode support.
- **💾 Download & Share**: Easily download your generated videos as MP4 files.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS (with custom animations & glassmorphism)
- **AI Models**: 
  - **Gemini Veo**: For video generation
  - **Gemini 1.5 Pro**: For site analysis and script writing
  - **Google TTS**: For voice synthesis

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Gemini API Key** (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/webvidgen.git
    cd webvidgen
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

1.  **Enter URL**: Paste the link of the website you want to showcase.
2.  **Configure**: Choose your aspect ratio (16:9 for YouTube, 9:16 for TikTok/Reels) and enable voiceover if desired.
3.  **Review Prompt**: The AI will suggest a prompt based on the site. You can edit this to change the mood or focus.
4.  **Generate**: Click "Generate Video" and watch the magic happen!
5.  **Download**: Once done, preview the video and download it to your device.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
