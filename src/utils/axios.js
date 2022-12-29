import axios from 'axios'

//全局配置
// axios.defaults.baseURL = ''
axios.defaults.timeout = 5000
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

// axios请求拦截
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么:

    // 如果需要在header头中传token，使用下边这段代码
    // if (localStorage.getItem('token')) {
    //   config.headers['token'] = localStorage.getItem('token')
    // }

    return config
  },
  err => {
    // 对请求错误做些什么
    console.log('axios请求错误:', err)
    // alert('axios请求错误:', err)
  }
)

// axios响应拦截
axios.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    // 对响应错误做点什么
    console.log('axios响应错误:', err)
    // alert('axios响应错误:', err)
  }
)

export default axios
