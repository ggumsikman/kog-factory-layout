/**
 * app.js
 * 편집기 핵심 로직
 * (사이드바, 캔버스 드래그앤드롭, 선택/이동/리사이즈, 저장/불러오기)
 */

// ═══════════════════════════════════════════
// 상태
// ═══════════════════════════════════════════
let curTab    = 0;
let layouts   = { ga: [], na: [], da: [] };
let selectedEl = null;
let nextId    = 1;
let dragState = null;

// ═══════════════════════════════════════════
// 사이드바 렌더링
// ═══════════════════════════════════════════
function renderSidebar() {
  const sb = document.getElementById('sidebar');
  sb.innerHTML = '';
  const defs = MDEFS[TABS[curTab]];

  const makeSection = (sectionName, items) => {
    const sec = document.createElement('div');
    sec.className = 'sb-section';
    sec.innerHTML = `<h3>${sectionName}</h3>`;
    items.forEach(m => {
      const div = document.createElement('div');
      div.className = 'mitem';
      div.draggable = true;
      div.innerHTML = `<div class="micon" style="background:${m.color}">${m.icon}</div><span>${m.label}</span>`;
      div.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', JSON.stringify(m));
        e.dataTransfer.effectAllowed = 'copy';
      });
      sec.appendChild(div);
    });
    return sec;
  };

  defs.forEach(sec => sb.appendChild(makeSection(sec.section, sec.items)));
  sb.appendChild(makeSection(COMMON.section, COMMON.items));
}

// ═══════════════════════════════════════════
// 캔버스 렌더링
// ═══════════════════════════════════════════
function renderCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('.pm').forEach(e => e.remove());
  layouts[TABS[curTab]].forEach(m => createEl(m));
  updateSB();
}

function createEl(m) {
  const canvas = document.getElementById('canvas');
  const el = document.createElement('div');
  el.className = 'pm';
  el.id = 'pm_' + m.uid;
  el.style.cssText = `left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;`
    + `background:${m.color||'#fff'};border-color:${m.borderColor||'#4a90d9'};`
    + (m.rotate ? `transform:rotate(${m.rotate}deg);` : '');
  el.innerHTML = `
    <button class="del-btn">×</button>
    <button class="rot-btn">↻</button>
    <div class="pm-icon">${m.icon||'⚙'}</div>
    <div class="pm-label">${esc(m.label||'')}</div>
    <div class="pm-num">${esc(m.num||'')}</div>
    <div class="pm-spec">${esc(m.spec||'')}</div>
    <div class="rsz"></div>`;

  el.querySelector('.del-btn').addEventListener('click', e => { e.stopPropagation(); delM(m.uid); });
  el.querySelector('.rot-btn').addEventListener('click', e => { e.stopPropagation(); rotM(m.uid); });
  el.querySelector('.rsz').addEventListener('mousedown', e => {
    e.stopPropagation(); e.preventDefault();
    dragState = { type:'resize', uid:m.uid, sx:e.clientX, sy:e.clientY, sw:m.w, sh:m.h };
  });
  el.addEventListener('mousedown', e => {
    if (['del-btn','rot-btn','rsz'].some(c => e.target.classList.contains(c))) return;
    e.preventDefault();
    selectM(m.uid);
    const r = el.getBoundingClientRect();
    dragState = { type:'move', uid:m.uid, ox:e.clientX - r.left, oy:e.clientY - r.top };
  });

  canvas.appendChild(el);
}

