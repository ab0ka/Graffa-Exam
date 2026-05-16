const canvas = document.getElementById("plannerCanvas");
const ctx = canvas.getContext("2d");
const stage = document.getElementById("canvasStage");
const inlineEditor = document.getElementById("inlineEditor");
const mapModeBtn = document.getElementById("mapModeBtn");
const planModeBtn = document.getElementById("planModeBtn");
const planView = document.getElementById("planView");
const addTopicBtn = document.getElementById("addTopicBtn");
const addDayBtn = document.getElementById("addDayBtn");
const addMaterialBtn = document.getElementById("addMaterialBtn");
const addPracticeBtn = document.getElementById("addPracticeBtn");
const connectBtn = document.getElementById("connectBtn");
const deleteBtn = document.getElementById("deleteBtn");
const fitBtn = document.getElementById("fitBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const topicList = document.getElementById("topicList");
const dayList = document.getElementById("dayList");
const typeFilters = document.getElementById("typeFilters");
const planRows = document.getElementById("planRows");
const planSummary = document.getElementById("planSummary");
const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const createDayOnDateBtn = document.getElementById("createDayOnDateBtn");
const linkSelectedToDateBtn = document.getElementById("linkSelectedToDateBtn");
const selectedCalendarTitle = document.getElementById("selectedCalendarTitle");
const selectedCalendarItems = document.getElementById("selectedCalendarItems");
const nameInput = document.getElementById("nameInput");
const typeInput = document.getElementById("typeInput");
const dateInput = document.getElementById("dateInput");
const durationInput = document.getElementById("durationInput");
const progressInput = document.getElementById("progressInput");
const notesInput = document.getElementById("notesInput");
const selectionBadge = document.getElementById("selectionBadge");
const metadataGrid = document.getElementById("metadataGrid");
const relationList = document.getElementById("relationList");
const relationBadge = document.getElementById("relationBadge");
const materialList = document.getElementById("materialList");
const uploadedMaterialList = document.getElementById("uploadedMaterialList");
const materialFileInput = document.getElementById("materialFileInput");
const materialTitleInput = document.getElementById("materialTitleInput");
const materialDescriptionInput = document.getElementById("materialDescriptionInput");
const uploadMaterialBtn = document.getElementById("uploadMaterialBtn");
const checkpointRows = document.getElementById("checkpointRows");
const topicCount = document.getElementById("topicCount");
const materialCount = document.getElementById("materialCount");
const progressCount = document.getElementById("progressCount");

const typeStyles = {
  exam: { label: "Экзамен", color: "#2b3033", fill: "#eef0ef" },
  topic: { label: "Тема", color: "#3468b7", fill: "#eaf1fb" },
  day: { label: "День", color: "#2c8a68", fill: "#e8f4ee" },
  material: { label: "Материал", color: "#b66c12", fill: "#fff1d8" },
  practice: { label: "Задания", color: "#7359b8", fill: "#f0ecfb" },
  checkpoint: { label: "Контроль", color: "#b5485c", fill: "#fae8eb" },
};

const relationLabels = {
  covers: "изучаем",
  scheduled: "в день",
  uses: "материал",
  practices: "тренировка",
  checks: "проверка",
  repeats: "повторить",
  leads_to: "к экзамену",
};

const monthNames = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const monthGenitive = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const longWeekDays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const demoState = {
  nodes: [
    {
      id: "exam_profile",
      type: "exam",
      name: "Экзамен по математике",
      x: 0,
      y: -170,
      width: 230,
      height: 104,
      date: "10 июня",
      duration: 0,
      progress: 46,
      notes: "Цель: уверенно закрыть базовые темы и отработать сложные номера.",
    },
    {
      id: "topic_derivative",
      type: "topic",
      name: "Производная и графики",
      x: -220,
      y: -30,
      width: 220,
      height: 100,
      date: "",
      duration: 120,
      progress: 72,
      notes: "Касательные, монотонность, экстремумы, чтение графиков.",
    },
    {
      id: "topic_trig",
      type: "topic",
      name: "Тригонометрия",
      x: 0,
      y: -30,
      width: 210,
      height: 100,
      date: "",
      duration: 150,
      progress: 38,
      notes: "Формулы приведения, уравнения, отбор корней.",
    },
    {
      id: "topic_geometry",
      type: "topic",
      name: "Планиметрия",
      x: 220,
      y: -30,
      width: 200,
      height: 100,
      date: "",
      duration: 120,
      progress: 54,
      notes: "Треугольники, окружности, площади, доказательства.",
    },
    {
      id: "day_monday",
      type: "day",
      name: "Понедельник",
      x: -220,
      y: 135,
      width: 190,
      height: 96,
      date: "20 мая",
      duration: 90,
      progress: 60,
      notes: "Разобрать производную и дать короткую самостоятельную.",
    },
    {
      id: "day_wednesday",
      type: "day",
      name: "Среда",
      x: 0,
      y: 145,
      width: 190,
      height: 96,
      date: "22 мая",
      duration: 90,
      progress: 35,
      notes: "Тригонометрия: формулы и уравнения.",
    },
    {
      id: "day_friday",
      type: "day",
      name: "Пятница",
      x: 220,
      y: 135,
      width: 190,
      height: 96,
      date: "24 мая",
      duration: 110,
      progress: 20,
      notes: "Геометрия и мини-пробник.",
    },
    {
      id: "mat_formulas",
      type: "material",
      name: "Конспект формул",
      x: -390,
      y: 65,
      width: 190,
      height: 92,
      date: "",
      duration: 25,
      progress: 90,
      notes: "Одностраничная памятка для повторения перед занятием.",
      fileName: "formulas.pdf",
      fileType: "PDF",
      fileSize: "240 KB",
    },
    {
      id: "mat_video",
      type: "material",
      name: "Видео-разбор №13",
      x: 390,
      y: 65,
      width: 190,
      height: 92,
      date: "",
      duration: 35,
      progress: 45,
      notes: "Показать фрагменты про отбор корней и типовые ловушки.",
      fileName: "lesson-13.mp4",
      fileType: "video",
      fileSize: "18 MB",
    },
    {
      id: "practice_set",
      type: "practice",
      name: "Тренировка: 24 задачи",
      x: -70,
      y: 305,
      width: 220,
      height: 96,
      date: "",
      duration: 60,
      progress: 30,
      notes: "Смешанный набор по трем темам, проверка ошибок по группам.",
    },
    {
      id: "checkpoint_mock",
      type: "checkpoint",
      name: "Мини-пробник",
      x: 210,
      y: 290,
      width: 190,
      height: 96,
      date: "24 мая",
      duration: 45,
      progress: 10,
      notes: "Короткий срез: производная, тригонометрия, геометрия.",
    },
  ],
  links: [
    { id: "l1", from: "topic_derivative", to: "exam_profile", type: "leads_to" },
    { id: "l2", from: "topic_trig", to: "exam_profile", type: "leads_to" },
    { id: "l3", from: "topic_geometry", to: "exam_profile", type: "leads_to" },
    { id: "l4", from: "day_monday", to: "topic_derivative", type: "covers" },
    { id: "l5", from: "day_wednesday", to: "topic_trig", type: "covers" },
    { id: "l6", from: "day_friday", to: "topic_geometry", type: "covers" },
    { id: "l7", from: "mat_formulas", to: "topic_derivative", type: "uses" },
    { id: "l8", from: "mat_video", to: "topic_trig", type: "uses" },
    { id: "l9", from: "practice_set", to: "day_wednesday", type: "practices" },
    { id: "l10", from: "checkpoint_mock", to: "day_friday", type: "checks" },
    { id: "l11", from: "practice_set", to: "checkpoint_mock", type: "repeats" },
  ],
  checkpoints: [
    { date: "20 мая", name: "5 задач на производную", status: "готово" },
    { date: "22 мая", name: "Тригонометрия: уравнения", status: "в плане" },
    { date: "24 мая", name: "Мини-пробник", status: "ожидает" },
  ],
};

const storageKey = "graffaTeacherPlannerStateV4";

const state = {
  nodes: [],
  links: [],
  checkpoints: [],
  selectedNodeId: null,
  selectedLinkId: null,
  hoverNodeId: null,
  hoverLinkId: null,
  draggedNodeId: null,
  renamingNodeId: null,
  connectFromId: null,
  connectMode: false,
  panning: false,
  calendarYear: 2026,
  calendarMonth: 4,
  selectedDateKey: "2026-05-20",
  planningItemId: "topic_derivative",
  pan: { x: 0, y: 0 },
  zoom: 1,
  pointer: { x: 0, y: 0, worldX: 0, worldY: 0 },
  filters: Object.fromEntries(Object.keys(typeStyles).map((type) => [type, true])),
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  const data = saved ? JSON.parse(saved) : clone(demoState);
  state.nodes = data.nodes;
  state.links = data.links;
  state.checkpoints = data.checkpoints || clone(demoState.checkpoints);
  state.selectedNodeId = state.nodes[0]?.id || null;
}

function saveState() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      nodes: state.nodes,
      links: state.links,
      checkpoints: state.checkpoints,
    })
  );
}

