import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Code, Play, RotateCcw, Copy, Check, ChevronRight,
  BookOpen, Lightbulb, Terminal, Cpu, Binary, Layers, Braces, Hash,
  CheckCircle, XCircle, ArrowRight, Sparkles, Trophy, Zap,
  FileCode
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/learnProgramming.css';

// ─── Programming Concepts Data ───
const programmingConcepts = [
  {
    id: 'variables',
    title: 'Variables & Data Types',
    icon: <Hash size={22} strokeWidth={1.5} />,
    color: '#6366F1',
    description: 'Variables are containers for storing data values. Different data types include integers, floats, strings, and booleans.',
    theory: [
      'A variable is a named location in memory that stores a value. In Python, you don\'t need to declare data type — it\'s dynamically typed. In C++, you must declare the type explicitly.',
      'Common data types: int (whole numbers), float/double (decimal numbers), char (single character), string (text), bool (true/false).',
      'Type casting allows conversion between data types. Implicit casting happens automatically; explicit casting requires manual conversion.',
    ],
    pythonExample: `# Variables in Python
name = "Elevate"       # string
age = 21               # integer
gpa = 3.85             # float
is_student = True      # boolean

print(f"Name: {name}")
print(f"Age: {age}")
print(f"GPA: {gpa}")
print(f"Student: {is_student}")
print(f"Type of age: {type(age)}")`,
    cppExample: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "Elevate";
    int age = 21;
    double gpa = 3.85;
    bool isStudent = true;

    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "GPA: " << gpa << endl;
    cout << "Student: " << isStudent << endl;
    return 0;
}`,
  },
  {
    id: 'control',
    title: 'Control Flow',
    icon: <Braces size={22} strokeWidth={1.5} />,
    color: '#EC4899',
    description: 'Control flow determines the order in which statements are executed. Includes if-else, switch, and ternary operators.',
    theory: [
      'Conditional statements (if, else if, else) allow branching logic based on conditions. The condition evaluates to true or false.',
      'Switch/match statements provide cleaner syntax when comparing a variable against multiple fixed values.',
      'Short-circuit evaluation: In "and" (&&), if the first condition is false, the second is not evaluated. In "or" (||), if the first is true, the second is skipped.',
    ],
    pythonExample: `# Control Flow in Python
score = 85

# If-elif-else
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Score: {score}, Grade: {grade}")

# Ternary operator
status = "Pass" if score >= 60 else "Fail"
print(f"Status: {status}")

# Match statement (Python 3.10+)
match grade:
    case "A": print("Excellent!")
    case "B": print("Good job!")
    case _: print("Keep trying!")`,
    cppExample: `#include <iostream>
using namespace std;

int main() {
    int score = 85;
    char grade;

    // If-else chain
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else grade = 'F';

    cout << "Score: " << score;
    cout << ", Grade: " << grade << endl;

    // Ternary operator
    string status = (score >= 60) ? "Pass" : "Fail";
    cout << "Status: " << status << endl;

    // Switch statement
    switch (grade) {
        case 'A': cout << "Excellent!" << endl; break;
        case 'B': cout << "Good job!" << endl; break;
        default: cout << "Keep trying!" << endl;
    }
    return 0;
}`,
  },
  {
    id: 'loops',
    title: 'Loops & Iteration',
    icon: <RotateCcw size={22} strokeWidth={1.5} />,
    color: '#10B981',
    description: 'Loops execute a block of code repeatedly. For, while, and do-while are the main loop constructs.',
    theory: [
      'For loops iterate a known number of times. In Python, range() generates a sequence; in C++, you use initialization, condition, and increment.',
      'While loops continue as long as a condition is true. They\'re useful when the number of iterations is unknown.',
      'Break exits the loop entirely. Continue skips the current iteration and moves to the next. Nested loops run the inner loop completely for each outer loop iteration.',
    ],
    pythonExample: `# Loops in Python

# For loop with range
print("Counting:")
for i in range(1, 6):
    print(f"  {i}", end=" ")
print()

# While loop
n = 5
factorial = 1
while n > 0:
    factorial *= n
    n -= 1
print(f"5! = {factorial}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"Squares: {squares}")

# Nested loop - multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end="  ")
    print()`,
    cppExample: `#include <iostream>
using namespace std;

int main() {
    // For loop
    cout << "Counting: ";
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;

    // While loop - factorial
    int n = 5, factorial = 1;
    while (n > 0) {
        factorial *= n;
        n--;
    }
    cout << "5! = " << factorial << endl;

    // Do-while loop
    int num = 1;
    do {
        cout << num << " ";
        num *= 2;
    } while (num <= 16);
    cout << endl;

    // Nested loop - pattern
    for (int i = 1; i <= 4; i++) {
        for (int j = 1; j <= i; j++)
            cout << "* ";
        cout << endl;
    }
    return 0;
}`,
  },
  {
    id: 'functions',
    title: 'Functions & Recursion',
    icon: <Layers size={22} strokeWidth={1.5} />,
    color: '#F59E0B',
    description: 'Functions are reusable blocks of code. Recursion is when a function calls itself to solve smaller subproblems.',
    theory: [
      'Functions encapsulate logic for reuse. They take parameters (inputs) and return values (outputs). This follows the DRY principle (Don\'t Repeat Yourself).',
      'Recursion breaks a problem into smaller identical subproblems. Every recursive function needs a base case (stopping condition) to prevent infinite recursion.',
      'Stack overflow occurs when recursion goes too deep. Tail recursion optimization can help, but not all languages support it.',
    ],
    pythonExample: `# Functions in Python

def greet(name, greeting="Hello"):
    """Greet a person with a message."""
    return f"{greeting}, {name}!"

print(greet("Elevate"))
print(greet("World", "Hi"))

# Recursive Fibonacci
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"Fibonacci(7) = {fibonacci(7)}")

# Lambda function
square = lambda x: x ** 2
numbers = [1, 2, 3, 4, 5]
squared = list(map(square, numbers))
print(f"Squared: {squared}")

# *args and **kwargs
def summarize(*args, **kwargs):
    print(f"Args: {args}")
    print(f"Kwargs: {kwargs}")

summarize(1, 2, 3, name="Test")`,
    cppExample: `#include <iostream>
using namespace std;

// Function with default parameter
string greet(string name, string greeting = "Hello") {
    return greeting + ", " + name + "!";
}

// Recursive fibonacci
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Function overloading
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }

