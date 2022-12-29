// 设置横向拖动大小的功能
export default function main_page_resize_fun() {
  console.log(' // 设置横向拖动大小的功能')

  let slideBar = this.$refs.slideBar,
    isMoving = false
  slideBar.addEventListener('mousedown', e => {
    isMoving = true
    slideBar.style.cursor = 'e-resize'
    // console.log(document.body.clientWidth - e.clientX)
  })

  //鼠标移动
  this.$refs.main.addEventListener('mousemove', e => {
    if (isMoving === false) {
      return
    }
    slideBar.style.cursor = 'e-resize'
    document.body.style.setProperty(
      '--right-sider-width',
      `${document.body.clientWidth - e.clientX}px`
    )
  })

  this.$refs.main.addEventListener('mouseup', e => {
    if (isMoving === false) {
      return
    }
    isMoving = false
    slideBar.style.cursor = 'default'
  })

  document.addEventListener('selectstart', function (e) {
    if (isMoving) {
      // console.log(`阻止文字选中事件`)
      e.preventDefault()
    }
  })
}
