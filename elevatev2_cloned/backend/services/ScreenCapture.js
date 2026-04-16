const screenshot = require('screenshot-desktop');
const ocrService = require('./ocrService');
const intentDetector = require('./intentDetector');

let captureInterval = null;
let isCapturing = false;

const startCapture = async (socket) => {
  if (isCapturing) return;
  
  isCapturing = true;
  console.log('📸 Screen capture started');

  captureInterval = setInterval(async () => {
    try {
      const img = await screenshot({ format: 'png' });
      
      // Extract text from screenshot
      const text = await ocrService.extractText(img);
      
      // Detect question intent
      const intent = await intentDetector.analyze(text);
      
      // If valid question detected, generate hint
      if (intent.isQuestion) {
        const hintGenerator = require('../ai/hintGenerator');
        const hint = await hintGenerator.generate(intent);
        
        // Emit hint to client
        socket.emit('hint', hint);
      }
    } catch (error) {
      console.error('Screen capture error:', error);
    }
  }, 2000); // Capture every 2 seconds
};

const stopCapture = () => {
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
    isCapturing = false;
    console.log('⏹️ Screen capture stopped');
  }
};

module.exports = { startCapture, stopCapture };