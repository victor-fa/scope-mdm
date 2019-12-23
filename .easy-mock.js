// .easy-mock.js  自动生成命令 easymock init .
module.exports = {
  output: "api", // 产出到项目下的 api 目录，不用手动创建
  template: "axios", // 基于 easy-mock-templates 提供的 axios 模板
  projects: [
    {
      id: "5ab30a8c196746052ecd4975", // easymock项目id 例：58fef6ac5e43ae5dbea5eb53
      name: "user", // 该项目下的 API 生成之后会被放到项目 api/user 目录下
      white: [
        "/equipmentModel" // 只生成 xx 接口
      ]
    }
  ]
};