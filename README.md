# 币报后台程序-后端&前端逻辑部分
> 爬虫部分见另一项目

### 开发环境

首次运行

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 生产环境运行

> 服务器运行：以下命令只在linux中生效

```bash
$ npm start
$ npm stop
```

### 币报整站项目技术栈说明

后端：egg.js + mongoDB + redis + nunjucks（服务端模板）
前端：vue.js + vuex + ElementUI + axios

### 运行顺序
前端请求 -> router -> middleWare -> controller -> service

定时任务在schedule文件夹内，自动运行，不过代码要按照规范才可以运行

**定时任务：**

1. exchange_data：获取汇率的定时任务，0点6点12点18点执行

2. token_data：获取代币的行情数据，改写行情数据，5分钟执行一次

3. info_data: 获取代币的价格，并写入一条数据（详情折线图、首页迷你折线图使用）

**middleWare：**

1. admin_handler：判断管理员是否登录，以session中是否存在token为判断依据，并在管理员进行post操作时，写入日志信息

**model：**

Mongoose的模型层，文件内有每个document的名称，这里不做详述

**controller：**

- home：前端页面的控制层，用于获取数据并渲染币报前端页面
- news：前端和后台管理的新闻控制层，用于处理新闻和获取新闻相关信息
- public：公共接口控制层，（上传、网站信息、汇率）
- tokens：币种行情控制层，包括前端和后端
- user：会员相关的控制层，包括前端和后端

**service：**

- admin：管理员的逻辑层，后台管理系统使用
- exchange：汇率的逻辑层，定时器exchange_data使用
- log：管理操作日志的逻辑层，中间件和部分逻辑调用
- news：新闻的逻辑层，前端和后台都有使用
- public：公共逻辑层
- tokens：币种行情的逻辑层，前端和后台都有使用
- user：用户相关，前端和后台都有使用

### 接口说明

**1.返回数据格式**
```json
{
  "respcode": 100, // 状态码
  "respmsg": "获取数据成功", // 返回信息
  "data": {} //数据主题
}
```

**1.http状态码**
- 200：成功
- 202：权限不足
- 203：错误（后台逻辑所能捕捉到的）
- 其余：服务器错误，或未知报错

**1.状态码：**
- 100：成功
- 500：没有权限进入逻辑层（中间件拦截）
- 200：整体流程的最终失败
- 201：数据库获取失败
- 202：未知的失败

