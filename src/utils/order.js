export default function (arr, type) {
  if (!arr.length) return arr

  // 针对有 date项的资源，目前是 2CY_manga
  // 正序 就是按 date 从早到晚
  // 倒序 就是按 date 从晚到早

  if (type === '最早') {
    if (arr[0].date) {
      arr = arr.sort((fir, sec) => {
        if (!fir.date) return 1
        if (!sec.date) return -1

        return fir.date < sec.date ? -1 : 1
      })
    }
    return arr
  } else if (type === '最新') {
    if (arr[0].date) {
      arr = arr.sort((fir, sec) => {
        if (!fir.date) return -1
        if (!sec.date) return 1

        return fir.date < sec.date ? 1 : -1
      })
    } else {
      arr = arr.reverse()
    }
    return arr
  } else if (type === '随机') {
    function shuffle(arr) {
      // 随机打乱数组
      let _arr = arr.slice() // 调用数组副本，不改变原数组
      for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        ;[_arr[i], _arr[j]] = [_arr[j], _arr[i]]
      }
      return _arr
    }
    function getRandomInt(min, max) {
      // 获取min到max的一个随机数，包含min和max本身
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    return shuffle(arr)
  }
}
