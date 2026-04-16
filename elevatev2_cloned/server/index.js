import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION HISTORY TRACKING — prevents repeating the same question in a session
// ═══════════════════════════════════════════════════════════════════════════════
const questionHistory = {
  mcq: {},      // { [topic]: Set of seen IDs }
  programming: {},
  cs: {},
};

/**
 * Pick a question from `pool` that hasn't been seen for `historyKey/topic`.
 * Automatically resets the history when the pool is exhausted.
 * Returns { item, wasReset }
 */
function pickUnseen(historyCategory, topic, pool) {
  if (!questionHistory[historyCategory][topic]) {
    questionHistory[historyCategory][topic] = new Set();
  }
  const seen = questionHistory[historyCategory][topic];

  // Filter to unseen items
  let available = pool.filter(q => !seen.has(q.id));

  // If all questions are exhausted, reset and use full pool
  let wasReset = false;
  if (available.length === 0) {
    seen.clear();
    available = [...pool];
    wasReset = true;
  }

  // Pick a random unseen item
  const item = available[Math.floor(Math.random() * available.length)];
  seen.add(item.id);
  return { item, wasReset };
}

/**
 * Pick `count` unseen items from a pool.
 */
function pickMultipleUnseen(historyCategory, topic, pool, count) {
  if (!questionHistory[historyCategory][topic]) {
    questionHistory[historyCategory][topic] = new Set();
  }
  const seen = questionHistory[historyCategory][topic];
  let available = pool.filter(q => !seen.has(q.id));

  // If not enough unseen questions, reset
  let wasReset = false;
  if (available.length < count) {
    seen.clear();
    available = [...pool];
    wasReset = true;
  }

  // Shuffle and pick `count`
  const shuffled = available.sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);
  picked.forEach(q => seen.add(q.id));
  return { items: picked, wasReset };
}


// ═══════════════════════════════════════════════════════════════════════════════
// STATIC DATA — YouTube channels, Flashcards
// ═══════════════════════════════════════════════════════════════════════════════
const ytChannels = [
  { name: "CareerVidz", instructor: "Richard McMunn", desc: "The absolute best channel for learning exactly what to say in an interview. Sample answers and professional vocabulary.", color: "#ef4444", url: "https://www.youtube.com/@CareerVidz" },
  { name: "Speak English with Vanessa", instructor: "Vanessa", desc: "Great for learning how to sound natural, relaxed, and confident in everyday professional conversations.", color: "#3b82f6", url: "https://www.youtube.com/@SpeakEnglishWithVanessa" },
  { name: "Business English Pod", instructor: "Corporate Focus", desc: "Focuses entirely on the English needed in corporate environments (meetings, negotiations, presentations, and phone calls).", color: "#10b981", url: "https://www.youtube.com/@BusinessEnglishPod" },
  { name: "TEDx Talks", instructor: "Various", desc: "Inspiring talks on leadership, communication, and professional growth from global thought leaders.", color: "#f59e0b", url: "https://www.youtube.com/@TEDx" },
];

const vocabFlashcards = [
  { term: "Bandwidth", def: "The capacity or time someone has to take on additional work." },
  { term: "Circle Back", def: "To discuss an issue at a later time." },
  { term: "Actionable", def: "Able to be done or acted on; having practical value." },
  { term: "Deep Dive", def: "An in-depth analysis or comprehensive review of a specific topic." },
  { term: "Synergy", def: "The combined power of a group of things working together." },
];


