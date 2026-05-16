const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const wrap = document.getElementById("canvasWrap");
const addNodeBtn = document.getElementById("addNodeBtn");
const connectModeBtn = document.getElementById("connectModeBtn");
const nodeText = document.getElementById("nodeText");
const tonePicker = document.getElementById("tonePicker");
const statusText = document.getElementById("statusText");
const focusBtn = document.getElementById("focusBtn");
const deleteBtn = document.getElementById("deleteBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const renameEditor = document.getElementById("renameEditor");

const tones = [
  ["#35dec0", "#0e8f81"],
  ["#ff8b62", "#c94335"],
  ["#f5d75d", "#c17b19"],
  ["#83a7ff", "#4a54d8"],
  ["#f078b6", "#a33774"],
];

const state = {
  nodes: [
    {
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 58,
      text: "Главная задача",
      tone: 0,
      wobble: Math.random() * 10,
    },
  ],
  links: [],
  selectedId: null,
  selectedLinkId: null,
  hoverId: null,
  hoverLinkId: null,
  connectFromId: null,
  connectMode: false,
  draggingNodeId: null,
  renamingNodeId: null,
  renameOriginalText: "",
  panning: false,
  spaceDown: false,
  pointer: { x: 0, y: 0, worldX: 0, worldY: 0 },
  pan: { x: 0, y: 0 },
  zoom: 1,
  lastTime: 0,
  pulse: 0,
};

state.selectedId = state.nodes[0].id;

function resize() {
  const rect = wrap.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!state.pan.x && !state.pan.y) {
    state.pan.x = rect.width / 2;
    state.pan.y = rect.height / 2;
  }
  positionRenameEditor();
}

function selectedNode() {
  return state.nodes.find((node) => node.id === state.selectedId);
}

function selectedLink() {
  return state.links.find((link) => link.id === state.selectedLinkId);
}

function renamingNode() {
  return state.nodes.find((node) => node.id === state.renamingNodeId);
}

function setStatus(text) {
  statusText.textContent = text;
}

function isTextEditing() {
  return document.activeElement === nodeText || document.activeElement === renameEditor;
}

function screenToWorld(x, y) {
  return {
    x: (x - state.pan.x) / state.zoom,
    y: (y - state.pan.y) / state.zoom,
  };
}

function worldToScreen(x, y) {
  return {
    x: x * state.zoom + state.pan.x,
    y: y * state.zoom + state.pan.y,
  };
}

function hitNode(worldX, worldY) {
  for (let index = state.nodes.length - 1; index >= 0; index -= 1) {
    const node = state.nodes[index];
    const dx = worldX - node.x;
    const dy = worldY - node.y;
    if (Math.hypot(dx, dy) <= node.radius + 8) return node;
  }
  return null;
}

function distanceToSegment(pointX, pointY, startX, startY, endX, endY) {
  const dx = endX - startX;
  const dy = endY - startY;
  const lengthSq = dx * dx + dy * dy;
  if (!lengthSq) return Math.hypot(pointX - startX, pointY - startY);
  const t = Math.max(0, Math.min(1, ((pointX - startX) * dx + (pointY - startY) * dy) / lengthSq));
  return Math.hypot(pointX - (startX + dx * t), pointY - (startY + dy * t));
}

function hitLink(worldX, worldY) {
  const tolerance = 13 / state.zoom;
  for (let index = state.links.length - 1; index >= 0; index -= 1) {
    const link = state.links[index];
    const from = state.nodes.find((node) => node.id === link.from);
    const to = state.nodes.find((node) => node.id === link.to);
    if (!from || !to) continue;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const curve = (Math.sin(state.lastTime * 0.0012 + link.energy * 8) * 18) / state.zoom;
    const cpX = (from.x + to.x) / 2 + normalX * curve;
    const cpY = (from.y + to.y) / 2 + normalY * curve;

    let previousX = from.x;
    let previousY = from.y;
    for (let step = 1; step <= 24; step += 1) {
      const t = step / 24;
      const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cpX + t * t * to.x;
      const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cpY + t * t * to.y;
      if (distanceToSegment(worldX, worldY, previousX, previousY, x, y) <= tolerance) {
        return link;
      }
      previousX = x;
      previousY = y;
    }
  }
  return null;
}

