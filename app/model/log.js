'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 新闻数据模型
  const InfoSchema = new Schema({
    // 操作者id
    id: { type: String },
    // 操作者手机号
    phone: { type: String },
    // 操作行为
    action: { type: String },
    // 操作时间
    date: { type: Date },
  });
  return mongoose.model('Log', InfoSchema);
};
