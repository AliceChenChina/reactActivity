# Elegant React

致力于构建一个开箱即用的、功能丰富且无副作用的、无侵入少耦合方便裁剪的、能够提高开发效率的、轻盈优雅的`React`项目模板。

## Usage

```shell
# 安装依赖
npm install # or `yarn`
# 安装joyer-cli
npm install joyer-cli -g

# 安装joyer组件
joyer install

# 开发模式
npm start # or `yarn start`

# 打包构建
joyer build [name]

# 部署至预发环境
joyer deploy
```

## Propaedeutics

- `mobx` 
    
    状态管理（[查看文档](https://github.com/mobxjs/mobx)）

- `stylus` 
    
    CSS预处理语言（[查看文档](http://stylus-lang.com/)）


## Features

### 依赖按需加载

- babel-polyfill按浏览器支持程度及代码中所使用的API打包，并非全量打入

### 支持history路由模式，自动打包入口html文件至各个路由目录

- config.useHistory = true 后开启该功能，注意router要和目录对应，如`/a`路由要对应`src/pages/a`目录

- 暂时不支持二级或更深层路由，建议用名称代替更深层路由：
```
|-- src
|   |-- pages
|       |-- user        for /user
|       |-- userInfo    for /user/info
```

------------

## Hierarchy

```
|-- dist                                            // 编译产出目录
|-- joyer-components                                // 模板组件库，通过joyer install安装及更新，一般不要动里面代码
|
|-- src                                             // 源码目录
|   |-- components                                  // 组件目录
|   |-- styles                                      // 公共css文件、字体文件
|   |   |-- main.styl                               // 全局样式
|   |   |-- mixins.styl                             // 变量与mixin（使用@require引入）
|   |   |-- transitions.styl                        // 过渡与动画相关
|   |
|   |-- modules                                     // 通用js模块
|   |   |-- api.js                                  // 接口调用封装
|   |   |-- controller.js                           // 通用行为封装
|   |   |-- share-utils.js                          // 分享相关封装
|   |   |-- utils.js                                // 工具类函数封装
|   |
|   |-- assets                                      // 资产目录
|   |   |-- images                                  // 图片目录
|   |
|   |-- pages                                       // 视图目录
|   |   |-- index                                   // 页面资源目录
|   |       |-- index.vue
|   |       |-- index.styl
|   |
|   |-- App.vue                                     // 根组件
|   |-- index.html                                  // 入口html文件
|   |-- main.js                                     // 入口js文件
|   |-- router.jsx                                   // 路由
|
|-- .gitignore                                      // git忽略配置
|-- joyer-config.js                                 // joyer配置文件
```
