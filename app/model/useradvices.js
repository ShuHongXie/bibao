'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 用户反馈和建议模型
  const UserAdvicesSchema = new Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    advices: { type: String },
    id: { type: Number },
  });
  return mongoose.model('Useradvices', UserAdvicesSchema);
};
