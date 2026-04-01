/**
 * preset.js
 * DWG 캐드 도면 기반 초기 배치 데이터
 *
 * 실제 공장 배치를 조정했으면 이 파일 대신
 * 저장(Ctrl+S) 후 localStorage 또는 JSON 내보내기를 사용하세요.
 */

function buildPreset() {
  const preset = { ga: [], na: [], da: [] };
  let uid = 1000;

  // ══════════════════════════════════════════
  // 가동 — 전조실
  // ══════════════════════════════════════════

  // WR1~WR16 상단 행
  const wrRow1 = [
    'WR1호','WR2호','WR3호','WR4호','WR5호','WR6호','WR7호','WR18',
    'WR9호','WR10호','WR11호','WR12호','WR13호','WR14호','WR15호','WR16호'
  ];
  wrRow1.forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:20+i*92, y:20, w:80, h:75,
      icon:'🔩', label:lbl, color:'#bee3f8', borderColor:'#3182ce', num:'', spec:'', note:'' });
  });

  // WR 두번째 행
  const wrRow2 = [
    'WR19호','WR20호','WR21호','WR22호','WR28호','WR29호','WR30호',
    'WR31호','WR32호','WR33호','WR18호','WR17호'
  ];
  wrRow2.forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:20+i*92, y:110, w:80, h:75,
      icon:'🔩', label:lbl, color:'#bee3f8', borderColor:'#3182ce', num:'', spec:'', note:'' });
  });

  // WR23~27 오른쪽 세로 배열
  ['WR23호','WR24호','WR25호','WR26호','WR27호'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:1130, y:20+i*92, w:80, h:80,
      icon:'🔩', label:lbl, color:'#90cdf4', borderColor:'#2b6cb0', num:'', spec:'', note:'' });
  });

  // 산세처리기 (왼쪽)
  ['산세처리기1','산세처리기2','산세처리기3'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:20, y:220+i*110, w:80, h:100,
      icon:'🧪', label:lbl, color:'#fbb6ce', borderColor:'#97266d', num:'', spec:'', note:'' });
  });

  // RL 기계 (중간 구역)
  ['RL13호','RL12호','RL11호','RL7호','RL5호','RL4호','RL3호'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:280+i*92, y:280, w:80, h:75,
      icon:'⚙', label:lbl, color:'#c6f6d5', borderColor:'#276749', num:'', spec:'', note:'' });
  });
  ['RL9호','RL1호','RL2호','RL10호','RL8호'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:440+i*92, y:370, w:80, h:75,
      icon:'⚙', label:lbl, color:'#c6f6d5', borderColor:'#276749', num:'', spec:'', note:'' });
  });
  ['RL14호 8mm','RL16호','RL15호'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:120+i*90, y:280, w:80, h:75,
      icon:'⚙', label:lbl, color:'#9ae6b4', borderColor:'#276749', num:'', spec:'', note:'' });
  });

  // CORE 바렐
  preset.ga.push({ uid:uid++, x:160, y:490, w:140, h:80,
    icon:'🔄', label:'CORE 바렐', color:'#fed7aa', borderColor:'#c05621', num:'', spec:'', note:'' });

  // 콤프레서
  ['콤프레서1','콤프레서2','콤프레서3'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:1230+i*90, y:20+i*90, w:80, h:80,
      icon:'🌀', label:lbl, color:'#e9d8fd', borderColor:'#553c9a', num:'', spec:'', note:'' });
  });

  // 배전반
  ['로링1배전','헷다1배전','로링4배전'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:340+i*300, y:205, w:30, h:60,
      icon:'⚡', label:lbl, color:'#fefcbf', borderColor:'#d69e2e', num:'', spec:'', note:'' });
  });

  // ══════════════════════════════════════════
  // 나동 — 단조·헤더실 (HD 기계)
  // ══════════════════════════════════════════

  // 컬럼 정의: [번호, 사이즈, 배경색, 테두리색]
  const makeHD = (lbl, spec, color, bc, x, y, w, h) => ({
    uid:uid++, x, y, w, h,
    icon:'🔨', label:lbl, color, borderColor:bc,
    num:'', spec, note:''
  });

  const C = { // 색상 단축
    m2: ['#e9d8fd','#553c9a'], m3: ['#fed7aa','#c05621'],
    m4: ['#bee3f8','#2b6cb0'], m5: ['#c6f6d5','#276749'],
    m6: ['#fbb6ce','#97266d'], m8: ['#feb2b2','#c53030'],
  };

  // 왼쪽 컬럼 (x=20)
  [
    ['HD005','M4',...C.m4], ['HD007','M2',...C.m2], ['HD008','M3',...C.m3],
    ['HD006','M4',...C.m4], ['HD027','M3',...C.m3], ['HD026','M4',...C.m4],
    ['HD025','M4',...C.m4], ['HD024','M4',...C.m4], ['HD042','M5',...C.m5],
    ['HD041','M5',...C.m5],
  ].forEach(([lbl, spec, color, bc], i) => {
    preset.na.push(makeHD(lbl, spec, color, bc, 20, 20+i*100, 75, spec==='M8'?110:spec==='M5'?95:spec==='M2'?80:90));
  });

  // 중간 컬럼 (x=200)
  [
    ['HD001','M5',...C.m5], ['HD002','M5',...C.m5], ['HD020','M2',...C.m2],
    ['HD021','M3',...C.m3], ['HD022','M3',...C.m3], ['HD019','M3',...C.m3],
    ['HD018','M3',...C.m3], ['HD017','M4',...C.m4], ['HD043','M5',...C.m5],
    ['HD037','M4',...C.m4],
  ].forEach(([lbl, spec, color, bc], i) => {
    preset.na.push(makeHD(lbl, spec, color, bc, 200, 20+i*100, 75, spec==='M5'?95:spec==='M2'?80:90));
  });

  // 오른쪽 컬럼1 (x=380)
  [
    ['HD003','M8',...C.m8], ['HD039','M4',...C.m4], ['HD009','M3',...C.m3],
    ['HD010','M4',...C.m4], ['HD011','M4',...C.m4], ['HD012','M4',...C.m4],
    ['HD013','M3',...C.m3], ['HD014','M4',...C.m4], ['HD036','M4',...C.m4],
    ['HD038','M3',...C.m3],
  ].forEach(([lbl, spec, color, bc], i) => {
    preset.na.push(makeHD(lbl, spec, color, bc, 380, 20+i*100, spec==='M8'?100:75, spec==='M8'?110:spec==='M2'?80:90));
  });

  // 오른쪽 컬럼2 (x=570)
  [
    ['HD029','M8',...C.m8], ['HD030','M3',...C.m3], ['HD028','M3',...C.m3],
    ['HD040','M5',...C.m5], ['HD031','M3',...C.m3], ['HD032','M4',...C.m4],
    ['HD033','M4',...C.m4], ['HD034','M4',...C.m4], ['HD035','M3',...C.m3],
    ['HD023','M4',...C.m4],
  ].forEach(([lbl, spec, color, bc], i) => {
    preset.na.push(makeHD(lbl, spec, color, bc, 570, 20+i*100, spec==='M8'?100:75, spec==='M8'?110:spec==='M5'?95:spec==='M2'?80:90));
  });

  // 추가 HD
  ['HD004','HD015','HD016'].forEach((lbl, i) => {
    preset.na.push(makeHD(lbl, 'M4', ...C.m4, 760, 20+i*100, 75, 90));
  });

  // 핀치기, 바이브레이터
  preset.na.push({ uid:uid++, x:900, y:400, w:160, h:80,
    icon:'🔧', label:'핀치기 (2500)', color:'#fefcbf', borderColor:'#744210', num:'', spec:'', note:'' });
  preset.na.push({ uid:uid++, x:900, y:500, w:100, h:80,
    icon:'📳', label:'바이브레이터', color:'#e2e8f0', borderColor:'#4a5568', num:'', spec:'', note:'' });

  // ══════════════════════════════════════════
  // 다동 — 포장실
  // ══════════════════════════════════════════

  // ABP 기계
  ['ABP127호S','ABP기계','ABP174S','ABP기계2','ABP기계3'].forEach((lbl, i) => {
    preset.da.push({ uid:uid++, x:20, y:20+i*120, w:90, h:110,
      icon:'📦', label:lbl, color:'#bee3f8', borderColor:'#2b6cb0', num:'', spec:'', note:'' });
  });

  // 포크리프트, 로드크레인
  preset.da.push({ uid:uid++, x:160, y:20,  w:140, h:100,
    icon:'🚜', label:'포크리프트 구역', color:'#fefcbf', borderColor:'#744210', num:'', spec:'', note:'' });
  preset.da.push({ uid:uid++, x:160, y:140, w:80,  h:80,
    icon:'🏗', label:'로드크레인', color:'#fbb6ce', borderColor:'#97266d', num:'', spec:'', note:'' });
  preset.da.push({ uid:uid++, x:160, y:240, w:80,  h:80,
    icon:'🗄', label:'다이스토탈', color:'#e9d8fd', borderColor:'#553c9a', num:'', spec:'', note:'' });

  // 파각기
  ['파각기1','파각기2','파각기3','파각기4','파각기5'].forEach((lbl, i) => {
    preset.da.push({ uid:uid++, x:300+i*100, y:20, w:88, h:60,
      icon:'🔧', label:lbl, color:'#fed7aa', borderColor:'#c05621', num:'', spec:'', note:'' });
  });

  // 계량기
  ['계량기1','계량기2','계량기3'].forEach((lbl, i) => {
    preset.da.push({ uid:uid++, x:300+i*110, y:100, w:80, h:70,
      icon:'⚖', label:lbl, color:'#c6f6d5', borderColor:'#276749', num:'', spec:'', note:'' });
  });

  // 파각단면
  ['파각단면1','파각단면2','파각단면3','파각단면4','파각단면5'].forEach((lbl, i) => {
    preset.da.push({ uid:uid++, x:20+i*120, y:660, w:100, h:40,
      icon:'🔲', label:lbl, color:'#e2e8f0', borderColor:'#718096', num:'', spec:'', note:'' });
  });

  return preset;
}
