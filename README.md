# 🗺️ RoadMaps - Interactive Learning Paths Platform

<div align="center">

  <h1>✨ Transform Learning Into an Adventure</h1>
  
  <p>
    <strong>Create stunning, interactive roadmaps with beautiful visualizations and track your progress like never before.</strong>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-create-roadmaps">Create</a> •
    <a href="#-keyboard-shortcuts">Shortcuts</a>
  </p>

  <br>

  <img src="https://img.shields.io/badge/Design-Premium-blueviolet?style=for-the-badge" alt="Design">
  <img src="https://img.shields.io/badge/UI-Glassmorphism-blue?style=for-the-badge" alt="UI">
  <img src="https://img.shields.io/badge/Status-Production-success?style=for-the-badge" alt="Status">

</div>

---

## 💎 What is RoadMaps?

**RoadMaps** is a premium, open-source platform for creating, sharing, and tracking interactive learning paths. Unlike boring lists or traditional wikis, this tool transforms knowledge into **stunning visual skill trees** with:

- 🎨 **Glassmorphism UI** - Modern frosted-glass design
- 🌊 **Smooth Animations** - Fluid transitions and micro-interactions
- 🎯 **Drag & Drop Editor** - Intuitive visual roadmap creation
- 📊 **Progress Tracking** - Gamified learning experience
- 🌓 **Dark/Light Themes** - Beautiful in any mode
- 🔒 **Privacy First** - No accounts, no tracking, your data stays local

---

## ✨ Features

### 🎨 Premium Design System
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Gradient Accents** - Vibrant color gradients throughout
- **Smooth Animations** - Every interaction feels premium
- **Responsive** - Works beautifully on all devices

### 🖼️ Visual Drag-and-Drop Editor
- **Infinite Canvas** - Pan and zoom freely
- **Smart Linking** - Drag from ports to create beautiful curves
- **Real-time Preview** - See changes instantly
- **Auto Layout** - Automatic or manual node positioning
- **Color-coded Categories** - 6 theme colors (Core, GameDev, ML, Crypto, Engineering, Research)

### 🧭 Interactive Viewer
- **Progress Tracking** - Mark nodes as completed
- **Auto-Save** - Progress saved to localStorage
- **Markdown Support** - Rich content with full markdown rendering
- **Smart Curves** - Beautiful Bezier connections
- **Zoom Controls** - Easy navigation

### 📂 Open Architecture
- **JSON Based** - Simple, version-control friendly format
- **Offline First** - Runs entirely in browser
- **Local Loading** - Open files directly from your computer
- **Export/Import** - Full control over your data

---

## ⚡ Quick Start

### Option 1: Use Online
Just open `index.html` in any modern browser!

### Option 2: Local Server (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd roadmaps

# Start a local server
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

---

## 🎨 Create Roadmaps

### Using the Visual Editor

1. **Open Editor** - Click "Create New" on home page
2. **Add Nodes** - Click "+ Node" or press `Ctrl+N`
3. **Customize** - Select node and edit properties in right panel
4. **Create Links** - Drag from ● port on one node to another
5. **Save** - Click "💾 Save" or press `Ctrl+S`

### JSON Format

Roadmaps are stored as simple JSON files:

```json
{
  "id": "my_roadmap",
  "title": "My Learning Path",
  "description": "Short description",
  "nodes": [
    {
      "id": "node1",
      "title": "Node Title",
      "group": "core",
      "content": "# Description\n\nMarkdown content...",
      "prerequisites": [],
      "x": 200,
      "y": 150
    }
  ]
}
```

### Node Color Groups
- `core` - Blue (Main concepts)
- `gamedev` - Green (Game development)
- `ml` - Purple (AI/ML)
- `crypto` - Orange (Blockchain/Crypto)
- `engineering` - Red (Engineering)
- `research` - Pink (Research topics)

---

## ⌨️ Keyboard Shortcuts

### Editor
- `Ctrl+N` / `Cmd+N` - New node
- `Ctrl+S` / `Cmd+S` - Save roadmap
- `Delete` / `Backspace` - Delete selected node
- `Shift+Click` on link - Delete link

### Viewer
- `Mouse Wheel` - Zoom in/out
- `Click+Drag` - Pan canvas
- `Click Node` - View details

---

## 🛠️ Technology Stack

- **HTML5 / CSS3** - Modern layout with CSS Grid, Flexbox, Glassmorphism
- **Vanilla JavaScript** - No framework dependencies
- **D3.js v7** - Powerful graph visualization
- **Marked.js** - Markdown rendering
- **LocalStorage** - Progress persistence

---

## 📁 Project Structure

```
roadmaps/
├── index.html          # Landing page
├── editor.html         # Visual roadmap editor
├── viewer.html         # Roadmap viewer
├── viewer.js           # Viewer logic
├── style.css           # Premium design system
├── directory.json      # Available roadmaps list
└── roadmaps/           # JSON roadmap files
    └── math.json       # Example roadmap
```

---

## 🎯 Design Principles

### Glassmorphism
- Frosted glass effect using `backdrop-filter: blur()`
- Semi-transparent backgrounds
- Subtle borders and shadows

### Color System
- Premium dark theme with mesh gradients
- Vibrant accent colors
- Carefully crafted light theme

### Animations
- Smooth transitions (300ms cubic-bezier)
- Hover effects on all interactive elements
- Loading states and micro-interactions

### Typography
- System font stack for best performance
- Clear hierarchy with variable font sizes
- Optimal line heights for readability

---

## 🚀 Future Enhancements

- [ ] Export to PNG/SVG
- [ ] Share roadmaps via URL
- [ ] Search and filter nodes
- [ ] Import from other formats
- [ ] Roadmap templates
- [ ] Export progress reports
- [ ] Collaborative editing
- [ ] Mobile app

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 Credits

Built with ❤️ for the self-learning community.

**Features:**
- Premium glassmorphism design
- Smooth animations and micro-interactions
- Full markdown support
- Intuitive drag-and-drop editor
- Beautiful dark/light themes

**Happy Learning! 🚀**

---

<div align="center">
  <p>Made with passion for visual learning</p>
  <p>⭐ Star us on GitHub if you find this useful!</p>
</div>
