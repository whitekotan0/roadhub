// --- CONFIGURATION ---
const NODE_WIDTH = 200;
const NODE_HEIGHT = 90;
const LEVEL_GAP = 280;
const SIBLING_GAP = 320;

// --- STATE ---
let nodesData = [], linksData = [];
let progress = JSON.parse(localStorage.getItem('roadmap-progress') || '{}');
let currentMapId = "default";
let svg, g, zoom;

// --- THEME INIT ---
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isLight ? '🌙' : '☀️';
  
  if (svg) render();
}

if(localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
  document.getElementById('theme-btn').textContent = '🌙';
}

// --- LOAD MAP ---
async function loadMap() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.get('local') === 'true') {
    const localData = localStorage.getItem('temp_roadmap');
    if (localData) {
      try {
        const json = JSON.parse(localData);
        initApp(json, json.id || "local_map");
        return;
      } catch (e) {
        showError("Failed to load local file: " + e.message);
        return;
      }
    } else {
      showError("Local file not found");
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
    showError("Error: " + e.message);
  }
}

function showError(message) {
  alert(message);
  setTimeout(() => window.location.href = 'index.html', 2000);
}

function initApp(json, id) {
  currentMapId = id;
  document.getElementById('map-title').textContent = json.title || "Roadmap";
  document.title = `${json.title || "Roadmap"} - Roadmap Viewer`;
  processGraph(json.nodes);
  initGraph();
  updateStats();
}

function processGraph(nodes) {
  const hasPredefinedCoords = nodes.length > 0 && nodes[0].hasOwnProperty('x') && nodes[0].hasOwnProperty('y');

  if (hasPredefinedCoords) {
    console.log("Using predefined coordinates (Manual mode)");
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

  console.log("Calculating layout (Auto mode)");
  
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
        if(n.level < maxP + 1) { 
          n.level = maxP + 1; 
          change = true; 
        }
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
  d3.select("#svg").selectAll("*").remove();

  svg = d3.select("#svg").attr("width", "100%").attr("height", "100%");
  
  // Arrow Marker
  const defs = svg.append("defs");
  
  // Gradient for arrow
  const arrowGradient = defs.append("linearGradient")
    .attr("id", "arrow-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");
  
  arrowGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "var(--accent-primary)")
    .attr("stop-opacity", 0.5);
  
  arrowGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "var(--accent-primary)")
    .attr("stop-opacity", 1);
  
  defs.append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", NODE_WIDTH/2 + 10)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "url(#arrow-gradient)");

  g = svg.append("g");
  zoom = d3.zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", e => g.attr("transform", e.transform));
  svg.call(zoom);
  
  // Center View
  const initialTransform = d3.zoomIdentity
    .translate(container.clientWidth/2, 100)
    .scale(0.75);
  svg.call(zoom.transform, initialTransform);
  
  render();
}

