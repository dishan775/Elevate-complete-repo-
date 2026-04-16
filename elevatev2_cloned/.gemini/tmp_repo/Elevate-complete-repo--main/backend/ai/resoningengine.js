const axios = require('axios');

// Knowledge base for common topics
const knowledgeBase = {
  'Arrays': {
    concepts: ['Indexing', 'Iteration', 'Sliding Window', 'Two Pointers'],
    commonApproaches: [
      'Iterate through the array',
      'Use two pointers for optimization',
      'Consider edge cases (empty array, single element)',
      'Check for sorted vs unsorted conditions'
    ],
    pitfalls: [
      'Array index out of bounds',
      'Not handling empty arrays',
      'Integer overflow in calculations'
    ]
  },
  'Trees': {
    concepts: ['Recursion', 'Depth-First Search', 'Breadth-First Search', 'Tree Traversal'],
    commonApproaches: [
      'Use recursion for tree problems',
      'Consider base case (null node)',
      'Choose appropriate traversal method',
      'Use a queue for level-order traversal'
    ],
    pitfalls: [
      'Forgetting null checks',
      'Stack overflow with deep recursion',
      'Not returning values correctly'
    ]
  },
  'Graphs': {
    concepts: ['BFS', 'DFS', 'Adjacency List', 'Visited Set'],
    commonApproaches: [
      'Represent graph as adjacency list',
      'Use visited set to avoid cycles',
      'Choose BFS for shortest path',
      'Use DFS for connectivity'
    ],
    pitfalls: [
      'Infinite loops in cycles',
      'Not handling disconnected components',
      'Wrong choice of BFS vs DFS'
    ]
  },
  'Dynamic Programming': {
    concepts: ['Memoization', 'Tabulation', 'Optimal Substructure', 'Overlapping Subproblems'],
    commonApproaches: [
      'Identify overlapping subproblems',
      'Define the recurrence relation',
      'Choose top-down or bottom-up approach',
      'Optimize space complexity'
    ],
    pitfalls: [
      'Not identifying base cases',
      'Incorrect state definition',
      'Inefficient memoization'
    ]
  }
};

const generateExplanation = async (question, topic) => {
  const knowledge = knowledgeBase[topic] || knowledgeBase['Arrays'];

  return {
    hint: `This appears to be a ${topic} problem. Consider using ${knowledge.commonApproaches[0]}.`,
    concepts: knowledge.concepts,
    approach: knowledge.commonApproaches.slice(0, 3),
    pitfalls: knowledge.pitfalls.slice(0, 2)
  };
};

module.exports = { generateExplanation };