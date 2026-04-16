const analyze = async (text) => {
  // Simple keyword-based detection (enhance with ML in production)
  const keywords = {
    dataStructures: ['array', 'tree', 'graph', 'linked list', 'stack', 'queue', 'heap'],
    algorithms: ['sort', 'search', 'traverse', 'complexity', 'time', 'space', 'binary search', 'dfs', 'bfs'],
    systemDesign: ['design', 'scalable', 'distributed', 'database', 'api', 'microservice'],
    databases: ['sql', 'nosql', 'query', 'index', 'transaction', 'acid'],
  };

  const lowerText = text.toLowerCase();
  
  let detectedTopic = 'general';
  let confidence = 0;

  // Check for question patterns
  const isQuestion = /\b(what|how|why|when|where|which|explain|describe|difference)\b/i.test(text);

  // Detect topic
  for (const [topic, words] of Object.entries(keywords)) {
    const matches = words.filter(word => lowerText.includes(word));
    if (matches.length > confidence) {
      confidence = matches.length;
      detectedTopic = topic;
    }
  }

  return {
    isQuestion,
    topic: detectedTopic,
    confidence: confidence / 10,
    originalText: text
  };
};

module.exports = { analyze };