function render() {
  // Clear and re-render links
  g.selectAll(".link").remove();
  g.selectAll(".link").data(linksData).enter().append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)")
    .attr("d", d => {
      const s = nodesData.find(n => n.id === (d.source.id || d.source));
      const t = nodesData.find(n => n.id === (d.target.id || d.target));
      if (!s || !t) return "M0,0";
      
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const controlOffset = Math.min(dist * 0.4, 150);
      
      let startX = s.x;
      let startY = s.y + NODE_HEIGHT/2;
      let endX = t.x;
      let endY = t.y - NODE_HEIGHT/2;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          startX = s.x + NODE_WIDTH/2;
          startY = s.y;
          endX = t.x - NODE_WIDTH/2;
          endY = t.y;
        } else {
          startX = s.x - NODE_WIDTH/2;
          startY = s.y;
          endX = t.x + NODE_WIDTH/2;
          endY = t.y;
        }
      }
      
      return `M${startX},${startY} C${startX},${startY + controlOffset} ${endX},${endY - controlOffset} ${endX},${endY}`;
    });

  // Nodes
  const nodeSelection = g.selectAll(".node").data(nodesData, d => d.id);
  
  nodeSelection.exit().remove();
  
  const nodeEnter = nodeSelection.enter().append("g")
    .attr("class", d => `node ${isDone(d.id) ? 'completed' : ''}`)
    .attr("data-group", d => d.group || 'core')
    .attr("transform", d => `translate(${d.x - NODE_WIDTH/2}, ${d.y - NODE_HEIGHT/2})`)
    .style("cursor", "pointer")
    .on("click", (e, d) => openPanel(d));

  nodeEnter.append("rect")
    .attr("width", NODE_WIDTH)
    .attr("height", NODE_HEIGHT)
    .attr("rx", 14);
  
  nodeEnter.append("text")
    .attr("x", NODE_WIDTH/2)
    .attr("y", NODE_HEIGHT/2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("pointer-events", "none")
    .text(d => {
      const maxLen = 24;
      return d.title.length > maxLen ? d.title.substring(0, maxLen-3) + '...' : d.title;
    });

  // Update existing nodes
  const allNodes = nodeEnter.merge(nodeSelection);
  allNodes
    .attr("class", d => `node ${isDone(d.id) ? 'completed' : ''}`)
    .attr("data-group", d => d.group || 'core')
    .attr("transform", d => `translate(${d.x - NODE_WIDTH/2}, ${d.y - NODE_HEIGHT/2})`);
  
  allNodes.select("text").text(d => {
    const maxLen = 24;
    return d.title.length > maxLen ? d.title.substring(0, maxLen-3) + '...' : d.title;
  });
}

// --- LOGIC ---
function isDone(id) { 
  return progress[currentMapId]?.[id]; 
}

function toggleNode(id) {
  if(!progress[currentMapId]) progress[currentMapId] = {};
  if(progress[currentMapId][id]) {
    delete progress[currentMapId][id];
  } else {
    progress[currentMapId][id] = true;
  }
  
  localStorage.setItem('roadmap-progress', JSON.stringify(progress));
  
  g.selectAll(".node").filter(d => d.id === id).classed("completed", isDone(id));
  updatePanelBtn(id);
  updateStats();
}

function openPanel(d) {
  document.getElementById('p-title').textContent = d.title;
  
  const content = d.content || `# ${d.title}\n\nNo description available.`;
  try {
    if (typeof marked !== 'undefined') {
      document.getElementById('p-content').innerHTML = marked.parse(content);
    } else {
      document.getElementById('p-content').innerHTML = content
        .replace(/\n/g, '<br>')
        .replace(/#{3} (.*)/g, '<h3>$1</h3>')
        .replace(/#{2} (.*)/g, '<h2>$1</h2>')
        .replace(/#{1} (.*)/g, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*)/g, '<li>$1</li>');
    }
  } catch (e) {
    console.error("Markdown parsing error:", e);
    document.getElementById('p-content').innerHTML = `<p>${content}</p>`;
  }
  
  const btn = document.getElementById('p-toggle');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.onclick = () => toggleNode(d.id);
  updatePanelBtn(d.id);
  
  document.getElementById('panel').classList.add('active');
}

function updatePanelBtn(id) {
  const btn = document.getElementById('p-toggle');
  const done = isDone(id);
  btn.textContent = done ? "✓ Mark as Incomplete" : "✓ Mark as Completed";
  btn.className = done ? "btn btn-danger" : "btn btn-success";
}

function updateStats() {
  const total = nodesData.length;
  if (total === 0) return;
  const done = nodesData.filter(n => isDone(n.id)).length;
  const pct = Math.round((done/total)*100);
  document.getElementById('progress-text').textContent = `${done} / ${total}`;
  document.getElementById('progress-percent').textContent = `${pct}%`;
}

function closePanel() { 
  document.getElementById('panel').classList.remove('active'); 
}

function resetView() { 
  const container = document.getElementById('canvas-container');
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity
      .translate(container.clientWidth/2, 100)
      .scale(0.75)
    );
}

function clearProgress() {
  if(confirm("Are you sure? This will reset all progress for this roadmap.")) {
    if(progress[currentMapId]) delete progress[currentMapId];
    localStorage.setItem('roadmap-progress', JSON.stringify(progress));
    location.reload();
  }
}

// Start
loadMap();