function selectedNode() {
  return state.nodes.find((node) => node.id === state.selectedNodeId);
}

function selectedLink() {
  return state.links.find((link) => link.id === state.selectedLinkId);
}

function renamingNode() {
  return state.nodes.find((node) => node.id === state.renamingNodeId);
}

function nodeById(id) {
  return state.nodes.find((node) => node.id === id);
}

function visibleNode(node) {
  return state.filters[node.type] !== false;
}

function relatedLinks(nodeId) {
  return state.links.filter((link) => link.from === nodeId || link.to === nodeId);
}

function relatedNodes(nodeId, type) {
  return relatedLinks(nodeId)
    .map((link) => nodeById(link.from === nodeId ? link.to : link.from))
    .filter((node) => node && (!type || node.type === type));
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateLabel(date) {
  return `${date.getDate()} ${monthGenitive[date.getMonth()]}`;
}

function parseDateLabel(label) {
  if (!label) return null;
  const normalized = label.trim().toLowerCase();
  const match = normalized.match(/^(\d{1,2})\s+([а-яё]+)$/i);
  if (!match) return null;
  const monthIndex = monthGenitive.indexOf(match[2]);
  if (monthIndex < 0) return null;
  return new Date(2026, monthIndex, Number(match[1]));
}

function nodeDateKey(node) {
  const parsed = parseDateLabel(node?.date);
  return parsed ? dateKey(parsed) : "";
}

function fileSizeLabel(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readSmallFile(file) {
  if (!file || file.size > 1200 * 1024) return Promise.resolve("");
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result || ""));
    reader.addEventListener("error", () => resolve(""));
    reader.readAsDataURL(file);
  });
}

function worldToScreen(x, y) {
  return { x: x * state.zoom + state.pan.x, y: y * state.zoom + state.pan.y };
}

function screenToWorld(x, y) {
  return { x: (x - state.pan.x) / state.zoom, y: (y - state.pan.y) / state.zoom };
}

function resize() {
  const rect = stage.getBoundingClientRect();
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
  positionInlineEditor();
}

