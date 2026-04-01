/**
 * preset.js
 * DWG 캐드 도면 기반 초기 배치 데이터
 *
 * 실제 공장 배치를 조정했으면 이 파일 대신
 * 저장(Ctrl+S) 후 localStorage 또는 JSON 내보내기를 사용하세요.
 *
 * 스케일 기준:
 *  - 가동/나동/다동: 격자 40px = 약 1m
 *  - 2층: 1px ≈ 10mm (총 25000mm → 2500px)
 */

function buildPreset() {
  const preset = { ga: [], na: [], da: [], '2f': [] };
  let uid = 1000;

  // ══════════════════════════════════════════
  // 가동 — 전조실
  // ══════════════════════════════════════════

  // WR1~WR16 상단 행
  ['WR1호','WR2호','WR3호','WR4호','WR5호','WR6호','WR7호','WR18',
   'WR9호','WR10호','WR11호','WR12호','WR13호','WR14호','WR15호','WR16호'
  ].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:20+i*92, y:20, w:80, h:75,
      icon:'🔩', label:lbl, color:'#bee3f8', borderColor:'#3182ce', num:'', spec:'', note:'' });
  });

  // WR 두번째 행
  ['WR19호','WR20호','WR21호','WR22호','WR28호','WR29호','WR30호',
   'WR31호','WR32호','WR33호','WR18호','WR17호'
  ].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:20+i*92, y:110, w:80, h:75,
      icon:'🔩', label:lbl, color:'#bee3f8', borderColor:'#3182ce', num:'', spec:'', note:'' });
  });

  // WR23~27 오른쪽 세로 배열
  ['WR23호','WR24호','WR25호','WR26호','WR27호'].forEach((lbl, i) => {
    preset.ga.push({ uid:uid++, x:1130, y:20+i*92, w:80, h:80,
      icon:'🔩', label:lbl, color:'#90cdf4', borderColor:'#2b6cb0', num:'', spec:'', note:'' });
  });

  // 산세처리기
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
  // 나동 — 단조·헤더실 (HD 헤더기계)
  // ══════════════════════════════════════════

  const makeHD = (lbl, spec, color, bc, x, y) => {
    const h = spec==='M8'?110 : spec==='M5'?95 : spec==='M2'?80 : 90;
    const w = spec==='M8'?100 : spec==='M5'?85 : spec==='M2'?70 : 75;
    return { uid:uid++, x, y, w, h, icon:'🔨', label:lbl, color, borderColor:bc, num:'', spec, note:'' };
  };
  const C = {
    m2:['#e9d8fd','#553c9a'], m3:['#fed7aa','#c05621'],
    m4:['#bee3f8','#2b6cb0'], m5:['#c6f6d5','#276749'],
    m6:['#fbb6ce','#97266d'], m8:['#feb2b2','#c53030'],
  };

  // 4개 컬럼으로 배치
  const cols = [
    { x:20,  machines:[['HD005','M4',...C.m4],['HD007','M2',...C.m2],['HD008','M3',...C.m3],
                        ['HD006','M4',...C.m4],['HD027','M3',...C.m3],['HD026','M4',...C.m4],
                        ['HD025','M4',...C.m4],['HD024','M4',...C.m4],['HD042','M5',...C.m5],['HD041','M5',...C.m5]] },
    { x:200, machines:[['HD001','M5',...C.m5],['HD002','M5',...C.m5],['HD020','M2',...C.m2],
                        ['HD021','M3',...C.m3],['HD022','M3',...C.m3],['HD019','M3',...C.m3],
                        ['HD018','M3',...C.m3],['HD017','M4',...C.m4],['HD043','M5',...C.m5],['HD037','M4',...C.m4]] },
    { x:380, machines:[['HD003','M8',...C.m8],['HD039','M4',...C.m4],['HD009','M3',...C.m3],
                        ['HD010','M4',...C.m4],['HD011','M4',...C.m4],['HD012','M4',...C.m4],
                        ['HD013','M3',...C.m3],['HD014','M4',...C.m4],['HD036','M4',...C.m4],['HD038','M3',...C.m3]] },
    { x:570, machines:[['HD029','M8',...C.m8],['HD030','M3',...C.m3],['HD028','M3',...C.m3],
                        ['HD040','M5',...C.m5],['HD031','M3',...C.m3],['HD032','M4',...C.m4],
                        ['HD033','M4',...C.m4],['HD034','M4',...C.m4],['HD035','M3',...C.m3],['HD023','M4',...C.m4]] },
  ];

  cols.forEach(col => {
    col.machines.forEach(([lbl, spec, color, bc], i) => {
      preset.na.push(makeHD(lbl, spec, color, bc, col.x, 20+i*100));
    });
  });

  // 추가 HD
  ['HD004','HD015','HD016'].forEach((lbl, i) => {
    preset.na.push(makeHD(lbl, 'M4', ...C.m4, 760, 20+i*100));
  });

  // 핀치기, 바이브레이터
  preset.na.push({ uid:uid++, x:900, y:400, w:160, h:80,
    icon:'🔧', label:'핀치기 (2500)', color:'#fefcbf', borderColor:'#744210', num:'', spec:'', note:'' });
  preset.na.push({ uid:uid++, x:900, y:500, w:100, h:80,
    icon:'📳', label:'바이브레이터', color:'#e2e8f0', borderColor:'#4a5568', num:'', spec:'', note:'' });

  // ══════════════════════════════════════════
  // 다동 — 포장실 (DWG 이미지 기반)
  // 캔버스: 약 1800×800px 기준
  // ══════════════════════════════════════════

  // 왼쪽 영역: ASS'Y 기계들
  // 상단행: ASS'Y1LLY, ASS'Y3호, ASS'Y2호, ASS'Y1호, ASS'Y1호
  const assyTop = ["ASS'Y 1LLY", "ASS'Y 3호", "ASS'Y 2호", "ASS'Y 1호(A)", "ASS'Y 1호(B)"];
  assyTop.forEach((lbl, i) => {
    preset.da.push({ uid:uid++, x:20+i*110, y:20, w:95, h:110,
      icon:'🔵', label:lbl, color:'#bee3f8', borderColor:'#2b6cb0', num:'', spec:'', note:'' });
  });

  // 중단: ASS'Y 7호
  preset.da.push({ uid:uid++, x:130, y:150, w:95, h:110,
    icon:'🔵', label:"ASS'Y 7호", color:'#bee3f8', borderColor:'#2b6cb0', num:'', spec:'', note:'' });

  // 하단: ASS'Y 6호, ASS'Y 4호
  preset.da.push({ uid:uid++, x:130, y:310, w:95, h:110,
    icon:'🔵', label:"ASS'Y 6호", color:'#bee3f8', borderColor:'#2b6cb0', num:'', spec:'', note:'' });
  preset.da.push({ uid:uid++, x:130, y:460, w:95, h:110,
    icon:'🔵', label:"ASS'Y 4호", color:'#bee3f8', borderColor:'#2b6cb0', num:'', spec:'', note:'' });

  // 중앙 상단: 로라선별기 1~5호
  ['로라선별기1','로라선별기2','로라선별기3','로라선별기4','로라선별기5'].forEach((lbl, i) => {
    preset.da.push({ uid:uid++, x:640+i*116, y:60, w:100, h:130,
      icon:'🔷', label:lbl, color:'#c6f6d5', borderColor:'#276749', num:'', spec:'', note:'' });
  });

  // 우측: IC탱크
  preset.da.push({ uid:uid++, x:1460, y:100, w:110, h:110,
    icon:'🛢', label:'IC탱크', color:'#e9d8fd', borderColor:'#553c9a', num:'', spec:'', note:'' });

  // 우측: 크레인, 포장기
  preset.da.push({ uid:uid++, x:1380, y:360, w:80, h:80,
    icon:'🏗', label:'크레인', color:'#fbb6ce', borderColor:'#97266d', num:'', spec:'', note:'' });
  preset.da.push({ uid:uid++, x:1460, y:560, w:100, h:100,
    icon:'📦', label:'포장기', color:'#bee3f8', borderColor:'#2b6cb0', num:'', spec:'', note:'' });

  // 하단 중앙: 육각용기, 컨베이어
  preset.da.push({ uid:uid++, x:600, y:600, w:140, h:60,
    icon:'🔶', label:'육각용기', color:'#fed7aa', borderColor:'#c05621', num:'', spec:'', note:'' });
  preset.da.push({ uid:uid++, x:600, y:670, w:280, h:44,
    icon:'➡', label:'컨베이어', color:'#fefcbf', borderColor:'#744210', num:'', spec:'', note:'' });

  // 구역 레이블
  preset.da.push({ uid:uid++, x:560, y:10, w:120, h:36,
    icon:'📋', label:'포장실1-1', color:'#fffff0', borderColor:'#d69e2e', num:'', spec:'', note:'' });
  preset.da.push({ uid:uid++, x:10, y:260, w:36, h:120,
    icon:'📋', label:'포장실2호', color:'#fffff0', borderColor:'#d69e2e', num:'', spec:'', note:'' });

  // ══════════════════════════════════════════
  // 2층 — 사무동 (DWG 치수 기반)
  // 스케일: 1px = 10mm
  // 전체: 25000mm×11000mm → 2500×1100px
  // ══════════════════════════════════════════
  //
  // 상단부 (높이 3800mm = 380px):
  //   다용도실(2250mm) | 회의실(13750mm) | 접견실(3150mm) | 탕비실(1800mm) | 화장실(4050mm)
  //   오른쪽 계단(2450mm)
  //
  // 하단부 (높이 약 7200mm = 720px):
  //   [계단1350] [휴게실영역] | 기획실(3150mm) | 사무실(8550mm) | 연구실(4500mm) | 대표이사(4050mm)
  //   (기획실 왼쪽에 3400mm 공간 = 복도/통로)
  //
  // 좌측 계단 & 휴게실:
  //   좌측에 계단(1350mm = 135px 폭), 그 오른쪽에 휴게실(3150mm = 315px)
  //   휴게실은 상단부 아래 전체 높이 = 6300mm+800mm = 7100mm? 실제는 11000-3800=7200px

  const S = 0.1; // 1mm → 0.1px (10mm = 1px)
  const m = (mm) => Math.round(mm * S); // mm → px

  const topH = m(3800);   // 380px
  const botH = m(7200);   // 720px (나머지)
  const totalH = m(11000); // 1100px

  // ── 상단부 ──
  // 다용도실: x=0, w=2250mm, h=1800mm (상단 일부, 사진 보면 상단 180px)
  preset['2f'].push({ uid:uid++, x:0, y:0, w:m(2250), h:m(1800),
    icon:'🏠', label:'다용도실', color:'#e9d8fd', borderColor:'#553c9a', num:'', spec:'2250×1800', note:'' });

  // 회의실: x=2250, w=13750, h=3800
  preset['2f'].push({ uid:uid++, x:m(2250), y:0, w:m(13750), h:topH,
    icon:'🤝', label:'회의실', color:'#bee3f8', borderColor:'#3182ce', num:'', spec:'13750×3800', note:'' });

  // 접견실: x=16000, w=3150, h=3800
  preset['2f'].push({ uid:uid++, x:m(16000), y:0, w:m(3150), h:topH,
    icon:'🪑', label:'접견실', color:'#c6f6d5', borderColor:'#276749', num:'', spec:'3150×3800', note:'' });

  // 탕비실: x=19150, w=1800, h=3800
  preset['2f'].push({ uid:uid++, x:m(19150), y:0, w:m(1800), h:topH,
    icon:'☕', label:'탕비실', color:'#fed7aa', borderColor:'#c05621', num:'', spec:'1800×3800', note:'' });

  // 화장실: x=20950, w=4050, h=3800
  preset['2f'].push({ uid:uid++, x:m(20950), y:0, w:m(4050), h:topH,
    icon:'🚻', label:'화장실', color:'#90cdf4', borderColor:'#2b6cb0', num:'', spec:'4050×3800', note:'' });

  // 우측 계단 (2450mm 폭)
  preset['2f'].push({ uid:uid++, x:m(25000-2450), y:0, w:m(2450), h:m(4500),
    icon:'🪜', label:'계단 (우)', color:'#e2e8f0', borderColor:'#4a5568', num:'', spec:'2450', note:'' });

  // ── 하단부 ──
  // 좌측 계단
  preset['2f'].push({ uid:uid++, x:0, y:topH, w:m(1350), h:botH,
    icon:'🪜', label:'계단 (좌)', color:'#e2e8f0', borderColor:'#4a5568', num:'', spec:'1350', note:'' });

  // 휴게실: x=1350, w=3150, 전체 하단 높이
  preset['2f'].push({ uid:uid++, x:m(1350), y:topH, w:m(3150), h:botH,
    icon:'🛋', label:'휴게실', color:'#fefcbf', borderColor:'#744210', num:'', spec:'3150×6300', note:'' });

  // 기획실: x=1350+3150+3400=7900? 아니면 x=1350+3150=4500
  // 이미지상 기획실은 3400mm 통로 뒤에 위치 → x=4500+3400=7900?
  // 실제 bottom치수: 1350+3150+3400+8550+4500+4050=25000
  // 기획실 위치: x=1350+3150=4500, 너비=3400 (or 기획실=3150, 통로=3400?)
  // 이미지에서 기획실은 작고 사무실이 크게 보임
  // 기획실: w=3150+3400=6550? 아니면 둘이 다른 방?
  // → 가장 합리적 해석: 복도/통로=3400, 기획실=3150 (별도 방)
  // 기획실 x = 4500 (1350+3150), w = 3400 (하지만 이미지에서 기획실이 작으므로...)
  // 이미지 비율로 보면: 기획실이 사무실보다 훨씬 작음
  // 재해석: 1350(계단) + 3150(휴게실) + [기획실 포함 구역 3400+8550] + 4500(연구실) + 4050(대표이사)
  // 기획실 = 3400, 사무실 = 8550이 더 자연스러움

  // 기획실: x=4500, w=3400
  preset['2f'].push({ uid:uid++, x:m(4500), y:topH+m(1000), w:m(3400), h:m(4500),
    icon:'📊', label:'기획실', color:'#e9d8fd', borderColor:'#553c9a', num:'', spec:'3400×4500', note:'' });

  // 사무실: x=7900, w=8550
  preset['2f'].push({ uid:uid++, x:m(7900), y:topH+m(1000), w:m(8550), h:m(4500),
    icon:'🖥', label:'사무실', color:'#c6f6d5', borderColor:'#276749', num:'', spec:'8550×4500', note:'' });

  // 연구실: x=16450, w=4500
  preset['2f'].push({ uid:uid++, x:m(16450), y:topH+m(1000), w:m(4500), h:m(4500),
    icon:'🔬', label:'연구실', color:'#bee3f8', borderColor:'#3182ce', num:'', spec:'4500×4500', note:'' });

  // 대표이사: x=20950, w=4050 (우측 계단 전까지)
  preset['2f'].push({ uid:uid++, x:m(20950), y:topH+m(1000), w:m(4050), h:m(4500),
    icon:'👔', label:'대표이사', color:'#fbb6ce', borderColor:'#97266d', num:'', spec:'4050×4500', note:'' });

  return preset;
}
