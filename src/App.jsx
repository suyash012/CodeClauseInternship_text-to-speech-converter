import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [speeches, setSpeeches] = useState([]);
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const handleVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name); // Default to the first voice
      }
    };
    synth.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged(); // Initial call
    return () => {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const addSpeech = () => {
    if (text.trim() === '') {
      alert('Please enter some text to add.');
      return;
    }
    setSpeeches([...speeches, { text, voice: selectedVoice }]);
    setText('');
  };

  const handleSpeak = (speech) => {
    const utterance = new SpeechSynthesisUtterance(speech.text);
    const voice = voices.find((v) => v.name === speech.voice);
    if (voice) {
      utterance.voice = voice;
    }
    speechSynthesis.speak(utterance);
  };

  const handleDelete = (index) => {
    const newSpeeches = speeches.filter((_, i) => i !== index);
    setSpeeches(newSpeeches);
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-300">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4">Text-to-Speech Converter</h1>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here..."
          rows="5"
          className="w-4/5 p-4 text-lg border rounded-lg shadow-md mb-4 bg-orange-100"
        ></textarea>
        <br />
        <select
          value={selectedVoice}
          onChange={handleVoiceChange}
          className="w-4/5 p-2 mb-4 text-lg border rounded-lg shadow-md bg-orange-100"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
        <button
          onClick={addSpeech}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 mb-4"
        >
          Add Speech
        </button>
        <ul className="w-4/5">
          {speeches.map((speech, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 mb-2  bg-orange-100 rounded-lg shadow-md"
            >
              <span>{speech.text} - {speech.voice}</span>
              <div>
                <button
                  onClick={() => handleSpeak(speech)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 mr-2"
                >
                  Speak
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