function setMode(mode) {
  const mapMode = mode === "map";
  stage.hidden = !mapMode;
  planView.hidden = mapMode;
  mapModeBtn.classList.toggle("active", mapMode);
  planModeBtn.classList.toggle("active", !mapMode);
  if (mapMode) requestAnimationFrame(resize);
}

function averageProgress(nodes = state.nodes) {
  const weighted = nodes.filter((node) => node.type !== "material");
  if (!weighted.length) return 0;
  return Math.round(weighted.reduce((sum, node) => sum + Number(node.progress || 0), 0) / weighted.length);
}

function updateCounts() {
  topicCount.textContent = String(state.nodes.filter((node) => node.type === "topic").length);
  materialCount.textContent = String(state.nodes.filter((node) => node.type === "material").length);
  progressCount.textContent = `${averageProgress()}%`;
}

function progressBar(value) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return `<span class="progress-track"><i style="width:${safeValue}%"></i></span>`;
}

function renderTopicList() {
  topicList.innerHTML = "";
  state.nodes
    .filter((node) => node.type === "topic")
    .forEach((node) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `topic-row ${node.id === state.selectedNodeId ? "active" : ""}`;
      row.innerHTML = `<strong>${node.name}</strong><span>${node.duration || 0} мин · готовность ${node.progress || 0}%</span>${progressBar(node.progress)}`;
      row.addEventListener("click", () => selectNode(node.id));
      topicList.appendChild(row);
    });
}

function renderDayList() {
  dayList.innerHTML = "";
  state.nodes
    .filter((node) => node.type === "day")
    .forEach((node) => {
      const topics = relatedNodes(node.id, "topic").map((item) => item.name).join(", ") || "без темы";
      const row = document.createElement("button");
      row.type = "button";
      row.className = `day-row ${node.id === state.selectedNodeId ? "active" : ""}`;
      row.innerHTML = `<strong>${node.name} · ${node.date || "дата"}</strong><span>${topics}</span>${progressBar(node.progress)}`;
      row.addEventListener("click", () => selectNode(node.id));
      dayList.appendChild(row);
    });
}

function calendarNodesForKey(key) {
  return state.nodes.filter((node) => nodeDateKey(node) === key);
}

function dayNodeForKey(key) {
  return state.nodes.find((node) => node.type === "day" && nodeDateKey(node) === key);
}

function renderCalendar() {
  calendarGrid.innerHTML = "";
  calendarTitle.textContent = `${monthNames[state.calendarMonth]} ${state.calendarYear}`;
  weekDays.forEach((day) => {
    const cell = document.createElement("div");
    cell.className = "calendar-weekday";
    cell.textContent = day;
    calendarGrid.appendChild(cell);
  });

  const firstDate = new Date(state.calendarYear, state.calendarMonth, 1);
  const startOffset = (firstDate.getDay() + 6) % 7;
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - startOffset + 1;
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    const date = new Date(state.calendarYear, state.calendarMonth, inMonth ? dayNumber : 1);
    const key = inMonth ? dateKey(date) : "";
    const items = inMonth ? calendarNodesForKey(key) : [];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `calendar-day ${inMonth ? "" : "muted"} ${key === state.selectedDateKey ? "active" : ""}`;
    button.innerHTML = inMonth
      ? `<strong>${dayNumber}</strong>${items
          .slice(0, 3)
          .map((item) => `<span class="calendar-pill">${typeStyles[item.type]?.label || "Элемент"} · ${item.name}</span>`)
          .join("")}`
      : "";
    if (inMonth) {
      button.addEventListener("click", () => {
        state.selectedDateKey = key;
        const day = dayNodeForKey(key);
        if (day) selectNode(day.id, { keepMode: true, keepPlanning: true });
        syncUI();
      });
    }
    calendarGrid.appendChild(button);
  }

  renderSelectedCalendarDay();
}

function renderSelectedCalendarDay() {
  const date = state.selectedDateKey ? new Date(`${state.selectedDateKey}T12:00:00`) : new Date(state.calendarYear, state.calendarMonth, 1);
  const items = calendarNodesForKey(dateKey(date));
  const planningItem = nodeById(state.planningItemId);
  selectedCalendarTitle.textContent = `${date.getDate()} ${monthGenitive[date.getMonth()]}, ${longWeekDays[date.getDay()]}`;
  selectedCalendarItems.innerHTML = "";

  if (planningItem) {
    const selected = document.createElement("div");
    selected.className = "metadata-item";
    selected.innerHTML = `<span>Выбрано для плана</span><strong>${planningItem.name}</strong>`;
    selectedCalendarItems.appendChild(selected);
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "metadata-item";
    empty.innerHTML = "<span>На эту дату пока ничего нет</span><strong>Можно создать учебный день</strong>";
    selectedCalendarItems.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "material-row";
    row.innerHTML = `<strong>${item.name}</strong><span>${typeStyles[item.type]?.label || "Элемент"} · ${item.duration || 0} мин · ${item.progress || 0}%</span>`;
    row.addEventListener("click", () => selectNode(item.id, { keepMode: true }));
    selectedCalendarItems.appendChild(row);
  });
}

function renderFilters() {
  typeFilters.innerHTML = "";
  Object.entries(typeStyles).forEach(([type, style]) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" ${state.filters[type] ? "checked" : ""} data-type="${type}" /><span>${style.label}</span>`;
    label.querySelector("input").addEventListener("change", (event) => {
      state.filters[type] = event.target.checked;
      if (selectedNode() && !visibleNode(selectedNode())) state.selectedNodeId = null;
      syncUI();
    });
    typeFilters.appendChild(label);
  });
}

