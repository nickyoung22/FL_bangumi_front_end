const _throttle = function (fn, delay = 200) {
  let valid = true //借助闭包

  return function (...args) {
    if (!valid) {
      //阀门关闭 不生效
      return false
    }

    // 工作时间，执行函数 并在间隔期内把状态位设为无效

    //工作 并关阀门
    fn.apply(this, args)
    valid = false

    //一定时间后解开阀门
    setTimeout(() => {
      valid = true
    }, delay)
  }
}

export default _throttle
