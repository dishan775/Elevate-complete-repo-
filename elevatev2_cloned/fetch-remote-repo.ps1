$base = "https://raw.githubusercontent.com/dishan775/Elevate-complete-repo-/main"
$dest = "C:\Users\Lenovo\.gemini\antigravity\playground\obsidian-spirit\elevate\remote-repo"

$files = @(
  # Backend
  "backend/ai/hintGenerator.js",
  "backend/ai/questionClassifier.js",
  "backend/ai/resoningengine.js",
  "backend/api/routes.js",
  "backend/api/server.js",
  "backend/config/db.js",
  "backend/models/User.js",
  "backend/services/Ocrservice.js",
  "backend/services/ScreenCapture.js",
  "backend/services/audiocapture.js",
  "backend/services/intentDetector.js",
  "backend/services/speechtoText.js",
  "backend/package.json",
  "backend/test-auth.js",
  "backend/test-mongo.js",
  "backend/nodes.json",

  # Electron
  "electron files/main.js",
  "electron files/preload.js",

  # Docs
  "docs/ETHICS.md",

  # README frontend
  "README/frontend/src/App.jsx",
  "README/frontend/src/index.js",
  "README/frontend/src/components/AnalyticsDashboard.jsx",
  "README/frontend/src/components/BlogPage.jsx",
  "README/frontend/src/components/Dashboard.jsx",
  "README/frontend/src/components/HintOverlay.jsx",
  "README/frontend/src/components/HomePage.jsx",
  "README/frontend/src/components/IntroPage.jsx",
  "README/frontend/src/components/LoginPage.jsx",
  "README/frontend/src/components/Navbar.jsx",
  "README/frontend/src/components/PortfolioPage.jsx",
  "README/frontend/src/components/PracticeCard.jsx",
  "README/frontend/src/components/ProfilePage.jsx",
  "README/frontend/src/components/SessionControls.jsx",
  "README/frontend/src/components/ThemeToggle.jsx",
  "README/frontend/src/store/authStore.js",
  "README/frontend/src/store/themeStore.js",
  "README/frontend/src/styles/blog.css",
  "README/frontend/src/styles/dashboard.css",
  "README/frontend/src/styles/home.css",
  "README/frontend/src/styles/intro.css",
  "README/frontend/src/styles/login.css",
  "README/frontend/src/styles/main.css",
  "README/frontend/src/styles/portfolio.css",
  "README/frontend/src/styles/profile.css",
  "README/frontend/public/index.html",
  "README/frontend/public/manifest.json",
  "README/frontend/package.json",
  "README/frontend/.env.example",
  ".gitignore"
)

$ok = 0; $fail = 0
foreach ($f in $files) {
  $url = "$base/$($f -replace ' ','%20')"
  $out = Join-Path $dest $f
  $dir = Split-Path $out
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop
    Write-Host "OK  $f" -ForegroundColor Green
    $ok++
  } catch {
    Write-Host "ERR $f" -ForegroundColor Red
    $fail++
  }
}
Write-Host "`nDone: $ok downloaded, $fail failed" -ForegroundColor Cyan
