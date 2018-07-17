'use strict';

// {app_root}/app/model/user.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 新闻数据模型
  const NewsSchema = new Schema({
    // 新闻的id
    id: { type: Number, unique: true },
    // 新闻发布者
    author: { type: String },
    // 新闻标题
    title: { type: String },
    // 新闻内容
    content: { type: String },
    // 新闻类型，0：新闻，1：公告
    type: { type: Number },
    // 时间，创建时间，更新时间
    meta: {
      create_date: {
        type: Date,
      },
      updated_date: {
        type: Date,
      },
    },
  });
  return mongoose.model('News', NewsSchema);
};
