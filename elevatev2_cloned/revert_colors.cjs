const fs = require('fs');
let file = fs.readFileSync('src/pages/PracticeEnglish.jsx', 'utf8');

const replacements = [
  { search: /backgroundColor:\s*'var\(--card-border\)'/g, replace: "backgroundColor: '#f1f5f9'" },
  { search: /backgroundColor:\s*'rgba\(16,185,129,0\.1\)'/g, replace: "backgroundColor: '#ecfdf5'" },
  { search: /backgroundColor:\s*'var\(--surface\)'/g, replace: "backgroundColor: '#ffffff'" },
  { search: /backgroundColor:\s*'rgba\(217,70,239,0\.1\)'/g, replace: "backgroundColor: '#f8fafc'" },
  { search: /border:\s*'1px solid rgba\(217,70,239,0\.2\)'/g, replace: "border: '1px solid #e2e8f0'" },
  { search: /backgroundColor:\s*'var\(--background\)'/g, replace: "backgroundColor: '#f8fafc'" },
  { search: /backgroundColor:\s*'rgba\(239,68,68,0\.1\)'/g, replace: "backgroundColor: '#fef2f2'" },
  { search: /backgroundColor:\s*'rgba\(139,92,246,0\.1\)'/g, replace: "backgroundColor: '#f0f9ff'" },
  { search: /backgroundColor:\s*'rgba\(59,130,246,0\.1\)'/g, replace: "backgroundColor: '#eff6ff'" },
  { search: /color:\s*'#34d399'/g, replace: "color: '#059669'" },
  { search: /color:\s*'#f87171'/g, replace: "color: '#dc2626'" },
  { search: /color:\s*'#0f172a'/g, replace: "color: '#1e293b'" },
  { search: /color:\s*'var\(--text-main\)'/g, replace: "color: '#0f172a'" },
  { search: /color:\s*'var\(--text-muted\)'/g, replace: "color: '#475569'" },
  { search: /color:\s*'#60a5fa'/g, replace: "color: '#2563eb'" },
  { search: /border:\s*'1px solid #3b82f6'/g, replace: "border: '1px solid #2563eb'" },
  { search: /border:\s*'1px solid var\(--card-border\)'/g, replace: "border: '1px solid #e2e8f0'" }
];

replacements.forEach(({search, replace}) => {
  file = file.replace(search, replace);
});

fs.writeFileSync('src/pages/PracticeEnglish.jsx', file);
console.log('Premium Light Mode applied successfully!');