// ═══════════════════════════════════════════
// 드래그앤드롭 / 마우스 이벤트
// ═══════════════════════════════════════════
function initDrop() {
  const canvas = document.getElementById('canvas');

  canvas.addEventListener('dragover', e => e.preventDefault());
  canvas.addEventListener('drop', e => {
    e.preventDefault();
    try {
      const def = JSON.parse(e.dataTransfer.getData('text/plain'));
      const r = canvas.getBoundingClientRect();
      addM(def, Math.max(0, snap(e.clientX - r.left - def.w/2)),
               Math.max(0, snap(e.clientY - r.top  - def.h/2)));
    } catch(err) { console.error(err); }
  });
  canvas.addEventListener('click', e => { if (e.target === canvas) clearSelected(); });

  document.addEventListener('mousemove', e => {
    const cr = document.getElementById('canvas').getBoundingClientRect();
    document.getElementById('sb-pos').textContent =
      `마우스: (${Math.round(e.clientX-cr.left)}, ${Math.round(e.clientY-cr.top)})`;

    if (!dragState) return;
    const m = layouts[TABS[curTab]].find(x => x.uid === dragState.uid);
    if (!m) return;

    if (dragState.type === 'move') {
      m.x = Math.max(0, snap(e.clientX - cr.left - dragState.ox));
      m.y = Math.max(0, snap(e.clientY - cr.top  - dragState.oy));
      const el = document.getElementById('pm_'+m.uid);
      if (el) { el.style.left = m.x+'px'; el.style.top = m.y+'px'; }
    } else if (dragState.type === 'resize') {
      m.w = Math.max(30, snapS(dragState.sw + e.clientX - dragState.sx));
      m.h = Math.max(24, snapS(dragState.sh + e.clientY - dragState.sy));
      const el = document.getElementById('pm_'+m.uid);
      if (el) { el.style.width = m.w+'px'; el.style.height = m.h+'px'; }
    }
  });

  document.addEventListener('mouseup', () => { dragState = null; });
}

const snap  = v => Math.round(v/40)*40;
const snapS = v => Math.round(v/8)*8;

// ═══════════════════════════════════════════
// 기계 CRUD
// ═══════════════════════════════════════════
function addM(def, x, y) {
  const uid = nextId++;
  const m = {
    uid, x, y, w:def.w, h:def.h,
    icon:def.icon, label:def.label,
    color:def.color||'#fff', borderColor:def.bColor||'#4a90d9',
    num:'', spec:'', rotate:0, note:''
  };
  layouts[TABS[curTab]].push(m);
  createEl(m);
  selectM(uid);
  updateSB();
}

function delM(uid) {
  const tk = TABS[curTab];
  layouts[tk] = layouts[tk].filter(m => m.uid !== uid);
  document.getElementById('pm_'+uid)?.remove();
  if (selectedEl?.id === 'pm_'+uid) { selectedEl = null; renderPropsEmpty(); }
  updateSB();
}

function rotM(uid) {
  const m = layouts[TABS[curTab]].find(x => x.uid === uid);
  if (!m) return;
  m.rotate = ((m.rotate||0) + 90) % 360;
  const tmp = m.w; m.w = m.h; m.h = tmp;
  const el = document.getElementById('pm_'+uid);
  if (el) {
    el.style.transform = m.rotate ? `rotate(${m.rotate}deg)` : '';
    el.style.width = m.w+'px'; el.style.height = m.h+'px';
  }
}

// ═══════════════════════════════════════════
// 선택 & 속성 패널
// ═══════════════════════════════════════════
function selectM(uid) {
  selectedEl?.classList.remove('selected');
  const el = document.getElementById('pm_'+uid);
  if (!el) return;
  el.classList.add('selected');
  selectedEl = el;
  const m = layouts[TABS[curTab]].find(x => x.uid === uid);
  if (m) renderProps(m);
}

function clearSelected() {
  selectedEl?.classList.remove('selected');
  selectedEl = null;
  renderPropsEmpty();
}

function renderPropsEmpty() {
  document.getElementById('propsContent').innerHTML =
    '<div class="nosel">기계를 클릭하면<br>속성이 표시됩니다<br><br>💡 드래그로 배치<br>모서리로 크기조절</div>';
}

function renderProps(m) {
  document.getElementById('propsContent').innerHTML = `
    <div class="pg"><label>이름</label>
      <input type="text" value="${esc(m.label)}" onchange="setProp('label',this.value)"></div>
    <div class="pg"><label>번호/ID</label>
      <input type="text" value="${esc(m.num||'')}" placeholder="예: HD001" onchange="setProp('num',this.value)"></div>
    <div class="pg"><label>사양 (M/RPM 등)</label>
      <input type="text" value="${esc(m.spec||'')}" placeholder="예: M4 RPM60" onchange="setProp('spec',this.value)"></div>
    <div class="pg"><label>배경색</label>
      <input type="color" value="${toHex(m.color)}" onchange="setPropColor('color',this.value)"></div>
    <div class="pg"><label>테두리색</label>
      <input type="color" value="${toHex(m.borderColor||'#4a90d9')}" onchange="setPropColor('borderColor',this.value)"></div>
    <div class="pg"><label>너비</label>
      <input type="number" value="${m.w}" min="20" step="8" onchange="setPropNum('w',this.value)"></div>
    <div class="pg"><label>높이</label>
      <input type="number" value="${m.h}" min="20" step="8" onchange="setPropNum('h',this.value)"></div>
    <div class="pg"><label>X</label>
      <input type="number" value="${m.x}" step="40" onchange="setPropNum('x',this.value)"></div>
    <div class="pg"><label>Y</label>
      <input type="number" value="${m.y}" step="40" onchange="setPropNum('y',this.value)"></div>
    <div class="pg"><label>메모</label>
      <textarea onchange="setProp('note',this.value)">${esc(m.note||'')}</textarea></div>
    <button class="pbtn" onclick="rotM(${m.uid})">↻ 90° 회전</button>
    <button class="pbtn danger" onclick="delM(${m.uid})">🗑 삭제</button>`;
}

