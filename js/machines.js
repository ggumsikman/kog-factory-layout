/**
 * machines.js
 * 기계 목록 데이터 정의
 *
 * 새 기계/공간을 추가하려면 해당 탭의 section에
 * { id, icon, label, color, bColor, w, h } 항목을 추가하세요.
 */

const TABS      = ['ga', 'na', 'da', '2f'];
const TAB_NAMES = [
  '가동 — 전조실',
  '나동 — 단조·헤더실',
  '다동 — 포장실',
  '2층 — 사무동',
];

const MDEFS = {

  // ──────────────────────────────────────────
  // 가동 — 전조실
  // ──────────────────────────────────────────
  ga: [
    {
      section: 'WR 전조기 (롤링기)',
      items: [
        { id:'wr',   icon:'🔩', label:'WR 전조기',     color:'#bee3f8', bColor:'#3182ce', w:72, h:72 },
        { id:'wr_l', icon:'🔩', label:'WR 전조기(대)', color:'#90cdf4', bColor:'#2b6cb0', w:80, h:90 },
      ]
    },
    {
      section: 'RL 기계',
      items: [
        { id:'rl',   icon:'⚙', label:'RL 기계',       color:'#c6f6d5', bColor:'#276749', w:68, h:72 },
        { id:'rl_l', icon:'⚙', label:'RL 기계(8mm)',  color:'#9ae6b4', bColor:'#276749', w:80, h:80 },
      ]
    },
    {
      section: '설비',
      items: [
        { id:'core_barrel', icon:'🔄', label:'CORE 바렐',       color:'#fed7aa', bColor:'#c05621', w:140, h:80  },
        { id:'compressor',  icon:'🌀', label:'콤프레서',        color:'#e9d8fd', bColor:'#553c9a', w:80,  h:80  },
        { id:'trolley',     icon:'🏋', label:'트롤리 (호이스트)',color:'#fefcbf', bColor:'#744210', w:60,  h:60  },
        { id:'panel_g',     icon:'⚡', label:'배전반',          color:'#e2e8f0', bColor:'#4a5568', w:30,  h:80  },
        { id:'acid_tank',   icon:'🧪', label:'산세처리기',      color:'#fbb6ce', bColor:'#97266d', w:80,  h:100 },
        { id:'wash_m',      icon:'🫧', label:'세척기',          color:'#bee3f8', bColor:'#2b6cb0', w:80,  h:80  },
        { id:'oil_tank',    icon:'🛢', label:'오일 탱크',       color:'#fefcbf', bColor:'#744210', w:60,  h:80  },
      ]
    },
  ],

  // ──────────────────────────────────────────
  // 나동 — 단조·헤더실
  // ──────────────────────────────────────────
  na: [
    {
      section: 'HD 헤더기계 (M4~M5)',
      items: [
        { id:'hd_m4', icon:'🔨', label:'헤더 M4', color:'#bee3f8', bColor:'#2b6cb0', w:80, h:90 },
        { id:'hd_m5', icon:'🔨', label:'헤더 M5', color:'#c6f6d5', bColor:'#276749', w:85, h:95 },
      ]
    },
    {
      section: 'HD 헤더기계 (M2~M3)',
      items: [
        { id:'hd_m2', icon:'🔨', label:'헤더 M2', color:'#e9d8fd', bColor:'#553c9a', w:70, h:80 },
        { id:'hd_m3', icon:'🔨', label:'헤더 M3', color:'#fed7aa', bColor:'#c05621', w:75, h:85 },
      ]
    },
    {
      section: 'HD 헤더기계 (M6~M8)',
      items: [
        { id:'hd_m6', icon:'🔨', label:'헤더 M6', color:'#fbb6ce', bColor:'#97266d', w:90,  h:100 },
        { id:'hd_m8', icon:'🔨', label:'헤더 M8', color:'#feb2b2', bColor:'#c53030', w:100, h:110 },
      ]
    },
    {
      section: '기타 설비',
      items: [
        { id:'pinchi',    icon:'🔧', label:'핀치기',       color:'#fefcbf', bColor:'#744210', w:120, h:80 },
        { id:'vibra',     icon:'📳', label:'바이브레이터', color:'#e2e8f0', bColor:'#4a5568', w:80,  h:80 },
        { id:'conveyor',  icon:'➡',  label:'컨베이어',     color:'#fefcbf', bColor:'#744210', w:200, h:40 },
        { id:'panel_n',   icon:'⚡', label:'배전반',       color:'#e2e8f0', bColor:'#4a5568', w:30,  h:80 },
        { id:'oil_n',     icon:'🛢', label:'오일 탱크',    color:'#fefcbf', bColor:'#744210', w:60,  h:80 },
      ]
    },
  ],

  // ──────────────────────────────────────────
  // 다동 — 포장실
  // ──────────────────────────────────────────
  da: [
    {
      section: "ASS'Y 조립기계",
      items: [
        { id:'assy',   icon:'🔵', label:"ASS'Y 기계",     color:'#bee3f8', bColor:'#2b6cb0', w:90,  h:110 },
        { id:'assy_l', icon:'🔵', label:"ASS'Y 기계(대)", color:'#90cdf4', bColor:'#2b6cb0', w:100, h:120 },
      ]
    },
    {
      section: '로라선별기',
      items: [
        { id:'roller_s', icon:'🔷', label:'로라선별기', color:'#c6f6d5', bColor:'#276749', w:88, h:120 },
      ]
    },
    {
      section: '포장 설비',
      items: [
        { id:'pack_m',    icon:'📦', label:'포장기',     color:'#bee3f8', bColor:'#2b6cb0', w:80,  h:100 },
        { id:'conveyor2', icon:'➡',  label:'컨베이어',   color:'#fefcbf', bColor:'#744210', w:240, h:48  },
        { id:'hex_bin',   icon:'🔶', label:'육각용기',   color:'#fed7aa', bColor:'#c05621', w:120, h:60  },
      ]
    },
    {
      section: '설비',
      items: [
        { id:'ic_tank',    icon:'🛢', label:'IC탱크',       color:'#e9d8fd', bColor:'#553c9a', w:100, h:100 },
        { id:'crane_da',   icon:'🏗', label:'크레인',       color:'#fbb6ce', bColor:'#97266d', w:80,  h:80  },
        { id:'pack_area1', icon:'📋', label:'포장실1-1 구역',color:'#fffff0', bColor:'#d69e2e', w:160, h:40  },
        { id:'pack_area2', icon:'📋', label:'포장실2호 구역',color:'#fffff0', bColor:'#d69e2e', w:40,  h:160 },
      ]
    },
  ],

  // ──────────────────────────────────────────
  // 2층 — 사무동
  // ──────────────────────────────────────────
  '2f': [
    {
      section: '상층부 공간 (3800mm)',
      items: [
        { id:'2f_multi',    icon:'🏠', label:'다용도실',  color:'#e9d8fd', bColor:'#553c9a', w:180, h:152 },
        { id:'2f_meeting',  icon:'🤝', label:'회의실',    color:'#bee3f8', bColor:'#3182ce', w:440, h:152 },
        { id:'2f_reception',icon:'🪑', label:'접견실',    color:'#c6f6d5', bColor:'#276749', w:126, h:152 },
        { id:'2f_pantry',   icon:'☕', label:'탕비실',    color:'#fed7aa', bColor:'#c05621', w:72,  h:152 },
        { id:'2f_toilet',   icon:'🚻', label:'화장실',    color:'#90cdf4', bColor:'#2b6cb0', w:162, h:152 },
      ]
    },
    {
      section: '하층부 공간 (6300mm)',
      items: [
        { id:'2f_lounge',   icon:'🛋', label:'휴게실',   color:'#fefcbf', bColor:'#744210', w:180, h:252 },
        { id:'2f_planning', icon:'📊', label:'기획실',   color:'#e9d8fd', bColor:'#553c9a', w:126, h:180 },
        { id:'2f_office',   icon:'🖥', label:'사무실',   color:'#c6f6d5', bColor:'#276749', w:342, h:180 },
        { id:'2f_research', icon:'🔬', label:'연구실',   color:'#bee3f8', bColor:'#3182ce', w:180, h:180 },
        { id:'2f_ceo',      icon:'👔', label:'대표이사', color:'#fbb6ce', bColor:'#97266d', w:162, h:180 },
      ]
    },
    {
      section: '공용 공간',
      items: [
        { id:'2f_stairs',   icon:'🪜', label:'계단',     color:'#e2e8f0', bColor:'#4a5568', w:54,  h:200 },
        { id:'2f_hall',     icon:'🚶', label:'복도/홀',  color:'rgba(200,230,200,0.3)', bColor:'#48bb78', w:200, h:60 },
        { id:'2f_door',     icon:'🚪', label:'문',       color:'#fefcbf', bColor:'#744210', w:60,  h:16  },
      ]
    },
  ],
};