// Pass by reference
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    cout << greet("Elevate") << endl;
    cout << "Fib(7) = " << fibonacci(7) << endl;
    cout << "Int add: " << add(3, 4) << endl;
    cout << "Double add: " << add(3.5, 4.2) << endl;

    int x = 10, y = 20;
    swap(x, y);
    cout << "After swap: x=" << x << " y=" << y << endl;
    return 0;
}`,
  },
  {
    id: 'arrays',
    title: 'Arrays & Collections',
    icon: <Binary size={22} strokeWidth={1.5} />,
    color: '#8B5CF6',
    description: 'Arrays store multiple values of the same type. Collections like lists, sets, and maps provide more flexibility.',
    theory: [
      'Arrays are contiguous blocks of memory storing elements of the same type. Access is O(1) by index, but insertion/deletion can be O(n).',
      'Dynamic arrays (ArrayList in Java, vector in C++, list in Python) automatically resize when capacity is exceeded.',
      'Hash maps/dictionaries provide O(1) average-case lookup by mapping keys to values. Sets store unique elements only.',
    ],
    pythonExample: `# Collections in Python

# List operations
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
fruits.insert(1, "avocado")
print(f"Fruits: {fruits}")
print(f"Sliced: {fruits[1:3]}")

# Dictionary
student = {
    "name": "Alice",
    "age": 21,
    "grades": [90, 85, 92]
}
print(f"Name: {student['name']}")
print(f"Avg: {sum(student['grades'])/len(student['grades']):.1f}")

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(f"Union: {a | b}")
print(f"Intersection: {a & b}")

