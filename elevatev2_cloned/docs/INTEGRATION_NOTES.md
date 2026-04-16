# Elevate Platform — Remote Repo Integration Notes

## Source Repo
`https://github.com/dishan775/Elevate-complete-repo-`

## Integration Summary (April 2026)

### What the remote repo contained
| Folder | Contents | Action |
|--------|----------|--------|
| `.git_backup/` | Raw git history backup | Skipped — not needed |
| `README/frontend/` | Old CRA React app (v1) | Skipped — our Vite frontend is newer |
| `backend/` | MongoDB + Auth backend | Already exists locally in `backend/` |
| `backend/ai/` | hintGenerator, questionClassifier, reasoningEngine | Already present locally |
| `backend/services/` | OCR, audio capture, screen capture, speech-to-text | Already present locally |
| `electron files/` | Electron main.js (CRA version) | Our `electron/main.cjs` is the Vite version |
| `docs/ETHICS.md` | Ethics doc | Added to `docs/` |

### What was already integrated
- `backend/` folder is fully synced — the remote repo is the source of this folder
- `electron/main.cjs` targets Vite dev server (port 5173) and Vite dist builds — kept as-is
- `server/index.js` is the OpenAI/English API server running on port 5000 — kept as-is

### Architecture
```
elevate/
├── src/               # Vite React frontend
├── server/            # OpenAI/English API server (port 5000)
├── backend/           # MongoDB Auth server (port 3001)
│   ├── api/routes.js    # /auth/register, /auth/login, /user/profile, /sessions/stats
│   ├── models/User.js   # Mongoose User model with bcrypt
│   ├── config/db.js     # MongoDB connection
│   ├── ai/              # AI utilities
│   └── services/        # Screen/audio capture, OCR, speech-to-text
├── electron/          # Electron desktop wrapper
└── docs/              # Documentation
```
