const classify = (text) => {
  const topics = {
    'Arrays': ['array', 'subarray', 'contiguous', 'kadane'],
    'Trees': ['tree', 'binary tree', 'bst', 'traversal', 'inorder', 'preorder', 'postorder'],
    'Graphs': ['graph', 'bfs', 'dfs', 'shortest path', 'dijkstra', 'cycle'],
    'Dynamic Programming': ['dp', 'dynamic programming', 'memoization', 'tabulation', 'optimal substructure'],
    'Sorting': ['sort', 'quicksort', 'mergesort', 'heapsort', 'bubble sort'],
    'Searching': ['search', 'binary search', 'linear search'],
    'System Design': ['design', 'scalable', 'load balancer', 'cache', 'database'],
  };

  const lowerText = text.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return topic;
    }
  }

  return 'General Programming';
};

module.exports = { classify };