import {
  App,
  Config,
  Inject,
  Middleware,
  MidwayFrameworkType,
} from '@midwayjs/decorator';
import * as _ from 'lodash';
import { RESCODE } from '@cool-midway/core';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Context } from '@midwayjs/koa';
import { Application as SocketApplication } from '@midwayjs/socketio';
import { IMiddleware, IMidwayApplication } from '@midwayjs/core';
import { CacheManager } from '@midwayjs/cache';
const localRegExp = '|.*/comm/downloadDist';
/**
 * 权限校验
 */
@Middleware()
export class BaseAuthorityMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config('koa.globalPrefix')
  prefix;

  @Config('module.base')
  jwtConfig;

  @Inject()
  cacheManager: CacheManager;

  @App()
  app: IMidwayApplication;

  @App(MidwayFrameworkType.WS_IO)
  socketApp: SocketApplication;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      let statusCode = 200;
      let { url } = ctx;
      url = url.replace(this.prefix, '');
      const token = ctx.get('Authorization');
      const adminUrl = '/admin/';
      // 路由地址为 admin前缀的 需要权限校验
      if (_.startsWith(url, adminUrl)) {
        try {
          ctx.admin = jwt.verify(token, this.jwtConfig.jwt.secret);
          // 校验token是否存在于redis
          const redisToken = await this.cacheManager.get(
            `admin:token:${ctx.admin.userId}`
          );

          // 如果redis中不存在token，则返回登录, 前台token与redis中的token不一致,说明有其他用户登录相同的账号
          if (!redisToken || token !== redisToken) {
            ctx.status = 401;
            ctx.body = {
              code: 999,
              message: '登录失效~',
            };
            return;
          }
        } catch (err) {}
        // 不需要登录 无需权限校验
        if (new RegExp(`^${adminUrl}?.*/open/${localRegExp}`).test(url)) {
          await next();
          return;
        }
        if (ctx.admin) {
          // 超管拥有所有权限
          if (ctx.admin.username == 'admin' && !ctx.admin.isRefresh) {
            await next();
            return;
          }
          // 要登录每个人都有权限的接口
          if (new RegExp(`^${adminUrl}?.*/comm/`).test(url)) {
            await next();
            return;
          }
          // 如果传的token是refreshToken则校验失败
          if (ctx.admin.isRefresh) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效~',
            };
            return;
          }
          // 判断密码版本是否正确
          const passwordV = await this.cacheManager.get(
            `admin:passwordVersion:${ctx.admin.userId}`
          );
          if (passwordV != ctx.admin.passwordVersion) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效~',
            };
            return;
          }
          const rToken = await this.cacheManager.get(
            `admin:token:${ctx.admin.userId}`
          );
          if (!rToken) {
            ctx.status = 401;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: '登录失效或无权限访问~',
            };
            return;
          }
          if (rToken !== token && this.jwtConfig.sso) {
            statusCode = 401;
          } else {
            let perms: string[] = await this.cacheManager.get(
              `admin:perms:${ctx.admin.userId}`
            );
            if (!_.isEmpty(perms)) {
              perms = perms.map(e => {
                return e.replace(/:/g, '/');
              });
              if (!perms.includes(url.split('?')[0].replace('/admin/', ''))) {
                statusCode = 403;
              }
            } else {
              statusCode = 403;
            }
          }
        } else {
          statusCode = 401;
        }
        if (statusCode > 200) {
          ctx.status = statusCode;
          ctx.body = {
            code: RESCODE.COMMFAIL,
            message: '登录失效或无权限访问~',
          };
          return;
        }
      }
      await next();
    };
  }
}
