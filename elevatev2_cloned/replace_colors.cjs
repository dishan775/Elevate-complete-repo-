const fs = require('fs');
let file = fs.readFileSync('src/pages/PracticeEnglish.jsx', 'utf8');

const replacements = [
  { search: /backgroundColor:\s*'#f3f4f6'/g, replace: "backgroundColor: 'var(--card-border)'" },
  { search: /backgroundColor:\s*'#ecfdf5'/g, replace: "backgroundColor: 'rgba(16,185,129,0.1)'" },
  { search: /backgroundColor:\s*'#f9fafb'/g, replace: "backgroundColor: 'var(--surface)'" },
  { search: /backgroundColor:\s*'#fdf4ff'/g, replace: "backgroundColor: 'rgba(217,70,239,0.1)'" },
  { search: /border:\s*'1px solid #fbcfe8'/g, replace: "border: '1px solid rgba(217,70,239,0.2)'" },
  { search: /backgroundColor:\s*'#f8fafc'/g, replace: "backgroundColor: 'var(--background)'" },
  { search: /backgroundColor:\s*'#f1f5f9'/g, replace: "backgroundColor: 'var(--card-border)'" },
  { search: /backgroundColor:\s*'#fef2f2'/g, replace: "backgroundColor: 'rgba(239,68,68,0.1)'" },
  { search: /backgroundColor:\s*'#f3e8ff'/g, replace: "backgroundColor: 'rgba(139,92,246,0.1)'" },
  { search: /backgroundColor:\s*'#eff6ff'/g, replace: "backgroundColor: 'rgba(59,130,246,0.1)'" },
  { search: /backgroundColor:\s*'white'/g, replace: "backgroundColor: 'var(--surface)'" },
  { search: /color:\s*'#065f46'/g, replace: "color: '#34d399'" },
  { search: /color:\s*'#991b1b'/g, replace: "color: '#f87171'" },
  { search: /color:\s*'#1e293b'/g, replace: "color: '#f8fafc'" },
  { search: /color:\s*'#2563eb'/g, replace: "color: '#60a5fa'" },
  { search: /border:\s*'1px solid #2563eb'/g, replace: "border: '1px solid #3b82f6'" },
  { search: /border:\s*'1px solid #e5e7eb'/g, replace: "border: '1px solid var(--card-border)'" },
  { search: /color:\s*'#111827'/g, replace: "color: 'var(--text-main)'" },
  { search: /color:\s*'#6b7280'/g, replace: "color: 'var(--text-muted)'" },
];

replacements.forEach(({search, replace}) => {
  file = file.replace(search, replace);
});

fs.writeFileSync('src/pages/PracticeEnglish.jsx', file);
console.log('Replaced colors successfully!');
