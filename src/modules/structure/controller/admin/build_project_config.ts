import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolCommException,
} from '@cool-midway/core';
import { BuildProjectConfigEntity } from '../../entity/build_project_config';
import { BuildProjectConfigService } from '../../service/build_project_config';
import { Context } from '@midwayjs/koa';

/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BuildProjectConfigEntity,
})
export class BuildProjectConfigController extends BaseController {
  @Inject()
  buildProjectConfigService: BuildProjectConfigService;

  @Inject()
  ctx: Context;

  @Post('/build', { summary: '触发打包项目' })
  async build(@Body('id') id: string) {
    if (!id) {
      throw new CoolCommException('任务id不能为空');
    }
    return this.ok(
      await this.buildProjectConfigService.build(id, this.ctx.admin.roleIds)
    );
  }
}