function positionRenameEditor() {
  const node = renamingNode();
  if (!node || renameEditor.hidden) return;

  const point = worldToScreen(node.x, node.y);
  const width = Math.max(130, Math.min(260, node.radius * state.zoom * 2.15));
  renameEditor.style.left = `${point.x}px`;
  renameEditor.style.top = `${point.y}px`;
  renameEditor.style.width = `${width}px`;
}

function startRename(node) {
  state.renamingNodeId = node.id;
  state.renameOriginalText = node.text;
  state.selectedId = node.id;
  state.selectedLinkId = null;
  state.connectFromId = null;
  state.connectMode = false;
  connectModeBtn.classList.remove("active");
  node.vx = 0;
  node.vy = 0;

  renameEditor.value = node.text;
  renameEditor.hidden = false;
  syncInspector();
  positionRenameEditor();
  requestAnimationFrame(() => {
    renameEditor.focus();
    renameEditor.select();
  });
  setStatus("Переименование капельки");
}

function finishRename(save = true) {
  const node = renamingNode();
  if (!node) return;

  if (save) {
    const nextText = renameEditor.value.trim();
    if (nextText) node.text = nextText;
    setStatus("Капелька переименована");
  } else {
    node.text = state.renameOriginalText;
    setStatus("Переименование отменено");
  }

  state.renamingNodeId = null;
  state.renameOriginalText = "";
  renameEditor.hidden = true;
  syncInspector();
}

function createNode(x, y, text = "Новая идея") {
  const node = {
    id: crypto.randomUUID(),
    x,
    y,
    vx: 0,
    vy: 0,
    radius: 52,
    text,
    tone: Math.floor(Math.random() * tones.length),
    wobble: Math.random() * 12,
  };
  state.nodes.push(node);
  state.selectedId = node.id;
  state.selectedLinkId = null;
  syncInspector();
  setStatus("Капелька создана");
  return node;
}

function createNearSelected() {
  const base = selectedNode();
  if (!base) {
    const center = screenToWorld(wrap.clientWidth / 2, wrap.clientHeight / 2);
    return createNode(center.x, center.y);
  }

  const angle = Math.random() * Math.PI * 2;
  const distance = 180;
  const node = createNode(
    base.x + Math.cos(angle) * distance,
    base.y + Math.sin(angle) * distance,
    "Следующий шаг"
  );
  addLink(base.id, node.id);
  return node;
}

function addLink(from, to) {
  if (from === to) return;
  const exists = state.links.some(
    (link) => (link.from === from && link.to === to) || (link.from === to && link.to === from)
  );
  if (!exists) state.links.push({ id: crypto.randomUUID(), from, to, energy: Math.random() });
}

function removeSelected() {
  const link = selectedLink();
  if (link) {
    state.links = state.links.filter((item) => item.id !== link.id);
    state.selectedLinkId = null;
    state.hoverLinkId = null;
    syncInspector();
    setStatus("Связь удалена");
    return;
  }

  if (state.nodes.length <= 1 || !state.selectedId) return;
  const deletedId = state.selectedId;
  state.nodes = state.nodes.filter((node) => node.id !== deletedId);
  state.links = state.links.filter((link) => link.from !== deletedId && link.to !== deletedId);
  state.selectedId = state.nodes[0]?.id || null;
  syncInspector();
  setStatus("Узел удален");
}

function syncInspector() {
  const node = selectedNode();
  nodeText.value = node ? node.text : "";
  nodeText.disabled = !node || Boolean(state.selectedLinkId);
  nodeText.placeholder = state.selectedLinkId ? "Выбрана связь. Нажми Delete или кнопку удаления." : "";
  document.querySelectorAll(".tone").forEach((button, index) => {
    button.classList.toggle("selected", Boolean(node && !state.selectedLinkId && node.tone === index));
  });
}

function fitGraph() {
  if (!state.nodes.length) return;
  const minX = Math.min(...state.nodes.map((node) => node.x - node.radius));
  const maxX = Math.max(...state.nodes.map((node) => node.x + node.radius));
  const minY = Math.min(...state.nodes.map((node) => node.y - node.radius));
  const maxY = Math.max(...state.nodes.map((node) => node.y + node.radius));
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const scale = Math.min(wrap.clientWidth / (width + 220), wrap.clientHeight / (height + 220), 1.35);
  state.zoom += (scale - state.zoom) * 0.8;
  state.pan.x = wrap.clientWidth / 2 - ((minX + maxX) / 2) * state.zoom;
  state.pan.y = wrap.clientHeight / 2 - ((minY + maxY) / 2) * state.zoom;
  setStatus("Вид выровнен");
}

