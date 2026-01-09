// --- CONFIGURATION ---
const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;
const LEVEL_GAP = 250;
const SIBLING_GAP = 300;

// --- STATE ---
let nodesData = [];
let linksData = [];
let progress = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
let currentMapId = "default";
let svg, g, zoom;

// --- THEME LOGIC ---
function initTheme() {
  // Check saved theme
  const savedTheme = localStorage.getItem('roadmap-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.getElementById('theme-btn').textContent = '🌙';
  } else {
    document.getElementById('theme-btn').textContent = '☀️';
  }
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  
  localStorage.setItem('roadmap-theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isLight ? '🌙' : '☀️';
}

// --- 1. LOAD DATA ---
async function loadData() {
  initTheme(); // Apply theme on load

  const urlParams = new URLSearchParams(window.location.search);
  const mapFile = urlParams.get('map') || 'math.json';

  try {
    const response = await fetch(`./roadmaps/${mapFile}`);
    if (!response.ok) throw new Error(`Could not load roadmaps/${mapFile}`);
    
    const json = await response.json();
    
    currentMapId = json.id || mapFile;
    document.getElementById('map-title').textContent = json.title || "Roadmap";

    processGraph(json.nodes);
    initGraph();
    updateStats();
    document.getElementById('loading').style.display = 'none';
  } catch (err) {
    document.getElementById('loading').innerHTML = `Error loading <b>${mapFile}</b>.<br>Check console.`;
    console.error(err);
  }
}

// --- 2. LAYOUT LOGIC ---
function processGraph(rawNodes) {
  const nodeMap = new Map();
  rawNodes.forEach(n => nodeMap.set(n.id, { ...n, level: 0, children: [], parents: [] }));

  linksData = [];
  rawNodes.forEach(n => {
    if (n.prerequisites) {
      n.prerequisites.forEach(parentId => {
        if (nodeMap.has(parentId)) {
          linksData.push({ source: parentId, target: n.id });
          nodeMap.get(parentId).children.push(n.id);
          nodeMap.get(n.id).parents.push(parentId);
        }
      });
    }
  });

  let changed = true;
  while(changed) {
    changed = false;
    nodeMap.forEach(node => {
      if (node.parents.length > 0) {
        const maxParentLevel = Math.max(...node.parents.map(pid => nodeMap.get(pid).level));
        if (node.level < maxParentLevel + 1) {
          node.level = maxParentLevel + 1;
          changed = true;
        }
      }
    });
  }

  const levels = {};
  nodeMap.forEach(node => {
    if (!levels[node.level]) levels[node.level] = [];
    levels[node.level].push(node);
  });

  nodesData = Array.from(nodeMap.values()).map(node => {
    const nodesInLevel = levels[node.level];
    const indexInLevel = nodesInLevel.indexOf(node);
    const levelWidth = nodesInLevel.length * SIBLING_GAP;
    const xOffset = indexInLevel * SIBLING_GAP - (levelWidth / 2) + (SIBLING_GAP / 2);

    return { ...node, x: xOffset, y: node.level * LEVEL_GAP };
  });
}

// --- 3. RENDERING ---
function initGraph() {
  const container = document.getElementById('canvas-container');
  svg = d3.select("#svg").attr("width", "100%").attr("height", "100%");

  // Marker setup
  svg.append("defs").append("marker")
    .attr("id", "arrow").attr("viewBox", "0 -5 10 10")
    .attr("refX", NODE_WIDTH / 2 + 10).attr("refY", 0)
    .attr("markerWidth", 6).attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--line-color)"); 
    // ^ Note: fill color here needs to handle theme changes or be static gray

  g = svg.append("g");

  zoom = d3.zoom().scaleExtent([0.1, 2]).on("zoom", (e) => g.attr("transform", e.transform));
  svg.call(zoom);
  
  const initialTransform = d3.zoomIdentity.translate(container.clientWidth/2, 50).scale(0.8);
  svg.call(zoom.transform, initialTransform);

  render();
}

