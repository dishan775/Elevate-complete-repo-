const axios = require('axios');

// Using OpenAI Whisper API (requires API key)
const transcribe = async (audioBuffer) => {
  try {
    // For demo purposes, return mock text
    // In production, implement actual Whisper API call
    return 'What is the time complexity of binary search?';
  } catch (error) {
    console.error('Speech-to-Text Error:', error);
    return '';
  }
};

module.exports = { transcribe };