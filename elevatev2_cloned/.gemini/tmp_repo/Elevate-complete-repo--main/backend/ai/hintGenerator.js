const questionClassifier = require('./questionClassifier');
const reasoningEngine = require('./reasoningEngine');

const generate = async (intent) => {
  const topic = questionClassifier.classify(intent.originalText);
  const reasoning = await reasoningEngine.generateExplanation(intent.originalText, topic);

  // Generate progressive hints
  const hint = {
    id: Date.now(),
    level: 1, // Start with level 1 hint
    topic: topic,
    content: reasoning.hint,
    concepts: reasoning.concepts,
    approach: reasoning.approach,
    pitfalls: reasoning.pitfalls,
    timestamp: new Date().toISOString()
  };

  return hint;
};

module.exports = { generate };