function renderPlan() {
  const days = state.nodes
    .filter((node) => node.type === "day")
    .sort((a, b) => (nodeDateKey(a) || "").localeCompare(nodeDateKey(b) || ""));
  planSummary.textContent = `${days.length} учебных дня`;
  planRows.innerHTML = "";
  days.forEach((day) => {
    const topics = relatedNodes(day.id, "topic").map((node) => node.name);
    const materials = relatedNodes(day.id, "material")
      .concat(topics.flatMap((topicName) => state.nodes.filter((node) => node.type === "material" && relatedNodes(node.id, "topic").some((topic) => topic.name === topicName))))
      .map((node) => node.name);
    const practice = relatedNodes(day.id, "practice").map((node) => node.name);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${day.name}</strong><br><span>${day.date || ""}</span></td>
      <td>${topics.join("<br>") || "-"}</td>
      <td>${[...new Set(materials)].join("<br>") || "-"}</td>
      <td>${practice.join("<br>") || "-"}</td>
      <td><span class="status-chip">${day.progress || 0}%</span></td>
    `;
    tr.addEventListener("click", () => selectNode(day.id, { keepMode: true, keepPlanning: true }));
    planRows.appendChild(tr);
  });
}

function renderInspector() {
  const node = selectedNode();
  const link = selectedLink();
  const disabled = !node || Boolean(link);

  if (link) {
    const from = nodeById(link.from);
    const to = nodeById(link.to);
    selectionBadge.textContent = "Связь";
    nameInput.value = `${from?.name || "-"} → ${to?.name || "-"}`;
    typeInput.value = "checkpoint";
    dateInput.value = "";
    durationInput.value = "";
    progressInput.value = 0;
    notesInput.value = relationLabels[link.type] || link.type;
  } else if (node) {
    selectionBadge.textContent = typeStyles[node.type]?.label || "Элемент";
    nameInput.value = node.name;
    typeInput.value = node.type;
    dateInput.value = node.date || "";
    durationInput.value = node.duration || 0;
    progressInput.value = node.progress || 0;
    notesInput.value = node.notes || "";
  } else {
    selectionBadge.textContent = "Нет";
    nameInput.value = "";
    dateInput.value = "";
    durationInput.value = "";
    progressInput.value = 0;
    notesInput.value = "";
  }

  [nameInput, typeInput, dateInput, durationInput, progressInput, notesInput].forEach((input) => {
    input.disabled = disabled;
  });

  renderMetadata(node, link);
  renderRelations(node, link);
  renderMaterials(node);
}

function renderMetadata(node, link) {
  metadataGrid.innerHTML = "";
  const entries = link
    ? [
        ["Тип связи", relationLabels[link.type] || link.type],
        ["От", nodeById(link.from)?.name || "-"],
        ["К", nodeById(link.to)?.name || "-"],
      ]
    : [
        ["Тип", node ? typeStyles[node.type]?.label : "-"],
        ["Дата", node?.date || "-"],
        ["Время", node?.duration ? `${node.duration} мин` : "-"],
        ["Готовность", node ? `${node.progress || 0}%` : "-"],
        ...(node?.type === "material"
          ? [
              ["Файл", node.fileName || "не выбран"],
              ["Размер", node.fileSize || "-"],
            ]
          : []),
      ];
  entries.forEach(([key, value]) => {
    const item = document.createElement("div");
    item.className = "metadata-item";
    item.innerHTML = `<span>${key}</span><strong>${value}</strong>`;
    metadataGrid.appendChild(item);
  });
}

function renderRelations(node, link) {
  const relations = node ? relatedLinks(node.id) : link ? [link] : [];
  relationBadge.textContent = String(relations.length);
  relationList.innerHTML = "";
  relations.forEach((item) => {
    const from = nodeById(item.from);
    const to = nodeById(item.to);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "relation-item";
    row.innerHTML = `<strong>${from?.name || "-"} → ${to?.name || "-"}</strong><span>${relationLabels[item.type] || item.type}</span>`;
    row.addEventListener("click", () => selectLink(item.id));
    relationList.appendChild(row);
  });
}

function renderMaterials(node) {
  materialList.innerHTML = "";
  uploadedMaterialList.innerHTML = "";
  const materials = node
    ? node.type === "material"
      ? [node]
      : relatedNodes(node.id, "material")
    : state.nodes.filter((item) => item.type === "material").slice(0, 4);
  if (!materials.length) {
    const empty = document.createElement("div");
    empty.className = "metadata-item";
    empty.innerHTML = "<span>К выбранному элементу материалы еще не привязаны</span><strong>Загрузи файл или выбери материал ниже</strong>";
    materialList.appendChild(empty);
  }
  materials.forEach((item) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `material-row ${item.id === state.selectedNodeId ? "active" : ""}`;
    const fileInfo = item.fileName ? `${item.fileName} · ${item.fileSize || ""}` : `${item.duration || 0} мин · ${item.progress || 0}% готово`;
    row.innerHTML = `<strong>${item.name}</strong><span>${fileInfo}</span>`;
    row.addEventListener("click", () => selectNode(item.id));
    materialList.appendChild(row);
  });

  state.nodes
    .filter((item) => item.type === "material")
    .forEach((item) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `material-row ${item.id === state.selectedNodeId ? "active" : ""}`;
      row.innerHTML = `<strong>${item.name}</strong><span>${item.fileName || "без файла"}${item.notes ? ` · ${item.notes}` : ""}</span>`;
      row.addEventListener("click", () => selectNode(item.id));
      uploadedMaterialList.appendChild(row);
    });
}

function renderCheckpoints() {
  checkpointRows.innerHTML = "";
  state.checkpoints.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.date}</td><td>${row.name}</td><td>${row.status}</td>`;
    checkpointRows.appendChild(tr);
  });
}

