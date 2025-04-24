import React, { useState, useEffect } from 'react';
import CameraPreview from './components/CameraPreview';
import AudioRecorder from './components/AudioRecorder';
import SnapshotGallery from './components/SnapshotGallery';
import './App.css';

const App: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('camera'); // Default tab

  const handleAudioRecording = (audio: Blob) => {
    setAudioBlob(audio);
  };

  const handleSnapshot = (imagePath: string) => {
    setSnapshots((prev) => [...prev, imagePath]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <h1 className="app-title">Notes Desktop App</h1>
        </div>
        <button className="toggle-button" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          Camera
        </button>
        <button
          className={`tab-button ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          Audio
        </button>
        <button
          className={`tab-button ${activeTab === 'snapshots' ? 'active' : ''}`}
          onClick={() => setActiveTab('snapshots')}
        >
          Snapshots
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'camera' && <CameraPreview onCapture={handleSnapshot} />}
        {activeTab === 'audio' && (
          <AudioRecorder
            onStart={() => setIsRecording(true)}
            onStop={handleAudioRecording}
          />
        )}
        {activeTab === 'snapshots' && <SnapshotGallery snapshots={snapshots} />}
      </div>
    </div>
  );
};

export default App;
