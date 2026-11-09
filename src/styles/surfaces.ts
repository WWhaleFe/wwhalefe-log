const activePill = `
  background: linear-gradient(135deg, #d6006e, #6a1bff);
  color: white;
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.35),
    inset -2px -2px 5px rgba(40, 0, 90, 0.35),
    0 6px 14px rgba(106, 27, 255, 0.35);
`

export type Surfaces = typeof surfaces.light

export const surfaces = {
  light: {
    pageColor: "#f7f1ff",
    pageGlow: `
      radial-gradient(42rem 42rem at 8% 6%, rgba(255, 46, 147, 0.55), transparent 70%),
      radial-gradient(38rem 38rem at 92% 12%, rgba(0, 212, 255, 0.55), transparent 70%),
      radial-gradient(44rem 44rem at 88% 88%, rgba(123, 47, 255, 0.5), transparent 70%),
      radial-gradient(40rem 40rem at 10% 92%, rgba(255, 230, 0, 0.55), transparent 70%)
    `,
    brandText: "linear-gradient(120deg, #d6006e, #6a1bff 60%, #0086c9)",
    clay: `
      background: linear-gradient(145deg, #ffffff, #f8f1ff);
      box-shadow: 12px 12px 28px rgba(123, 47, 255, 0.22),
        -8px -8px 20px rgba(255, 255, 255, 0.8),
        inset 3px 3px 6px rgba(255, 255, 255, 0.9),
        inset -4px -4px 8px rgba(123, 47, 255, 0.12);
    `,
    clayRaised: `
      box-shadow: 18px 20px 36px rgba(214, 0, 110, 0.26),
        -8px -8px 22px rgba(255, 255, 255, 0.85),
        inset 3px 3px 6px rgba(255, 255, 255, 0.9),
        inset -4px -4px 8px rgba(214, 0, 110, 0.14);
    `,
    claySoft: `
      background: linear-gradient(145deg, #ffffff, #f1e6ff);
      box-shadow: 3px 4px 9px rgba(123, 47, 255, 0.22),
        inset 1px 1px 3px rgba(255, 255, 255, 0.95),
        inset -2px -2px 4px rgba(123, 47, 255, 0.14);
    `,
    chipShadow: `
      box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.7),
        inset -2px -2px 4px rgba(0, 0, 0, 0.12),
        0 4px 10px rgba(123, 47, 255, 0.28);
    `,
    glass: `
      background: rgba(255, 255, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.7);
      box-shadow: 0 8px 32px rgba(123, 47, 255, 0.16);
      backdrop-filter: blur(18px) saturate(170%);
      -webkit-backdrop-filter: blur(18px) saturate(170%);
    `,
    glassStrong: `
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 12px 32px rgba(123, 47, 255, 0.24);
      backdrop-filter: blur(22px) saturate(180%);
      -webkit-backdrop-filter: blur(22px) saturate(180%);
    `,
    hover: "background: rgba(255, 255, 255, 0.65);",
    activePill,
    link: "#c20064",
    focusRing: "rgba(214, 0, 110, 0.45)",
    tableLine: "rgba(123, 47, 255, 0.18)",
    tableHead: "rgba(123, 47, 255, 0.1)",
  },
  dark: {
    pageColor: "#120a2a",
    pageGlow: `
      radial-gradient(42rem 42rem at 8% 6%, rgba(255, 46, 147, 0.35), transparent 70%),
      radial-gradient(38rem 38rem at 92% 12%, rgba(0, 212, 255, 0.28), transparent 70%),
      radial-gradient(44rem 44rem at 88% 88%, rgba(123, 47, 255, 0.42), transparent 70%),
      radial-gradient(40rem 40rem at 10% 92%, rgba(255, 230, 0, 0.14), transparent 70%)
    `,
    brandText: "linear-gradient(120deg, #ff7ac0, #c3a2ff 60%, #5fe3ff)",
    clay: `
      background: linear-gradient(145deg, #30235a, #231844);
      box-shadow: 12px 12px 28px rgba(0, 0, 0, 0.45),
        -6px -6px 18px rgba(123, 47, 255, 0.14),
        inset 3px 3px 6px rgba(255, 255, 255, 0.1),
        inset -4px -4px 8px rgba(0, 0, 0, 0.3);
    `,
    clayRaised: `
      box-shadow: 18px 20px 36px rgba(0, 0, 0, 0.55),
        -6px -6px 22px rgba(255, 46, 147, 0.2),
        inset 3px 3px 6px rgba(255, 255, 255, 0.12),
        inset -4px -4px 8px rgba(0, 0, 0, 0.3);
    `,
    claySoft: `
      background: linear-gradient(145deg, #3d2d70, #2c2052);
      box-shadow: 3px 4px 9px rgba(0, 0, 0, 0.4),
        inset 1px 1px 3px rgba(255, 255, 255, 0.14),
        inset -2px -2px 4px rgba(0, 0, 0, 0.3);
    `,
    chipShadow: `
      box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.55),
        inset -2px -2px 4px rgba(0, 0, 0, 0.18),
        0 4px 10px rgba(0, 0, 0, 0.4);
    `,
    glass: `
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
    `,
    glassStrong: `
      background: rgba(38, 26, 74, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(22px) saturate(170%);
      -webkit-backdrop-filter: blur(22px) saturate(170%);
    `,
    hover: "background: rgba(255, 255, 255, 0.12);",
    activePill,
    link: "#ff8cc8",
    focusRing: "rgba(255, 122, 192, 0.5)",
    tableLine: "rgba(255, 255, 255, 0.16)",
    tableHead: "rgba(255, 255, 255, 0.08)",
  },
}
