const express = require("express");

require("dotenv").config();
const OpenAI = require("openai");

const router = express.Router();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});




const ytChannels = [
  {
    name: "CareerVidz",
    instructor: "Richard McMunn",
    desc: "The absolute best channel for learning exactly what to say in an interview. Sample answers and professional vocabulary.",
    color: "#ef4444",
    url: "https://www.youtube.com/@CareerVidz"
  },
  {
    name: "Speak English with Vanessa",
    instructor: "Vanessa",
    desc: "Great for learning how to sound natural, relaxed, and confident in everyday professional conversations.",
    color: "#3b82f6",
    url: "https://www.youtube.com/@SpeakEnglishWithVanessa"
  },
  {
    name: "Business English Pod",
    instructor: "Corporate Focus",
    desc: "Focuses entirely on the English needed in corporate environments (meetings, negotiations, presentations, and phone calls).",
    color: "#10b981",
    url: "https://www.youtube.com/@BusinessEnglishPod"
  }
];

const vocabFlashcards = [
  { term: "Bandwidth", def: "The capacity or time someone has to take on additional work." },
  { term: "Circle Back", def: "To discuss an issue at a later time." },
  { term: "Actionable", def: "Able to be done or acted on; having practical value." },
  { term: "Deep Dive", def: "An in-depth analysis or comprehensive review of a specific topic." },
  { term: "Synergy", def: "The combined power of a group of things working together." }
];

const grammarMCQs = [
  {
    question: "Which sentence is grammatically correct in a professional context?",
    options: ["I am writing to formally request an extension.", "Im writing to ask for extension.", "I writes to request extension formally.", "Me writing to formal request extension."],
    correctIndex: 0,
    explanation: "The first option uses correct progressive tense ('am writing') and appropriate formal vocabulary."
  },
  {
    question: "Choose the correct preposition: 'The team will circle back ___ this issue tomorrow.'",
    options: ["in", "on", "at", "for"],
    correctIndex: 1,
    explanation: "The standard corporate phrase is 'circle back on [an issue]'."
  },
  {
    question: "Identify the most polite way to disagree in a meeting:",
    options: ["You are completely wrong about that.", "I see your point, but I have a slightly different perspective.", "That doesn't make any sense.", "No, we shouldn't do that."],
    correctIndex: 1,
    explanation: "Option 2 acknowledges the other person's view before introducing a counterpoint, which is standard professional communication."
  },
  {
    question: "Fill in the blank: 'We need to streamline the process to increase our ___.'",
    options: ["synergy", "bandwidth", "efficiency", "deliverables"],
    correctIndex: 2,
    explanation: "Streamlining a process directly leads to increased 'efficiency'."
  }
];

let userScoreHistory = [];

router.get('/api/english/resources', (req, res) => {
  res.json({ success: true, data: ytChannels });
});

router.get('/api/english/flashcards', (req, res) => {
  res.json({ success: true, data: vocabFlashcards });
});

router.get('/api/english/scores', (req, res) => {
  res.json({ success: true, data: userScoreHistory });
});

// Calculate metrics
const getSummary = () => {
  const totalScore = userScoreHistory.reduce((acc, curr) => acc + (parseInt(curr.score) || 0), 0);
  // XP = (Total Score / 2) + (Number of activities * 20)
  // This is just a sample formula
  const xp = Math.floor(totalScore / 2) + (userScoreHistory.length * 20);
  const level = Math.floor(xp / 100) + 1;
  const latest = userScoreHistory.length > 0 ? userScoreHistory[userScoreHistory.length - 1] : null;
  
  return {
    totalXP: xp,
    level,
    latestScore: latest ? latest.score : 0,
    latestType: latest ? latest.type : 'none',
    activityCount: userScoreHistory.length,
    badge: level < 2 ? "Beginner" : level < 5 ? "Intermediate" : level < 10 ? "Advanced" : "Pro Communicator"
  };
};