function getSelM() {
  if (!selectedEl) return null;
  const uid = parseInt(selectedEl.id.replace('pm_',''));
  return layouts[TABS[curTab]].find(m => m.uid === uid);
}

function setProp(k, v) {
  const m = getSelM(); if (!m) return;
  m[k] = v;
  const el = document.getElementById('pm_'+m.uid); if (!el) return;
  if (k === 'label') el.querySelector('.pm-label').textContent = v;
  if (k === 'num')   el.querySelector('.pm-num').textContent   = v;
  if (k === 'spec')  el.querySelector('.pm-spec').textContent  = v;
}
function setPropColor(k, v) {
  const m = getSelM(); if (!m) return;
  m[k] = v;
  const el = document.getElementById('pm_'+m.uid); if (!el) return;
  if (k === 'color')       el.style.background   = v;
  if (k === 'borderColor') el.style.borderColor  = v;
}
function setPropNum(k, v) {
  const m = getSelM(); if (!m) return;
  m[k] = parseInt(v)||0;
  const el = document.getElementById('pm_'+m.uid); if (!el) return;
  if (k === 'w') el.style.width  = m.w+'px';
  if (k === 'h') el.style.height = m.h+'px';
  if (k === 'x') el.style.left   = m.x+'px';
  if (k === 'y') el.style.top    = m.y+'px';
}

// ═══════════════════════════════════════════
// 탭 전환
// ═══════════════════════════════════════════
function switchTab(idx) {
  curTab = idx;
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.getElementById('canvasTitle').textContent = TAB_NAMES[idx];
  selectedEl = null; renderPropsEmpty();
  renderSidebar(); renderCanvas();
  document.getElementById('sb-tab').textContent = TAB_NAMES[idx];
}

// ═══════════════════════════════════════════
// 저장 / 불러오기
// ═══════════════════════════════════════════
function saveLayout() {
  const data = {
    v: 2, layouts, nextId,
    cv: { w: document.getElementById('cvW').value, h: document.getElementById('cvH').value }
  };
  localStorage.setItem('cog_v2', JSON.stringify(data));
  document.getElementById('sb-saved').textContent = '저장됨: ' + new Date().toLocaleTimeString('ko-KR');
}

function loadLayout() {
  const raw = localStorage.getItem('cog_v2');
  if (!raw) { alert('저장된 데이터가 없습니다.'); return; }
  try {
    const d = JSON.parse(raw);
    layouts = d.layouts; nextId = d.nextId || 1;
    if (d.cv) {
      document.getElementById('cvW').value = d.cv.w;
      document.getElementById('cvH').value = d.cv.h;
      resizeCv();
    }
    renderCanvas();
  } catch(e) { alert('오류: ' + e.message); }
}

function loadPreset() {
  const allEmpty = Object.values(layouts).every(arr => arr.length === 0);
  if (!allEmpty && !confirm('현재 배치를 DWG 기반 초기 배치로 교체합니까?\n(기존 작업이 삭제됩니다)')) return;
  layouts = buildPreset();
  nextId  = 2000;
  renderCanvas();
  alert('DWG 기반 초기 배치가 로드되었습니다!\n각 탭(가동/나동/다동)을 확인하고 실제 위치에 맞게 조정하세요.');
}

