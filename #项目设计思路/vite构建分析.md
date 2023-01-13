

> windows cmd  :  `tree /f`

## 2022.1.8

```
C:.
│  event-9519ab40.js
│  index-1f1de985.js
│  index-70bb6245.css
│  index-e0a13a92.js
│  store-007e81c5.js
│  store-a1d9903a.css
│  tree.txt
│  _commonjsHelpers-042e6b4d.js
│  _plugin-vue_export-helper-3111e043.css
│  _plugin-vue_export-helper-4f7633d9.js
│
├─router-page 异步的路由页面
│      Add_Resources_detail-6759a07f.js
│      Add_Resources_detail-a02a9d73.css
│      Add_Resources_page-02b1553a.js
│      Add_Resources_page-17e15ef0.css
│      chnMangaReader-2c13e50e.css
│      chnMangaReader-cb25863d.js
│      main-36621f18.js
│      main-909b970c.css
│      NotFound-1332e082.js
│      NotFound-c9ff237e.css
│      RouteLoading-2cbc8fed.css
│      RouteLoading-df384e14.js
│      System_Info_page-c21cf90b.css
│      System_Info_page-eeeab884.js
│
├─大的图片 （小的图片 vite会自动 转化为base64编码）
│      图片加载失败-c4efc9a0.png
│      图片加载失败-dad2a3d6.js
│
├─异步组件中 被引用多次的组件 不是异步组件 但还是被split出来 例如file-icon
│      file_icon-16e92b85.js
│
├─第三方组件库 ( elementplus )
│      el-button-2cb60ae5.css
│      el-button-51837115.js
│      el-checkbox-button-c7b5aeb4.css
│      el-checkbox-button-e7af78ea.js
│      el-icon-b1770749.css
│      el-input-0e5cd2ac.css
│      el-input-e889eba7.js
│      el-popover-0e5f328b.js
│      el-popover-bac8718b.css
│      el-popper-9a16cedc.js
│      el-popper-b17b6765.css
│      el-progress-1f9bfc72.css
│      el-progress-a9598870.js
│      el-tooltip-4ed993c7.js
│
└─自定义的异步组件 ( main-item main-plugins )
     anime_movie-1d5a4054.css
     anime_movie-b74c3921.js
     dance-867f9c31.css
     dance-f6b20d16.js
     manga-174d4520.js
     manga-48453669.css
     selected-ee9e51ae.css
     selected-ff93dfdb.js
```

### file_icon

这是个同步引入的组件，为什么还是被 code split 出来了呢？

详见：https://cn.vitejs.dev/guide/features.html#async-chunk-loading-optimization

> ### 异步 Chunk 加载优化[¶](https://cn.vitejs.dev/guide/features.html#async-chunk-loading-optimization)
>
> 在实际项目中，Rollup 通常会生成 “共用” chunk —— 被**两个或以上**的其他 chunk 共享的 chunk。与动态导入相结合，会很容易出现下面这种场景：
>
> ![image-2023018042121751](vite%E6%9E%84%E5%BB%BA%E5%88%86%E6%9E%90.assets/image-20230108042121751.png)
>
> Entryasync chunk Acommon chunk Casync chunk Bdynamic importdirect import
>
> 在无优化的情境下，当异步 chunk `A` 被导入时，浏览器将必须请求和解析 `A`，然后它才能弄清楚它也需要共用 chunk `C`。这会导致额外的网络往返：
>
> ```
> Entry ---> A ---> C
> ```
>
> Vite 将使用一个预加载步骤自动重写代码，来分割动态导入调用，以实现当 `A` 被请求时，`C` 也将 **同时** 被请求：
>
> ```
> Entry ---> (A + C)
> ```
>
> `C` 也可能有更深的导入，在未优化的场景中，这会导致更多的网络往返。Vite 的优化会跟踪所有的直接导入，无论导入的深度如何，都能够完全消除不必要的往返。



## 2022.1.13

```

```

