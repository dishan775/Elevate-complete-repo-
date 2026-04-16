const Tesseract = require('tesseract.js');

const extractText = async (imageBuffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: m => console.log(m)
      }
    );
    return text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    return '';
  }
};

module.exports = { extractText };