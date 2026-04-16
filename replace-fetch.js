const fs = require('fs');
const file = 'c:/Users/DISHAN/OneDrive/Desktop/fullstackdev/ripis2.0/README/frontend/src/components/PracticeEnglish.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/fetch\('(\/api[^']+)'/g, "fetch('http://localhost:5000$1'");
fs.writeFileSync(file, content);
console.log('Replaced local fetch calls in PracticeEnglish.jsx properly');
