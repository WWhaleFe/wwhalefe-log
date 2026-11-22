// 회색 콘솔 판 위에 부드럽게 뜬 카드, 강조는 라임 하나만 쓴다.
// 기존 키 이름(clay, glass ...)은 글 상세·댓글에서도 쓰므로 그대로 두고 값만 바꾼다.

export type Surfaces = typeof surfaces.light

const ACCENT = "#d4f53c"
const ACCENT_TEXT = "#171a08"

export const surfaces = {
  light: {
    pageColor: "#e6e8eb",
    // 같은 회색 안에서 위쪽만 살짝 밝게 해 조명을 받은 판처럼 보이게 한다
    pageGlow:
      "radial-gradient(90rem 48rem at 50% -12rem, rgba(255, 255, 255, 0.75), transparent 70%)",
    brandText: "linear-gradient(#17181a, #17181a)",

    // 큰 판(글 카드, 프로필)
    clay: `
      background: #f3f4f6;
      border: 1px solid rgba(17, 19, 22, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95),
        0 1px 2px rgba(17, 19, 22, 0.04),
        0 18px 40px -18px rgba(17, 19, 22, 0.18);
    `,
    clayRaised: `
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95),
        0 1px 2px rgba(17, 19, 22, 0.05),
        0 24px 48px -18px rgba(17, 19, 22, 0.24);
    `,
    // 판 위에 놓인 작은 칩·버튼
    claySoft: `
      background: #fbfbfc;
      border: 1px solid rgba(17, 19, 22, 0.07);
      box-shadow: inset 0 1px 0 #ffffff, 0 1px 2px rgba(17, 19, 22, 0.06);
    `,
    chipShadow: `
      border: 1px solid rgba(17, 19, 22, 0.07);
      box-shadow: inset 0 1px 0 #ffffff, 0 1px 2px rgba(17, 19, 22, 0.06);
    `,
    // 사이드 목록 같은 보조 판
    glass: `
      background: #f3f4f6;
      border: 1px solid rgba(17, 19, 22, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95),
        0 1px 2px rgba(17, 19, 22, 0.04),
        0 12px 28px -16px rgba(17, 19, 22, 0.14);
    `,
    // 드롭다운·떠 있는 메뉴
    glassStrong: `
      background: #fbfbfc;
      border: 1px solid rgba(17, 19, 22, 0.08);
      box-shadow: 0 1px 2px rgba(17, 19, 22, 0.06),
        0 16px 36px -10px rgba(17, 19, 22, 0.22);
    `,
    // 고정 헤더: 내용이 지나가도 읽히게 살짝 불투명하게 둔다
    bar: `
      background: rgba(243, 244, 246, 0.86);
      border: 1px solid rgba(17, 19, 22, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9),
        0 10px 28px -16px rgba(17, 19, 22, 0.2);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    `,
    // 판 안으로 들어간 홈(세그먼트 트랙, 입력칸)
    well: `
      background: #e9ebee;
      border: 1px solid rgba(17, 19, 22, 0.05);
      box-shadow: inset 0 1px 2px rgba(17, 19, 22, 0.06);
    `,
    // 대기·비활성 칸의 사선 무늬
    hatch: `
      background-color: #eceef1;
      background-image: repeating-linear-gradient(
        135deg,
        rgba(17, 19, 22, 0.055) 0 1px,
        transparent 1px 8px
      );
    `,
    // 보조 버튼의 점선 테두리
    dashed: "1px dashed rgba(17, 19, 22, 0.24)",
    hairline: "rgba(17, 19, 22, 0.07)",
    hover: "background: rgba(17, 19, 22, 0.045);",
    // 주 버튼·선택된 항목: 먹색 알약
    activePill: `
      background: #17181a;
      color: #f4f5f6;
      border-color: transparent;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14),
        0 4px 10px -4px rgba(17, 19, 22, 0.45);
    `,
    accent: ACCENT,
    accentText: ACCENT_TEXT,
    link: "#4a6400",
    focusRing: "rgba(122, 160, 0, 0.6)",
    tableLine: "rgba(17, 19, 22, 0.1)",
    tableHead: "rgba(17, 19, 22, 0.04)",
  },
  dark: {
    pageColor: "#0e0f11",
    pageGlow:
      "radial-gradient(90rem 48rem at 50% -12rem, rgba(255, 255, 255, 0.045), transparent 70%)",
    brandText: "linear-gradient(#eceef0, #eceef0)",

    clay: `
      background: #18191c;
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 18px 40px -20px rgba(0, 0, 0, 0.7);
    `,
    clayRaised: `
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 24px 48px -18px rgba(0, 0, 0, 0.8);
    `,
    claySoft: `
      background: #232428;
      border: 1px solid rgba(255, 255, 255, 0.07);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    `,
    chipShadow: `
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    `,
    glass: `
      background: #18191c;
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 12px 28px -18px rgba(0, 0, 0, 0.6);
    `,
    glassStrong: `
      background: #232428;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.7);
    `,
    bar: `
      background: rgba(24, 25, 28, 0.84);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 10px 28px -16px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    `,
    well: `
      background: #111214;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
    `,
    hatch: `
      background-color: #141517;
      background-image: repeating-linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.05) 0 1px,
        transparent 1px 8px
      );
    `,
    dashed: "1px dashed rgba(255, 255, 255, 0.22)",
    hairline: "rgba(255, 255, 255, 0.07)",
    hover: "background: rgba(255, 255, 255, 0.05);",
    // 다크에서는 주 버튼을 밝은 회색에 어두운 글자로 뒤집는다
    activePill: `
      background: #eceef0;
      color: #111214;
      border-color: transparent;
      box-shadow: inset 0 1px 0 #ffffff, 0 4px 10px -4px rgba(0, 0, 0, 0.6);
    `,
    accent: ACCENT,
    accentText: ACCENT_TEXT,
    link: "#d4f53c",
    focusRing: "rgba(212, 245, 60, 0.55)",
    tableLine: "rgba(255, 255, 255, 0.1)",
    tableHead: "rgba(255, 255, 255, 0.04)",
  },
}