router.get('/api/english/summary', (req, res) => {
  res.json({ success: true, data: getSummary() });
});

router.post('/api/english/add-xp', (req, res) => {
  const { amount, reason } = req.body;
  // For now, we simulate XP by adding a dummy score entry
  if (amount) {
    userScoreHistory.push({ 
      score: amount, 
      type: 'bonus_xp', 
      reason: reason || 'Activity Completion',
      date: new Date().toISOString() 
    });
  }
  res.json({ success: true, data: getSummary() });
});

router.post('/api/english/generate-mcq', async (req, res) => {
  const { topic, count } = req.body;
  const numQuestions = parseInt(count) || 3;
  const reqTopic = topic || "Mixed Grammar";

  // Real AI API path
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate ${numQuestions} multiple-choice English grammar questions focusing on "${reqTopic}". 
      These should be suitable for a professional corporate or technical interview context.
      Return strictly a JSON object with a single key "questions" which contains an array of objects.
      Each object in the array must have exactly these keys:
      - "question" (string)
      - "options" (array of 4 strings)
      - "correctIndex" (integer 0-3 representing the correct option)
      - "explanation" (string explaining why)`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult.questions });
    } catch (error) {
      console.error("OpenAI MCQ Error:", error);
      // Fallback below
    }
  }

  // Mock Fallback
  setTimeout(() => {
    let fallbackQuestions = [];
    const lowerTopic = reqTopic.toLowerCase();
    
    if (lowerTopic.includes("tense")) {
      fallbackQuestions = [
        { question: "By the time the meeting ends, we ___ a decision.", options: ["will make", "made", "will have made", "are making"], correctIndex: 2, explanation: "Use the future perfect tense for an action that will be completed before a specified time in the future." },
        { question: "I ___ on this project since last January.", options: ["am working", "was working", "have been working", "work"], correctIndex: 2, explanation: "Present perfect continuous is used for actions that began in the past and continue into the present." },
        { question: "He usually ___ his emails first thing in the morning.", options: ["is checking", "checks", "checked", "has checked"], correctIndex: 1, explanation: "Simple present is used for habitual actions." }
      ];
    } else if (lowerTopic.includes("passive")) {
      fallbackQuestions = [
        { question: "Choose the passive voice: 'The manager approved the report.'", options: ["The report is approved by the manager.", "The report was approved by the manager.", "The manager was approving the report.", "The report had been approved."], correctIndex: 1, explanation: "The past tense 'approved' becomes 'was approved' in the passive voice." },
        { question: "We expect that the server ___ by tomorrow.", options: ["will fix", "will be fixed", "is fixing", "fixed"], correctIndex: 1, explanation: "The server receives the action, so passive voice ('will be fixed') is required." },
        { question: "The code ___ currently ___ by the QA team.", options: ["is / reviewing", "is / being reviewed", "has / reviewed", "was / reviewed"], correctIndex: 1, explanation: "Present continuous passive requires 'is being + past participle'." }
      ];
    } else {
      fallbackQuestions = grammarMCQs;
    }
    
    res.json({ success: true, data: fallbackQuestions.slice(0, numQuestions) });
  }, 1000);
});

router.post('/api/english/scores', (req, res) => {
  const { score, type, date } = req.body;
  if(score !== undefined) {
    userScoreHistory.push({ score, type, date: date || new Date().toISOString() });
  }
  res.json({ success: true, data: userScoreHistory });
});

router.post('/api/english/rewrite', async (req, res) => {
  const { text, tone } = req.body;
  
  if (!text || text.trim() === '') return res.status(400).json({ success: false, error: "No input provided." });

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Rewrite the following email in a ${tone || 'Professional'} tone. Make sure it sounds natural and appropriate for a corporate setting. Keep the meaning the same but enhance grammar, tone, and structure.
      
      Email: "${text}"
      
      Return strictly a JSON object with a single key "rewrittenText" containing the improved string.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult.rewrittenText });
    } catch (error) { console.error("OpenAI Rewrite Error:", error); }
  }

  // Mock Fallback
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

router.post('/api/english/generate-email', async (req, res) => {
  const { scenario, tone } = req.body;
  if (!scenario) return res.status(400).json({ success: false, error: "No scenario provided." });

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Write a professional email for the following situation: Scenario: "${scenario}", Tone: "${tone || 'Professional'}". Make it clear, polite, and concise. Return strictly a JSON object with a single key "email" containing the generated string.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult.email });
    } catch (error) { console.error("OpenAI Auto Email Error:", error); }
  }

  setTimeout(() => {
    let mockEmail = `Subject: Regarding "${scenario}"\n\nDear Team,\n\nI am writing to address the situation regarding ${scenario}. Please let me know if you need any additional information or have any questions moving forward.\n\nBest regards,\n[Your Name]`;
    res.json({ success: true, data: mockEmail });
  }, 1000);
});

router.post('/api/english/chat', async (req, res) => {
  const { messages, scenario } = req.body;
  
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an AI corporate manager/recruiter conducting a text-based chat simulation. Scenario: ${scenario}. Keep responses short, conversational, and professional, exactly like real-time Slack or Teams messages.` },
          ...messages
        ]
      });
      return res.json({ success: true, data: response.choices[0].message.content });
    } catch (error) { console.error("OpenAI Chat Error:", error); }
  }

  // Mock Fallback
  setTimeout(() => {
    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    let reply = "That sounds interesting. Could you elaborate on your thoughts regarding that?";
    if (lastMsg.includes('salary') || lastMsg.includes('pay') || lastMsg.includes('compensation')) {
      reply = "Our budget for this role is quite strict at $120k base, but given your specialized experience, we might have some flexibility with a sign-on bonus. What total compensation range are you targeting?";
    } else if (lastMsg.includes('remote') || lastMsg.includes('wfh') || lastMsg.includes('home')) {
      reply = "We offer a hybrid schedule—usually 2 mandatory days in the office. Based on your location, does that work for you, or do you need a temporary remote accommodation?";
    } else if (lastMsg.includes('benefits') || lastMsg.includes('pto') || lastMsg.includes('vacation')) {
      reply = "We have comprehensive health coverage, strict 4% 401(k) matching, and unlimited PTO (which typically averages to 4 weeks). Are any of these dealbreakers for you?";
    } else if (messages.length > 5) {
      reply = "Great! Thanks for the excellent and fully transparent discussion today. I have everything I need to take this back to the executive team for final approval.";
    }
    res.json({ success: true, data: reply });
  }, 1200);
});

