'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 用户登录
  async login() {
    const ctx = this.ctx;
    // 判断传参是否为空
    try {
      const res = await ctx.service.user.login();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async reg() { // 用户注册
    const ctx = this.ctx;
    try {
      const res = await ctx.service.user.reg();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }
  
  async retrieve() { // 用户找回密码
    const ctx = this.ctx;
    try {
      const res = await ctx.service.user.retrieve();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getSmsCode() { // 获取手机验证码
    const ctx = this.ctx;
    try {
      const res = await ctx.service.user.getSmsCode();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async selectToken() { // 加入或取消自选Token
    const ctx = this.ctx;
    try {
      const res = await ctx.service.user.selectToken();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  // 管理后台用户相关接口 -------------------------------------------------
  async adminLogin() { // 管理员登录
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.adminLogin();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async adminLogout() { // 管理员注销
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.adminLogout();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getUserList() { // 获取用户列表
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.getUserList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getUserInfo() { // 获取用户详细信息
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.getUserInfo();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async changeUserStatus() { // 更改用户状态
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.changeUserStatus();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async removeUser() { // 更改用户状态
    const ctx = this.ctx;
    const id = ctx.request.body.id;
    const password = ctx.request.body.password;
    const res = await ctx.service.admin.removeUser(id, password);
    ctx.body = res;
  }

  // 管理后台管理员相关接口 -------------------------------------------------
  async getAdminList() { // 获取管理列表
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.getAdminList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async addAdmin() { // 新增管理员
    const ctx = this.ctx;
    try {
      const res = await ctx.service.admin.addAdmin();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getUserTokenList() { // 获取用户自选Token名单
    const ctx = this.ctx;
    try {
      const res = await ctx.service.user.getUserTokenList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }
}

module.exports = UserController;