// ═══════════════════════════════════════════════════════════════════════════════
// GRAMMAR MCQ POOLS — 6+ unique questions per topic, each with a unique `id`
// ═══════════════════════════════════════════════════════════════════════════════
const grammarMCQPools = {
  "tenses and verb forms": [
    { id: "t1", question: "By the time the meeting ends, we ___ a decision.", options: ["will make", "made", "will have made", "are making"], correctIndex: 2, explanation: "Use the future perfect tense for an action that will be completed before a specified time in the future." },
    { id: "t2", question: "I ___ on this project since last January.", options: ["am working", "was working", "have been working", "work"], correctIndex: 2, explanation: "Present perfect continuous is used for actions that began in the past and continue into the present." },
    { id: "t3", question: "He usually ___ his emails first thing in the morning.", options: ["is checking", "checks", "checked", "has checked"], correctIndex: 1, explanation: "Simple present is used for habitual actions." },
    { id: "t4", question: "The team ___ the proposal before the client arrived.", options: ["finished", "had finished", "has finished", "was finishing"], correctIndex: 1, explanation: "Past perfect ('had finished') indicates an action completed before another past action." },
    { id: "t5", question: "We ___ a new CRM tool next quarter.", options: ["implement", "will implement", "have implemented", "implemented"], correctIndex: 1, explanation: "Simple future is used for planned future actions ('will implement')." },
    { id: "t6", question: "She ___ for this company for ten years by December.", options: ["will work", "works", "will have been working", "has worked"], correctIndex: 2, explanation: "Future perfect continuous is used for an ongoing action that will continue up to a future point." },
    { id: "t7", question: "The engineers ___ the bug when the server crashed again.", options: ["fix", "were fixing", "have fixed", "will fix"], correctIndex: 1, explanation: "Past continuous indicates an action in progress when interrupted by another event." },
    { id: "t8", question: "Our revenue ___ by 15% over the last fiscal year.", options: ["grows", "grew", "has grown", "had grown"], correctIndex: 2, explanation: "Present perfect ('has grown') connects past results to the present context." },
  ],
  "active and passive voice": [
    { id: "p1", question: "Choose the passive voice: 'The manager approved the report.'", options: ["The report is approved by the manager.", "The report was approved by the manager.", "The manager was approving the report.", "The report had been approved."], correctIndex: 1, explanation: "The past tense 'approved' becomes 'was approved' in the passive voice." },
    { id: "p2", question: "We expect that the server ___ by tomorrow.", options: ["will fix", "will be fixed", "is fixing", "fixed"], correctIndex: 1, explanation: "The server receives the action, so passive voice ('will be fixed') is required." },
    { id: "p3", question: "The code ___ currently ___ by the QA team.", options: ["is / reviewing", "is / being reviewed", "has / reviewed", "was / reviewed"], correctIndex: 1, explanation: "Present continuous passive requires 'is being + past participle'." },
    { id: "p4", question: "A new feature ___ to the platform last week.", options: ["added", "was added", "has added", "is adding"], correctIndex: 1, explanation: "Past simple passive: 'was added' — the feature received the action." },
    { id: "p5", question: "The candidates ___ about the schedule change yet.", options: ["haven't informed", "haven't been informed", "didn't inform", "aren't informing"], correctIndex: 1, explanation: "Present perfect passive: 'haven't been informed' — candidates receive the action." },
    { id: "p6", question: "The budget ___ by the finance team before the board meeting.", options: ["approves", "will approve", "will have been approved", "is approving"], correctIndex: 2, explanation: "Future perfect passive: 'will have been approved' — completed before a future event." },
    { id: "p7", question: "The email should ___ before 5 PM.", options: ["send", "be sent", "sending", "been sent"], correctIndex: 1, explanation: "Modal passive: 'should be sent' — the email receives the sending action." },
  ],
  "prepositions": [
    { id: "pr1", question: "Choose the correct preposition: 'The team will circle back ___ this issue tomorrow.'", options: ["in", "on", "at", "for"], correctIndex: 1, explanation: "The standard corporate phrase is 'circle back on [an issue]'." },
    { id: "pr2", question: "We need to comply ___ the new regulations.", options: ["to", "with", "for", "by"], correctIndex: 1, explanation: "'Comply with' is the correct collocation in professional English." },
    { id: "pr3", question: "The project is ___ schedule and under budget.", options: ["in", "at", "on", "by"], correctIndex: 2, explanation: "The standard phrase is 'on schedule', meaning progressing as planned." },
    { id: "pr4", question: "I look forward ___ hearing from you.", options: ["for", "at", "in", "to"], correctIndex: 3, explanation: "'Look forward to' is the correct prepositional phrase in formal correspondence." },
    { id: "pr5", question: "She was promoted ___ the position of Senior Engineer.", options: ["for", "in", "to", "at"], correctIndex: 2, explanation: "'Promoted to' a position is the standard corporate usage." },
    { id: "pr6", question: "The meeting was postponed ___ next Monday.", options: ["on", "at", "until", "by"], correctIndex: 2, explanation: "'Postponed until' indicates the new scheduled time." },
    { id: "pr7", question: "Please refer ___ the attached document for details.", options: ["at", "to", "on", "for"], correctIndex: 1, explanation: "'Refer to' is the correct prepositional pairing in formal contexts." },
  ],
  "articles and determiners": [
    { id: "a1", question: "We need ___ engineer with experience in cloud infrastructure.", options: ["a", "an", "the", "no article"], correctIndex: 1, explanation: "'An' is used before vowel sounds. 'Engineer' starts with a vowel sound." },
    { id: "a2", question: "___ CEO will address the company at 3 PM.", options: ["A", "An", "The", "No article"], correctIndex: 2, explanation: "'The' CEO refers to a specific, known person — the definite article is required." },
    { id: "a3", question: "She gave ___ excellent presentation at the summit.", options: ["a", "an", "the", "no article"], correctIndex: 1, explanation: "'An' precedes 'excellent' because it starts with a vowel sound." },
    { id: "a4", question: "We installed ___ software update last night.", options: ["a", "an", "the", "no article"], correctIndex: 2, explanation: "'The' is used because it's a specific update that both speaker and listener know about." },
    { id: "a5", question: "___ teamwork is essential for project success.", options: ["A", "An", "The", "No article"], correctIndex: 3, explanation: "Uncountable abstract nouns used in a general sense don't take articles." },
    { id: "a6", question: "He is ___ honest employee who always meets deadlines.", options: ["a", "an", "the", "no article"], correctIndex: 1, explanation: "'An' is used because 'honest' starts with a silent 'h', making the vowel sound." },
    { id: "a7", question: "Could you send me ___ copy of the report?", options: ["a", "an", "the", "no article"], correctIndex: 0, explanation: "'A' copy — any copy, not a specific one — uses the indefinite article." },
  ],
  "corporate vocabulary & jargon": [
    { id: "cv1", question: "Which sentence is grammatically correct in a professional context?", options: ["I am writing to formally request an extension.", "Im writing to ask for extension.", "I writes to request extension formally.", "Me writing to formal request extension."], correctIndex: 0, explanation: "The first option uses correct progressive tense ('am writing') and appropriate formal vocabulary." },
    { id: "cv2", question: "What does 'Let's take this offline' typically mean in a corporate meeting?", options: ["We should turn off our computers.", "Let's discuss this privately after the meeting.", "The internet connection is bad.", "We should cancel the meeting."], correctIndex: 1, explanation: "'Take this offline' means to discuss a topic outside of the current meeting, usually in a smaller group." },
    { id: "cv3", question: "Fill in the blank: 'We need to streamline the process to increase our ___.'", options: ["synergy", "bandwidth", "efficiency", "deliverables"], correctIndex: 2, explanation: "Streamlining a process directly leads to increased 'efficiency'." },
    { id: "cv4", question: "What does 'low-hanging fruit' refer to in business?", options: ["Cheap office snacks", "Tasks that are easy to accomplish and yield quick results", "Entry-level job positions", "Products with low profit margins"], correctIndex: 1, explanation: "'Low-hanging fruit' is corporate jargon for easy wins — tasks that require minimal effort but deliver visible results." },
    { id: "cv5", question: "'Let's align on the deliverables before EOD.' What does 'EOD' stand for?", options: ["End of Discussion", "End of Day", "End of Document", "Early on Delivery"], correctIndex: 1, explanation: "'EOD' stands for 'End of Day', commonly used in corporate communication for deadlines." },
    { id: "cv6", question: "Which phrase best replaces 'think about' in a formal report?", options: ["ponder upon", "consider", "think on", "imagine"], correctIndex: 1, explanation: "'Consider' is the professional equivalent of 'think about' in formal business writing." },
    { id: "cv7", question: "What does 'scalable solution' mean?", options: ["A solution that can be weighed on a scale", "A solution that grows effectively as demand increases", "A temporary workaround", "A solution that only works on small projects"], correctIndex: 1, explanation: "A 'scalable solution' can handle increasing workloads or growth without sacrificing performance." },
  ],
  "polite corporate conflict resolution": [
    { id: "cr1", question: "Identify the most polite way to disagree in a meeting:", options: ["You are completely wrong about that.", "I see your point, but I have a slightly different perspective.", "That doesn't make any sense.", "No, we shouldn't do that."], correctIndex: 1, explanation: "Option 2 acknowledges the other person's view before introducing a counterpoint, which is standard professional communication." },
    { id: "cr2", question: "Your colleague missed a deadline. Which response is most professional?", options: ["Why didn't you finish? This is unacceptable.", "I noticed the deadline was missed. Is there anything I can help with to get this back on track?", "You always miss deadlines.", "I'll just do it myself next time."], correctIndex: 1, explanation: "This response is solution-oriented, non-accusatory, and offers assistance — hallmarks of professional conflict resolution." },
    { id: "cr3", question: "How should you address a mistake you made in a professional email?", options: ["Ignore it and hope nobody notices.", "I apologize for the oversight. I have corrected the error and taken steps to prevent it in the future.", "That wasn't my fault.", "Sorry my bad lol."], correctIndex: 1, explanation: "A professional apology acknowledges the mistake, corrects it, and outlines preventive measures." },
    { id: "cr4", question: "A client is unhappy with a deliverable. What's the best first response?", options: ["Our work was fine, the requirements were unclear.", "I understand your concerns. Could we schedule a call to discuss the specific areas you'd like revised?", "We already spent a lot of time on this.", "That's not what we agreed on."], correctIndex: 1, explanation: "Acknowledging concerns and proposing a collaborative solution is the most professional approach." },
    { id: "cr5", question: "Your manager gives you constructive criticism. How should you respond?", options: ["I disagree with your assessment.", "Thank you for the feedback. I'll incorporate these suggestions moving forward.", "That's not fair.", "Okay, whatever you say."], correctIndex: 1, explanation: "Gracefully accepting feedback and committing to improvement demonstrates professionalism and growth mindset." },
    { id: "cr6", question: "Two team members have conflicting ideas. As a mediator, you should:", options: ["Pick the idea you like best.", "Say both ideas are wrong.", "Acknowledge both perspectives and suggest combining the strongest elements of each.", "Tell them to figure it out themselves."], correctIndex: 2, explanation: "A skilled mediator validates both viewpoints and seeks a synthesis that leverages the strengths of each." },
    { id: "cr7", question: "How do you professionally push back on an unrealistic deadline?", options: ["That's impossible, I refuse.", "I want to deliver quality work on this. Could we discuss adjusting the timeline or scope to ensure the best outcome?", "Fine, I'll try.", "You should have told me earlier."], correctIndex: 1, explanation: "This approach frames the pushback around quality and invites collaboration on a realistic solution." },
  ],
};

// Default fallback pool for topics not explicitly matched
const defaultMCQPool = [
  ...grammarMCQPools["tenses and verb forms"].slice(0, 3),
  ...grammarMCQPools["prepositions"].slice(0, 2),
  ...grammarMCQPools["corporate vocabulary & jargon"].slice(0, 2),
];


// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAMMING CHALLENGE POOLS — 5+ per topic with unique IDs
// ═══════════════════════════════════════════════════════════════════════════════
const programmingFallbacks = {
  variables: [
    { id: "v1", title: "Swap Two Variables", difficulty: "Easy", language: "JavaScript", problem: "Write a function `swap(a, b)` that returns an array `[b, a]` without using a third variable.", example: "swap(3, 7) → [7, 3]", hint: "Try using array destructuring in ES6: `[a, b] = [b, a]`.", solution: "function swap(a, b) {\n  [a, b] = [b, a];\n  return [a, b];\n}" },
    { id: "v2", title: "Type Coercion Detective", difficulty: "Medium", language: "JavaScript", problem: "What will `console.log(1 + '2')` and `console.log(1 - '2')` output? Explain the difference.", example: "1 + '2' → '12', 1 - '2' → -1", hint: "The `+` operator in JS also performs string concatenation. The `-` operator only does subtraction.", solution: "// + concatenates if either operand is a string\nconsole.log(1 + '2'); // '12' (string)\n// - forces numeric conversion\nconsole.log(1 - '2'); // -1 (number)" },
    { id: "v3", title: "Const vs Let Scope", difficulty: "Easy", language: "JavaScript", problem: "Explain the difference between `let`, `const`, and `var` in terms of scope and mutability. Write an example demonstrating block scoping.", example: "{ let x = 1; } console.log(x) → ReferenceError", hint: "`var` is function-scoped, `let` and `const` are block-scoped. `const` prevents reassignment.", solution: "// var is function-scoped\nfunction test() {\n  if (true) {\n    var a = 1; // accessible outside block\n    let b = 2; // only inside block\n    const c = 3; // only inside block, can't reassign\n  }\n  console.log(a); // 1\n  // console.log(b); // ReferenceError\n}" },
    { id: "v4", title: "Typeof Quirks", difficulty: "Medium", language: "JavaScript", problem: "What does `typeof null` return and why? Also, what does `typeof NaN` return?", example: "typeof null → 'object', typeof NaN → 'number'", hint: "`typeof null` returning 'object' is a famous JS bug from the original implementation.", solution: "console.log(typeof null);     // 'object' (historical JS bug)\nconsole.log(typeof NaN);      // 'number' (NaN is technically numeric)\nconsole.log(typeof undefined); // 'undefined'\nconsole.log(typeof []);       // 'object' (arrays are objects)" },
    { id: "v5", title: "Destructuring Default Values", difficulty: "Easy", language: "JavaScript", problem: "Write a function that destructures an object parameter with default values for `name` ('Anonymous') and `role` ('Guest').", example: "greet({name: 'Alex'}) → 'Hello Alex, role: Guest'", hint: "Use destructuring in the function parameter with `= 'default'` syntax.", solution: "function greet({ name = 'Anonymous', role = 'Guest' } = {}) {\n  return `Hello ${name}, role: ${role}`;\n}\nconsole.log(greet({ name: 'Alex' })); // 'Hello Alex, role: Guest'\nconsole.log(greet()); // 'Hello Anonymous, role: Guest'" },
    { id: "v6", title: "Template Literal Tag", difficulty: "Hard", language: "JavaScript", problem: "Create a tagged template literal function `highlight` that wraps each expression in **bold** markers.", example: "highlight`Hello ${name}, score: ${score}` → 'Hello **Alex**, score: **95**'", hint: "A tagged template receives (strings[], ...values) — interleave them back together with modifications.", solution: "function highlight(strings, ...values) {\n  return strings.reduce((result, str, i) => {\n    return result + str + (values[i] !== undefined ? `**${values[i]}**` : '');\n  }, '');\n}\nconst name = 'Alex', score = 95;\nconsole.log(highlight`Hello ${name}, score: ${score}`);" },
  ],
  functions: [
    { id: "f1", title: "Fibonacci Generator", difficulty: "Medium", language: "JavaScript", problem: "Write a function `fib(n)` that returns the nth Fibonacci number. fib(0)=0, fib(1)=1, fib(2)=1.", example: "fib(6) → 8", hint: "Use dynamic programming (build from bottom up) to avoid exponential recursion.", solution: "function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}" },
    { id: "f2", title: "Memoize Function", difficulty: "Hard", language: "JavaScript", problem: "Implement a `memoize(fn)` higher-order function that caches results of any pure function based on its arguments.", example: "const memoFib = memoize(fib); memoFib(40) runs in O(1) on subsequent calls.", hint: "Use a closure and a Map to store `JSON.stringify(args)` → result.", solution: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}" },
    { id: "f3", title: "Curry Function", difficulty: "Hard", language: "JavaScript", problem: "Implement a `curry(fn)` function that converts a multi-argument function into a chain of single-argument functions.", example: "curry(add)(1)(2)(3) → 6 where add = (a,b,c) => a+b+c", hint: "Return a function that collects arguments until enough are gathered, then call the original.", solution: "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}\nconst add = (a, b, c) => a + b + c;\nconsole.log(curry(add)(1)(2)(3)); // 6" },
    { id: "f4", title: "Debounce Implementation", difficulty: "Medium", language: "JavaScript", problem: "Write a `debounce(fn, delay)` function that delays invoking `fn` until `delay` ms have elapsed since the last call.", example: "const debouncedSearch = debounce(search, 300);", hint: "Clear the previous timeout on each call and set a new one.", solution: "function debounce(fn, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}" },
    { id: "f5", title: "Throttle Implementation", difficulty: "Medium", language: "JavaScript", problem: "Write a `throttle(fn, limit)` function that ensures `fn` is called at most once every `limit` ms.", example: "const throttledScroll = throttle(onScroll, 200);", hint: "Track the last time the function was called and skip calls within the limit window.", solution: "function throttle(fn, limit) {\n  let lastCall = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastCall >= limit) {\n      lastCall = now;\n      fn.apply(this, args);\n    }\n  };\n}" },
    { id: "f6", title: "Compose Functions", difficulty: "Medium", language: "JavaScript", problem: "Implement `compose(...fns)` that returns a function applying all functions from right to left.", example: "compose(double, addOne)(3) → 8 (addOne first: 4, then double: 8)", hint: "Use `reduceRight` to chain the functions.", solution: "function compose(...fns) {\n  return function(x) {\n    return fns.reduceRight((acc, fn) => fn(acc), x);\n  };\n}\nconst double = x => x * 2;\nconst addOne = x => x + 1;\nconsole.log(compose(double, addOne)(3)); // 8" },
  ],
  arrays: [
    { id: "a1", title: "Two Sum", difficulty: "Easy", language: "JavaScript", problem: "Given an array of integers and a target, return the indices of the two numbers that add up to the target.", example: "twoSum([2, 7, 11, 15], 9) → [0, 1]", hint: "Use a HashMap to store complement values and their indices. Iterate once.", solution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n}" },
    { id: "a2", title: "Flatten Deeply Nested Array", difficulty: "Medium", language: "JavaScript", problem: "Write a function `deepFlatten(arr)` that flattens a nested array of any depth without `.flat(Infinity)`.", example: "deepFlatten([1,[2,[3,[4]]]]) → [1,2,3,4]", hint: "Use recursion. For each element, check if it's an array then recurse.", solution: "function deepFlatten(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val)\n  , []);\n}" },
    { id: "a3", title: "Remove Duplicates In-Place", difficulty: "Easy", language: "JavaScript", problem: "Write a function that removes duplicate values from a sorted array in-place and returns the new length.", example: "removeDuplicates([1,1,2,3,3]) → 3 (array becomes [1,2,3,...])", hint: "Use a two-pointer technique: a slow pointer for the write position and a fast pointer to scan.", solution: "function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let slow = 0;\n  for (let fast = 1; fast < nums.length; fast++) {\n    if (nums[fast] !== nums[slow]) {\n      slow++;\n      nums[slow] = nums[fast];\n    }\n  }\n  return slow + 1;\n}" },
    { id: "a4", title: "Maximum Subarray (Kadane's)", difficulty: "Medium", language: "JavaScript", problem: "Find the contiguous subarray with the largest sum. Return the sum.", example: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) → 6 (subarray [4,-1,2,1])", hint: "Track the current sum — reset to the current element if the running sum drops below it.", solution: "function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}" },
    { id: "a5", title: "Rotate Array", difficulty: "Medium", language: "JavaScript", problem: "Rotate an array to the right by `k` steps in-place.", example: "rotate([1,2,3,4,5], 2) → [4,5,1,2,3]", hint: "Reverse the whole array, then reverse the first k and the rest separately.", solution: "function rotate(nums, k) {\n  k = k % nums.length;\n  const reverse = (arr, start, end) => {\n    while (start < end) {\n      [arr[start], arr[end]] = [arr[end], arr[start]];\n      start++; end--;\n    }\n  };\n  reverse(nums, 0, nums.length - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.length - 1);\n  return nums;\n}" },
    { id: "a6", title: "Group Anagrams", difficulty: "Hard", language: "JavaScript", problem: "Given an array of strings, group anagrams together.", example: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"]) → [["eat","tea","ate"],["tan","nat"],["bat"]]', hint: "Sort each word's characters as a key — anagrams produce the same sorted key.", solution: 'function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split("").sort().join("");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return [...map.values()];\n}' },
  ],
  sorting: [
    { id: "s1", title: "QuickSort Implementation", difficulty: "Hard", language: "JavaScript", problem: "Implement the QuickSort algorithm on an array of numbers. Choose the last element as the pivot.", example: "quickSort([3,6,8,10,1,2,1]) → [1,1,2,3,6,8,10]", hint: "Recursively partition the array into elements less than, equal to, and greater than the pivot.", solution: "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.slice(0, -1).filter(x => x <= pivot);\n  const right = arr.slice(0, -1).filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}" },
    { id: "s2", title: "Merge Sort", difficulty: "Medium", language: "JavaScript", problem: "Implement merge sort — a divide-and-conquer algorithm that splits the array in half recursively and merges.", example: "mergeSort([38,27,43,3,9,82,10]) → [3,9,10,27,38,43,82]", hint: "Split until single elements, then merge two sorted arrays by comparing heads.", solution: "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(l, r) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < l.length && j < r.length) {\n    result.push(l[i] < r[j] ? l[i++] : r[j++]);\n  }\n  return result.concat(l.slice(i)).concat(r.slice(j));\n}" },
    { id: "s3", title: "Bubble Sort Optimization", difficulty: "Easy", language: "JavaScript", problem: "Implement an optimized bubble sort that stops early if no swaps occur in a pass.", example: "bubbleSort([5,3,8,4,2]) → [2,3,4,5,8]", hint: "Add a `swapped` flag. If a full pass completes without swapping, the array is sorted.", solution: "function bubbleSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let swapped = false;\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n  return arr;\n}" },
    { id: "s4", title: "Selection Sort", difficulty: "Easy", language: "JavaScript", problem: "Implement selection sort — find the minimum element and put it at the beginning on each pass.", example: "selectionSort([64,25,12,22,11]) → [11,12,22,25,64]", hint: "In each iteration, find the min of the unsorted portion and swap it with the first unsorted element.", solution: "function selectionSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}" },
    { id: "s5", title: "Counting Sort", difficulty: "Medium", language: "JavaScript", problem: "Implement counting sort for an array of non-negative integers.", example: "countingSort([4,2,2,8,3,3,1]) → [1,2,2,3,3,4,8]", hint: "Create a count array, then reconstruct the sorted array from the counts.", solution: "function countingSort(arr) {\n  const max = Math.max(...arr);\n  const count = new Array(max + 1).fill(0);\n  arr.forEach(n => count[n]++);\n  const result = [];\n  count.forEach((c, i) => {\n    for (let j = 0; j < c; j++) result.push(i);\n  });\n  return result;\n}" },
  ],
  objects: [
    { id: "o1", title: "Deep Clone an Object", difficulty: "Medium", language: "JavaScript", problem: "Write `deepClone(obj)` that returns a fully independent copy of a nested object without JSON methods.", example: "const b = deepClone(a); b.x.y = 99; // a.x.y stays unchanged", hint: "Recurse through keys. Handle null, arrays, dates, and plain objects differently.", solution: "function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (obj instanceof Date) return new Date(obj);\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, deepClone(v)]));\n}" },
    { id: "o2", title: "Object Freeze Deep", difficulty: "Hard", language: "JavaScript", problem: "Object.freeze only freezes the top level. Write `deepFreeze(obj)` that recursively freezes all nested objects.", example: "const frozen = deepFreeze({a: {b: 1}}); frozen.a.b = 2; // still 1", hint: "Iterate over all property values. If a value is an object, recurse before freezing.", solution: "function deepFreeze(obj) {\n  Object.keys(obj).forEach(key => {\n    if (typeof obj[key] === 'object' && obj[key] !== null) {\n      deepFreeze(obj[key]);\n    }\n  });\n  return Object.freeze(obj);\n}" },
    { id: "o3", title: "Flatten Nested Object", difficulty: "Medium", language: "JavaScript", problem: "Write `flattenObject(obj)` that converts `{a: {b: {c: 1}}}` into `{'a.b.c': 1}`.", example: "flattenObject({a: {b: 1}, c: 2}) → {'a.b': 1, 'c': 2}", hint: "Use recursion with a prefix string that accumulates the dot-separated keys.", solution: "function flattenObject(obj, prefix = '', result = {}) {\n  for (const [key, val] of Object.entries(obj)) {\n    const newKey = prefix ? `${prefix}.${key}` : key;\n    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {\n      flattenObject(val, newKey, result);\n    } else {\n      result[newKey] = val;\n    }\n  }\n  return result;\n}" },
    { id: "o4", title: "Implement Object.assign", difficulty: "Medium", language: "JavaScript", problem: "Write your own `myAssign(target, ...sources)` that copies all enumerable own properties from sources to target.", example: "myAssign({a:1}, {b:2}, {c:3}) → {a:1, b:2, c:3}", hint: "Iterate over each source object's keys and copy them to the target.", solution: "function myAssign(target, ...sources) {\n  sources.forEach(source => {\n    if (source) {\n      Object.keys(source).forEach(key => {\n        target[key] = source[key];\n      });\n    }\n  });\n  return target;\n}" },
    { id: "o5", title: "Proxy-based Validator", difficulty: "Hard", language: "JavaScript", problem: "Use a Proxy to create an object that only accepts positive numbers for its properties.", example: "validator.age = 25 // works; validator.age = -5 // throws Error", hint: "Use the `set` trap in a Proxy handler to validate before assignment.", solution: "function createValidator() {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      if (typeof value !== 'number' || value <= 0) {\n        throw new Error(`${prop} must be a positive number`);\n      }\n      target[prop] = value;\n      return true;\n    }\n  });\n}\nconst v = createValidator();\nv.age = 25; // OK\n// v.age = -5; // Error!" },
  ],
};


