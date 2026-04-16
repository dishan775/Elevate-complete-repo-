const record = require('node-record-lpcm16');
const speechToText = require('./speechToText');
const intentDetector = require('./intentDetector');

let recording = null;
let isRecording = false;

const startCapture = async (socket) => {
  if (isRecording) return;
  
  isRecording = true;
  console.log('🎤 Audio capture started');

  recording = record.record({
    sampleRate: 16000,
    channels: 1,
    audioType: 'wav'
  });

  let audioBuffer = [];

  recording.stream().on('data', (chunk) => {
    audioBuffer.push(chunk);
    
    // Process every 3 seconds of audio
    if (audioBuffer.length > 48000 * 3) {
      processAudioBuffer(Buffer.concat(audioBuffer), socket);
      audioBuffer = [];
    }
  });
};

const processAudioBuffer = async (buffer, socket) => {
  try {
    // Convert audio to text
    const text = await speechToText.transcribe(buffer);
    
    if (text) {
      // Detect question intent
      const intent = await intentDetector.analyze(text);
      
      // If valid question detected, generate hint
      if (intent.isQuestion) {
        const hintGenerator = require('../ai/hintGenerator');
        const hint = await hintGenerator.generate(intent);
        
        // Emit hint to client
        socket.emit('hint', hint);
      }
    }
  } catch (error) {
    console.error('Audio processing error:', error);
  }
};

const stopCapture = () => {
  if (recording) {
    recording.stop();
    recording = null;
    isRecording = false;
    console.log('⏹️ Audio capture stopped');
  }
};

module.exports = { startCapture, stopCapture };