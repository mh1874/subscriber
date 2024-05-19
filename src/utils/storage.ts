// 存储数据，并设置过期时间（以小时为单位）默认24h过期
export const setStorage = (
  key: string,
  value: any,
  expiration: number = 24
) => {
  const currentTime = Math.floor(Date.now() / 1000) // 当前时间的时间戳（秒）
  const expirationInSeconds = expiration * 3600 // 将小时转换为秒
  const data = {
    value,
    expiration: currentTime + expirationInSeconds
  }
  uni.setStorageSync(key, data)
}

// 获取数据，并检查是否过期
export const getStorage = (key: string) => {
  const data = uni.getStorageSync(key)
  if (!data) {
    return null // 数据不存在
  }
  const currentTime = Math.floor(Date.now() / 1000) // 当前时间的时间戳（秒）
  if (currentTime > data.expiration) {
    uni.removeStorageSync(key) // 数据过期，删除
    return null // 返回 null 表示数据已经过期
  }
  return data.value // 返回存储的数据
}

// 示例：设置一个键为 'example' 的数据，有效期为 24 小时
// setStorage('example', { foo: 'bar' })

// 示例：读取 'example' 的数据
// const value = getStorage('example')
