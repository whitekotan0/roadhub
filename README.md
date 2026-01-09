<div align="center">

  <h1>🗺️ RoadHub</h1>
  
  <p>
    <strong>Turn boring learning lists into interactive RPG-style skill trees.</strong>
  </p>

  <p>
    <a href="https://whitekotan0.github.io/roadhub/">🚀 Live Demo</a> •
    <a href="#-features">✨ Features</a> •
    <a href="#-quick-start">⚡ Quick Start</a> •
    <a href="#-creating-roadmaps">🎨 Create Your Own</a>
  </p>

  <br>

  <img src="screenshots/demo.gif" alt="RoadHub Demo" width="100%" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">

</div>

---

## 💡 What is RoadHub?

**RoadHub** is a free, open-source platform for creating, sharing, and tracking educational roadmaps. 

Unlike standard lists or wikis, this tool visualizes knowledge as **Interactive Skill Trees**. It helps learners understand dependencies, track their progress, and see the "big picture" of any subject—from Mathematics to Knitting.

### Why Use This?
* **📚 For Learners:** Visualize complex subjects as interconnected nodes.
* **👨‍🏫 For Educators:** Create structured curricula with clear prerequisites.
* **🎮 Gamification:** Track progress like leveling up in an RPG.
* **🔒 Privacy First:** No accounts, no tracking. Your data stays in your browser.
* **📂 Open Format:** Full control over your data (JSON).

---

## ✨ Features

### 🎨 Visual Drag-and-Drop Editor
Create complex learning paths without writing a single line of code.
* **Infinite Canvas:** Drag nodes freely in any direction.
* **Smart Linking:** Drag from node connectors ("ports") to create smooth Bezier curves.
* **Real-time Preview:** See your changes instantly as you type.

### 🧭 Interactive Viewer
* **Progress Tracking:** Mark nodes as "Completed" and watch your percentage rise.
* **Auto-Save:** Your progress is saved automatically to `localStorage`.
* **Rich Content:** Nodes support Markdown (links, videos, formatted text).

### 🌗 Beautiful Theming
* **Dark Mode (Default):** Deep blue & wine palette, perfect for night coding.
* **Light Mode:** Clean pastel design for clarity.
* **Categories:** Color-coded groups (e.g., Core, GameDev, ML, Crypto).

### 📂 Open Architecture
* **JSON Based:** All maps are simple `.json` files. Easy to version control.
* **Offline First:** Runs entirely in the browser. No backend required.
* **Local Loading:** Open any roadmap file directly from your computer without uploading it.

---

## ⚡ Quick Start

### Option 1: Live Demo
Visit the official site (no installation needed):
**[Launch RoadHub](https://whitekotan0.github.io/roadhub/)**

### Option 2: Run Locally
Since the project fetches JSON files, you need a simple local server.

```bash
# 1. Clone the repository
git clone [https://github.com/whitekotan0/roadhub.git](https://github.com/whitekotan0/roadhub.git)
cd roadhub

# 2. Run a local server (Python example)
python -m http.server 8000

# 3. Open in browser
# http://localhost:8000