// ═══════════════════════════════════════════════════════════════════════════════
// CORE CS QUESTION POOLS — 5+ per domain with unique IDs
// ═══════════════════════════════════════════════════════════════════════════════
const csFallbacks = {
  databases: [
    { id: "db1", question: "What is the difference between a clustered and a non-clustered index in SQL?", options: ["A clustered index sorts and stores data rows physically; a non-clustered index points to data rows.", "A clustered index is for numeric columns; non-clustered is for text.", "Clustered indexes are faster for writing; non-clustered for reading.", "There is no practical difference in modern databases."], correctIndex: 0, explanation: "A table can have only one clustered index (it IS the table data, sorted physically), while it can have multiple non-clustered indexes (separate structures that point to the actual rows).", topic: "Databases" },
    { id: "db2", question: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Availability, Concurrency, Indexing, Distribution", "Atomicity, Concurrency, Integrity, Durability", "Accessibility, Consistency, Isolation, Distribution"], correctIndex: 0, explanation: "ACID: Atomicity (all-or-nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), Durability (committed data persists).", topic: "Databases" },
    { id: "db3", question: "In which scenario would you choose a NoSQL database over SQL?", options: ["When strict ACID compliance is required.", "When storing highly structured relational data with complex joins.", "When dealing with unstructured data at massive scale or requiring flexible schemas.", "When building a banking application with financial ledger tables."], correctIndex: 2, explanation: "NoSQL databases like MongoDB excel at horizontal scaling, flexible schemas, and handling large volumes of unstructured or semi-structured data.", topic: "Databases" },
    { id: "db4", question: "What is database normalization and what does Third Normal Form (3NF) require?", options: ["Encrypting data for security; 3NF requires SSL.", "Structuring data to reduce redundancy; 3NF requires no transitive dependencies.", "Compressing data for storage; 3NF requires ZIP compression.", "Indexing all columns; 3NF requires at least 3 indexes."], correctIndex: 1, explanation: "Normalization reduces data redundancy. 3NF requires that all non-key attributes depend only on the primary key (no transitive dependencies through other non-key attributes).", topic: "Databases" },
    { id: "db5", question: "What is a deadlock in database systems and how can it be prevented?", options: ["A query that runs forever; prevented by adding indexes.", "A situation where two transactions wait for each other indefinitely; prevented by timeout or ordering locks.", "A full disk error; prevented by adding storage.", "A syntax error; prevented by query validation."], correctIndex: 1, explanation: "A deadlock occurs when two or more transactions each hold locks the other needs. Prevention strategies include lock ordering, timeouts, and deadlock detection algorithms.", topic: "Databases" },
    { id: "db6", question: "What is the difference between INNER JOIN and LEFT JOIN?", options: ["INNER JOIN returns all rows from both tables; LEFT JOIN returns only matching rows.", "INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table plus matching rows from the right.", "They are identical in behavior.", "INNER JOIN is faster; LEFT JOIN is slower but more accurate."], correctIndex: 1, explanation: "INNER JOIN returns only rows where there's a match in both tables. LEFT JOIN returns all rows from the left table, with NULL values for non-matching right table columns.", topic: "Databases" },
  ],
  os: [
    { id: "os1", question: "What is the fundamental difference between a process and a thread?", options: ["A process is faster; a thread is slower.", "A process has its own memory space; threads within a process share the same memory space.", "Threads can run on multiple CPUs; processes cannot.", "There is no difference."], correctIndex: 1, explanation: "A process is an independent program with its own address space. Threads share the parent process's address space, making context-switching faster.", topic: "Operating Systems" },
    { id: "os2", question: "What is a deadlock, and which four conditions must ALL be present?", options: ["A crash; conditions are stack overflow, heap exhaustion, segfault, pointer error.", "An infinite loop; recursion, high CPU, no sleep, no exit.", "A circular waiting state; Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.", "A race condition; shared memory, concurrent access, no locks, no semaphores."], correctIndex: 2, explanation: "Coffman's four conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Preventing any one prevents deadlock.", topic: "Operating Systems" },
    { id: "os3", question: "What is virtual memory and why is it useful?", options: ["RAM installed on the motherboard.", "A technique where the OS uses disk space to extend available memory beyond physical RAM.", "A type of cloud storage.", "Cache memory inside the CPU."], correctIndex: 1, explanation: "Virtual memory uses disk space (swap/page file) to simulate additional RAM, allowing programs to use more memory than physically available through paging/swapping.", topic: "Operating Systems" },
    { id: "os4", question: "What is the difference between preemptive and non-preemptive scheduling?", options: ["Preemptive is for single-core; non-preemptive for multi-core.", "In preemptive, the OS can interrupt a running process; in non-preemptive, a process runs until it voluntarily yields.", "Preemptive is older; non-preemptive is modern.", "There is no difference."], correctIndex: 1, explanation: "Preemptive scheduling allows the OS to interrupt running processes based on priority or time slices. Non-preemptive scheduling lets processes run until they complete or voluntarily yield.", topic: "Operating Systems" },
    { id: "os5", question: "What is thrashing in an operating system?", options: ["When the CPU overheats.", "When the system spends more time swapping pages in/out of memory than executing actual work.", "When a virus attacks the file system.", "When too many files are open."], correctIndex: 1, explanation: "Thrashing occurs when excessive page faults cause the OS to spend most of its time swapping pages, dramatically reducing throughput. It often happens when working set exceeds available memory.", topic: "Operating Systems" },
    { id: "os6", question: "What is the purpose of a semaphore in operating systems?", options: ["To display warning messages to users.", "To control access to shared resources by multiple processes using signaling.", "To encrypt network traffic.", "To manage file permissions."], correctIndex: 1, explanation: "A semaphore is a synchronization primitive with an integer counter. It controls concurrent access to shared resources — binary semaphores act like mutexes, counting semaphores allow N concurrent accesses.", topic: "Operating Systems" },
  ],
  networking: [
    { id: "n1", question: "What is the primary difference between TCP and UDP?", options: ["TCP is faster; UDP is reliable.", "TCP guarantees delivery and order (connection-oriented); UDP does not (connectionless).", "UDP uses IP addresses; TCP uses MAC addresses.", "TCP is for web; UDP is for databases only."], correctIndex: 1, explanation: "TCP is reliable and connection-oriented with handshakes and retransmissions. UDP is fast but fire-and-forget, ideal for streaming, DNS, and gaming.", topic: "Networking" },
    { id: "n2", question: "During an HTTPS request, what role does TLS play?", options: ["TLS routes packets via IP.", "TLS compresses the HTTP payload.", "TLS provides encryption, authentication, and data integrity between client and server.", "TLS is only for email protocols."], correctIndex: 2, explanation: "TLS establishes a shared secret, encrypts the HTTP payload, verifies server identity via certificates, and ensures data integrity.", topic: "Networking" },
    { id: "n3", question: "What happens during a TCP three-way handshake?", options: ["Client sends data, server acknowledges, connection closes.", "Client sends SYN, server responds SYN-ACK, client responds ACK.", "Server sends SYN, client responds ACK, server sends data.", "Three packets of data are exchanged simultaneously."], correctIndex: 1, explanation: "The three-way handshake establishes a TCP connection: (1) Client → SYN, (2) Server → SYN-ACK, (3) Client → ACK. Only then does data transfer begin.", topic: "Networking" },
    { id: "n4", question: "What is DNS and what does it do?", options: ["Dynamic Network Service — manages network bandwidth.", "Domain Name System — translates human-readable domain names to IP addresses.", "Data Network Security — encrypts all network traffic.", "Distributed Node Storage — stores files across servers."], correctIndex: 1, explanation: "DNS is the phonebook of the internet. It resolves domain names (e.g., google.com) to IP addresses (e.g., 142.250.190.78) so browsers can locate servers.", topic: "Networking" },
    { id: "n5", question: "What is the difference between HTTP/1.1 and HTTP/2?", options: ["HTTP/2 is text-based; HTTP/1.1 is binary.", "HTTP/2 supports multiplexing multiple requests over a single connection; HTTP/1.1 uses one request per connection.", "HTTP/1.1 is encrypted; HTTP/2 is not.", "There is no significant difference."], correctIndex: 1, explanation: "HTTP/2 introduces binary framing, header compression, server push, and multiplexing — allowing multiple concurrent requests/responses over a single TCP connection.", topic: "Networking" },
    { id: "n6", question: "What is a CDN (Content Delivery Network)?", options: ["A central database server.", "A geographically distributed network of servers that cache and serve content closer to users.", "A type of firewall.", "A programming framework for web apps."], correctIndex: 1, explanation: "CDNs cache static content (images, CSS, JS) on edge servers worldwide, reducing latency by serving content from the nearest geographic location to the user.", topic: "Networking" },
  ],
  systemdesign: [
    { id: "sd1", question: "What is the CAP theorem?", options: ["CPU, Availability, Performance cannot all be optimized.", "A distributed system can guarantee at most TWO of: Consistency, Availability, Partition Tolerance.", "Caching, APIs, Persistence form three pillars of system design.", "CAP stands for Client-Application-Protocol."], correctIndex: 1, explanation: "During a network partition, a distributed system must choose between Consistency (all nodes see same data) or Availability (every request gets a response). You can't have all three.", topic: "System Design" },
    { id: "sd2", question: "What is the primary purpose of a Load Balancer?", options: ["To store static assets close to users.", "To translate domain names to IPs.", "To distribute incoming traffic across multiple backend servers to prevent overload.", "To manage database connection pools."], correctIndex: 2, explanation: "A load balancer distributes requests using strategies like Round Robin, Least Connections, or IP Hash, and provides health-checking.", topic: "System Design" },
    { id: "sd3", question: "What is database sharding?", options: ["Encrypting database columns.", "Splitting a database into smaller, faster, more manageable parts called shards.", "Creating read replicas.", "Compressing database files."], correctIndex: 1, explanation: "Sharding horizontally partitions data across multiple database instances. Each shard holds a subset of the data, enabling horizontal scaling for write-heavy workloads.", topic: "System Design" },
    { id: "sd4", question: "What is the difference between horizontal and vertical scaling?", options: ["Horizontal adds more machines; vertical adds more power to existing machine.", "Horizontal adds more RAM; vertical adds more CPU.", "They are the same thing.", "Horizontal is for databases; vertical is for web servers."], correctIndex: 0, explanation: "Vertical scaling (scale up) means adding more CPU/RAM to a single server. Horizontal scaling (scale out) means adding more machines. Horizontal is generally preferred for distributed systems.", topic: "System Design" },
    { id: "sd5", question: "What is a message queue and when would you use one?", options: ["A chat application feature.", "An asynchronous communication mechanism between services for decoupling and handling bursts.", "A type of database query.", "A network protocol for emails."], correctIndex: 1, explanation: "Message queues (e.g., RabbitMQ, Kafka, SQS) decouple producers and consumers, enabling async processing, handling traffic spikes, and ensuring reliability through message persistence.", topic: "System Design" },
    { id: "sd6", question: "What is the purpose of a circuit breaker pattern in microservices?", options: ["To protect against electrical surges.", "To prevent cascading failures by stopping calls to a failing service after a threshold.", "To encrypt inter-service communication.", "To load balance between services."], correctIndex: 1, explanation: "A circuit breaker monitors failures. When failures exceed a threshold, it 'opens' and stops sending requests to the failing service, allowing it time to recover and preventing cascade failures.", topic: "System Design" },
  ],
  datastructures: [
    { id: "ds1", question: "What is the time complexity of a Hash Map lookup on average?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, explanation: "A hash map computes the index directly from the key using a hash function, giving O(1) average lookup. Worst case O(n) with many collisions.", topic: "Data Structures" },
    { id: "ds2", question: "In what order does a BST in-order traversal produce nodes?", options: ["Pre-order", "Level-order", "Post-order", "Sorted ascending order (Left → Root → Right)"], correctIndex: 3, explanation: "In-order traversal of a BST visits left subtree → root → right subtree, always producing a sorted ascending sequence.", topic: "Data Structures" },
    { id: "ds3", question: "What is the main advantage of a linked list over an array?", options: ["Faster random access.", "Constant-time insertion and deletion at any position (given a reference).", "Uses less memory.", "Better cache performance."], correctIndex: 1, explanation: "Linked lists allow O(1) insertion/deletion given a node reference (no shifting required), whereas arrays require O(n) shifting. Arrays have better cache locality and random access.", topic: "Data Structures" },
    { id: "ds4", question: "When would you use a stack vs a queue?", options: ["Stack for FIFO, queue for LIFO.", "Stack for LIFO (undo, recursion), queue for FIFO (BFS, task scheduling).", "They are interchangeable.", "Stack for sorting, queue for searching."], correctIndex: 1, explanation: "Stacks (LIFO) are used for undo operations, recursion, and expression evaluation. Queues (FIFO) are used for BFS, task scheduling, and buffering.", topic: "Data Structures" },
    { id: "ds5", question: "What is a heap data structure and what operation is it optimized for?", options: ["A type of linked list optimized for sorting.", "A complete binary tree optimized for finding and removing the min/max element in O(log n).", "A hash table variant for caching.", "A graph structure for pathfinding."], correctIndex: 1, explanation: "A heap is a complete binary tree where each parent is smaller (min-heap) or larger (max-heap) than its children. Finding min/max is O(1), insert/remove is O(log n).", topic: "Data Structures" },
    { id: "ds6", question: "What is a trie and when is it useful?", options: ["A balanced binary search tree.", "A tree-like structure for storing strings, useful for prefix-based searches and autocomplete.", "A graph algorithm for shortest paths.", "A type of hash table."], correctIndex: 1, explanation: "A trie (prefix tree) stores characters at each node. It's ideal for autocomplete, spell checking, and prefix matching — lookup is O(m) where m is the word length, regardless of dataset size.", topic: "Data Structures" },
  ],
};


// ═══════════════════════════════════════════════════════════════════════════════
// IN-MEMORY SCORE HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
let userScoreHistory = [];

// ═══════════════════════════════════════════════════════════════════════════════
// XP / SUMMARY TRACKING
// ═══════════════════════════════════════════════════════════════════════════════
let gamification = {
  totalXP: 0,
  level: 1,
  latestScore: 0,
  latestType: 'none',
  activityCount: 0,
};

function getBadge(level) {
  if (level < 2) return 'Beginner';
  if (level < 5) return 'Intermediate';
  if (level < 10) return 'Advanced';
  return 'Pro Communicator';
}

app.get('/api/english/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      ...gamification,
      badge: getBadge(gamification.level),
    }
  });
});