router.post('/api/english/generate-lesson', async (req, res) => {
  const { topic } = req.body;
  const reqTopic = topic || "Corporate Meetings";

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Act as an expert English communication trainer and ed-tech content creator.
        Create interactive and engaging content for an English learning platform designed for students and job seekers.
        Topic: "${reqTopic}"

        Generate exactly the following 8 sections in a strict JSON format. Do not include markdown formatting or backticks, just the raw JSON object.
        
        {
          "topicTitle": "${reqTopic}",
          "conversation": [ {"speaker": "A", "text": "..."}, {"speaker": "B", "text": "..."} ],
          "smallTalk": [ {"starter": "...", "response": "..."} ],
          "mistakes": [ {"incorrect": "...", "correct": "..."} ],
          "sentenceBuilder": [ {"jumbled": "...", "correct": "..."} ],
          "vocab": [ {"simple": "...", "professional": "..."} ],
          "speakingTask": { "task": "...", "points": ["...", "..."] },
          "emailTask": { "situation": "...", "sample": "..." },
          "rapidFire": [ {"question": "...", "answer": "..."} ]
        }
        
        Keep language simple, practical, and beginner-friendly. Make content useful for interviews, workplace, and daily communication.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ success: true, data: aiResult });
    } catch (error) { console.error("OpenAI Lesson Error:", error); }
  }

  // Very rich Offline Mock
  setTimeout(() => {
    res.json({
      success: true,
      data: {
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
          sample: "Hi Team,\n\nI'm thrilled to join as the new Product Designer. I bring 3 years of experience in UI design and I look forward to working with you all!\n\nBest,\nAlex"
        },
        rapidFire: [
          { question: "What is a formal way to say 'Hi'?", answer: "Good morning / Good afternoon" },
          { question: "Is 'wanna' acceptable in a formal email?", answer: "No, use 'want to' or 'would like to'." }
        ]
      }
    });
  }, 1500);
});

