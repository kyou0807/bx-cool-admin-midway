import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
  Config,
  OnWSDisConnection,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/socketio';
import { socketType } from './socketType';
import * as jwt from 'jsonwebtoken';
import { CacheManager } from '@midwayjs/cache';
/**
 * 测试
 */
@WSController('/bxAdmin')
export class BaseController {
  @Inject()
  ctx: Context;

  @Config('module.base')
  jwtConfig;

  @Inject()
  cacheManager: CacheManager;

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('socket连接成功,客户端id为: ', this.ctx.id);
    let token = this.ctx.handshake.auth.token;
    let userInfo = null;
    try {
      userInfo = jwt.verify(token, this.jwtConfig.jwt.secret);
    } catch (error) {}
    if (!userInfo) {
      this.ctx.emit(
        socketType.close,
        `token校验失败,客户端:${this.ctx.id},断开连接!`
      );
      this.ctx.disconnect();
      console.log('token校验失败,客户端:', this.ctx.id, ',断开连接!');
      return;
    }

    let clientIdList: Array<String> = await this.cacheManager.get(
      `socket:${userInfo.userId}`
    );
    if (clientIdList) {
      clientIdList.push(this.ctx.id);
    } else {
      clientIdList = [this.ctx.id];
    }
    await this.cacheManager.set(`socket:${userInfo.userId}`, clientIdList);
    console.log(
      'socket连接成功,客户端数量为: ',
      this.ctx.app.engine.clientsCount
    );
    this.ctx.emit(socketType.success, {
      clientsCount: this.ctx.app.engine.clientsCount,
      msg: '连接成功',
      clientId: this.ctx.id,
    });
  }

  @OnWSMessage(socketType.client)
  async gotMessage(userInfo) {
    console.log('客户端回执消息:', userInfo, 'id:', this.ctx.id);
    await this.cacheManager.set(`socket:${userInfo.id}`, [this.ctx.id]);
  }

  @OnWSDisConnection()
  async disConnection(data) {
    console.log('客户端', this.ctx.id, '已断开!', data);
  }
}