app.post('/api/english/add-xp', (req, res) => {
  const { amount, reason } = req.body;
  gamification.totalXP += (amount || 0);
  gamification.level = Math.floor(gamification.totalXP / 100) + 1;
  gamification.activityCount += 1;
  res.json({
    success: true,
    data: {
      ...gamification,
      badge: getBadge(gamification.level),
    }
  });
});


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES — English: Resources, Flashcards, Scores
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/english/resources', (req, res) => {
  res.json({ success: true, data: ytChannels });
});

app.get('/api/english/flashcards', (req, res) => {
  res.json({ success: true, data: vocabFlashcards });
});

app.get('/api/english/scores', (req, res) => {
  res.json({ success: true, data: userScoreHistory });
});

app.post('/api/english/scores', (req, res) => {
  const { score, type, date } = req.body;
  if (score !== undefined) {
    userScoreHistory.push({ score, type, date: date || new Date().toISOString() });
    gamification.latestScore = score;
    gamification.latestType = type;
  }
  res.json({ success: true, data: userScoreHistory });
});


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE — Grammar MCQ (non-repeating)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/english/generate-mcq', async (req, res) => {
  const { topic, count } = req.body;
  const numQuestions = parseInt(count) || 3;
  const reqTopic = topic || "Mixed Grammar";

  // Real AI path
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate ${numQuestions} multiple-choice English grammar questions focusing on "${reqTopic}". 
      These should be suitable for a professional corporate or technical interview context.
      IMPORTANT: Generate UNIQUE questions that are different from typical textbook examples.
      Return strictly a JSON object with a single key "questions" which contains an array of objects.
      Each object must have: "question" (string), "options" (array of 4 strings), "correctIndex" (integer 0-3), "explanation" (string)`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult.questions });
    } catch (error) {
      console.error("OpenAI MCQ Error:", error);
    }
  }

  // Fallback with non-repeating logic
  setTimeout(() => {
    const lowerTopic = reqTopic.toLowerCase();
    const pool = grammarMCQPools[lowerTopic] || defaultMCQPool;
    const { items, wasReset } = pickMultipleUnseen('mcq', lowerTopic, pool, numQuestions);

    // Strip internal `id` field before sending to frontend
    const cleaned = items.map(({ id, ...rest }) => rest);
    res.json({ success: true, data: cleaned, poolReset: wasReset });
  }, 800);
});


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES — Email Rewrite, Generate, Chat, Evaluate, Lesson, Reading
// (These don't have repeating question issues — kept as-is)
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/english/rewrite', async (req, res) => {
  const { text, tone } = req.body;
  if (!text || text.trim() === '') return res.status(400).json({ success: false, error: "No input provided." });

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Rewrite the following email in a ${tone || 'Professional'} tone. Make it natural and appropriate for a corporate setting. Keep meaning but enhance grammar, tone, and structure.\nEmail: "${text}"\nReturn strictly a JSON object with a single key "rewrittenText".`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult.rewrittenText });
    } catch (error) { console.error("OpenAI Rewrite Error:", error); }
  }

  setTimeout(() => {
    let mockTonePrefix = "";
    if (tone === "Formal") mockTonePrefix = "Dear Sir/Madam, \n\nI am writing to formally communicate that ";
    else if (tone === "Friendly") mockTonePrefix = "Hi team! \n\nJust wanted to quickly share that ";
    else if (tone === "Apologetic") mockTonePrefix = "Dear Team, \n\nPlease accept my sincere apologies. ";
    else if (tone === "Confident") mockTonePrefix = "Hello, \n\nI am certain that ";
    else mockTonePrefix = "Dear Team, \n\nI hope this message finds you well. ";
    let rewritten = mockTonePrefix + text.toLowerCase().replace(/hey|wanna|gonna|idk/g, "...") + "\n\nBest regards,\nProfessional User";
    res.json({ success: true, data: rewritten });
  }, 1200);
});

