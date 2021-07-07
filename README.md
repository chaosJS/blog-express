1. app.use
   1. no first params ,then every request will exe that func middle
2. next 中间件
   1. app.use 注册/收集中间件
   2. 遇到 http 请求，根据 path 和 method 判断触发哪个函数
   3. 实现 next，通过 next 触发下一个中间件
3. 手写 express
   1. `lib/my-express.js` 基本实现了 express 的一些核心方法
   2. `lib/test-my-express.js` 写的测试用例
