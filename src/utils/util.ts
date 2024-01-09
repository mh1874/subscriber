/**
 * 判断消息内容是否需要做展开处理
 * @param message
 * @returns boolean
 */
export const needExpandHandler = (message: string) => {
  const hasHtmlNode = [
    '<div',
    '<p',
    '<span',
    '<a',
    '<img',
    'src=',
    'href=',
    'style=',
    'class='
  ].includes(message)
  if (hasHtmlNode) {
    return message.length > 400
  }
  return message.length > 240
}

/**
 * 空值判断函数
 * @param v 需要判断的值
 * @returns boolean
 */
export function isEmpty(v: any) {
  if (v === '') return true // 检验空字符串
  if (v === 'null') return true // 检验字符串类型的null
  if (v === 'undefined') return true // 检验字符串类型的 undefined
  if (!v && v !== 0 && v !== '' && v !== false) return true // 检验 undefined 和 null
  if (Object.prototype.toString.call(v) === '[object Array]' && v.length === 0)
    return true // 检验空数组
  if (
    Object.prototype.toString.call(v) === '[object Object]' &&
    Object.keys(v).length === 0
  ) {
    return true // 检验空对象
  }
  return false
}