app.post('/api/english/generate-email', async (req, res) => {
  const { scenario, tone } = req.body;
  if (!scenario) return res.status(400).json({ success: false, error: "No scenario provided." });

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Write a professional email for: Scenario: "${scenario}", Tone: "${tone || 'Professional'}". Clear, polite, concise. Return JSON with key "email".`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult.email });
    } catch (error) { console.error("OpenAI Auto Email Error:", error); }
  }

  setTimeout(() => {
    let mockEmail = `Subject: Regarding "${scenario}"\n\nDear Team,\n\nI am writing to address the situation regarding ${scenario}. Please let me know if you need any additional information or have any questions moving forward.\n\nBest regards,\n[Your Name]`;
    res.json({ success: true, data: mockEmail });
  }, 1000);
});

app.post('/api/english/chat', async (req, res) => {
  const { messages, scenario } = req.body;

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an AI corporate manager/recruiter conducting a text-based chat simulation. Scenario: ${scenario}. Keep responses short, conversational, and professional.` },
          ...messages
        ]
      });
      return res.json({ success: true, data: response.choices[0].message.content });
    } catch (error) { console.error("OpenAI Chat Error:", error); }
  }

  setTimeout(() => {
    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    let reply = "That sounds interesting. Could you elaborate on your thoughts regarding that?";
    if (lastMsg.includes('salary') || lastMsg.includes('pay') || lastMsg.includes('compensation')) {
      reply = "Our budget for this role is quite strict at $120k base, but given your specialized experience, we might have some flexibility with a sign-on bonus. What total compensation range are you targeting?";
    } else if (lastMsg.includes('remote') || lastMsg.includes('wfh') || lastMsg.includes('home')) {
      reply = "We offer a hybrid schedule — usually 2 mandatory days in the office. Based on your location, does that work for you?";
    } else if (lastMsg.includes('benefits') || lastMsg.includes('pto') || lastMsg.includes('vacation')) {
      reply = "We have comprehensive health coverage, 4% 401(k) matching, and unlimited PTO (averaging 4 weeks). Are any of these dealbreakers?";
    } else if (messages.length > 5) {
      reply = "Great! Thanks for the excellent and transparent discussion today. I have everything I need to take this to the executive team for final approval.";
    }
    res.json({ success: true, data: reply });
  }, 1200);
});

