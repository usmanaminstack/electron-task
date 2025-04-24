# Voice Notes Desktop App (Electron.js)

## 📌 Objective

Build a cross-platform desktop app using **Electron.js** that allows users to:
- Record audio through a microphone.
- Preview their webcam and take snapshots.
- Transcribe voice recordings to text.
- Send the transcribed text to an API.
- Read the text aloud using text-to-speech (TTS).

---

## 🛠 Features Implemented

### ✅ Responsive UI
- Built with **TailwindCSS** for clean and modern layout.
- Responsive design suitable for desktop and tablet views.

### ✅ Camera Integration
- Displays a **live camera preview** using webcam.
- Allows users to **take snapshots**, which are saved locally as `.png`.
- Displays a gallery of saved snapshots.

### ✅ Microphone Recording
- Users can record their voice via system microphone.
- Recording controls: **Start**, **Stop**, and **Save**.
- Saves audio in `.webm` format.

### ✅ Speech-to-Text Conversion
- **In Chrome**: Transcription works using the **Web Speech API** (browser-provided).
- **In Electron**: Transcription is **disabled** due to the lack of native browser API support.

### ✅ API Integration
- Sends transcribed text to a mock API endpoint:  
  `https://jsonplaceholder.typicode.com/posts`
- Displays API response (e.g., "Post created successfully").

### ✅ Text-to-Speech
- Uses **Web Speech API (SpeechSynthesis)** for reading text aloud.
- Includes **play**, **pause**, and **stop** controls.

### ✅ Error Handling
- Graceful error messages for:
  - Microphone/camera access issues.
  - API call failures.

---

## ❗ Why Transcription Doesn’t Work in Electron

### In Chrome
The app uses the **Web Speech API** (built into Chrome) for speech recognition. It allows free, in-browser speech-to-text without any setup or cost.

### In Electron
Electron does not have access to the full **Web Speech API** because:
- It uses a stripped-down version of Chromium.
- There’s **no support for speech recognition natively**.
- No browser-level microphone-to-text interface exists out-of-the-box.

#### 🧩 Workaround: Paid Alternatives
To enable transcription in Electron, you must integrate **external paid services** like:
- **Google Cloud Speech-to-Text**
- **Microsoft Azure Speech Services**
- **AssemblyAI**
- **Deepgram**

This requires:
- Setting up an account.
- Managing API keys.
- Sending audio files to the cloud and processing the returned text.

---

## ✨ Bonus Features (Optional)
- [ ] Dark Mode toggle.

---


## 🚀 Setup Instructions

```bash
git clone https://github.com/usmanaminstack/electron-task.git
cd electron-task
npm install
npm run dev