router.post('/api/english/generate-reading', async (req, res) => {
  const { topic } = req.body;
  const reqTopic = topic || "General Business Update";
  
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate a corporate reading comprehension exercise about "${reqTopic}". Return strictly a JSON object with: 1. "title" (string), 2. "content" (a 150-200 word passage formatted with paragraphs), 3. "questions" (an array of exactly 3 objects, each with "question", "options" (array of 4 strings), "correctIndex" (0-3), and "explanation"), 4. "vocabulary" (array of exactly 3 objects with "word" and "definition" for difficult technical/corporate words as they appear in the passage).`;
      const response = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
      return res.json({ success: true, data: JSON.parse(response.choices[0].message.content) });
    } catch (error) { console.error("OpenAI Reading Error:", error); }
  }

  setTimeout(() => {
    res.json({
      success: true,
      data: {
        title: `Memorandum: ${reqTopic}`,
        content: `To all staff,\n\nEffective immediately, we are rolling out a new initiative regarding ${reqTopic}. This paradigm shift is designed to streamline our operational bandwidth and mitigate downstream bottlenecks.\n\nManagement requests that all synergistic activities be logged in the centralized compliance portal by EOD Friday. Failure to comply may result in a temporary suspension of remote work privileges. Data silos must be dismantled to ensure complete transparency across divisions.\n\nWe appreciate your agile response to this urgent deployment and trust that cross-functional teams will collaborate seamlessly to ensure a smooth transition. Direct any inquiries to your immediate supervisor.\n\nBest,\nExecutive Leadership`,
        questions: [{
          question: "When must activities be logged?",
          options: ["Monday morning", "Wednesday afternoon", "Friday EOD", "Next week"],
          correctIndex: 2,
          explanation: "The memo explicitly states activities must be logged by EOD Friday."
        }, {
          question: "What might happen if someone fails to comply?",
          options: ["A fine", "Suspension of remote work privileges", "Immediate Termination", "A verbal warning"],
          correctIndex: 1,
          explanation: "The text says 'Failure to comply may result in a temporary suspension of remote work privileges.'"
        }, {
          question: "What is the primary goal of this new initiative?",
          options: ["To increase employee salaries", "To streamline operational bandwidth", "To sell the tech stack", "To hire more junior staff"],
          correctIndex: 1,
          explanation: "The initiative is designed to 'streamline our operational bandwidth' and mitigate bottlenecks."
        }],
        vocabulary: [
          { word: "Paradigm Shift", definition: "A fundamental and major change in approach or underlying assumptions." },
          { word: "Mitigate", definition: "To make less severe, serious, or painful." },
          { word: "Agile", definition: "Able to move quickly and easily; highly responsive to sudden changes." }
        ]
      }
    });
  }, 1200);
});

router.post('/api/english/evaluate', async (req, res) => {
  const { text, type } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ success: false, error: "No input provided." });
  }

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const isEmail = type === 'email';
      const prompt = isEmail 
        ? `Evaluate the following corporate email based on:
           1. Grammar (score out of 100)
           2. Professional tone (score out of 100)
           3. Clarity (score out of 100)
           Provide exactly 3 suggestions for improvement in an array.
           Email: "${text}"
           Return JSON with keys: 'overallScore' (number, average of the 3), 'grammar', 'tone', 'clarity', 'suggestions' (array of 3 strings), 'feedback' (1 summary sentence).`
        : `You are an expert technical recruiter and professional English coach analyzing a spoken interview response.
           User Response: "${text}"
           Return strict JSON with exactly these keys: 
           "overallScore" (number 0-100),
           "fluency" (number 0-100),
           "vocabulary" (number 0-100),
           "fillerWords" (integer count of um/uh/like/you know),
           "feedback" (1 summary sentence),
           "suggestions" (array of exactly 3 actionable tips for speaking better).`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(response.choices[0].message.content);

      if (isEmail) {
        return res.json({ success: true, data: {
            originalText: text,
            score: aiResult.overallScore,
            breakdown: { grammar: aiResult.grammar, tone: aiResult.tone, clarity: aiResult.clarity },
            suggestions: aiResult.suggestions,
            feedback: aiResult.feedback,
            type: type
        }});
      } else {
        return res.json({ success: true, data: { 
            originalText: text, 
            score: aiResult.overallScore, 
            breakdown: { fluency: aiResult.fluency, vocabulary: aiResult.vocabulary, fillerWords: aiResult.fillerWords },
            suggestions: aiResult.suggestions,
            feedback: aiResult.feedback, 
            type: type 
        }});
      }
    } catch (error) {
      console.error("OpenAI API Error:", error);
    }
  }

  // Fallback Mock Logic
  setTimeout(() => {
    let feedback = "";
    let score = 0;
    const lowerText = (text || "").toLowerCase();
    
    if (text.length < 15 && type === 'voice') {
      feedback = "Your response is too short. Try to elaborate on your points and use complete sentences.";
      score = 40;
    } else if (lowerText.includes(" um ") || lowerText.includes(" uh ")) {
      feedback = "Good attempt! However, we detected a few filler words like 'um' or 'uh'. Pausing silently is often better than using filler words.";
      score = 70;
    } else if (type === 'email' && (lowerText.includes(" hey ") || lowerText.includes(" wanna "))) {
      feedback = "Your tone is a bit too informal for a corporate setting. Avoid words like 'hey' or 'wanna' and use 'Dear' or 'Greetings' instead.";
      score = 65;
    } else {
      feedback = "Excellent! Your phrasing is clear, professional, and well-structured. No significant grammar issues detected.";
      score = 95;
    }

    if (type === 'email') {
       res.json({
         success: true,
         data: {
           originalText: text, score: score, feedback: feedback,
           breakdown: { grammar: score + Math.floor(Math.random()*5), tone: score, clarity: score - Math.floor(Math.random()*5) },
           suggestions: ["Avoid using overly casual contractions like 'wanna'.", "Ensure you include a proper sign-off.", "Try to use more assertive words."],
           type: type
         }
       });
    } else {
       // Voice Fallback Deep Analysis
       const fillerCount = (lowerText.match(/\bum\b|\buh\b|\blike\b/g) || []).length;
       const fluencyScore = Math.max(0, score - (fillerCount * 5));
       const vocabScore = Math.min(100, score + 5);
       
       res.json({ 
         success: true, 
         data: { 
           originalText: text, 
           type,
           score: score, 
           breakdown: { fluency: fluencyScore, vocabulary: vocabScore, fillerWords: fillerCount },
           feedback: feedback, 
           suggestions: [
             fillerCount > 0 ? "Take a deliberate 1-second pause instead of using filler words." : "Maintain your excellent pacing.",
             "Try substituting standard verbs with stronger action verbs (e.g., 'spearheaded', 'facilitated').",
             "Keep utilizing the STAR method (Situation, Task, Action, Result) for behavioral questions."
           ]
         } 
       });
    }
  }, 1200); 
});

// ─── PROGRAMMING MODULE ────────────────────────────────────────────────────

const programmingFallbacks = {
  variables: [
    { title: "Swap Two Variables", difficulty: "Easy", language: "JavaScript", problem: "Write a function `swap(a, b)` that returns an array `[b, a]` without using a third variable.", example: "swap(3, 7) → [7, 3]", hint: "Try using array destructuring in ES6: `[a, b] = [b, a]`.", solution: "function swap(a, b) {\n  [a, b] = [b, a];\n  return [a, b];\n}" },
    { title: "Type Coercion Detective", difficulty: "Medium", language: "JavaScript", problem: "What will `console.log(1 + '2')` and `console.log(1 - '2')` output? Explain the difference between the `+` and `-` operators in JS.", example: "1 + '2' → '12', 1 - '2' → -1", hint: "The `+` operator in JS also performs string concatenation. The `-` operator only does subtraction and coerces strings to numbers.", solution: "// + concatenates if either operand is a string\nconsole.log(1 + '2'); // '12' (string)\n// - forces numeric conversion\nconsole.log(1 - '2'); // -1 (number)" },
  ],
  functions: [
    { title: "Fibonacci Generator", difficulty: "Medium", language: "JavaScript", problem: "Write a function `fib(n)` that returns the nth Fibonacci number. fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2...", example: "fib(6) → 8", hint: "Use dynamic programming (build a table from bottom up) or memoization to avoid exponential recursion.", solution: "function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}" },
    { title: "Memoize Function", difficulty: "Hard", language: "JavaScript", problem: "Implement a `memoize(fn)` higher-order function that caches the results of any pure function based on its arguments.", example: "const memoFib = memoize(fib); memoFib(40) runs in O(1) on subsequent calls.", hint: "Use a closure and a Map/object to store `JSON.stringify(args)` → result.", solution: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}" },
  ],
  arrays: [
    { title: "Two Sum", difficulty: "Easy", language: "JavaScript", problem: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to the target. You may assume exactly one solution exists.", example: "twoSum([2, 7, 11, 15], 9) → [0, 1]", hint: "Use a HashMap (object/Map) to store complement values and their indices. Iterate once.", solution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n}" },
    { title: "Flatten Deeply Nested Array", difficulty: "Medium", language: "JavaScript", problem: "Write a function `deepFlatten(arr)` that flattens a nested array of any depth without using `.flat(Infinity)`.", example: "deepFlatten([1,[2,[3,[4]]]]) → [1,2,3,4]", hint: "Use recursion. For each element, check if it's an array. If so, recurse and spread the result.", solution: "function deepFlatten(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val)\n  , []);\n}" },
  ],
  sorting: [
    { title: "QuickSort Implementation", difficulty: "Hard", language: "JavaScript", problem: "Implement the QuickSort algorithm on an array of numbers. Choose the last element as the pivot.", example: "quickSort([3,6,8,10,1,2,1]) → [1,1,2,3,6,8,10]", hint: "Recursively partition the array into elements less than, equal to, and greater than the pivot.", solution: "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.slice(0, -1).filter(x => x <= pivot);\n  const right = arr.slice(0, -1).filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}" },
  ],
  objects: [
    { title: "Deep Clone an Object", difficulty: "Medium", language: "JavaScript", problem: "Write a `deepClone(obj)` function that returns a fully independent copy of a nested object without using `JSON.parse(JSON.stringify(obj))` (which loses functions/dates).", example: "const b = deepClone(a); b.x.y = 99; // a.x.y stays unchanged", hint: "Recurse through keys. Handle null, arrays, dates, and plain objects differently.", solution: "function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (obj instanceof Date) return new Date(obj);\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, deepClone(v)]));\n}" },
  ],
};

router.post('/api/programming/challenge', async (req, res) => {
  const { topic, difficulty } = req.body;
  const reqTopic = topic || 'arrays';
  const reqDifficulty = difficulty || 'Medium';

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate a single coding challenge for a software engineering interview.
      Topic: "${reqTopic}", Difficulty: "${reqDifficulty}", Language: JavaScript.
      Return a strict JSON object with exactly these keys:
      - "title": (string) a short title for the challenge
      - "difficulty": "${reqDifficulty}"
      - "language": "JavaScript"
      - "problem": (string) a clear 2-3 sentence problem statement
      - "example": (string) one concise input/output example
      - "hint": (string) a helpful hint without giving away the answer
      - "solution": (string) a clean, working JavaScript solution with comments`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return res.json({ success: true, data: JSON.parse(response.choices[0].message.content) });
    } catch (error) { console.error("OpenAI Programming Error:", error); }
  }

  // Offline Fallback
  setTimeout(() => {
    const pool = programmingFallbacks[reqTopic.toLowerCase()] || programmingFallbacks.arrays;
    const challenge = pool[Math.floor(Math.random() * pool.length)];
    res.json({ success: true, data: challenge });
  }, 800);
});