function applyPhysics(dt) {
  for (const a of state.nodes) {
    if (a.id === state.draggingNodeId) continue;
    for (const b of state.nodes) {
      if (a === b) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const force = Math.min(7200 / (distance * distance), 0.7);
      a.vx += (dx / distance) * force * dt;
      a.vy += (dy / distance) * force * dt;
    }
  }

  for (const link of state.links) {
    const from = state.nodes.find((node) => node.id === link.from);
    const to = state.nodes.find((node) => node.id === link.to);
    if (!from || !to) continue;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const target = 185;
    const pull = (distance - target) * 0.012;
    const fx = (dx / distance) * pull * dt;
    const fy = (dy / distance) * pull * dt;
    if (from.id !== state.draggingNodeId) {
      from.vx += fx;
      from.vy += fy;
    }
    if (to.id !== state.draggingNodeId) {
      to.vx -= fx;
      to.vy -= fy;
    }
  }

  for (const node of state.nodes) {
    const targetRadius = node.id === state.selectedId ? 62 : 52;
    node.radius += (targetRadius - node.radius) * 0.08;
    if (node.id === state.draggingNodeId) continue;
    node.vx *= 0.9;
    node.vy *= 0.9;
    node.x += node.vx * dt;
    node.y += node.vy * dt;
  }
}

function drawBackground(width, height) {
  ctx.save();
  ctx.fillStyle = "rgba(12, 16, 18, 0.72)";
  ctx.fillRect(0, 0, width, height);

  const gridSize = 46 * state.zoom;
  const offsetX = state.pan.x % gridSize;
  const offsetY = state.pan.y % gridSize;
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = offsetX; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = offsetY; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawLink(link, time) {
  const from = state.nodes.find((node) => node.id === link.from);
  const to = state.nodes.find((node) => node.id === link.to);
  if (!from || !to) return;
  const selected = link.id === state.selectedLinkId;
  const hovered = link.id === state.hoverLinkId;

  const start = worldToScreen(from.x, from.y);
  const end = worldToScreen(to.x, to.y);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const curve = Math.sin(time * 0.0012 + link.energy * 8) * 18;
  const cpX = (start.x + end.x) / 2 + normalX * curve;
  const cpY = (start.y + end.y) / 2 + normalY * curve;

  const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
  gradient.addColorStop(0, "rgba(53, 222, 192, 0.78)");
  gradient.addColorStop(1, "rgba(255, 139, 98, 0.7)");

  ctx.save();
  ctx.lineCap = "round";
  if (selected || hovered) {
    ctx.shadowColor = selected ? "rgba(255, 245, 210, 0.56)" : "rgba(255, 255, 255, 0.28)";
    ctx.shadowBlur = selected ? 26 : 16;
    ctx.strokeStyle = selected ? "rgba(255, 245, 210, 0.62)" : "rgba(255, 255, 255, 0.32)";
    ctx.lineWidth = Math.max(8, 10 * state.zoom);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(cpX, cpY, end.x, end.y);
    ctx.stroke();
  }

  ctx.shadowColor = selected ? "rgba(255, 245, 210, 0.42)" : "rgba(53, 222, 192, 0.25)";
  ctx.shadowBlur = selected ? 24 : 18;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = Math.max(selected ? 4 : 2, (selected ? 4.5 : 3) * state.zoom);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(cpX, cpY, end.x, end.y);
  ctx.stroke();

  const t = (time * 0.00032 + link.energy) % 1;
  const particleX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * cpX + t * t * end.x;
  const particleY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * cpY + t * t * end.y;
  ctx.fillStyle = "rgba(255, 245, 210, 0.92)";
  ctx.shadowColor = "rgba(255, 245, 210, 0.65)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(particleX, particleY, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function wrapText(text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function drawNode(node, time) {
  const point = worldToScreen(node.x, node.y);
  const selected = node.id === state.selectedId;
  const hovered = node.id === state.hoverId;
  const [colorA, colorB] = tones[node.tone];
  const radius = node.radius * state.zoom;
  const wobble = Math.sin(time * 0.002 + node.wobble) * 0.05;

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(Math.sin(time * 0.0008 + node.wobble) * 0.05);
  ctx.scale(1 + wobble, 1 - wobble);

  ctx.shadowColor = selected ? "rgba(53, 222, 192, 0.52)" : "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = selected ? 34 : 22;
  ctx.shadowOffsetY = 12;

  const gradient = ctx.createRadialGradient(-radius * 0.35, -radius * 0.4, radius * 0.1, 0, 0, radius);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.18, colorA);
  gradient.addColorStop(1, colorB);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.bezierCurveTo(radius * 0.78, -radius * 0.78, radius * 1.03, radius * 0.08, radius * 0.58, radius * 0.63);
  ctx.bezierCurveTo(radius * 0.12, radius * 1.15, -radius * 0.82, radius * 0.92, -radius * 0.98, radius * 0.08);
  ctx.bezierCurveTo(-radius * 1.14, -radius * 0.72, -radius * 0.38, -radius * 1.04, 0, -radius);
  ctx.fill();

  if (selected || hovered) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = selected ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = selected ? 3 : 2;
    ctx.stroke();
  }

  ctx.scale(1 / (1 + wobble), 1 / (1 - wobble));
  ctx.rotate(-Math.sin(time * 0.0008 + node.wobble) * 0.05);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = "rgba(8, 20, 20, 0.86)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.max(12, 14 * state.zoom)}px Inter, sans-serif`;
  const lines = wrapText(node.text || "Без названия", radius * 1.34);
  const lineHeight = Math.max(16, 18 * state.zoom);
  const startY = -((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, 0, startY + index * lineHeight);
  });
  ctx.restore();
}

