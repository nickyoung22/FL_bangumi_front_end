export default function modify_console_log() {
  // 同一时间发出的信息，相同的颜色显示
  console.original_log = console.log
  let now_color_index = 0,
    colors_arr = ['#e8eae0', '#f5bd00', '#937bf6', '#1ce1ff'],
    last_date_for_consoleLog = ''

  console.log = function (...params) {
    let dateNow = new Date().toLocaleString()

    if (last_date_for_consoleLog !== '') {
      if (dateNow !== last_date_for_consoleLog) {
        now_color_index = (now_color_index + 1) % colors_arr.length
      }
    }

    last_date_for_consoleLog = dateNow

    console.original_log(`[%c${dateNow}] `, `color : ${colors_arr[now_color_index]};`, ...params)
  }
}