// ──────────────────────────────────────────
// 모든 탭 공통 설비
// ──────────────────────────────────────────
const COMMON = {
  section: '공통 설비',
  items: [
    { id:'wall_h',   icon:'━',  label:'벽 (가로)',    color:'#718096', bColor:'#2d3748', w:200, h:20  },
    { id:'wall_v',   icon:'┃',  label:'벽 (세로)',    color:'#718096', bColor:'#2d3748', w:20,  h:200 },
    { id:'door',     icon:'🚪', label:'문',            color:'#fefcbf', bColor:'#744210', w:60,  h:16  },
    { id:'pillar',   icon:'⬛', label:'기둥',          color:'#4a5568', bColor:'#1a202c', w:28,  h:28  },
    { id:'passage',  icon:'↔',  label:'통로',          color:'rgba(200,230,200,0.3)', bColor:'#48bb78', w:200, h:80 },
    { id:'office',   icon:'🖥', label:'사무공간',      color:'#c6f6d5', bColor:'#276749', w:160, h:120 },
    { id:'toilet',   icon:'🚻', label:'화장실',        color:'#bee3f8', bColor:'#2b6cb0', w:80,  h:80  },
    { id:'locker',   icon:'🗄', label:'로커',          color:'#e2e8f0', bColor:'#4a5568', w:40,  h:80  },
    { id:'fire_ext', icon:'🧯', label:'소화기',        color:'#fed7aa', bColor:'#c05621', w:24,  h:24  },
    { id:'elec_box', icon:'⚡', label:'전기 패널',     color:'#fefcbf', bColor:'#744210', w:40,  h:80  },
    { id:'textbox',  icon:'📝', label:'텍스트 박스',   color:'#fffff0', bColor:'#d69e2e', w:120, h:40  },
    { id:'arrow',    icon:'➡',  label:'흐름 화살표',   color:'rgba(255,200,0,0.2)', bColor:'#d69e2e', w:100, h:32 },
  ]
};
