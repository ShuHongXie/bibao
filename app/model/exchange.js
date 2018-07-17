'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ExchangeSchema = new Schema({
    // 汇率名
    name: { type: String },
    // 排序ID
    sortId: { type: Number },
    // 汇率英文名
    enname: { type: String },
    // 对比美元汇率
    price: { type: String },
    // 更新时间
    date: { type: Date },
  });
  return mongoose.model('Exchange', ExchangeSchema);
};
