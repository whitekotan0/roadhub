<div align="center">

# 🗺️ RoadHub

### Transform Learning Into an Interactive Adventure

**Create stunning, interactive roadmaps with beautiful visualizations and track your progress like never before.**

[🌐 Live Demo](https://roadhub.online/) • [📖 Documentation](#-features) • [🚀 Quick Start](#-quick-start)

<img width="100%" alt="RoadHub Interface" src="https://img.shields.io/badge/Design-Glassmorphism-8B5CF6?style=for-the-badge&logo=tailwindcss&logoColor=white" />

</div>

---

## 💎 What is RoadHub?

**RoadHub** is a premium open-source platform for creating, sharing, and exploring interactive learning paths. Transform knowledge into **stunning visual skill trees** with modern design and intuitive controls.

### ✨ Key Features

```
🎨 Glassmorphism UI      Modern frosted-glass design with vibrant gradients
🎯 Drag & Drop Editor    Intuitive visual roadmap creation
📊 Progress Tracking     Gamified learning experience with auto-save
🌓 Dark/Light Themes     Beautiful in any mode
🔒 Privacy First         No accounts, no tracking, your data stays local
⚡ Offline First         Runs entirely in browser
```

---

## 🚀 Quick Start

### Online Version
Visit **[roadhub.online](https://roadhub.online/)** - No installation required!

### Local Development

```bash
# Clone the repository
git clone https://github.com/whitekotan0/roadhub.git
cd roadhub

# Start local server
python -m http.server 8000

# Open http://localhost:8000
```

---

## 🎨 Features

### Visual Editor
- **Infinite Canvas** - Pan and zoom freely with smooth animations
- **Smart Linking** - Drag from connection ports to create beautiful curves
- **Real-time Preview** - See your changes instantly
- **Color-coded Categories** - 6 theme colors for different topics
- **Auto Layout** - Automatic or manual node positioning

### Interactive Viewer
- **Progress Tracking** - Mark nodes as completed, track your journey
- **Markdown Support** - Rich content with full markdown rendering
- **Smart Navigation** - Zoom controls and smooth panning
- **Auto-Save** - Progress automatically saved to localStorage

### Technical Excellence
- **JSON Based** - Simple, version-control friendly format
- **No Dependencies** - Pure HTML, CSS, and JavaScript
- **Responsive Design** - Works beautifully on all devices
- **Export/Import** - Full control over your data

---

## 🖼️ Creating Roadmaps

### Using the Visual Editor

1. Click **"Create New"** on the home page
2. Add nodes with **`Ctrl+N`** or the "+ Node" button
3. Select a node to customize in the properties panel
4. Drag from ● ports to create connections
5. Save with **`Ctrl+S`** or the 💾 button

### JSON Format

```json
{
  "id": "my_roadmap",
  "title": "My Learning Path",
  "description": "A custom learning journey",
  "nodes": [
    {
      "id": "node1",
      "title": "Getting Started",
      "group": "core",
      "content": "# Introduction\n\nMarkdown content here...",
      "prerequisites": [],
      "x": 200,
      "y": 150
    }
  ]
}
```

### Color Groups

| Group | Color | Use Case |
|-------|-------|----------|
| `core` | 🔵 Blue | Main concepts and fundamentals |
| `gamedev` | 🟢 Green | Game development topics |
| `ml` | 🟣 Purple | AI/ML and data science |
| `crypto` | 🟠 Orange | Blockchain and cryptocurrency |
| `engineering` | 🔴 Red | Software engineering |
| `research` | 🌸 Pink | Research and advanced topics |

---

## ⌨️ Keyboard Shortcuts

### Editor Mode
| Shortcut | Action |
|----------|--------|
| `Ctrl+N` / `Cmd+N` | Create new node |
| `Ctrl+S` / `Cmd+S` | Save roadmap |
| `Delete` / `Backspace` | Delete selected node |
| `Shift+Click` on link | Delete connection |

### Viewer Mode
| Action | Control |
|--------|---------|
| Pan Canvas | Click + Drag |
| Zoom | Mouse Wheel |
| View Details | Click Node |

---

## 🛠️ Technology Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| **HTML5 / CSS3** | Modern layout with Glassmorphism |
| **Vanilla JavaScript** | Zero framework dependencies |
| **D3.js v7** | Powerful graph visualization |
| **Marked.js** | Markdown rendering |
| **LocalStorage** | Progress persistence |

</div>

---

## 🎯 Design Philosophy

### Glassmorphism
Modern frosted glass aesthetic with `backdrop-filter: blur()`, semi-transparent backgrounds, and subtle elevation.

### Color System
Premium dark theme with mesh gradients, vibrant accent colors, and a carefully crafted light mode alternative.

### Animations
Smooth transitions using cubic-bezier curves, hover effects on interactive elements, and delightful micro-interactions.

### Typography
System font stack for optimal performance, clear visual hierarchy, and comfortable reading experience.

---

## 📁 Project Structure

```
roadhub/
├── index.html          # Landing page
├── editor.html         # Visual roadmap editor
├── viewer.html         # Roadmap viewer
├── viewer.js           # Viewer logic
├── style.css           # Complete design system
├── script.js           # Core functionality
├── directory.json      # Roadmap directory
└── roadmaps/           # Roadmap files
    ├── math.json
    ├── life_algorithm.json
    └── fix_bug.json
```

---

## 🔮 Roadmap

- [ ] Export to PNG/SVG
- [ ] Share roadmaps via URL
- [ ] Search and filter nodes
- [ ] Import from other formats
- [ ] Roadmap templates library
- [ ] Progress reports and analytics
- [ ] Mobile app version
- [ ] Collaborative editing

---

## 📄 License

**MIT License** - Free to use and modify for any purpose.

---

<div align="center">

### Made with 💜 by [whitekotan0](https://github.com/whitekotan0)

**[🌐 Visit RoadHub](https://roadhub.online/)** • **[⭐ Star on GitHub](https://github.com/whitekotan0/roadhub)**

<sub>Transform your learning journey into an interactive adventure</sub>

</div>