function syncUI() {
  updateCounts();
  renderTopicList();
  renderDayList();
  renderFilters();
  renderCalendar();
  renderPlan();
  renderInspector();
  renderCheckpoints();
}

function selectNode(id, options = {}) {
  state.selectedNodeId = id;
  state.selectedLinkId = null;
  const node = nodeById(id);
  if (node && node.type !== "day" && !options.keepPlanning) state.planningItemId = id;
  if (node?.date) {
    const key = nodeDateKey(node);
    if (key) {
      const parsed = parseDateLabel(node.date);
      state.selectedDateKey = key;
      if (parsed) {
        state.calendarYear = parsed.getFullYear();
        state.calendarMonth = parsed.getMonth();
      }
    }
  }
  if (!options.keepMode) setMode("map");
  syncUI();
}

function selectLink(id) {
  state.selectedLinkId = id;
  state.selectedNodeId = null;
  syncUI();
}

function nodeAt(worldX, worldY) {
  for (let index = state.nodes.length - 1; index >= 0; index -= 1) {
    const node = state.nodes[index];
    if (!visibleNode(node)) continue;
    const insideX = worldX >= node.x - node.width / 2 && worldX <= node.x + node.width / 2;
    const insideY = worldY >= node.y - node.height / 2 && worldY <= node.y + node.height / 2;
    if (insideX && insideY) return node;
  }
  return null;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  if (!lengthSq) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

function linkAt(worldX, worldY) {
  const tolerance = 12 / state.zoom;
  for (let index = state.links.length - 1; index >= 0; index -= 1) {
    const link = state.links[index];
    const from = nodeById(link.from);
    const to = nodeById(link.to);
    if (!from || !to || !visibleNode(from) || !visibleNode(to)) continue;
    if (distanceToSegment(worldX, worldY, from.x, from.y, to.x, to.y) <= tolerance) return link;
  }
  return null;
}

function createNode(type) {
  const center = screenToWorld(stage.clientWidth / 2, stage.clientHeight / 2);
  const count = state.nodes.filter((node) => node.type === type).length + 1;
  const sizes = {
    exam: [230, 104],
    topic: [210, 100],
    day: [190, 96],
    material: [190, 92],
    practice: [220, 96],
    checkpoint: [190, 96],
  };
  const [width, height] = sizes[type] || [200, 96];
  const node = {
    id: `${type}_${crypto.randomUUID().slice(0, 8)}`,
    type,
    name: `${typeStyles[type].label} ${count}`,
    x: center.x + (Math.random() - 0.5) * 160,
    y: center.y + (Math.random() - 0.5) * 110,
    width,
    height,
    date: "",
    duration: type === "day" ? 90 : 45,
    progress: 0,
    notes: "",
  };
  state.nodes.push(node);
  state.selectedNodeId = node.id;
  state.selectedLinkId = null;
  syncUI();
  saveState();
}

function createDayForSelectedDate() {
  const date = state.selectedDateKey ? new Date(`${state.selectedDateKey}T12:00:00`) : new Date(state.calendarYear, state.calendarMonth, 1);
  const existing = dayNodeForKey(dateKey(date));
  if (existing) {
    selectNode(existing.id, { keepMode: true, keepPlanning: true });
    return existing;
  }

  const center = screenToWorld(stage.clientWidth / 2, stage.clientHeight / 2);
  const node = {
    id: `day_${crypto.randomUUID().slice(0, 8)}`,
    type: "day",
    name: longWeekDays[date.getDay()],
    x: center.x + (Math.random() - 0.5) * 180,
    y: center.y + 120 + (Math.random() - 0.5) * 80,
    width: 190,
    height: 96,
    date: dateLabel(date),
    duration: 90,
    progress: 0,
    notes: "Новый день подготовки. Добавь тему, материал или задания.",
  };
  state.nodes.push(node);
  state.selectedNodeId = node.id;
  state.selectedLinkId = null;
  syncUI();
  saveState();
  return node;
}

function addPlanningItemToSelectedDate() {
  const item = nodeById(state.planningItemId);
  if (!item) return;
  const day = createDayForSelectedDate();
  if (!day || item.id === day.id) return;
  addLink(day.id, item.id);
  state.selectedNodeId = day.id;
  state.selectedLinkId = null;
  setMode("plan");
  syncUI();
  saveState();
}

async function uploadMaterials() {
  const files = Array.from(materialFileInput.files || []);
  const title = materialTitleInput.value.trim();
  const description = materialDescriptionInput.value.trim();
  const sourceFiles = files.length ? files : [null];
  const center = screenToWorld(stage.clientWidth / 2, stage.clientHeight / 2);

  for (let index = 0; index < sourceFiles.length; index += 1) {
    const file = sourceFiles[index];
    const dataUrl = file ? await readSmallFile(file) : "";
    const baseName = file?.name?.replace(/\.[^.]+$/, "") || "Новый материал";
    const node = {
      id: `material_${crypto.randomUUID().slice(0, 8)}`,
      type: "material",
      name: files.length > 1 ? baseName : title || baseName,
      x: center.x + (Math.random() - 0.5) * 220,
      y: center.y + 70 + (Math.random() - 0.5) * 120,
      width: 200,
      height: 96,
      date: "",
      duration: 30,
      progress: 0,
      notes: description,
      fileName: file?.name || "",
      fileType: file?.type || "",
      fileSize: file ? fileSizeLabel(file.size) : "",
      fileDataUrl: dataUrl,
    };
    state.nodes.push(node);
    state.selectedNodeId = node.id;
    state.planningItemId = node.id;
  }

  materialFileInput.value = "";
  materialTitleInput.value = "";
  materialDescriptionInput.value = "";
  syncUI();
  saveState();
}

function addLink(from, to) {
  if (!from || !to || from === to) return;
  const exists = state.links.some(
    (link) => (link.from === from && link.to === to) || (link.from === to && link.to === from)
  );
  if (exists) return;
  const fromNode = nodeById(from);
  const toNode = nodeById(to);
  const type =
    fromNode?.type === "day" || toNode?.type === "day"
      ? "scheduled"
      : fromNode?.type === "material" || toNode?.type === "material"
        ? "uses"
        : fromNode?.type === "checkpoint" || toNode?.type === "checkpoint"
          ? "checks"
          : "covers";
  state.links.push({ id: `link_${crypto.randomUUID().slice(0, 8)}`, from, to, type });
  state.selectedLinkId = state.links[state.links.length - 1].id;
  state.selectedNodeId = null;
  syncUI();
  saveState();
}

function deleteSelected() {
  const link = selectedLink();
  if (link) {
    state.links = state.links.filter((item) => item.id !== link.id);
    state.selectedLinkId = null;
    syncUI();
    saveState();
    return;
  }
  const node = selectedNode();
  if (!node) return;
  state.nodes = state.nodes.filter((item) => item.id !== node.id);
  state.links = state.links.filter((item) => item.from !== node.id && item.to !== node.id);
  state.selectedNodeId = state.nodes[0]?.id || null;
  syncUI();
  saveState();
}

function fitGraph() {
  const nodes = state.nodes.filter(visibleNode);
  if (!nodes.length) return;
  const minX = Math.min(...nodes.map((node) => node.x - node.width / 2));
  const maxX = Math.max(...nodes.map((node) => node.x + node.width / 2));
  const minY = Math.min(...nodes.map((node) => node.y - node.height / 2));
  const maxY = Math.max(...nodes.map((node) => node.y + node.height / 2));
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  state.zoom = Math.min(1.2, stage.clientWidth / (width + 180), stage.clientHeight / (height + 180));
  state.pan.x = stage.clientWidth / 2 - ((minX + maxX) / 2) * state.zoom;
  state.pan.y = stage.clientHeight / 2 - ((minY + maxY) / 2) * state.zoom;
}

function zoomAt(multiplier, x, y) {
  const before = screenToWorld(x, y);
  state.zoom = Math.min(2, Math.max(0.45, state.zoom * multiplier));
  state.pan.x = x - before.x * state.zoom;
  state.pan.y = y - before.y * state.zoom;
}

function updateNodeFromInspector() {
  const node = selectedNode();
  if (!node) return;
  node.name = nameInput.value;
  node.type = typeInput.value;
  node.date = dateInput.value;
  node.duration = Number(durationInput.value) || 0;
  node.progress = Number(progressInput.value) || 0;
  node.notes = notesInput.value;
  syncUI();
  saveState();
}

function positionInlineEditor() {
  const node = renamingNode();
  if (!node || inlineEditor.hidden) return;
  const point = worldToScreen(node.x, node.y);
  inlineEditor.style.left = `${point.x}px`;
  inlineEditor.style.top = `${point.y}px`;
  inlineEditor.style.width = `${Math.max(160, node.width * state.zoom - 26)}px`;
}

function startRename(node) {
  state.renamingNodeId = node.id;
  state.selectedNodeId = node.id;
  state.selectedLinkId = null;
  inlineEditor.value = node.name;
  inlineEditor.hidden = false;
  positionInlineEditor();
  requestAnimationFrame(() => {
    inlineEditor.focus();
    inlineEditor.select();
  });
}

function finishRename(save = true) {
  const node = renamingNode();
  if (!node) return;
  if (save && inlineEditor.value.trim()) node.name = inlineEditor.value.trim();
  state.renamingNodeId = null;
  inlineEditor.hidden = true;
  syncUI();
  saveState();
}

function drawBackground(width, height) {
  ctx.fillStyle = "#f7f4ed";
  ctx.fillRect(0, 0, width, height);
  const grid = 40 * state.zoom;
  ctx.strokeStyle = "rgba(91,84,74,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = state.pan.x % grid; x < width; x += grid) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = state.pan.y % grid; y < height; y += grid) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapCanvasText(text, maxWidth, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    let last = trimmed[trimmed.length - 1];
    while (last.length > 4 && ctx.measureText(`${last}...`).width > maxWidth) last = last.slice(0, -1);
    trimmed[trimmed.length - 1] = `${last}...`;
    return trimmed;
  }
  return lines;
}

