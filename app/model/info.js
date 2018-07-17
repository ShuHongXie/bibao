'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 新闻数据模型
  const InfoSchema = new Schema({
    // 提示
    tip: { type: String },
    // qq二维码
    qq: { type: String },
    // 微信二维码
    wechat: { type: String },
    // 电报群二维码
    telegram: { type: String },
    // email
    email: { type: String },
    // 电话号码
    phone: { type: String },
    // token数量
    tokenNums: { type: Number },
    // 总市值
    values: { type: Number },
    // 24h成交量
    volume: { type: Number },
    // QQ交流群二维码
    qqGroup: { type: String },
    // 微信交流群二维码
    wechatGroup: { type: String },
    // 区域交流群二维码
    regionGroup: { type: String },
    // 商标标识
    trademarkToken: { type: String },
    // 商标
    trademark: [{
      link: String,
      img: String,
      id: Number,
      _id: false,
    }],
    // 首页新闻一
    news1Title: { type: String },
    news1Content: { type: String },
    news1Pic: { type: String },
    news1Id: { type: Number },
    // 首页新闻二
    news2Title: { type: String },
    news2Content: { type: String },
    news2Pic: { type: String },
    news2Id: { type: Number },
    // 首页新闻三
    news3Title: { type: String },
    news3Content: { type: String },
    news3Pic: { type: String },
    news3Id: { type: Number },
  });
  return mongoose.model('Info', InfoSchema);
};