function drawConnectPreview(time) {
  if (!state.connectFromId) return;
  const from = state.nodes.find((node) => node.id === state.connectFromId);
  if (!from) return;
  const start = worldToScreen(from.x, from.y);
  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${0.42 + Math.sin(time * 0.006) * 0.15})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(state.pointer.x, state.pointer.y);
  ctx.stroke();
  ctx.restore();
}

function render(time = 0) {
  const rect = wrap.getBoundingClientRect();
  const dt = Math.min(32, time - state.lastTime || 16) / 16;
  state.lastTime = time;
  state.pulse += dt;

  applyPhysics(dt);
  drawBackground(rect.width, rect.height);
  state.links
    .filter((link) => link.id !== state.selectedLinkId)
    .forEach((link) => drawLink(link, time));
  const activeLink = selectedLink();
  if (activeLink) drawLink(activeLink, time);
  drawConnectPreview(time);
  state.nodes.forEach((node) => drawNode(node, time));
  positionRenameEditor();
  requestAnimationFrame(render);
}

function onPointerMove(event) {
  const rect = wrap.getBoundingClientRect();
  state.pointer.x = event.clientX - rect.left;
  state.pointer.y = event.clientY - rect.top;
  const world = screenToWorld(state.pointer.x, state.pointer.y);
  state.pointer.worldX = world.x;
  state.pointer.worldY = world.y;

  if (state.draggingNodeId) {
    const node = state.nodes.find((item) => item.id === state.draggingNodeId);
    if (node) {
      node.x = world.x;
      node.y = world.y;
      node.vx = 0;
      node.vy = 0;
    }
    return;
  }

  if (state.panning) {
    state.pan.x += event.movementX;
    state.pan.y += event.movementY;
    return;
  }

  const node = hitNode(world.x, world.y);
  const link = node ? null : hitLink(world.x, world.y);
  state.hoverId = node?.id || null;
  state.hoverLinkId = link?.id || null;
}