// ─── CORE CS MODULE ─────────────────────────────────────────────────────────

const csFallbacks = {
  databases: [
    { question: "What is the difference between a clustered and a non-clustered index in SQL?", options: ["A clustered index sorts and stores data rows physically; a non-clustered index points to data rows.", "A clustered index is for numeric columns; non-clustered is for text.", "Clustered indexes are faster for writing; non-clustered for reading.", "There is no practical difference in modern databases."], correctIndex: 0, explanation: "A table can have only one clustered index (it IS the table data, sorted physically), while it can have multiple non-clustered indexes (separate structures that point to the actual rows).", topic: "Databases" },
    { question: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Availability, Concurrency, Indexing, Distribution", "Atomicity, Concurrency, Integrity, Durability", "Accessibility, Consistency, Isolation, Distribution"], correctIndex: 0, explanation: "ACID is the cornerstone of relational database transactions. Atomicity (all-or-nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), Durability (committed data persists).", topic: "Databases" },
    { question: "In which scenario would you choose a NoSQL database over SQL?", options: ["When strict ACID compliance is required.", "When storing highly structured relational data with complex joins.", "When dealing with unstructured data at massive scale or requiring flexible schemas.", "When building a banking application with financial ledger tables."], correctIndex: 2, explanation: "NoSQL databases like MongoDB or Cassandra excel at horizontal scaling, flexible schemas, and handling large volumes of unstructured or semi-structured data (e.g., user profiles, logs, content).", topic: "Databases" },
  ],
  os: [
    { question: "What is the fundamental difference between a process and a thread?", options: ["A process is faster; a thread is slower.", "A process has its own memory space; threads within a process share the same memory space.", "Threads can run on multiple CPUs; processes cannot.", "There is no difference — the terms are interchangeable."], correctIndex: 1, explanation: "A process is an independent program in execution with its own address space. Threads are lighter-weight units of execution that share the address space of their parent process, making context-switching faster but requiring careful synchronization.", topic: "Operating Systems" },
    { question: "What is a deadlock, and which four conditions must ALL be present for one to occur?", options: ["A crash caused by memory overflow; conditions are stack overflow, heap exhaustion, segfault, pointer error.", "An infinite loop; conditions are recursion, high CPU, no sleep, no exit.", "A circular waiting state; conditions are Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.", "A race condition; conditions are shared memory, concurrent access, no locks, no semaphores."], correctIndex: 2, explanation: "Coffman's four necessary conditions for deadlock: (1) Mutual Exclusion, (2) Hold and Wait, (3) No Preemption, (4) Circular Wait. Preventing any one of these prevents a deadlock.", topic: "Operating Systems" },
  ],
  networking: [
    { question: "What is the primary difference between TCP and UDP?", options: ["TCP is faster; UDP is reliable.", "TCP guarantees delivery and order (connection-oriented); UDP does not guarantee delivery (connectionless).", "UDP uses IP addresses; TCP uses MAC addresses.", "TCP is for web traffic; UDP is for databases only."], correctIndex: 1, explanation: "TCP (Transmission Control Protocol) is reliable and connection-oriented — it uses handshakes, acknowledgments, and retransmissions. UDP (User Datagram Protocol) is fast but fire-and-forget, ideal for video streaming, DNS, and gaming where speed beats reliability.", topic: "Networking" },
    { question: "During an HTTPS request, what role does TLS play?", options: ["TLS routes packets to the correct server via IP.", "TLS compresses the HTTP payload to reduce latency.", "TLS provides encryption, authentication, and data integrity between client and server.", "TLS is only used for email protocols, not HTTPS."], correctIndex: 2, explanation: "TLS (Transport Layer Security) handshakes to establish a shared secret, then encrypts the entire HTTP payload. It also verifies the server's identity via certificates and uses MACs to ensure data hasn't been tampered with.", topic: "Networking" },
  ],
  systemdesign: [
    { question: "What is the CAP theorem and what trade-off does it describe?", options: ["CPU, Availability, and Performance cannot all be optimized simultaneously.", "A distributed system can guarantee at most TWO of: Consistency, Availability, and Partition Tolerance.", "Caching, APIs, and Persistence form the three pillars of system design.", "CAP stands for Client-Application-Protocol, describing REST APIs."], correctIndex: 1, explanation: "Brewer's CAP theorem states that during a network partition (P), a distributed system must choose between being Consistent (C — all nodes see the same data) or Available (A — every request gets a response). You cannot have all three simultaneously.", topic: "System Design" },
    { question: "What is the primary purpose of a Load Balancer in a distributed system?", options: ["To store static assets like images and CSS files close to users.", "To translate domain names into IP addresses for routing.", "To distribute incoming network traffic across multiple backend servers to prevent overload.", "To manage database connection pools and query caching."], correctIndex: 2, explanation: "A load balancer sits between clients and servers, distributing requests using strategies like Round Robin, Least Connections, or IP Hash. It also provides health-checking — removing unhealthy servers from the pool automatically.", topic: "System Design" },
  ],
  datastructures: [
    { question: "What is the time complexity of looking up a value in a Hash Map on average?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, explanation: "A hash map computes the index directly from the key using a hash function, giving O(1) average lookup. In the worst case (many hash collisions), it degrades to O(n), which is why good hash functions and load factors matter.", topic: "Data Structures" },
    { question: "In what order does a Binary Search Tree (BST) produce a sorted list of nodes?", options: ["Pre-order traversal", "Level-order traversal", "Post-order traversal", "In-order traversal (Left → Root → Right)"], correctIndex: 3, explanation: "By definition, an in-order traversal of a BST (visiting left subtree → root → right subtree) always produces a sorted ascending sequence, because all left descendants are smaller and all right descendants are larger.", topic: "Data Structures" },
  ],
};

router.post('/api/cs/question', async (req, res) => {
  const { topic } = req.body;
  const reqTopic = topic || 'databases';

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const prompt = `Generate a single, high-quality multiple-choice question about "${reqTopic}" in Computer Science suitable for a software engineering interview.
      Return a strict JSON object with exactly these keys:
      - "question": (string) the question
      - "options": (array of exactly 4 strings) the answer choices
      - "correctIndex": (integer 0-3) index of the correct option
      - "explanation": (string) a thorough 2-3 sentence explanation of why the answer is correct
      - "topic": "${reqTopic}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return res.json({ success: true, data: JSON.parse(response.choices[0].message.content) });
    } catch (error) { console.error("OpenAI CS Error:", error); }
  }

  // Offline Fallback
  setTimeout(() => {
    const pool = csFallbacks[reqTopic.toLowerCase().replace(/\s+/g, '')] || csFallbacks.databases;
    const question = pool[Math.floor(Math.random() * pool.length)];
    res.json({ success: true, data: question });
  }, 700);
});

module.exports = router;