app.post('/api/english/generate-lesson', async (req, res) => {
  const { topic } = req.body;
  const reqTopic = topic || "Corporate Meetings";

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Act as an expert English communication trainer. Topic: "${reqTopic}". Generate exactly 8 sections in strict JSON format:
        { "topicTitle", "conversation" [{speaker, text}], "smallTalk" [{starter, response}], "mistakes" [{incorrect, correct}], "sentenceBuilder" [{jumbled, correct}], "vocab" [{simple, professional}], "speakingTask" {task, points[]}, "emailTask" {situation, sample}, "rapidFire" [{question, answer}] }
        Keep language practical and beginner-friendly.`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult });
    } catch (error) { console.error("OpenAI Lesson Error:", error); }
  }

  setTimeout(() => {
    res.json({
      success: true, data: {
        topicTitle: reqTopic,
        conversation: [
          { speaker: "Alex", text: "Hi Sarah, I'm Alex. I just joined the marketing team today." },
          { speaker: "Sarah", text: "Nice to meet you, Alex! I'm Sarah from Sales. How are you settling in?" },
          { speaker: "Alex", text: "Pretty well, thanks! Everyone has been very welcoming." }
        ],
        smallTalk: [
          { starter: "How long have you been with the company?", response: "I've been here for about two years now." },
          { starter: "What did you do before joining us?", response: "I worked as a data analyst at a tech startup." }
        ],
        mistakes: [
          { incorrect: "Myself Alex.", correct: "I am Alex. or My name is Alex." },
          { incorrect: "I am working here since 2 years.", correct: "I have been working here for 2 years." }
        ],
        sentenceBuilder: [
          { jumbled: "team / to / excited / the / join / I / am", correct: "I am excited to join the team." },
          { jumbled: "help / any / let / if / need / me / you / know", correct: "Let me know if you need any help." }
        ],
        vocab: [
          { simple: "job", professional: "role / position" },
          { simple: "help", professional: "assist / support" },
          { simple: "talk", professional: "discuss / communicate" }
        ],
        speakingTask: {
          task: "Introduce yourself to a new colleague in 30 seconds.",
          points: ["State your name clearly", "Mention your current department/role", "Express enthusiasm to be there"]
        },
        emailTask: {
          situation: "Write a short introductory email to your new team on your first day.",
          sample: "Hi Team,\n\nI'm thrilled to join as the new Product Designer. I bring 3 years of experience in UI design and look forward to working with you all!\n\nBest,\nAlex"
        },
        rapidFire: [
          { question: "What is a formal way to say 'Hi'?", answer: "Good morning / Good afternoon" },
          { question: "Is 'wanna' acceptable in a formal email?", answer: "No, use 'want to' or 'would like to'." }
        ]
      }
    });
  }, 1500);
});

app.post('/api/english/generate-reading', async (req, res) => {
  const { topic } = req.body;
  const reqTopic = topic || "General Business Update";

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate a corporate reading comprehension exercise about "${reqTopic}". Return JSON with: "title", "content" (150-200 word passage), "questions" (3 objects with question, options[4], correctIndex, explanation), "vocabulary" (3 objects with word, definition).`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      return res.json({ success: true, data: JSON.parse(response.choices[0].message.content) });
    } catch (error) { console.error("OpenAI Reading Error:", error); }
  }

  setTimeout(() => {
    res.json({
      success: true, data: {
        title: `Memorandum: ${reqTopic}`,
        content: `To all staff,\n\nEffective immediately, we are rolling out a new initiative regarding ${reqTopic}. This paradigm shift is designed to streamline our operational bandwidth and mitigate downstream bottlenecks.\n\nManagement requests that all synergistic activities be logged in the centralized compliance portal by EOD Friday. Failure to comply may result in a temporary suspension of remote work privileges. Data silos must be dismantled to ensure complete transparency across divisions.\n\nWe appreciate your agile response to this urgent deployment and trust that cross-functional teams will collaborate seamlessly to ensure a smooth transition. Direct any inquiries to your immediate supervisor.\n\nBest,\nExecutive Leadership`,
        questions: [
          { question: "When must activities be logged?", options: ["Monday morning", "Wednesday afternoon", "Friday EOD", "Next week"], correctIndex: 2, explanation: "The memo explicitly states activities must be logged by EOD Friday." },
          { question: "What might happen if someone fails to comply?", options: ["A fine", "Suspension of remote work privileges", "Immediate Termination", "A verbal warning"], correctIndex: 1, explanation: "The text says 'Failure to comply may result in a temporary suspension of remote work privileges.'" },
          { question: "What is the primary goal of this new initiative?", options: ["To increase employee salaries", "To streamline operational bandwidth", "To sell the tech stack", "To hire more junior staff"], correctIndex: 1, explanation: "The initiative is designed to 'streamline our operational bandwidth' and mitigate bottlenecks." }
        ],
        vocabulary: [
          { word: "Paradigm Shift", definition: "A fundamental and major change in approach or underlying assumptions." },
          { word: "Mitigate", definition: "To make less severe, serious, or painful." },
          { word: "Agile", definition: "Able to move quickly and easily; highly responsive to sudden changes." }
        ]
      }
    });
  }, 1200);
});