function onPointerDown(event) {
  wrap.setPointerCapture(event.pointerId);
  const world = screenToWorld(event.offsetX, event.offsetY);
  const node = hitNode(world.x, world.y);
  const link = node ? null : hitLink(world.x, world.y);

  if (node && state.connectMode && state.connectFromId && state.connectFromId !== node.id) {
    addLink(state.connectFromId, node.id);
    state.selectedId = node.id;
    state.selectedLinkId = null;
    state.connectFromId = null;
    state.connectMode = false;
    connectModeBtn.classList.remove("active");
    syncInspector();
    setStatus("Связь создана");
    return;
  }

  if (state.spaceDown) {
    state.panning = true;
  } else if (node) {
    state.selectedId = node.id;
    state.selectedLinkId = null;
    state.draggingNodeId = node.id;
    if (state.connectMode) state.connectFromId = node.id;
    syncInspector();
    setStatus(state.connectMode ? "Выбери вторую капельку" : "Узел выбран");
  } else if (link) {
    state.selectedLinkId = link.id;
    state.selectedId = null;
    state.connectFromId = null;
    state.connectMode = false;
    connectModeBtn.classList.remove("active");
    syncInspector();
    setStatus("Связь выбрана");
  } else {
    state.selectedLinkId = null;
    syncInspector();
    state.panning = true;
  }
  wrap.classList.add("dragging");
}

function onPointerUp(event) {
  wrap.releasePointerCapture(event.pointerId);
  state.draggingNodeId = null;
  state.panning = false;
  wrap.classList.remove("dragging");
}

function zoomAt(multiplier, x = wrap.clientWidth / 2, y = wrap.clientHeight / 2) {
  const before = screenToWorld(x, y);
  state.zoom = Math.min(2.2, Math.max(0.38, state.zoom * multiplier));
  state.pan.x = x - before.x * state.zoom;
  state.pan.y = y - before.y * state.zoom;
}

tones.forEach((tone, index) => {
  const button = document.createElement("button");
  button.className = "tone";
  button.type = "button";
  button.style.background = `linear-gradient(145deg, ${tone[0]}, ${tone[1]})`;
  button.addEventListener("click", () => {
    const node = selectedNode();
    if (!node) return;
    node.tone = index;
    syncInspector();
  });
  tonePicker.appendChild(button);
});

addNodeBtn.addEventListener("click", createNearSelected);
connectModeBtn.addEventListener("click", () => {
  state.connectMode = !state.connectMode;
  state.connectFromId = state.connectMode ? state.selectedId : null;
  connectModeBtn.classList.toggle("active", state.connectMode);
  setStatus(state.connectMode ? "Режим связи включен" : "Режим связи выключен");
});
focusBtn.addEventListener("click", fitGraph);
deleteBtn.addEventListener("click", removeSelected);
zoomInBtn.addEventListener("click", () => zoomAt(1.14));
zoomOutBtn.addEventListener("click", () => zoomAt(0.88));

nodeText.addEventListener("input", () => {
  const node = selectedNode();
  if (!node) return;
  node.text = nodeText.value;
});

renameEditor.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    finishRename(true);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    finishRename(false);
  }
  event.stopPropagation();
});

renameEditor.addEventListener("blur", () => {
  finishRename(true);
});

["pointerdown", "pointermove", "pointerup", "click", "dblclick"].forEach((eventName) => {
  renameEditor.addEventListener(eventName, (event) => {
    event.stopPropagation();
  });
});

wrap.addEventListener("pointermove", onPointerMove);
wrap.addEventListener("pointerdown", onPointerDown);
wrap.addEventListener("pointerup", onPointerUp);
wrap.addEventListener("pointercancel", onPointerUp);
wrap.addEventListener("dblclick", (event) => {
  const world = screenToWorld(event.offsetX, event.offsetY);
  const targetNode = hitNode(world.x, world.y);
  if (targetNode) {
    event.preventDefault();
    startRename(targetNode);
    return;
  }

  const previousId = state.selectedId;
  const node = createNode(world.x, world.y, "Быстрая мысль");
  if (previousId && previousId !== node.id) addLink(previousId, node.id);
});
wrap.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    zoomAt(event.deltaY > 0 ? 0.92 : 1.08, event.offsetX, event.offsetY);
  },
  { passive: false }
);

window.addEventListener("keydown", (event) => {
  if (isTextEditing()) return;

  if (event.code === "Space") state.spaceDown = true;
  if (event.key === "Delete" || event.key === "Backspace") {
    removeSelected();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") state.spaceDown = false;
});

window.addEventListener("resize", resize);

createNearSelected();
createNearSelected();
state.nodes[1].text = "Разобрать идею";
state.nodes[2].text = "Следующее действие";
syncInspector();
resize();
fitGraph();
requestAnimationFrame(render);
