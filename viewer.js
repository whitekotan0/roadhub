// --- CONFIGURATION ---
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const LEVEL_GAP = 250;
const SIBLING_GAP = 300;

// --- STATE ---
let nodesData = [], linksData = [];
let progress = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
let currentMapId = "default";
let svg, g, zoom;

// --- THEME INIT ---
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
}
if(localStorage.getItem('theme') === 'light') toggleTheme();

// --- LOAD MAP ---
async function loadMap() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.get('local') === 'true') {
    const localData = localStorage.getItem('temp_roadmap');
    if (localData) {
      const json = JSON.parse(localData);
      initApp(json, json.id || "local_map");
      return;
    }
  }

  const filename = params.get('map') || 'math.json';
  try {
    const res = await fetch(`roadmaps/${filename}`);
    if(!res.ok) throw new Error("File not found");
    const json = await res.json();
    initApp(json, json.id || filename);
  } catch(e) {
    alert("Error: " + e.message);
  }
}

function initApp(json, id) {
  currentMapId = id;
  document.getElementById('map-title').textContent = json.title;
  processGraph(json.nodes);
  initGraph();
  updateStats();
}

function processGraph(nodes) {
  const hasPredefinedCoords = nodes.length > 0 && nodes[0].hasOwnProperty('x') && nodes[0].hasOwnProperty('y');

  if (hasPredefinedCoords) {
    console.log("Using predefined coordinates (Manual Mode).");
    
   
    nodesData = [...nodes];
    
   
    linksData = [];
    nodes.forEach(n => {
      if (n.prerequisites) {
        n.prerequisites.forEach(pId => {
          
          if (nodes.find(node => node.id === pId)) {
            linksData.push({ source: pId, target: n.id });
          }
        });
      }
    });
    
    return; 
  }

 
  console.log("Calculating layout (Auto Mode).");
  
  const map = new Map();
  nodes.forEach(n => map.set(n.id, { ...n, level: 0, children: [], parents: [] }));
  
  linksData = [];
  nodes.forEach(n => {
    if(n.prerequisites) {
      n.prerequisites.forEach(pId => {
        if(map.has(pId)) {
          linksData.push({ source: pId, target: n.id });
          map.get(pId).children.push(n.id);
          map.get(n.id).parents.push(pId);
        }
      });
    }
  });

  // Calculate Levels (Y)
  let change = true;
  while(change) {
    change = false;
    map.forEach(n => {
      if(n.parents.length) {
        const maxP = Math.max(...n.parents.map(p => map.get(p).level));
        if(n.level < maxP + 1) { n.level = maxP + 1; change = true; }
      }
    });
  }

  // Calculate Positions (X)
  const levels = {};
  map.forEach(n => {
    if(!levels[n.level]) levels[n.level] = [];
    levels[n.level].push(n);
  });

  nodesData = Array.from(map.values()).map(n => {
    const row = levels[n.level];
    const idx = row.indexOf(n);
    const width = row.length * SIBLING_GAP;
    return { 
      ...n, 
      x: (idx * SIBLING_GAP) - (width / 2) + (SIBLING_GAP/2), 
      y: n.level * LEVEL_GAP 
    };
  });
}

// --- D3 RENDERING ---
function initGraph() {
  const container = document.getElementById('canvas-container');
  // Очистка перед отрисовкой
  d3.select("#svg").selectAll("*").remove();

  svg = d3.select("#svg").attr("width", "100%").attr("height", "100%");
  
  // Arrow Marker
  svg.append("defs").append("marker")
    .attr("id", "arrow").attr("viewBox", "0 -5 10 10")
    .attr("refX", NODE_WIDTH/2 + 8).attr("refY", 0)
    .attr("markerWidth", 6).attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--line-color)");

  g = svg.append("g");
  zoom = d3.zoom().scaleExtent([0.1, 2]).on("zoom", e => g.attr("transform", e.transform));
  svg.call(zoom);
  
  // Center View
  svg.call(zoom.transform, d3.zoomIdentity.translate(container.clientWidth/2, 50).scale(0.8));
  
  render();
}

function render() {
  // Links
  g.selectAll(".link").data(linksData).join("path")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)")
    .attr("d", d => {
     
      const s = nodesData.find(n => n.id === (d.source.id || d.source));
      const t = nodesData.find(n => n.id === (d.target.id || d.target));
      
    
      return `M${s.x},${s.y + NODE_HEIGHT/2} C${s.x},${s.y + NODE_HEIGHT/2 + 100} ${t.x},${t.y - NODE_HEIGHT/2 - 100} ${t.x},${t.y - NODE_HEIGHT/2}`;
    });

  // Nodes
  const nodes = g.selectAll(".node").data(nodesData).join("g")
    .attr("class", d => `node ${isDone(d.id) ? 'completed' : ''}`)
    .attr("data-group", d => d.group || 'default') // For CSS Colors
    .attr("transform", d => `translate(${d.x - NODE_WIDTH/2}, ${d.y - NODE_HEIGHT/2})`)
    .on("click", (e, d) => openPanel(d));

  nodes.append("rect").attr("width", NODE_WIDTH).attr("height", NODE_HEIGHT);
  nodes.append("text").attr("x", NODE_WIDTH/2).attr("y", NODE_HEIGHT/2)
    .text(d => d.title.length > 22 ? d.title.substr(0,20)+'...' : d.title);
}

// --- LOGIC ---
function isDone(id) { return progress[currentMapId]?.[id]; }

function toggleNode(id) {
  if(!progress[currentMapId]) progress[currentMapId] = {};
  if(progress[currentMapId][id]) delete progress[currentMapId][id];
  else progress[currentMapId][id] = true;
  
  localStorage.setItem('roadmap-progress', JSON.stringify(progress));
  
  g.selectAll(".node").filter(d => d.id === id).classed("completed", isDone(id));
  updatePanelBtn(id);
  updateStats();
}

function openPanel(d) {
  document.getElementById('p-title').textContent = d.title;
  // Simple MD parser
  document.getElementById('p-content').innerHTML = (d.content || "")
    .replace(/\n/g, '<br>')
    .replace(/# (.*)/g, '<h3>$1</h3>')
    .replace(/- (.*)/g, '<li>$1</li>');
  
  const btn = document.getElementById('p-toggle');
  const newBtn = btn.cloneNode(true); // Remove listeners
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.onclick = () => toggleNode(d.id);
  updatePanelBtn(d.id);
  
  document.getElementById('panel').classList.add('active');
}

function updatePanelBtn(id) {
  const btn = document.getElementById('p-toggle');
  const done = isDone(id);
  btn.textContent = done ? "Mark Incomplete" : "Mark Completed";
  btn.style.background = done ? "var(--btn-bg)" : "#10b981";
  btn.style.color = done ? "var(--text-muted)" : "white";
}

function updateStats() {
  const total = nodesData.length;
  const done = nodesData.filter(n => isDone(n.id)).length;
  const pct = total ? Math.round((done/total)*100) : 0;
  document.getElementById('progress-text').textContent = `${done} / ${total}`;
}

function closePanel() { document.getElementById('panel').classList.remove('active'); }
function resetView() { svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(document.body.clientWidth/2, 50).scale(0.8)); }
function clearProgress() {
  if(confirm("Reset progress for this map?")) {
    delete progress[currentMapId];
    localStorage.setItem('roadmap-progress', JSON.stringify(progress));
    location.reload();
  }
}

// Start
loadMap();