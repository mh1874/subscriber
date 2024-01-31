/**
 * 判断消息内容是否需要做展开处理
 * 文本超过7行 或 图片超过1个
 * @param message
 * @param picList
 * @returns boolean
 */
export const shouldExpandContent = (message: string) => {
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
  return totalLines > 7
}

const excludeStrings = ['2018new', 'emoji', '_org', '_small']
/**
 * 从HTML字符串中提取图片信息并排除特定图片。
 * @param {string} html - 包含HTML标签的字符串。
 * @param {string[]} excludeStrings - 包含需要排除的字符串的数组。
 * @returns {Object} - 返回包含处理后文本和图片列表的对象。
 *                   - text: 处理后的文本，排除了特定图片的<img>标签。
 *                   - picList: 包含需要排除的图片的URL的数组。
 */
export const extractImagesFromHTML = (html: string) => {
  // 生成排除字符串的正则表达式
  const excludeRegex = new RegExp(
    excludeStrings.map((s) => `.*${s}.*`).join('|')
  )

  // 匹配 <img> 标签的 src 属性，判断是否需要排除
  const imgRegex = /<img\s+[^>]*src\s*=\s*["']?([^"'>]+)["']?[^>]*>/g

  const picList: any = []
  const text = html.replace(imgRegex, (match, imgSrc) => {
    // 如果图片的 src 属性包含排除字符串，不在 text 中排除，不在 picList 中返回
    if (excludeRegex.test(imgSrc)) {
      return match
    }
    // 否则在 text 中排除，同时在 picList 中返回
    picList.push(imgSrc)
    return ''
  })

  return { text, picList }
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
 * 将query参数加到url上
 */
export const appendQueryParameters = (url: string, query?: any) => {
  if (isEmpty(query)) {
    return url
  }
  const queryString = Object.keys(query)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    )
    .join('&')
  return url + (url.includes('?') ? '&' : '?') + queryString
}

/**
 * 用户等级文案展示
 */
const userLevelEnum: any = {
  1: '您还不是会员~',
  2: '高级会员VIP',
  3: '超级会员SVIP'
}
export const getUserLevel = (level: number): string => {
  return userLevelEnum[level]
}
