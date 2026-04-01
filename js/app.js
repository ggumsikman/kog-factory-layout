/**
 * app.js
 * 편집기 핵심 로직
 */

// ═══════════════════════════════════════════
// 상태
// ═══════════════════════════════════════════
let curTab      = 0;
let layouts     = { ga: [], na: [], da: [], '2f': [] };
let selectedUids = new Set(); // 다중 선택
let nextId      = 1;
let dragState   = null;
let rbState     = null; // 고무밴드 선택 상태

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

  if (selectedUids.has(m.uid)) el.classList.add('selected');

  el.querySelector('.del-btn').addEventListener('click', e => { e.stopPropagation(); delM(m.uid); });
  el.querySelector('.rot-btn').addEventListener('click', e => { e.stopPropagation(); rotM(m.uid); });
  el.querySelector('.rsz').addEventListener('mousedown', e => {
    e.stopPropagation(); e.preventDefault();
    dragState = { type:'resize', uid:m.uid, sx:e.clientX, sy:e.clientY, sw:m.w, sh:m.h };
  });
  el.addEventListener('mousedown', e => {
    if (['del-btn','rot-btn','rsz'].some(c => e.target.classList.contains(c))) return;
    e.preventDefault();
    if (e.shiftKey) {
      selectM(m.uid, true);
    } else if (!selectedUids.has(m.uid)) {
      selectM(m.uid, false); // 선택 안 된 기계 클릭 → 단독 선택
    }
    // 이미 선택된 기계 클릭 → 기존 다중 선택 유지하고 드래그
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

  // 빈 캔버스 클릭/드래그: 고무밴드 선택
  canvas.addEventListener('mousedown', e => {
    if (e.target !== canvas && e.target.id !== 'canvasTitle') return;
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    rbState = { sx: e.clientX - r.left, sy: e.clientY - r.top };

    // 고무밴드 오버레이 생성
    let ov = document.getElementById('rbOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'rbOverlay';
      ov.style.cssText = 'position:absolute;border:1.5px dashed #3182ce;background:rgba(49,130,206,0.07);pointer-events:none;z-index:50;display:none;';
      canvas.appendChild(ov);
    }
    ov.style.left = rbState.sx + 'px';
    ov.style.top  = rbState.sy + 'px';
    ov.style.width = '0'; ov.style.height = '0';
    ov.style.display = 'block';
  });

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

  document.addEventListener('mousemove', e => {
    const cr = document.getElementById('canvas').getBoundingClientRect();
    document.getElementById('sb-pos').textContent =
      `마우스: (${Math.round(e.clientX-cr.left)}, ${Math.round(e.clientY-cr.top)})`;

    // 고무밴드 업데이트
    if (rbState) {
      const cx = e.clientX - cr.left;
      const cy = e.clientY - cr.top;
      const x = Math.min(cx, rbState.sx);
      const y = Math.min(cy, rbState.sy);
      const ov = document.getElementById('rbOverlay');
      if (ov) {
        ov.style.left   = x + 'px';
        ov.style.top    = y + 'px';
        ov.style.width  = Math.abs(cx - rbState.sx) + 'px';
        ov.style.height = Math.abs(cy - rbState.sy) + 'px';
      }
      return;
    }

    if (!dragState) return;
    const m = layouts[TABS[curTab]].find(x => x.uid === dragState.uid);
    if (!m) return;

    if (dragState.type === 'move') {
      const newX = Math.max(0, snap(e.clientX - cr.left - dragState.ox));
      const newY = Math.max(0, snap(e.clientY - cr.top  - dragState.oy));
      const dx = newX - m.x;
      const dy = newY - m.y;
      if (dx === 0 && dy === 0) return;

      // 선택된 모든 기계 함께 이동
      const tk = TABS[curTab];
      const toMove = selectedUids.has(m.uid) ? selectedUids : new Set([m.uid]);
      toMove.forEach(uid => {
        const sm = layouts[tk].find(x => x.uid === uid);
        if (!sm) return;
        sm.x = Math.max(0, sm.x + dx);
        sm.y = Math.max(0, sm.y + dy);
        const el = document.getElementById('pm_' + uid);
        if (el) { el.style.left = sm.x + 'px'; el.style.top = sm.y + 'px'; }
      });

    } else if (dragState.type === 'resize') {
      m.w = Math.max(30, snapS(dragState.sw + e.clientX - dragState.sx));
      m.h = Math.max(24, snapS(dragState.sh + e.clientY - dragState.sy));
      const el = document.getElementById('pm_'+m.uid);
      if (el) { el.style.width = m.w+'px'; el.style.height = m.h+'px'; }
    }
  });

  document.addEventListener('mouseup', e => {
    // 고무밴드 선택 완료
    if (rbState) {
      const cr = document.getElementById('canvas').getBoundingClientRect();
      const cx = e.clientX - cr.left;
      const cy = e.clientY - cr.top;
      const x  = Math.min(cx, rbState.sx);
      const y  = Math.min(cy, rbState.sy);
      const w  = Math.abs(cx - rbState.sx);
      const h  = Math.abs(cy - rbState.sy);

      const ov = document.getElementById('rbOverlay');
      if (ov) ov.style.display = 'none';
      rbState = null;

      if (w < 5 && h < 5) {
        // 클릭 수준 → 선택 해제
        if (!e.shiftKey) clearSelected();
      } else {
        // 영역 안의 기계들 선택
        if (!e.shiftKey) clearSelected();
        const tk = TABS[curTab];
        layouts[tk].forEach(m => {
          if (m.x < x + w && m.x + m.w > x && m.y < y + h && m.y + m.h > y) {
            addToSel(m.uid);
          }
        });
        updatePropsForSel();
      }
      return;
    }
    dragState = null;
  });
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
  selectM(uid, false);
  updateSB();
}

function delM(uid) {
  const tk = TABS[curTab];
  layouts[tk] = layouts[tk].filter(m => m.uid !== uid);
  document.getElementById('pm_'+uid)?.remove();
  selectedUids.delete(uid);
  updatePropsForSel();
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
function selectM(uid, add) {
  if (!add) {
    // 기존 선택 전부 해제
    selectedUids.forEach(id => document.getElementById('pm_'+id)?.classList.remove('selected'));
    selectedUids.clear();
  }
  // 이미 선택된 경우 Shift+클릭이면 해제
  if (add && selectedUids.has(uid)) {
    selectedUids.delete(uid);
    document.getElementById('pm_'+uid)?.classList.remove('selected');
    updatePropsForSel();
    return;
  }
  selectedUids.add(uid);
  document.getElementById('pm_'+uid)?.classList.add('selected');
  updatePropsForSel();
}

function addToSel(uid) {
  selectedUids.add(uid);
  document.getElementById('pm_'+uid)?.classList.add('selected');
}

function clearSelected() {
  selectedUids.forEach(id => document.getElementById('pm_'+id)?.classList.remove('selected'));
  selectedUids.clear();
  renderPropsEmpty();
}

function updatePropsForSel() {
  if (selectedUids.size === 0) { renderPropsEmpty(); return; }
  if (selectedUids.size === 1) {
    const uid = [...selectedUids][0];
    const m = layouts[TABS[curTab]].find(x => x.uid === uid);
    if (m) renderProps(m);
    return;
  }
  // 다중 선택
  document.getElementById('propsContent').innerHTML = `
    <div style="text-align:center;padding:12px 0;color:#2b6cb0;font-weight:bold;">${selectedUids.size}개 선택됨</div>
    <div class="nosel" style="margin-top:4px;">드래그로 함께 이동<br>방향키로 미세조정</div>
    <hr class="phr">
    <button class="pbtn danger" onclick="delSelected()">🗑 선택 항목 모두 삭제</button>`;
}

function delSelected() {
  if (!confirm(selectedUids.size + '개를 모두 삭제할까요?')) return;
  const tk = TABS[curTab];
  selectedUids.forEach(uid => {
    layouts[tk] = layouts[tk].filter(m => m.uid !== uid);
    document.getElementById('pm_'+uid)?.remove();
  });
  selectedUids.clear();
  renderPropsEmpty();
  updateSB();
}

function renderPropsEmpty() {
  document.getElementById('propsContent').innerHTML =
    '<div class="nosel">기계를 클릭하면<br>속성이 표시됩니다<br><br>💡 드래그로 배치<br>Shift+클릭으로 다중선택<br>빈 곳 드래그로 영역선택</div>';
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
  if (selectedUids.size !== 1) return null;
  const uid = [...selectedUids][0];
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
  if (k === 'color')       el.style.background  = v;
  if (k === 'borderColor') el.style.borderColor = v;
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
  selectedUids.clear(); renderPropsEmpty();

  if (TABS[idx] === '2f') {
    document.getElementById('cvW').value = 2500;
    document.getElementById('cvH').value = 1200;
  } else {
    document.getElementById('cvW').value = 2000;
    document.getElementById('cvH').value = 1100;
  }
  resizeCv();
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
  localStorage.setItem('kog_v2', JSON.stringify(data));
  document.getElementById('sb-saved').textContent = '저장됨: ' + new Date().toLocaleTimeString('ko-KR');
}

function loadLayout() {
  const raw = localStorage.getItem('kog_v2');
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
  a.download = 'kog_layout_' + new Date().toISOString().slice(0,10) + '.json';
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

  // Delete: 선택된 모두 삭제
  if (e.key === 'Delete' && selectedUids.size > 0) {
    if (selectedUids.size === 1) {
      delM([...selectedUids][0]);
    } else {
      delSelected();
    }
    return;
  }

  if (e.key === 'Escape') { clearSelected(); return; }

  // 방향키: 선택된 모두 이동 (40px / Shift: 8px 미세조정)
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key) && selectedUids.size > 0) {
    e.preventDefault();
    const step = e.shiftKey ? 8 : 40;
    const tk = TABS[curTab];
    selectedUids.forEach(uid => {
      const m = layouts[tk].find(x => x.uid === uid);
      if (!m) return;
      if (e.key === 'ArrowLeft')  m.x = Math.max(0, m.x - step);
      if (e.key === 'ArrowRight') m.x += step;
      if (e.key === 'ArrowUp')    m.y = Math.max(0, m.y - step);
      if (e.key === 'ArrowDown')  m.y += step;
      const el = document.getElementById('pm_'+uid);
      if (el) { el.style.left = m.x+'px'; el.style.top = m.y+'px'; }
    });
  }
});

// ═══════════════════════════════════════════
// 초기화
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  initDrop();
  renderCanvas();

  const raw = localStorage.getItem('kog_v2');
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
