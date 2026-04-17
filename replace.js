const fs = require('fs');
const files = [
  'c:/Users/DISHAN/OneDrive/Desktop/fullstackdev/ripis2.0/elevatev2_cloned/src/pages/Login.jsx',
  'c:/Users/DISHAN/OneDrive/Desktop/fullstackdev/ripis2.0/elevatev2_cloned/src/pages/PracticeEnglish.jsx',
  'c:/Users/DISHAN/OneDrive/Desktop/fullstackdev/ripis2.0/elevatev2_cloned/src/pages/AIStudyBuddy.jsx',
  'c:/Users/DISHAN/OneDrive/Desktop/fullstackdev/ripis2.0/elevatev2_cloned/src/store/practiceStore.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/'\/api\//g, "'https://elevate-backend-2v69.onrender.com/api/");
    content = content.replace(/`\/api\//g, "`https://elevate-backend-2v69.onrender.com/api/");
    content = content.replace(/"\/api\//g, '"https://elevate-backend-2v69.onrender.com/api/');
    content = content.replace(/'http:\/\/localhost:\d+\/api\//g, "'https://elevate-backend-2v69.onrender.com/api/");
    fs.writeFileSync(file, content);
  } else {
    console.log("Missing file:", file);
  }
});
console.log('Replaced local fetch calls with production Render URL');
