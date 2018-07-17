'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 关于我们页面模型
  const AboutSchema = new Schema({
    // 关于我们的文档
    aboutUs: { type: String },
    // 广告合作QQ号
    qqAdvertise: { type: String },
    // 商务合作QQ号
    qqbusiness: { type: String },
    // 服务电话
    servicePhone: { type: String },
    // 常见问题的文档
    commonProblem: { type: String },
    // 免责声明的文档
    statement: { type: String },
  });
  return mongoose.model('About', AboutSchema);
};