function render() {
  // Clear existing to re-render (needed for some theme edge cases or data updates)
  g.selectAll("*").remove(); 

  // Links
  g.selectAll(".link").data(linksData).join("path")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)")
    .attr("d", d => {
      const src = nodesData.find(n => n.id === d.source);
      const trg = nodesData.find(n => n.id === d.target);
      return `M${src.x},${src.y + NODE_HEIGHT/2} C${src.x},${src.y + NODE_HEIGHT/2 + 50} ${trg.x},${trg.y - NODE_HEIGHT/2 - 50} ${trg.x},${trg.y - NODE_HEIGHT/2}`;
    });

  // Nodes
  const nodes = g.selectAll(".node").data(nodesData).join("g")
    .attr("class", d => `node ${isCompleted(d.id) ? 'completed' : ''}`)
    .attr("transform", d => `translate(${d.x - NODE_WIDTH/2}, ${d.y - NODE_HEIGHT/2})`)
    .on("click", (e, d) => openPanel(d));

  nodes.append("rect").attr("width", NODE_WIDTH).attr("height", NODE_HEIGHT);
  
  nodes.append("text")
    .attr("x", NODE_WIDTH/2)
    .attr("y", NODE_HEIGHT/2)
    .text(d => d.title.length > 20 ? d.title.substring(0,18) + '...' : d.title);
}

// --- 4. LOGIC & STATS ---
function isCompleted(nodeId) {
  return progress[currentMapId] && progress[currentMapId][nodeId];
}

function toggleNode(nodeId) {
  if (!progress[currentMapId]) progress[currentMapId] = {};

  if (progress[currentMapId][nodeId]) {
    delete progress[currentMapId][nodeId];
  } else {
    progress[currentMapId][nodeId] = true;
  }

  localStorage.setItem('roadmap-progress', JSON.stringify(progress));

  // Efficient Re-render of classes only
  g.selectAll(".node").filter(d => d.id === nodeId)
    .classed("completed", isCompleted(nodeId));
  
  updatePanelButton(nodeId);
  updateStats();
}

function updateStats() {
  const total = nodesData.length;
  if (total === 0) return;
  const completed = nodesData.filter(n => isCompleted(n.id)).length;
  const percent = Math.round((completed / total) * 100);

  document.getElementById('progress-text').textContent = `${completed} / ${total}`;
  document.getElementById('progress-percent').textContent = `${percent}% Completed`;
}

// --- 5. UI HELPERS ---
function openPanel(node) {
  document.getElementById('p-title').textContent = node.title;
  document.getElementById('p-id').textContent = node.id;
  document.getElementById('p-content').innerText = node.content; // Using innerText for basic rendering
  
  const btn = document.getElementById('p-toggle');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  newBtn.onclick = () => toggleNode(node.id);
  updatePanelButton(node.id);
  
  document.getElementById('panel').classList.add('active');
}

function updatePanelButton(id) {
  const btn = document.getElementById('p-toggle');
  const done = isCompleted(id);
  btn.textContent = done ? "Mark as Incomplete" : "Mark as Completed";
  
  // Styles are handled by CSS classes mostly, but overrides here for specific button state
  if(done) {
      btn.style.backgroundColor = "var(--btn-bg)";
      btn.style.color = "var(--text-muted)";
  } else {
      btn.style.backgroundColor = "#10b981";
      btn.style.color = "#fff";
  }
}

function closePanel() { document.getElementById('panel').classList.remove('active'); }

function resetView() {
  const container = document.getElementById('canvas-container');
  svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(container.clientWidth/2, 50).scale(0.8));
}

function clearProgress() {
  if(confirm("Are you sure? This deletes progress for the CURRENT roadmap.")) {
    if(progress[currentMapId]) delete progress[currentMapId];
    localStorage.setItem('roadmap-progress', JSON.stringify(progress));
    location.reload();
  }
}

// Start
loadData();