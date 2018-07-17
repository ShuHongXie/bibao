'use strict';
// bcrypt
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    id: { type: Number, unique: true },
    name: { type: String },
    phone: { type: String, unique: true },
    coinList: { type: Object },
    password: { type: String },
    type: { type: Number }, // 0普通会员 1管理员
    status: { type: Number }, // 0禁用 1启用
    meta: {
      regTime: { type: Date },
      prevLogTime: { type: Date },
    },
  });
  return mongoose.model('User', UserSchema);
};
