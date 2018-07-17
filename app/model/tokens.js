'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TokenSchema = new Schema({
    id: { type: Number },
    // 排序用id
    sortId: { type: Number },
    // ico图标大
    icon: { type: String },
    // 中文名
    name: { type: String },
    // 英文名
    en_name: { type: String },
    // 英文缩写
    symbol: { type: String },
    // 总市值
    total_value: { type: Number },
    // 流通数量
    market_num: { type: Number },
    // 总发行量
    max_supply: { type: Number },
    // 美元价格
    price_USD: { type: Number },
    // 人民币价格
    price_CNY: { type: Number },
    // 24h成交量
    volume_24h: { type: Number },
    // 24h成交额
    totol_price_24h: { type: Number },
    // 涨幅1h
    percent_change_1h: { type: Number },
    // 涨幅24h
    percent_change_24h: { type: Number },
    // 涨幅7d
    percent_change_7d: { type: Number },
    // 价格趋势7d
    price_change_7d: { type: Array },
    // 详细信息
    info: {
      updated_time: { type: Date },
      date: { type: String }, // 发行时间
      website: { type: Array }, // 网站
      blocks_web: { type: Array }, // 区块站
      white_boooks: { type: String }, // 白皮书
      remark: { type: String }, // 介绍
    },
    chart_supply_ps: { type: Number },
    chart_circulation_ps: { type: Number },
    chart_turnover_ps: { type: Number },
  });
  return mongoose.model('Token', TokenSchema);
};