app.post('/api/english/evaluate', async (req, res) => {
  const { text, type } = req.body;
  if (!text || text.trim() === '') return res.status(400).json({ success: false, error: "No input provided." });

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const isEmail = type === 'email';
      const prompt = isEmail
        ? `Evaluate this corporate email: Grammar (0-100), Tone (0-100), Clarity (0-100). 3 suggestions. Email: "${text}". Return JSON: overallScore, grammar, tone, clarity, suggestions[], feedback.`
        : `Analyze spoken interview response: "${text}". Return JSON: overallScore (0-100), fluency (0-100), vocabulary (0-100), fillerWords (count), feedback, suggestions[3].`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      const aiResult = JSON.parse(response.choices[0].message.content);
      if (isEmail) {
        return res.json({ success: true, data: { originalText: text, score: aiResult.overallScore, breakdown: { grammar: aiResult.grammar, tone: aiResult.tone, clarity: aiResult.clarity }, suggestions: aiResult.suggestions, feedback: aiResult.feedback, type } });
      } else {
        return res.json({ success: true, data: { originalText: text, score: aiResult.overallScore, breakdown: { fluency: aiResult.fluency, vocabulary: aiResult.vocabulary, fillerWords: aiResult.fillerWords }, suggestions: aiResult.suggestions, feedback: aiResult.feedback, type } });
      }
    } catch (error) { console.error("OpenAI API Error:", error); }
  }

  setTimeout(() => {
    let feedback = "";
    let score = 0;
    const lowerText = (text || "").toLowerCase();
    if (text.length < 15 && type === 'voice') { feedback = "Your response is too short. Try to elaborate and use complete sentences."; score = 40; }
    else if (lowerText.includes(" um ") || lowerText.includes(" uh ")) { feedback = "Good attempt! We detected filler words. Pausing silently is often better."; score = 70; }
    else if (type === 'email' && (lowerText.includes(" hey ") || lowerText.includes(" wanna "))) { feedback = "Too informal for corporate. Avoid 'hey' or 'wanna' — use 'Dear' instead."; score = 65; }
    else { feedback = "Excellent! Clear, professional, and well-structured. No significant grammar issues."; score = 95; }

    if (type === 'email') {
      res.json({ success: true, data: { originalText: text, score, feedback, breakdown: { grammar: score + Math.floor(Math.random() * 5), tone: score, clarity: score - Math.floor(Math.random() * 5) }, suggestions: ["Avoid casual contractions like 'wanna'.", "Include a proper sign-off.", "Use more assertive words."], type } });
    } else {
      const fillerCount = (lowerText.match(/\bum\b|\buh\b|\blike\b/g) || []).length;
      res.json({ success: true, data: { originalText: text, type, score, breakdown: { fluency: Math.max(0, score - (fillerCount * 5)), vocabulary: Math.min(100, score + 5), fillerWords: fillerCount }, feedback, suggestions: [fillerCount > 0 ? "Pause deliberately instead of using filler words." : "Maintain your excellent pacing.", "Use stronger action verbs ('spearheaded', 'facilitated').", "Utilize the STAR method for behavioral questions."] } });
    }
  }, 1200);
});


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE — Programming Challenge (non-repeating)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/programming/challenge', async (req, res) => {
  const { topic, difficulty } = req.body;
  const reqTopic = topic || 'arrays';
  const reqDifficulty = difficulty || 'Medium';

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate a UNIQUE coding challenge for a software engineering interview.
      Topic: "${reqTopic}", Difficulty: "${reqDifficulty}", Language: JavaScript.
      Return JSON: title, difficulty, language, problem, example, hint, solution.`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      return res.json({ success: true, data: JSON.parse(response.choices[0].message.content) });
    } catch (error) { console.error("OpenAI Programming Error:", error); }
  }

  // Offline Fallback — non-repeating
  setTimeout(() => {
    const pool = programmingFallbacks[reqTopic.toLowerCase()] || programmingFallbacks.arrays;

    // Optional: filter by difficulty if pool has enough
    let filtered = pool.filter(c => c.difficulty === reqDifficulty);
    if (filtered.length === 0) filtered = pool; // fallback to all if no match

    const { item, wasReset } = pickUnseen('programming', reqTopic, filtered);
    const { id, ...challenge } = item; // strip internal id
    res.json({ success: true, data: challenge, poolReset: wasReset });
  }, 800);
});


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE — Core CS Question (non-repeating)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/cs/question', async (req, res) => {
  const { topic } = req.body;
  const reqTopic = topic || 'databases';

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate a UNIQUE multiple-choice question about "${reqTopic}" in Computer Science for a software engineering interview.
      Return JSON: question, options[4], correctIndex (0-3), explanation, topic.`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      return res.json({ success: true, data: JSON.parse(response.choices[0].message.content) });
    } catch (error) { console.error("OpenAI CS Error:", error); }
  }

  // Offline Fallback — non-repeating
  setTimeout(() => {
    const pool = csFallbacks[reqTopic.toLowerCase().replace(/\s+/g, '')] || csFallbacks.databases;
    const { item, wasReset } = pickUnseen('cs', reqTopic, pool);
    const { id, ...question } = item; // strip internal id
    res.json({ success: true, data: question, poolReset: wasReset });
  }, 700);
});


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE — AI Study Buddy (RAG Simulator)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/chat/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ success: false, error: "No question provided" });

  const qLower = question.toLowerCase();

  // Simple hardcoded RAG matching over our existing CS & Programming pools
  let foundContext = null;

  // Search Core CS
  for (const topic in csFallbacks) {
    for (const item of csFallbacks[topic]) {
      if (qLower.includes(item.topic.toLowerCase()) || 
          item.question.toLowerCase().includes(qLower) || 
          (qLower.split(' ').some(word => word.length > 4 && item.explanation.toLowerCase().includes(word)))) {
        foundContext = item;
        break;
      }
    }
    if (foundContext) break;
  }

  // Search Programming if not found
  if (!foundContext) {
    for (const topic in programmingFallbacks) {
      for (const item of programmingFallbacks[topic]) {
        if (qLower.includes(item.title.toLowerCase()) || 
            (qLower.split(' ').some(word => word.length > 4 && item.problem.toLowerCase().includes(word)))) {
          foundContext = item;
          break;
        }
      }
      if (foundContext) break;
    }
  }

  // Simulated AI response generation
  setTimeout(() => {
    let answer = "";
    
    // Greeting/Generic
    if (qLower.includes("hello") || qLower.includes("hi") || qLower.includes("hey")) {
      answer = "Hello there! I'm your AI Study Buddy. Feel free to ask me any computer science, programming, or tech interview questions you have!";
    } 
    else if (foundContext && foundContext.explanation) {
      // It matched a CS question
      answer = `Based on my knowledge base regarding **${foundContext.topic}**:\n\n${foundContext.explanation}\n\nDid you know? A related question often asked is: *${foundContext.question}*`;
    } 
    else if (foundContext && foundContext.problem) {
      // It matched a Programming challenge
      answer = `Ah, you're asking about something related to **${foundContext.title}**!\n\nHere is a common problem in this area:\n*${foundContext.problem}*\n\n**Hint:** ${foundContext.hint}\n\nDo you want me to show you the code solution for this?`;
    } 
    else {
      // Fallback
      answer = "That's an interesting question! My specific knowledge base doesn't have an exact match right now, but Computer Science is a vast field. Could you try rephrasing or asking about core topics like Data Structures, Networking, OS, or Databases?";
    }

    res.json({ success: true, answer });
  }, 1000); // simulate thinking time
});


// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  console.log(`📦 Question pools loaded:`);
  console.log(`   Grammar MCQ: ${Object.values(grammarMCQPools).reduce((sum, pool) => sum + pool.length, 0)} questions across ${Object.keys(grammarMCQPools).length} topics`);
  console.log(`   Programming: ${Object.values(programmingFallbacks).reduce((sum, pool) => sum + pool.length, 0)} challenges across ${Object.keys(programmingFallbacks).length} topics`);
  console.log(`   Core CS: ${Object.values(csFallbacks).reduce((sum, pool) => sum + pool.length, 0)} questions across ${Object.keys(csFallbacks).length} domains`);
});
