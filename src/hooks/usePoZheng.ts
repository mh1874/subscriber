export function usePoZheng(): any {
  // 判断信息来源是否为破整网
  const isPoZheng = (source: string) => {
    return source === 'pozhengwang'
  }
  // 处理重点文字加深
  const processText = (text: string) => {
    const lastBreakIndex = Math.max(text.lastIndexOf('<br>'))
    if (lastBreakIndex === -1) return `<b>${text}</b>`
    const beforeLastBreak = text.substring(0, lastBreakIndex + 4)
    const afterLastBreak = text.substring(lastBreakIndex + 4)
    const wrappedBefore = `<b>${beforeLastBreak.trim()}</b>`
    return `${wrappedBefore}<br>${afterLastBreak}`
  }
  // 判断是否为http链接
  const isHttpUrl = (url: string) => {
    const regex = /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[/#?]?.*$/
    return regex.test(url)
  }
  // 复制链接
  const copyLink = (e: any) => {
    if (isHttpUrl(e.innerText)) {
      uni.setClipboardData({
        data: e.innerText,
        success() {
          uni.showToast({
            title: '链接已复制',
            icon: 'none'
          })
        }
      })
    }
  }
  return {
    isPoZheng,
    processText,
    isHttpUrl,
    copyLink
  }
}