# List sorting
nums = [64, 25, 12, 22, 11]
nums.sort()
print(f"Sorted: {nums}")`,
    cppExample: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    // Vector (dynamic array)
    vector<int> nums = {64, 25, 12, 22, 11};

    nums.push_back(99);
    sort(nums.begin(), nums.end());

    cout << "Sorted: ";
    for (int n : nums) cout << n << " ";
    cout << endl;

    // Map (dictionary)
    map<string, int> ages;
    ages["Alice"] = 21;
    ages["Bob"] = 23;
    ages["Charlie"] = 20;

    for (auto& [name, age] : ages) {
        cout << name << ": " << age << endl;
    }

    // Array operations
    int arr[] = {10, 20, 30, 40, 50};
    int size = sizeof(arr) / sizeof(arr[0]);
    int sum = 0;
    for (int i = 0; i < size; i++) sum += arr[i];
    cout << "Sum: " << sum << endl;
    cout << "Avg: " << sum / size << endl;
    return 0;
}`,
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    icon: <Cpu size={22} strokeWidth={1.5} />,
    color: '#EF4444',
    description: 'OOP organizes code into objects containing data and behavior. The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
    theory: [
      'Encapsulation bundles data (attributes) and methods (functions) into a class, hiding internal details. Access modifiers (public, private, protected) control visibility.',
      'Inheritance allows a child class to reuse parent class code. This creates an "is-a" relationship (Dog is-a Animal).',
      'Polymorphism means "many forms" — the same method name behaves differently based on the object. Method overriding (runtime) and overloading (compile-time) are key types.',
    ],
    pythonExample: `# OOP in Python

class Animal:
    def __init__(self, name, sound):
        self.name = name
        self._sound = sound  # protected

    def speak(self):
        return f"{self.name} says {self._sound}!"

    def __str__(self):
        return f"Animal({self.name})"

# Inheritance
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Woof")
        self.breed = breed

    def fetch(self):
        return f"{self.name} fetches the ball!"

# Polymorphism
class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")

animals = [Dog("Rex", "Labrador"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())

dog = Dog("Buddy", "Golden")
print(dog.fetch())`,
    cppExample: `#include <iostream>
#include <string>
using namespace std;

class Animal {
protected:
    string name;
    string sound;
public:
    Animal(string n, string s) : name(n), sound(s) {}
    virtual string speak() {
        return name + " says " + sound + "!";
    }
    virtual ~Animal() {}
};

class Dog : public Animal {
    string breed;
public:
    Dog(string n, string b)
        : Animal(n, "Woof"), breed(b) {}
    string fetch() {
        return name + " fetches the ball!";
    }
};

class Cat : public Animal {
public:
    Cat(string n) : Animal(n, "Meow") {}
};

int main() {
    Dog dog("Rex", "Labrador");
    Cat cat("Whiskers");

    // Polymorphism
    Animal* animals[] = {&dog, &cat};
    for (auto* a : animals)
        cout << a->speak() << endl;

    cout << dog.fetch() << endl;
    return 0;
}`,
  },
];

