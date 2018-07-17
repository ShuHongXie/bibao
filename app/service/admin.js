'use strict';

const Service = require('egg').Service;

const bcrypt = require('bcryptjs'); // 密码加密所需bcrypt模块
const crypto = require('crypto'); // 短信验证码账号密码加密

// 前端传过来的RSA密码解密-----BEGIN
const NodeRSA = require('node-rsa');
const key = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCqBa0yw4CxVzN6M91TRzIEsPEt3k/D/iiuCUGE0ujzbBGEmQzv
U829GLPUgrw1RaLYNzjYveKm/NlI3EyHmSRSLygVY0HPAcOXfRl5CA89glEvGCen
aop6QP1pGPGifd3N/S4SReVRT6UL1lOFiBflAe4Scqy/KVYrCLcveeb4XwIDAQAB
AoGANwomuxk+RFVGAoMJsgIz4gA52IRwRAgMuTz2gH4aZWWQTOGS+2L2EQdkfSC5
YXF35GYJZA4hx7cbdr0XlTSb5JUm1eUDHu+JtMQBVXS2qkFSVtq9QEI+iW9SFTrC
b0nLcOwX4TImwJv2xd6jh+V1lg2ge3PwtX6Udezj5KGZ1vECQQC0LKHTm4k0xAoK
xdQ/af1wwYxKvI0sdARHb/mPwyo+NAHyrMw2H77N+pCFuHyK2lwZtQcW+SqMWdpI
VseiMx8nAkEA8ZNIyHNbQE1yTvE/V/yWn0WFYyGAJYr1kXrxbiHiPAjVJhuLjGp2
8y3w1pBMJtsqhBR+am7LwP8sUoROLdogCQJAPCyr34CS0oymzfJEcOl1O7Nop41R
mQcmZrV/JASKlzvHasVLbsgrcZ+9pOt4rOdA21UaiRGupDFeNcrF4eYxAQJABcLo
endd1sPCFSXlx9hrUzMaQkn7P2n3/1c6SNEgDyR6yOThSCEF4zjWRJe+aTLS6cF/
XlR0IY80ZGdpYeiQ2QJAN/5j9z9rFTgmwbGx1886A7PWvWdU7BY5zw1pwghNY55h
5wz8YJ9iYgo3036gqV1TkDuHDAaQUBQM1LAtTpXONw==
-----END RSA PRIVATE KEY-----`); // 私钥
key.setOptions({ encryptionScheme: 'pkcs1' });
// 前端传过来的RSA密码解密-----END

async function checkPwd(pwd, hash) { // 获取登录密码是否与数据库加密密码一致性
  return new Promise((res, rej) => {
    bcrypt.compare(pwd, hash, (err, bool) => {
      if (err) return rej('error');
      res(bool);
    });
  });
}

//  service ------------------------------------
class AdminService extends Service {

  async adminLogin() { // 管理登录
    const ctx = this.ctx;
    const phone = ctx.request.body.phone;
    let password = ctx.request.body.password;
    const data = await ctx.model.User.findOne({ phone });
    let res = {};
    if (!data) {
      ctx.status = 200;
      res = {
        respcode: 200,
        respmsg: '该用户不存在',
      };
      return res;
    }
    if (data.type === 0) {
      ctx.status = 200;
      res = {
        respcode: 200,
        respmsg: '该用户不是管理员',
      };
      return res;
    }
    try {
      password = key.decrypt(password, 'utf-8');
    } catch (e) {
      return {
        respcode: 203,
        respmsg: '密码加密格式错误',
      };
    }
    const login = await checkPwd(password, data.password);

    if (login) {
      ctx.session.id = data.id;
      ctx.session.phone = data.phone;
      ctx.session.name = data.name;
      ctx.session.token = crypto.createHash('md5').update(data.id + new Date() + Math.random()).digest('hex'); // 生成token
      ctx.status = 200;
      res = {
        respcode: 100,
        respmsg: '登录成功',
        data: {
          token: ctx.session.token,
        },
      };
    } else {
      ctx.status = 201;
      res = {
        respcode: 200,
        respmsg: '密码不正确',
      };
    }
    return res;
  }

  async adminLogout() { // 管理注销
    const ctx = this.ctx;
    ctx.session = null;
    ctx.status = 200;
    const res = {
      respcode: 100,
      respmsg: '退出成功',
    };
    return res;
  }

  // 用户列表操作 -------------------------------
  async getUserList() { // 获取用户列表
    const ctx = this.ctx;
    const count = await this.ctx.model.User.find({}).count();
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    const data = await this.ctx.model.User.find({ type: 0 }, {
      _id: 0,
      __v: 0,
      type: 0,
      coinList: 0,
      password: 0,
    })
      .skip((parseInt(page) - 1) * size)
      .limit(parseInt(size));
    const res = {
      respcode: 100,
      respmsg: '获取用户列表成功',
      data: {
        count,
        list: data,
      },
    };
    return res;
  }

  async getUserInfo() { // 根据id获取用户信息
    const ctx = this.ctx;
    const id = ctx.query.id || 1;
    const data = await ctx.model.User.findOne({ id }, {
      _id: 0,
      __v: 0,
      coinList: 0,
      password: 0,
    });
    const res = {
      respcode: 100,
      respmsg: '获取用户列表成功',
      data,
    };
    return res;
  }

  async changeUserStatus() { // 更改用户状态
    const ctx = this.ctx;
    const id = ctx.request.body.id;
    const status = ctx.request.body.status;
    const data = await this.ctx.model.User.update({ id }, { $set: { status } });
    if (data.nModified > 0) {
      return {
        respcode: 100,
        respmsg: '修改用户状态成功',
      };
    }
    return {
      respcode: 200,
      respmsg: '修改用户状态失败',
    };
  }

  async removeUser() { // 删除用户
    let data = await this.ctx.model.User.findOne({ id: this.ctx.session.id });
    console.log(data);
    data = await this.ctx.model.User.remove({});
    console.log(data);
  }

  // 管理列表操作 -------------------------------
  async getAdminList() { // 获取管理员列表
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    const count = await ctx.model.User.find({ type: 1 }).count();
    const data = await ctx.model.User.find({ type: 1 }, {
      _id: 0,
      __v: 0,
      type: 0,
      coinList: 0,
      password: 0,
    })
      .skip((parseInt(page) - 1) * size)
      .limit(parseInt(size));
    const res = {
      respcode: 100,
      respmsg: '获取管理列表成功',
      data: {
        count,
        list: data,
      },
    };
    return res;
  }

  async addAdmin() { // 增加管理员
    const ctx = this.ctx;
    const phone = ctx.request.body.phone;
    const pwd = ctx.request.body.password;
    const status = ctx.request.body.status;
    const adminPwd = ctx.request.body.adminPwd;
    const data = await ctx.model.User.findOne({ id: ctx.session.id });
    let res = {};
    // 参数为空
    if (!pwd || !phone || !adminPwd) {
      res = {
        respcode: 200,
        respmsg: '管理员密码不正确',
      };
      return res;
    }
    // 验证管理员密码是否正确
    const flag = await checkPwd(adminPwd, data.password);
    if (!flag) {
      res = {
        respcode: 200,
        respmsg: '管理员密码不正确',
      };
      return res;
    }
    // 新建管理员
    const maxId = await ctx.service.user.getId();
    try {
      const info = await ctx.model.User.create({
        id: maxId == null ? 1 : maxId.id + 1,
        phone,
        password: pwd,
        type: 1,
        status,
        meta: {
          regTime: Date.now(),
        },
      });
      if (info) {
        res = {
          respcode: 100,
          respmsg: '添加管理员成功',
        };
      }
      return res;
    } catch (e) {
      // 错误码11000，phone unique
      if (e.code === 11000) {
        res = {
          respcode: 200,
          respmsg: '已存在该手机号码',
        };
      } else {
        res = {
          respcode: 200,
          respmsg: e,
        };
      }
      ctx.status = 202;
      return res;
    }

  }
}

module.exports = AdminService;