function exportJSON() {
  const blob = new Blob([JSON.stringify({ v:2, layouts, nextId }, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cog_layout_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
}

function importJSON() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json';
  inp.onchange = e => {
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        layouts = d.layouts; nextId = d.nextId || 1;
        renderCanvas();
      } catch(err) { alert('파일 오류: ' + err.message); }
    };
    reader.readAsText(e.target.files[0]);
  };
  inp.click();
}

// ═══════════════════════════════════════════
// 구역 추가
// ═══════════════════════════════════════════
function addZone() {
  const name  = prompt('구역 이름', '구역');   if (!name) return;
  const color = prompt('색상 (#hex)', '#3182ce') || '#3182ce';
  const canvas = document.getElementById('canvas');
  const zone = document.createElement('div');
  zone.className = 'zone-box';
  zone.style.cssText = `left:100px;top:60px;width:300px;height:220px;`
    + `border-color:${color};background:${color}18;`;
  zone.innerHTML = `<div class="zlabel" style="background:${color};color:#fff">${name}</div>`;

  zone.addEventListener('mousedown', ev => {
    if (ev.target !== zone) return;
    ev.preventDefault();
    const r = zone.getBoundingClientRect();
    const ox = ev.clientX - r.left, oy = ev.clientY - r.top;
    const mm = e2 => {
      const cr = canvas.getBoundingClientRect();
      zone.style.left = (e2.clientX - cr.left - ox) + 'px';
      zone.style.top  = (e2.clientY - cr.top  - oy) + 'px';
    };
    const mu = () => {
      document.removeEventListener('mousemove', mm);
      document.removeEventListener('mouseup', mu);
    };
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', mu);
  });
  zone.addEventListener('dblclick', () => { if (confirm('이 구역을 삭제할까요?')) zone.remove(); });
  canvas.appendChild(zone);
}

// ═══════════════════════════════════════════
// 캔버스 크기
// ═══════════════════════════════════════════
function resizeCv() {
  const c = document.getElementById('canvas');
  c.style.width  = document.getElementById('cvW').value + 'px';
  c.style.height = document.getElementById('cvH').value + 'px';
}

// ═══════════════════════════════════════════
// 상태바
// ═══════════════════════════════════════════
function updateSB() {
  document.getElementById('sb-cnt').textContent = '기계: ' + layouts[TABS[curTab]].length + '개';
}

// ═══════════════════════════════════════════
// 유틸
// ═══════════════════════════════════════════
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function toHex(c) {
  if (!c || typeof c !== 'string') return '#4a90d9';
  const m = c.match(/#[0-9a-fA-F]{6}/);
  return m ? m[0] : '#4a90d9';
}

// ═══════════════════════════════════════════
// 키보드 단축키
// ═══════════════════════════════════════════
document.addEventListener('keydown', e => {
  const active = document.activeElement.tagName;
  if (active === 'INPUT' || active === 'TEXTAREA') return;

  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveLayout(); return; }
  if (e.key === 'Delete' && selectedEl) {
    delM(parseInt(selectedEl.id.replace('pm_','')));
    return;
  }
  if (e.key === 'Escape') { clearSelected(); return; }

  // 방향키 이동 (40px 기본 / Shift+방향키 8px 미세조정)
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key) && selectedEl) {
    e.preventDefault();
    const m = getSelM(); if (!m) return;
    const step = e.shiftKey ? 8 : 40;
    if (e.key === 'ArrowLeft')  m.x = Math.max(0, m.x - step);
    if (e.key === 'ArrowRight') m.x += step;
    if (e.key === 'ArrowUp')    m.y = Math.max(0, m.y - step);
    if (e.key === 'ArrowDown')  m.y += step;
    const el = document.getElementById('pm_'+m.uid);
    if (el) { el.style.left = m.x+'px'; el.style.top = m.y+'px'; }
  }
});

// ═══════════════════════════════════════════
// 초기화
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  initDrop();
  renderCanvas();

  // 이전 저장 데이터 자동 불러오기
  const raw = localStorage.getItem('cog_v2');
  if (raw) {
    try {
      const d = JSON.parse(raw);
      if (d.layouts && confirm('저장된 배치도가 있습니다. 불러올까요?')) {
        layouts = d.layouts; nextId = d.nextId || 1;
        if (d.cv) {
          document.getElementById('cvW').value = d.cv.w;
          document.getElementById('cvH').value = d.cv.h;
          resizeCv();
        }
        renderCanvas();
      }
    } catch(e) {}
  }
});
