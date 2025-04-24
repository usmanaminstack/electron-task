import React, { useState, useRef, useEffect } from "react";

interface AudioRecorderProps {
  onStart: () => void;
  onStop: (audio: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onStart, onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(""); // Store transcribed text
  const [apiResponse, setApiResponse] = useState<any>(null); // Store API response
  const [isElectron, setIsElectron] = useState(false);
  const [isChrome, setIsChrome] = useState(true);
  const [transcriptionUnavailable, setTranscriptionUnavailable] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State for speech playback
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null); // Reference to SpeechSynthesisUtterance

  useEffect(() => {
    // Check if running in Electron
    if (typeof process !== "undefined" && process.versions && process.versions.electron) {
      setIsElectron(true);
    }

    // Check if the browser is Chrome
    const userAgent = navigator.userAgent.toLowerCase();
    if (!userAgent.includes("chrome") || userAgent.includes("edge")) {
      setIsChrome(false); // Not Chrome or Edge
    }
  }, []);

  // Check if SpeechRecognition is supported in the browser
  const isBrowser =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  useEffect(() => {
    if (isBrowser) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setTranscriptionUnavailable(true);
      };

      recognitionRef.current = recognition;
    } else {
      setTranscriptionUnavailable(true); // For browsers that don't support SpeechRecognition
    }

    // Initialize SpeechSynthesisUtterance for text-to-speech
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    setSpeechUtterance(utterance);

  }, [isBrowser]);

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        onStop(blob);
        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      onStart();
      startTimer();

      if (isBrowser && recognitionRef.current) {
        recognitionRef.current.start(); // Start Speech-to-Text
      }
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (isBrowser && recognitionRef.current) {
      recognitionRef.current.stop(); // Stop Speech-to-Text
    }
  };

  // Timer to keep track of recording time
  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  // Save audio locally
  const onSaveAudio = async () => {
    try {
      if (!audioBlob) {
        console.warn("No audio to save.");
        return;
      }

      const arrayBuffer = await audioBlob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const filePath = await (window as any).electronAPI.saveAudio({
        buffer,
        type: audioBlob.type,
      });

      console.log("Audio saved to:", filePath);
      alert("Audio saved successfully!");
    } catch (error) {
      console.error("Error saving audio:", error);
      alert("There was an error saving the audio. Please try again.");
    }
  };

  // Send the transcribed text to a mock API
  const sendTranscriptionToAPI = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          title: "Speech-to-Text Data",
          body: transcript,
          userId: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setApiResponse(data);
      alert("Transcription sent to API successfully!");
    } catch (error) {
      console.error("Error sending transcription to API:", error);
    }
  };

  // Control speech playback
  const playSpeech = () => {
    if (speechUtterance && !isPlaying) {
      window.speechSynthesis.speak(speechUtterance);
      setIsPlaying(true);
    }
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Update speech utterance text when transcript changes
  useEffect(() => {
    if (speechUtterance) {
      speechUtterance.text = transcript;
    }
  }, [transcript, speechUtterance]);

  return (
    <div className="my-4 p-4 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800 transition-all duration-300" style={{ width:'100%', height:'100%'}}>
      <div className="text-center mb-4">
        <h3 className="font-semibold text-xl">
          {isRecording ? "Recording..." : "Audio Recorder"}
        </h3>
        {isRecording && <p className="text-sm text-gray-500">{recordingTime}s</p>}
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="button bg-blue-500 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="button bg-red-500 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Stop
          </button>
        )}
      </div>

      {audioUrl && (
        <div className="text-center" style={{ marginTop: "20px" }}>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {!isElectron && isChrome && !transcriptionUnavailable && (
        <div className="text-center mt-4">
          <h3>Transcribed Text</h3>
          <p>{transcript}</p>
        </div>
      )}

      {transcriptionUnavailable && (
        <div className="text-center mt-4 text-red-500">
          <p>Transcription is unavailable in your current environment.</p>
        </div>
      )}

      {transcript && (
        <div className="text-center mt-4" style={{ display: "flex", justifyContent: "space-between",  padding: "10px 10px 10px 10px", borderRadius: "10px" }}>
          <button
            onClick={playSpeech}
            className="button bg-green-500 text-white p-2 rounded-full mr-2"
          >
            Play
          </button>
          <button
            onClick={pauseSpeech}
            className="button bg-yellow-500 text-white p-2 rounded-full mr-2"
          >
            Pause
          </button>
          <button
            onClick={stopSpeech}
            className="button bg-red-500 text-white p-2 rounded-full"
          >
            Stop
          </button>
        </div>
      )}

      {transcript && (
        <div className="text-center mt-4" >
          <button
          style={{ width:'100%', }}
            onClick={sendTranscriptionToAPI}
            className="button bg-blue-500 text-white p-3 rounded-full"
          >
            Send to API
          </button>
        </div>
      )}

      {/* {apiResponse && (
        <div className="text-center mt-4">
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default AudioRecorder;
