import { Provide, Inject, Get, Post, Body } from '@midwayjs/decorator';
import { CoolController, BaseController, CoolEps } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { CoolFile } from '@cool-midway/file';
import { ValueSetService } from '../../service/sys/valueSet';
import { Utils } from '../../../../comm/utils';
/**
 * 不需要登录的后台接口
 */
@Provide()
@CoolController()
export class BaseAppCommController extends BaseController {
  @Inject()
  coolFile: CoolFile;

  @Inject()
  valueSetService: ValueSetService;

  @Inject()
  ctx: Context;

  @Inject()
  eps: CoolEps;

  @Inject()
  utils: Utils;

  /**
   * 实体信息与路径
   * @returns
   */
  @Get('/eps', { summary: '实体信息与路径' })
  public async getEps() {
    return this.ok(this.eps.app);
  }

  /**
   * 文件上传
   */
  @Post('/upload', { summary: '文件上传' })
  async upload() {
    return this.ok(await this.coolFile.upload(this.ctx));
  }

  @Post('/getValueSetByEname', { summary: '根据ename获取值集' })
  async getValueSetByEname(@Body('ename') ename: string) {
    let list = await this.valueSetService.getValueSetByEname({ ename });
    return this.ok(
      this.utils.getTree(
        list.map(item => {
          delete item.createTime;
          delete item.updateTime;
          return item;
        })
      )
    );
  }

  /**
   * 文件上传模式，本地或者云存储
   */
  @Get('/uploadMode', { summary: '文件上传模式' })
  async uploadMode() {
    return this.ok(await this.coolFile.getMode());
  }
}
