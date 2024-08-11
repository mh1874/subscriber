export function useCopyLink(): any {
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
    isHttpUrl,
    copyLink
  }
}
