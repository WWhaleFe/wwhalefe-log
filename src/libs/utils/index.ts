export function formatDate(date: any, local: any) {
  const d = new Date(date)
  const options: any = { year: 'numeric', month: 'short', day: 'numeric' }
  const res = d.toLocaleDateString(local, options)
  return res
}

// 카테고리 이름 앞의 이모지는 화면에서만 떼어 낸다. 값(쿼리·필터)은 그대로 쓴다
export const stripLeadingEmoji = (text: string) =>
  text.replace(/^(?:\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u, "")
