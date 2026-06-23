@echo off
cd /d "%~dp0"
echo Starting portfolio server at http://localhost:8765
echo Keep this window open. Press Ctrl+C to stop.
python -m http.server 8765
pause