function drawLink(link) {
  const from = nodeById(link.from);
  const to = nodeById(link.to);
  if (!from || !to || !visibleNode(from) || !visibleNode(to)) return;
  const start = worldToScreen(from.x, from.y);
  const end = worldToScreen(to.x, to.y);
  const selected = link.id === state.selectedLinkId;
  const hovered = link.id === state.hoverLinkId;

  ctx.save();
  ctx.lineCap = "round";
  if (selected || hovered) {
    ctx.strokeStyle = selected ? "rgba(43,48,51,0.22)" : "rgba(52,104,183,0.18)";
    ctx.lineWidth = selected ? 10 : 8;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.strokeStyle = selected ? "#2b3033" : "rgba(84,88,91,0.42)";
  ctx.lineWidth = selected ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  const label = relationLabels[link.type] || link.type;
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  ctx.font = "11px Inter, sans-serif";
  const labelWidth = ctx.measureText(label).width + 16;
  ctx.fillStyle = "rgba(255,253,248,0.96)";
  ctx.strokeStyle = "rgba(222,216,204,0.9)";
  ctx.lineWidth = 1;
  roundRect(midX - labelWidth / 2, midY - 11, labelWidth, 22, 11);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#62676b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, midX, midY);
  ctx.restore();
}

function drawNode(node) {
  if (!visibleNode(node)) return;
  const style = typeStyles[node.type] || typeStyles.topic;
  const point = worldToScreen(node.x, node.y);
  const width = node.width * state.zoom;
  const height = node.height * state.zoom;
  const x = point.x - width / 2;
  const y = point.y - height / 2;
  const selected = node.id === state.selectedNodeId;
  const hovered = node.id === state.hoverNodeId;
  const pad = 13 * state.zoom;
  const compact = state.zoom < 0.78;

  ctx.save();
  ctx.shadowColor = selected ? "rgba(44,138,104,0.23)" : "rgba(36,38,41,0.11)";
  ctx.shadowBlur = selected ? 22 : 12;
  ctx.shadowOffsetY = 7;
  ctx.fillStyle = "#fffdf8";
  ctx.strokeStyle = selected ? style.color : hovered ? "#9b8f7f" : "#d8d0c2";
  ctx.lineWidth = selected ? 2.5 : 1.2;
  roundRect(x, y, width, height, 10);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  if (compact) {
    ctx.fillStyle = style.color;
    roundRect(x, y, 6 * state.zoom, height, 10);
    ctx.fill();

    ctx.fillStyle = style.color;
    ctx.font = `800 ${Math.max(10, 12 * state.zoom)}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(style.label, x + pad, y + 16 * state.zoom);

    ctx.fillStyle = "#242629";
    ctx.font = `800 ${Math.max(12, 15 * state.zoom)}px Inter, sans-serif`;
    const compactLines = wrapCanvasText(node.name, width - pad * 2, 1);
    ctx.fillText(compactLines[0] || "", x + pad, y + height / 2 + 2 * state.zoom);

    const meta = [node.date, node.duration ? `${node.duration} мин` : "", `${node.progress || 0}%`].filter(Boolean).join(" · ");
    ctx.fillStyle = "#70757a";
    ctx.font = `${Math.max(10, 11 * state.zoom)}px Inter, sans-serif`;
    ctx.fillText(meta, x + pad, y + height - 17 * state.zoom);

    const trackX = x + pad;
    const trackY = y + height - 8 * state.zoom;
    const trackWidth = width - pad * 2;
    ctx.fillStyle = "#e5ded3";
    roundRect(trackX, trackY, trackWidth, 4 * state.zoom, 999);
    ctx.fill();
    ctx.fillStyle = style.color;
    roundRect(trackX, trackY, (trackWidth * Math.max(0, Math.min(100, node.progress || 0))) / 100, 4 * state.zoom, 999);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.fillStyle = style.fill;
  ctx.strokeStyle = style.color;
  ctx.lineWidth = 1;
  const chipWidth = Math.min(width - pad * 2, Math.max(66 * state.zoom, ctx.measureText(style.label).width + 26 * state.zoom));
  roundRect(x + pad, y + pad, chipWidth, 24 * state.zoom, 12 * state.zoom);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = style.color;
  ctx.font = `700 ${Math.max(10, 12 * state.zoom)}px Inter, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(style.label, x + pad + 12 * state.zoom, y + pad + 12 * state.zoom);

  ctx.fillStyle = "#242629";
  ctx.font = `800 ${Math.max(12, 15 * state.zoom)}px Inter, sans-serif`;
  const titleLines = wrapCanvasText(node.name, width - pad * 2, 2);
  titleLines.forEach((line, index) => {
    ctx.fillText(line, x + pad, y + 50 * state.zoom + index * 18 * state.zoom);
  });

  const meta = [node.date, node.duration ? `${node.duration} мин` : "", `${node.progress || 0}%`].filter(Boolean).join(" · ");
  ctx.fillStyle = "#70757a";
  ctx.font = `${Math.max(10, 12 * state.zoom)}px Inter, sans-serif`;
  ctx.fillText(meta, x + pad, y + height - 22 * state.zoom);

  const trackX = x + pad;
  const trackY = y + height - 11 * state.zoom;
  const trackWidth = width - pad * 2;
  ctx.fillStyle = "#e5ded3";
  roundRect(trackX, trackY, trackWidth, 5 * state.zoom, 999);
  ctx.fill();
  ctx.fillStyle = style.color;
  roundRect(trackX, trackY, trackWidth * Math.max(0, Math.min(100, node.progress || 0)) / 100, 5 * state.zoom, 999);
  ctx.fill();
  ctx.restore();
}

function drawConnectPreview() {
  if (!state.connectFromId) return;
  const from = nodeById(state.connectFromId);
  if (!from) return;
  const start = worldToScreen(from.x, from.y);
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = "rgba(43,48,51,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(state.pointer.x, state.pointer.y);
  ctx.stroke();
  ctx.restore();
}

function render() {
  const rect = stage.getBoundingClientRect();
  drawBackground(rect.width, rect.height);
  state.links.forEach(drawLink);
  drawConnectPreview();
  state.nodes.forEach(drawNode);
  positionInlineEditor();
  requestAnimationFrame(render);
}

function onPointerMove(event) {
  const rect = stage.getBoundingClientRect();
  state.pointer.x = event.clientX - rect.left;
  state.pointer.y = event.clientY - rect.top;
  const world = screenToWorld(state.pointer.x, state.pointer.y);
  state.pointer.worldX = world.x;
  state.pointer.worldY = world.y;

  if (state.draggedNodeId) {
    const node = nodeById(state.draggedNodeId);
    if (node) {
      node.x = world.x;
      node.y = world.y;
    }
    return;
  }
  if (state.panning) {
    state.pan.x += event.movementX;
    state.pan.y += event.movementY;
    return;
  }
  const node = nodeAt(world.x, world.y);
  const link = node ? null : linkAt(world.x, world.y);
  state.hoverNodeId = node?.id || null;
  state.hoverLinkId = link?.id || null;
}

function onPointerDown(event) {
  const world = screenToWorld(event.offsetX, event.offsetY);
  const node = nodeAt(world.x, world.y);
  const link = node ? null : linkAt(world.x, world.y);
  stage.setPointerCapture(event.pointerId);

  if (node && state.connectMode && state.connectFromId && state.connectFromId !== node.id) {
    addLink(state.connectFromId, node.id);
    state.connectMode = false;
    state.connectFromId = null;
    connectBtn.classList.remove("active");
    return;
  }
  if (node) {
    state.selectedNodeId = node.id;
    state.selectedLinkId = null;
    state.draggedNodeId = node.id;
    if (state.connectMode) state.connectFromId = node.id;
    syncUI();
  } else if (link) {
    selectLink(link.id);
  } else {
    state.selectedLinkId = null;
    state.panning = true;
    syncUI();
  }
  stage.classList.add("dragging");
}

function onPointerUp(event) {
  stage.releasePointerCapture(event.pointerId);
  if (state.draggedNodeId) saveState();
  state.draggedNodeId = null;
  state.panning = false;
  stage.classList.remove("dragging");
}

function onDoubleClick(event) {
  const world = screenToWorld(event.offsetX, event.offsetY);
  const node = nodeAt(world.x, world.y);
  if (node) {
    startRename(node);
    return;
  }
  createNode("topic");
}

function toggleConnectMode() {
  state.connectMode = !state.connectMode;
  state.connectFromId = state.connectMode ? state.selectedNodeId : null;
  connectBtn.classList.toggle("active", state.connectMode);
}

[nameInput, typeInput, dateInput, durationInput, progressInput, notesInput].forEach((input) => {
  input.addEventListener("input", updateNodeFromInspector);
  input.addEventListener("change", updateNodeFromInspector);
});
addTopicBtn.addEventListener("click", () => createNode("topic"));
addDayBtn.addEventListener("click", () => createNode("day"));
addMaterialBtn.addEventListener("click", () => createNode("material"));
addPracticeBtn.addEventListener("click", () => createNode("practice"));
connectBtn.addEventListener("click", toggleConnectMode);
deleteBtn.addEventListener("click", deleteSelected);
fitBtn.addEventListener("click", fitGraph);
saveBtn.addEventListener("click", saveState);
uploadMaterialBtn.addEventListener("click", uploadMaterials);
materialFileInput.addEventListener("change", () => {
  const files = Array.from(materialFileInput.files || []);
  if (files.length === 1 && !materialTitleInput.value.trim()) {
    materialTitleInput.value = files[0].name.replace(/\.[^.]+$/, "");
  }
  if (files.length > 1 && !materialDescriptionInput.value.trim()) {
    materialDescriptionInput.value = `Добавлено файлов: ${files.length}`;
  }
});
createDayOnDateBtn.addEventListener("click", () => {
  createDayForSelectedDate();
  setMode("plan");
});
linkSelectedToDateBtn.addEventListener("click", addPlanningItemToSelectedDate);
prevMonthBtn.addEventListener("click", () => {
  state.calendarMonth -= 1;
  if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear -= 1;
  }
  state.selectedDateKey = dateKey(new Date(state.calendarYear, state.calendarMonth, 1));
  syncUI();
});
nextMonthBtn.addEventListener("click", () => {
  state.calendarMonth += 1;
  if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear += 1;
  }
  state.selectedDateKey = dateKey(new Date(state.calendarYear, state.calendarMonth, 1));
  syncUI();
});
resetBtn.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  const data = clone(demoState);
  state.nodes = data.nodes;
  state.links = data.links;
  state.checkpoints = data.checkpoints;
  state.selectedNodeId = state.nodes[0]?.id || null;
  state.selectedLinkId = null;
  state.planningItemId = "topic_derivative";
  state.calendarYear = 2026;
  state.calendarMonth = 4;
  state.selectedDateKey = "2026-05-20";
  fitGraph();
  syncUI();
});
mapModeBtn.addEventListener("click", () => setMode("map"));
planModeBtn.addEventListener("click", () => setMode("plan"));

inlineEditor.addEventListener("keydown", (event) => {
  event.stopPropagation();
  if (event.key === "Enter") finishRename(true);
  if (event.key === "Escape") finishRename(false);
});
inlineEditor.addEventListener("blur", () => finishRename(true));
["pointerdown", "pointerup", "pointermove", "dblclick"].forEach((eventName) => {
  inlineEditor.addEventListener(eventName, (event) => event.stopPropagation());
});

stage.addEventListener("pointermove", onPointerMove);
stage.addEventListener("pointerdown", onPointerDown);
stage.addEventListener("pointerup", onPointerUp);
stage.addEventListener("pointercancel", onPointerUp);
stage.addEventListener("dblclick", onDoubleClick);
stage.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    zoomAt(event.deltaY > 0 ? 0.92 : 1.08, event.offsetX, event.offsetY);
  },
  { passive: false }
);

window.addEventListener("keydown", (event) => {
  if ([inlineEditor, nameInput, notesInput, dateInput, durationInput].includes(document.activeElement)) return;
  if (event.key === "Delete" || event.key === "Backspace") deleteSelected();
});
window.addEventListener("resize", resize);

loadState();
resize();
fitGraph();
syncUI();
requestAnimationFrame(render);
