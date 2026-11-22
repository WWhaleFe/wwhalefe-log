// 카테고리는 칩 전체를 칠하지 않고 작은 점 하나로만 구분한다.
// 색은 BKCWorks 공용 팔레트(LLM/tools/palette.py SERIES)에서 가져왔다.
const SERIES = ["#ee6c75", "#f4b854", "#409332", "#4ab4b7", "#4a82e8", "#dab2f4"]

export const COLOR_SET: Record<string, string> = Object.fromEntries(
  "0123456789ABCDEF".split("").map((key, idx) => [key, SERIES[idx % SERIES.length]])
)
