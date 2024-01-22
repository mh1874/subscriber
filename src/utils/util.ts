/**
 * 判断消息内容是否需要做展开处理
 * 文本超过7行 或 图片超过1个
 * @param message
 * @returns boolean
 */
export const estimateLineCount = (message: string, picList: string[]) => {
  const maxCharsPerLine = 25
  // 移除 HTML 标签，只保留文本内容
  const textContent = message.replace(/<[^>]+>/g, '')
  const lines = textContent.split(/<br\s*\/?>|\n/)
  // 判断文本是否超过7行
  let totalLines = 0
  for (const line of lines) {
    const lineText = line.trim()
    const lineCount = Math.ceil(lineText.length / maxCharsPerLine)
    totalLines += lineCount
  }
  return totalLines > 7 || picList.length > 1
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

/**
 * 获取当前页路由及其当前页url query参数
 */
export const getCurrentPageInfo = () => {
  const routes = getCurrentPages() as any // 获取当前打开过的页面路由数组
  const curRoute = routes[routes.length - 1].route // 获取当前页面路由
  // 在微信小程序或是app中，通过curPage.options
  const { fullPath } = routes[routes.length - 1].$page
  const curParam = routes[routes.length - 1].options
  return { fullPath, curRoute, routes, curQuery: curParam }
}

/**
 * 获取用户等级
 */
const userLevelEnum: any = {
  1: '普通用户',
  2: '普通会员',
  3: '高级会员'
}
export const getUserLevel = (level: number): string => {
  return userLevelEnum[level]
}