// ─── Important Programming Questions ───
const programmingQuestions = [
  {
    id: 1,
    question: 'What is the difference between a compiler and an interpreter?',
    options: [
      'A compiler translates code line by line, an interpreter translates all at once',
      'A compiler translates entire code at once into machine code, an interpreter translates line by line at runtime',
      'Both are the same thing',
      'A compiler is only for C++, an interpreter is only for Python',
    ],
    correct: 1,
    explanation: 'A compiler (e.g., GCC for C++) converts the entire source code into machine code before execution. An interpreter (e.g., CPython) translates and executes code line by line at runtime.',
    difficulty: 'Easy',
    topic: 'Fundamentals',
  },
  {
    id: 2,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    correct: 2,
    explanation: 'Binary search halves the search space with each comparison, resulting in O(log n) time complexity. It requires the array to be sorted.',
    difficulty: 'Easy',
    topic: 'Algorithms',
  },
  {
    id: 3,
    question: 'Which OOP principle hides internal implementation details from the outside world?',
    options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
    correct: 2,
    explanation: 'Encapsulation bundles data and methods together and restricts direct access to internal state using access modifiers (private, protected, public).',
    difficulty: 'Easy',
    topic: 'OOP',
  },
  {
    id: 4,
    question: 'What will be the output of: print(type([]) == type({}))?',
    options: ['True', 'False', 'Error', 'None'],
    correct: 1,
    explanation: 'In Python, [] creates a list (type: list) and {} creates a dict (type: dict). Since list != dict, the output is False.',
    difficulty: 'Medium',
    topic: 'Python',
  },
  {
    id: 5,
    question: 'What is a segmentation fault in C++?',
    options: [
      'A syntax error in the code',
      'An error when accessing memory that the program doesn\'t have permission to access',
      'A logical error in the algorithm',
      'An error when dividing by zero',
    ],
    correct: 1,
    explanation: 'A segmentation fault (segfault) occurs when a program tries to access a memory location that it is not allowed to access, often caused by dereferencing null or dangling pointers.',
    difficulty: 'Medium',
    topic: 'C++',
  },
  {
    id: 6,
    question: 'What is the difference between stack and heap memory?',
    options: [
      'Stack is for functions, heap is for loops',
      'Stack is for static allocation with LIFO order, heap is for dynamic allocation',
      'They are the same memory region',
      'Stack is unlimited, heap is limited',
    ],
    correct: 1,
    explanation: 'Stack memory stores local variables and function call frames in LIFO order (fast, automatic). Heap memory is used for dynamically allocated objects (slower, manual management in C++).',
    difficulty: 'Medium',
    topic: 'Memory',
  },
  {
    id: 7,
    question: 'What is a pointer in C++?',
    options: [
      'A variable that stores a string',
      'A variable that stores the memory address of another variable',
      'A type of loop',
      'A function that returns void',
    ],
    correct: 1,
    explanation: 'A pointer is a variable whose value is the address of another variable in memory. Pointers are declared using * and addresses are obtained using &.',
    difficulty: 'Easy',
    topic: 'C++',
  },
  {
    id: 8,
    question: 'What does the "self" parameter represent in Python class methods?',
    options: [
      'The class itself',
      'The current instance of the class',
      'A global variable',
      'The parent class',
    ],
    correct: 1,
    explanation: '"self" refers to the current instance of the class. It allows access to instance variables and methods within the class. It must be the first parameter of instance methods.',
    difficulty: 'Easy',
    topic: 'Python',
  },
  {
    id: 9,
    question: 'What is the output of the following C++ code?\nint x = 5;\ncout << x++ << " " << ++x;',
    options: ['5 7', '6 7', '5 6', 'Undefined behavior'],
    correct: 3,
    explanation: 'Modifying a variable multiple times in the same expression without a sequence point is undefined behavior in C++. The output may vary across compilers.',
    difficulty: 'Hard',
    topic: 'C++',
  },
  {
    id: 10,
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort — O(n²)', 'Quick Sort — O(n log n)', 'Selection Sort — O(n²)', 'Insertion Sort — O(n²)'],
    correct: 1,
    explanation: 'Quick Sort has an average-case time complexity of O(n log n), which is significantly better than the O(n²) of Bubble, Selection, and Insertion sort.',
    difficulty: 'Easy',
    topic: 'Algorithms',
  },
  {
    id: 11,
    question: 'What is a decorator in Python?',
    options: [
      'A design pattern for adding CSS to web pages',
      'A function that takes another function and extends its behavior without modifying it',
      'A special type of class',
      'A way to comment code',
    ],
    correct: 1,
    explanation: 'A decorator is a function that wraps another function to extend or modify its behavior. Decorators use the @decorator_name syntax and are widely used for logging, authentication, and caching.',
    difficulty: 'Medium',
    topic: 'Python',
  },
  {
    id: 12,
    question: 'What is the difference between "==" and "===" or "is" in Python?',
    options: [
      'They are exactly the same',
      '"==" compares values, "is" compares memory identity (whether two variables point to the same object)',
      '"is" compares values, "==" compares types',
      '"==" is for numbers, "is" is for strings',
    ],
    correct: 1,
    explanation: '"==" checks if two objects have the same value (equality). "is" checks if two variables refer to the exact same object in memory (identity). For example, [1,2] == [1,2] is True, but [1,2] is [1,2] is False.',
    difficulty: 'Medium',
    topic: 'Python',
  },
];

