## ~~项目改名~~

这个是 **FL_bangumi** 项目，是 **FL_center的一个子项目** ， 

是一个web项目。

其前端由vue构建，**项目名称应为FL_bangumi_front_end** , 并且把构建出来的网页部署在FL_center后端的**#WEB_servers**中的一个单独的子服务器**FL_bangumi_static_page_server**上，

其后端部署为 **FL_center  后端中的一个服务**。



## 一切都在后端设置完成

> - [x] 前端除了必要的组件外，无任何与具体资源种类强相关的代码。
>
>
> - [x] 包括数据类型的type设置完善化
>
>
> - file_names、hots是否需要扫描在设置文件里说清楚。
>
> - 前端路由也不应由自己去再写一遍，各资源所属种类以及名称应在设置文件里写清楚。~~前端请求后自动生成相关路由。~~ 应该是前端各种类页面都统一使用同一动态路由的页面。
>
>   > 比如，漫画资源，需要有一个自己的单独功能页（漫画阅读器组件）。
>
> - [ ] ~~尽量一切都在后端的const中设置完成~~，不要在别的地方的操作处进行一些关于资源种类的强相关判断。资源相关的设置应该在数据库中。



- [x] 插件的设计：该资源是否需要额外插件，需要哪些插件。

  可以提供除了资源浏览、过滤外的其他功能，例如 舞蹈资源，需要有选择，形成临时舞蹈列表的功能。





后端配置格式实例

```js
let example = {
  '2CY_manga': {
    name: '漫画', // 展示的名字
    belong_to: { code: '2CY', name: '二次元' }, // 属于哪一大类
    location: 'F:\\manga', // 本地存储地址
    format: new data_format([
      // 配置资源数据项格式
      {
        name: 'date',
        type: 'Date',
        showName: '发布时间'
      },
      {
        name: 'artist',
        type: 'Array:String',
        showName: '漫画作者',
        is_filter_field: true
      },
      //  ...
      {
        name: 'tags',
        type: 'Array:String',
        showName: '标签选择',
        selection: [
          ['原创漫画', '同人志'],
          ['日语', '英语']
        ]
      }
    ]),
    componentName: 'manga' // 前端展示资源项时使用的组件
    // 须在前端list_item_components文件夹下有manga.vue这个组件
  }
}

```











## 后端多处访问mongodb时 的奇怪bug

改善代码访问数据库方式，容易报错

> ```
> C:\Users\chen\Desktop\FL_center2\FL_center2_back_end\node_modules\mongodb\lib\operations\get_more.js:22
>             return callback(new error_1.MongoRuntimeError('Getmore must run on the same server operation began on'));
>                             ^
> 
> MongoRuntimeError: Getmore must run on the same server operation began on
>     at GetMoreOperation.execute (C:\Users\chen\Desktop\FL_center2\FL_center2_back_end\node_modules\mongodb\lib\operations\get_more.js:22:29)
>     at GetMoreOperation.<anonymous> (C:\Users\chen\Desktop\FL_center2\FL_center2_back_end\node_modules\mongodb\lib\operations\operation.js:29:18)
>     at node:internal/util:364:7
>     at new Promise (<anonymous>)
>     at GetMoreOperation.executeAsync (node:internal/util:350:12)
>     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
>   [Symbol(errorLabels)]: Set(0) {}
> }
> 
> Node.js v18.12.1
> [nodemon] app crashed - waiting for file changes before starting...
> ```
>
> 

### 解决方案

提取到 `#DB `中的一个 共同的mongoclient，效果待观察......



## 封装预览图片组件 预览视频组件

最好能够点击查看大图



<hr>

## 封装一个漫画阅读器组件


封装一个漫画阅读器组件，在漫画的列表详情页中可以打开该组件进行漫画的阅览。


- [x] 图片拖拽与放大缩小功能

  > 目前是用CSS3的 translate scale 实现，也可用 height + width + position 实现

- [x] 侧栏模式

- [x] 多图预览模式

- [x] 图片懒加载

- [x] 双页模式

  > bug：右边图片暂时无缩放功能

- [ ] 旋转工具



## 资源展示主界面： 列表预览模式 / 多图预览模式 等

类似exhentai展示页 可选的多种展示方式



## 搜索功能强化

- 不只能搜数据库内的，还能搜本地待添加的
- 搜索的结果可以直接点击进入相关资源
- 浏览器右键快捷搜索



## filter_field 支持在` ##文件夹`下 建立多级文件夹

> 例如 `\##演员` 下可以有  `\##中国` , `\##欧美` 文件夹，在相应的文件夹下再去放置对应的演员文件夹

## item 组件重写

- vue3 组合式api
- grid布局
- 不需要cover.jpg

## 重新封装file_icon 组件 

- svg
- base-64img

