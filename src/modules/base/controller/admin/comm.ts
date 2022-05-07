import {
  Provide,
  Inject,
  Get,
  Post,
  Body,
  ALL,
  Query,
} from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolCommException,
} from '@cool-midway/core';
import { BaseSysUserEntity } from '../../entity/sys/user';
import { BaseSysLoginService } from '../../service/sys/login';
import { BaseSysPermsService } from '../../service/sys/perms';
import { BaseSysUserService } from '../../service/sys/user';
import { Context } from '@midwayjs/koa';
import { CoolFile } from '@cool-midway/file';
import { ApiTags, ApiResponse } from '@midwayjs/swagger';
const fs = require('fs');

const path = require('path');
const uuid = require('node-uuid');
const _ = require('lodash');
/**
 * Base 通用接口 一般写不需要权限过滤的接口
 */

@Provide()
@CoolController()
@ApiTags(['comm'])
export class BaseCommController extends BaseController {
  @Inject()
  baseSysUserService: BaseSysUserService;

  @Inject()
  baseSysPermsService: BaseSysPermsService;

  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @Inject()
  ctx: Context;

  @Inject()
  coolFile: CoolFile;

  @Inject()
  baseDir;

  /**
   * 获得个人信息
   */
  @Get('/person', { summary: '个人信息' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: BaseSysUserEntity,
  })
  async person() {
    return this.ok(await this.baseSysUserService.person());
  }

  /**
   * 修改个人信息
   */
  @Post('/personUpdate', { summary: '修改个人信息' })
  async personUpdate(@Body(ALL) user: BaseSysUserEntity) {
    await this.baseSysUserService.personUpdate(user);
    return this.ok();
  }

  /**
   * 权限菜单
   */
  @Get('/permmenu', { summary: '权限与菜单' })
  async permmenu() {
    return this.ok(
      await this.baseSysPermsService.permmenu(this.ctx.admin.roleIds)
    );
  }

  /**
   * 文件上传
   */

  @Get('/downloadDist', { summary: '文件下载' })
  async downloadDist(@Query() data) {
    let buildProjectPath = path.join(this.baseDir, '../', data.downLoadUrl);
    const Size = fs.statSync(buildProjectPath).size;
    const createReadStream = await fs.createReadStream(buildProjectPath);
    this.ctx.set('Content-disposition', 'attachment; filename=dist.zip');
    this.ctx.set('Content-type', 'application/force-download');
    this.ctx.set('Content-Length', Size);
    this.ctx.body = createReadStream;
  }

  /**
   * 文件上传
   */
  @Post('/upload', { summary: '文件上传' })
  async upload() {
    if (_.isEmpty(this.ctx.files)) {
      throw new CoolCommException('上传文件为空');
    }
    // 这里的改造是因为前台的组件有bug,会传递过来一个带路径的文件名,所以这里要去掉路径
    const { key } = this.ctx.fields;
    if (key) {
      if (key.indexOf('app/') > 0) {
        this.ctx.fields.key = key.replace('app/', '');
      }
    } else {
      const file = this.ctx.files[0];
      const suffix = file.filename.split('.').pop();
      this.ctx.fields.key = uuid.v4() + '.' + suffix;
    }

    return this.ok(await this.coolFile.upload(this.ctx));
  }

  /**
   * 文件上传模式，本地或者云存储
   */
  @Get('/uploadMode', { summary: '文件上传模式' })
  async uploadMode() {
    return this.ok(await this.coolFile.getMode());
  }

  /**
   * 退出
   */
  @Post('/logout', { summary: '退出' })
  async logout() {
    await this.baseSysLoginService.logout();
    return this.ok();
  }
}