// ─── Code Editor Component ───
const CodeEditor = ({ defaultCode, language }) => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError(null);

    const langMap = {
      python: { language: 'python', version: '3.10.0' },
      cpp: { language: 'c++', version: '10.2.0' },
    };

    const config = langMap[language];
    const payload = {
      language: config.language,
      version: config.version,
      files: [{ name: language === 'python' ? 'main.py' : 'main.cpp', content: code }],
    };

    // Try multiple API endpoints for reliability
    const endpoints = [
      'https://emkc.org/api/v2/piston/execute',
    ];

    let lastErr = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const text = await response.text();
          lastErr = `Server error (${response.status}): ${text}`;
          continue;
        }

        const data = await response.json();

        // Check for API-level errors
        if (data.message) {
          lastErr = `API Error: ${data.message}`;
          continue;
        }

        // Check for compilation errors (C++)
        if (data.compile && data.compile.stderr && data.compile.code !== 0) {
          setError(data.compile.stderr);
          setIsRunning(false);
          return;
        }

        // Check run output
        if (data.run) {
          if (data.run.signal === 'SIGKILL') {
            setError('Program was killed — possible infinite loop or timeout.');
          } else if (data.run.stderr && !data.run.stdout) {
            setError(data.run.stderr);
          } else if (data.run.stdout) {
            setOutput(data.run.stdout + (data.run.stderr ? '\n⚠ Warnings:\n' + data.run.stderr : ''));
          } else if (data.run.output) {
            setOutput(data.run.output);
          } else {
            setOutput('Program executed successfully (no output).');
          }
          setIsRunning(false);
          return;
        }

        lastErr = 'Unexpected response from compiler service.';
      } catch (err) {
        lastErr = `Network error: ${err.message}`;
      }
    }

    // All endpoints failed
    setError(lastErr || 'Failed to execute code. Please check your connection and try again.');
    setIsRunning(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput('');
    setError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun();
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="lp-editor-container">
      <div className="lp-editor-toolbar">
        <div className="lp-editor-lang">
          <div className="lp-lang-dot" style={{ background: language === 'python' ? '#3B82F6' : '#EC4899' }} />
          <span>{language === 'python' ? 'Python 3.10' : 'C++ (GCC 10.2)'}</span>
        </div>
        <div className="lp-editor-actions">
          <button className="lp-action-btn" onClick={handleCopy} title="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="lp-action-btn" onClick={handleReset} title="Reset code">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button className={`lp-run-btn ${isRunning ? 'running' : ''}`} onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <><div className="lp-spinner" /> Running...</>
            ) : (
              <><Play size={14} /> Run Code</>
            )}
          </button>
        </div>
      </div>
      <div className="lp-editor-body">
        <div className="lp-line-numbers">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="lp-line-num">{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="lp-code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Write your code here..."
        />
      </div>
      <div className="lp-editor-hint">
        <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run &nbsp;•&nbsp; <kbd>Tab</kbd> for indent
      </div>
      {(output || error) && (
        <div className={`lp-output-panel ${error ? 'error' : 'success'}`}>
          <div className="lp-output-header">
            <Terminal size={14} />
            <span>Output</span>
          </div>
          <pre className="lp-output-content">{error || output}</pre>
        </div>
      )}
    </div>
  );
};

// ─── Quiz Component ───
const QuizSection = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [filter, setFilter] = useState('All');

  const filteredQuestions = filter === 'All'
    ? programmingQuestions
    : programmingQuestions.filter(q => q.topic === filter);

  const topics = ['All', ...new Set(programmingQuestions.map(q => q.topic))];
  const question = filteredQuestions[currentQ];

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setAnswered(prev => prev + 1);
    if (idx === question.correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= filteredQuestions.length) {
      setQuizComplete(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    setQuizComplete(false);
  };

  if (!question) {
    return (
      <div className="lp-quiz-empty">
        <p>No questions available for this filter.</p>
        <button className="lp-btn-primary" onClick={() => setFilter('All')}>Show All Questions</button>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lp-quiz-complete">
        <div className="lp-quiz-complete-icon">
          {percentage >= 70 ? <Trophy size={56} strokeWidth={1.5} /> : <Sparkles size={56} strokeWidth={1.5} />}
        </div>
        <h2>Quiz Complete!</h2>
        <div className="lp-quiz-score-ring">
          <svg viewBox="0 0 120 120">
            <circle className="lp-ring-bg" cx="60" cy="60" r="50" fill="none" strokeWidth="8" />
            <circle
              className="lp-ring-progress"
              cx="60" cy="60" r="50" fill="none" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={2 * Math.PI * 50 * (1 - percentage / 100)}
              transform="rotate(-90 60 60)"
              style={{ stroke: percentage >= 70 ? '#10B981' : '#F59E0B' }}
            />
          </svg>
          <div className="lp-ring-text">
            <span className="lp-ring-percent">{percentage}%</span>
            <span className="lp-ring-label">{score}/{filteredQuestions.length}</span>
          </div>
        </div>
        <p className="lp-quiz-message">
          {percentage >= 90 ? 'Outstanding! You\'re a programming expert! 🏆' :
           percentage >= 70 ? 'Great job! You have solid programming knowledge! 🎉' :
           percentage >= 50 ? 'Good effort! Review the concepts and try again! 💪' :
           'Keep learning! Practice makes perfect! 📚'}
        </p>
        <button className="lp-btn-primary" onClick={handleRestart}>
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="lp-quiz-section">
      <div className="lp-quiz-filters">
        {topics.map(topic => (
          <button
            key={topic}
            className={`lp-filter-btn ${filter === topic ? 'active' : ''}`}
            onClick={() => { setFilter(topic); setCurrentQ(0); setSelectedAnswer(null); setShowExplanation(false); }}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="lp-quiz-progress">
        <div className="lp-quiz-progress-bar">
          <div className="lp-quiz-progress-fill" style={{ width: `${((currentQ + 1) / filteredQuestions.length) * 100}%` }} />
        </div>
        <span className="lp-quiz-counter">{currentQ + 1} / {filteredQuestions.length}</span>
      </div>

      <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lp-quiz-card">
        <div className="lp-quiz-meta">
          <span className={`lp-difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
          <span className="lp-topic-tag">{question.topic}</span>
        </div>
        <h3 className="lp-quiz-question">{question.question}</h3>
        <div className="lp-quiz-options">
          {question.options.map((option, idx) => {
            let optionClass = 'lp-quiz-option';
            if (selectedAnswer !== null) {
              if (idx === question.correct) optionClass += ' correct';
              else if (idx === selectedAnswer) optionClass += ' wrong';
            }
            return (
              <motion.button
                key={idx}
                whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                className={optionClass}
                onClick={() => handleAnswer(idx)}
              >
                <span className="lp-option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="lp-option-text">{option}</span>
                {selectedAnswer !== null && idx === question.correct && <CheckCircle size={18} className="lp-option-icon correct" />}
                {selectedAnswer !== null && idx === selectedAnswer && idx !== question.correct && <XCircle size={18} className="lp-option-icon wrong" />}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lp-explanation">
              <div className="lp-explanation-header">
                <Lightbulb size={16} />
                <span>Explanation</span>
              </div>
              <p>{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedAnswer !== null && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lp-btn-primary lp-next-btn" onClick={handleNext}>
            {currentQ + 1 >= filteredQuestions.length ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={16} />
          </motion.button>
        )}
      </motion.div>

      <div className="lp-quiz-stats">
        <div className="lp-stat-item">
          <CheckCircle size={16} />
          <span>{score} correct</span>
        </div>
        <div className="lp-stat-item">
          <XCircle size={16} />
          <span>{answered - score} wrong</span>
        </div>
        <div className="lp-stat-item">
          <Zap size={16} />
          <span>{answered > 0 ? Math.round((score / answered) * 100) : 0}% accuracy</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// MAIN LEARN PROGRAMMING PAGE
// ═══════════════════════════════════════════════
const LearnProgramming = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('concepts');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [editorLang, setEditorLang] = useState('python');

  const sections = [
    { id: 'concepts', label: 'Concepts', icon: <BookOpen size={18} /> },
    { id: 'compiler', label: 'Code Editor', icon: <Terminal size={18} /> },
    { id: 'quiz', label: 'Quiz', icon: <Lightbulb size={18} /> },
  ];

  return (
    <div className="lp-page">
      {/* Decorative background */}
      <div className="lp-bg-glow lp-bg-glow-1" />
      <div className="lp-bg-glow lp-bg-glow-2" />
      <div className="lp-bg-grid" />

      {/* Top Header */}
      <header className="lp-header">
        <div className="lp-header-left">
          <button className="lp-back-btn" onClick={() => navigate('/home')}>
            <ArrowLeft size={20} />
          </button>
          <div className="lp-header-title">
            <div className="lp-logo-icon"><Code size={20} /></div>
            <div>
              <h1>Learn Programming</h1>
              <span className="lp-header-sub">Master C++ & Python with interactive coding</span>
            </div>
          </div>
        </div>
        <div className="lp-header-right">
          <ThemeToggle />
          <div className="lp-user-chip" onClick={() => navigate('/profile')}>
            <div className="lp-user-avatar">{user?.avatar || 'U'}</div>
            <span>{user?.name || 'User'}</span>
          </div>
        </div>
      </header>

      {/* Section Tabs */}
      <div className="lp-tabs-container">
        <div className="lp-tabs">
          {sections.map(sec => (
            <button
              key={sec.id}
              className={`lp-tab ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(sec.id); setSelectedConcept(null); }}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lp-content">
        <AnimatePresence mode="wait">
          {/* ═══ CONCEPTS SECTION ═══ */}
          {activeSection === 'concepts' && !selectedConcept && (
            <motion.div key="concepts-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lp-concepts-grid">
              <div className="lp-section-intro">
                <h2>Programming <span className="lp-gradient-text">Fundamentals</span></h2>
                <p>Master the core concepts of programming with side-by-side Python & C++ examples. Click any concept to dive deep.</p>
              </div>
              <div className="lp-cards-grid">
                {programmingConcepts.map((concept, i) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="lp-concept-card"
                    onClick={() => setSelectedConcept(concept)}
                    style={{ '--card-color': concept.color }}
                  >
                    <div className="lp-concept-icon" style={{ background: `${concept.color}15`, color: concept.color }}>
                      {concept.icon}
                    </div>
                    <h3>{concept.title}</h3>
                    <p>{concept.description}</p>
                    <div className="lp-concept-footer">
                      <span className="lp-concept-badge" style={{ color: concept.color, background: `${concept.color}12` }}>
                        <FileCode size={12} /> 2 examples
                      </span>
                      <span className="lp-concept-arrow" style={{ color: concept.color }}>
                        Explore <ChevronRight size={14} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ CONCEPT DETAIL ═══ */}
          {activeSection === 'concepts' && selectedConcept && (
            <motion.div key="concept-detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lp-concept-detail">
              <button className="lp-breadcrumb-btn" onClick={() => setSelectedConcept(null)}>
                <ArrowLeft size={16} /> Back to Concepts
              </button>

              <div className="lp-detail-hero" style={{ '--hero-color': selectedConcept.color }}>
                <div className="lp-detail-hero-icon" style={{ background: `${selectedConcept.color}20`, color: selectedConcept.color }}>
                  {selectedConcept.icon}
                </div>
                <div>
                  <h2>{selectedConcept.title}</h2>
                  <p>{selectedConcept.description}</p>
                </div>
              </div>

              {/* Theory */}
              <div className="lp-theory-section">
                <h3><BookOpen size={18} /> Key Theory</h3>
                <div className="lp-theory-cards">
                  {selectedConcept.theory.map((point, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="lp-theory-card">
                      <div className="lp-theory-num" style={{ background: `${selectedConcept.color}15`, color: selectedConcept.color }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p>{point}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Code Examples with Live Editors */}
              <div className="lp-code-section">
                <h3><Terminal size={18} /> Interactive Code Examples</h3>
                <div className="lp-code-tabs">
                  <button className={`lp-code-tab ${editorLang === 'python' ? 'active' : ''}`} onClick={() => setEditorLang('python')}>
                    <span className="lp-lang-indicator" style={{ background: '#3B82F6' }} /> Python
                  </button>
                  <button className={`lp-code-tab ${editorLang === 'cpp' ? 'active' : ''}`} onClick={() => setEditorLang('cpp')}>
                    <span className="lp-lang-indicator" style={{ background: '#EC4899' }} /> C++
                  </button>
                </div>
                <CodeEditor
                  key={`${selectedConcept.id}-${editorLang}`}
                  defaultCode={editorLang === 'python' ? selectedConcept.pythonExample : selectedConcept.cppExample}
                  language={editorLang}
                />
              </div>
            </motion.div>
          )}

          {/* ═══ COMPILER SECTION ═══ */}
          {activeSection === 'compiler' && (
            <motion.div key="compiler" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lp-compiler-section">
              <div className="lp-section-intro">
                <h2>Code <span className="lp-gradient-text">Editor</span></h2>
                <p>Write, compile, and run your C++ and Python code directly in the browser. Powered by Piston API.</p>
              </div>

              <div className="lp-compiler-lang-select">
                <button
                  className={`lp-compiler-lang-btn ${editorLang === 'python' ? 'active' : ''}`}
                  onClick={() => setEditorLang('python')}
                >
                  <div className="lp-lang-icon python">Py</div>
                  <div>
                    <strong>Python 3.10</strong>
                    <span>Interpreted, dynamically typed</span>
                  </div>
                </button>
                <button
                  className={`lp-compiler-lang-btn ${editorLang === 'cpp' ? 'active' : ''}`}
                  onClick={() => setEditorLang('cpp')}
                >
                  <div className="lp-lang-icon cpp">C++</div>
                  <div>
                    <strong>C++ (GCC 10.2)</strong>
                    <span>Compiled, statically typed</span>
                  </div>
                </button>
              </div>

              <CodeEditor
                key={`compiler-${editorLang}`}
                defaultCode={editorLang === 'python'
                  ? `# Python Playground
# Write your Python code here and click Run!

def main():
    print("Hello from Python! 🐍")
    
    # Try editing this code!
    numbers = [1, 2, 3, 4, 5]
    squared = [n**2 for n in numbers]
    print(f"Squares: {squared}")
    print(f"Sum: {sum(squared)}")

main()`
                  : `// C++ Playground
// Write your C++ code here and click Run!

#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello from C++! 🚀" << endl;
    
    // Try editing this code!
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int n : numbers) {
        cout << n * n << " ";
        sum += n * n;
    }
    cout << endl << "Sum of squares: " << sum << endl;
    return 0;
}`}
                language={editorLang}
              />

              <div className="lp-quick-snippets">
                <h3><Sparkles size={16} /> Quick Code Snippets</h3>
                <div className="lp-snippets-grid">
                  {[
                    { label: 'Hello World', py: 'print("Hello, World!")', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
                    { label: 'Fibonacci', py: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a + b\n\nfib(10)', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a = 0, b = 1;\n    for (int i = 0; i < 10; i++) {\n        cout << a << " ";\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return 0;\n}' },
                    { label: 'FizzBuzz', py: 'for i in range(1, 21):\n    if i % 15 == 0: print("FizzBuzz")\n    elif i % 3 == 0: print("Fizz")\n    elif i % 5 == 0: print("Buzz")\n    else: print(i)', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 1; i <= 20; i++) {\n        if (i % 15 == 0) cout << "FizzBuzz";\n        else if (i % 3 == 0) cout << "Fizz";\n        else if (i % 5 == 0) cout << "Buzz";\n        else cout << i;\n        cout << endl;\n    }\n    return 0;\n}' },
                    { label: 'Bubble Sort', py: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n-1):\n        for j in range(n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 25, 12, 22, 11]))', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int arr[] = {64, 25, 12, 22, 11};\n    int n = 5;\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1])\n                swap(arr[j], arr[j+1]);\n    for (int i = 0; i < n; i++)\n        cout << arr[i] << " ";\n    return 0;\n}' },
                  ].map((snippet, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="lp-snippet-btn"
                      onClick={() => {
                        // Create a new editor with the snippet
                        const codeToUse = editorLang === 'python' ? snippet.py : snippet.cpp;
                        // We'll trigger re-render by navigating
                        const editorEl = document.querySelector('.lp-code-textarea');
                        if (editorEl) {
                          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                          nativeInputValueSetter.call(editorEl, codeToUse);
                          editorEl.dispatchEvent(new Event('input', { bubbles: true }));
                          // Alternate approach: directly set via React state isn't possible from here,
                          // so we do a page-level solution
                        }
                      }}
                    >
                      <Code size={14} />
                      <span>{snippet.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ QUIZ SECTION ═══ */}
          {activeSection === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="lp-section-intro">
                <h2>Programming <span className="lp-gradient-text">Quiz</span></h2>
                <p>Test your knowledge with important programming questions covering fundamentals, OOP, algorithms, and more.</p>
              </div>
              <QuizSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearnProgramming;
