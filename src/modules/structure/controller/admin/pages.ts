/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 15:37:02
 * @LastEditTime: 2022-06-17 09:42:12
 */
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolCommException,
} from '@cool-midway/core';
import { PagesEntity } from '../../entity/pages';
import { ProjectEntity } from '../../entity/project';
import { PagesService } from '../../service/pages';
import { Context } from '@midwayjs/koa';
const uuid = require('node-uuid');
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PagesEntity,
  insertParam: ctx => {
    let { json } = ctx.request.body;
    if (!json) {
      return {
        json: '{}',
        uuid: uuid.v4(),
      };
    }
    return {
      uuid: uuid.v4(),
    };
  },
  pageQueryOp: {
    keyWordLikeFields: ['a.name', 'b.name'],
    select: ['a.*', 'b.name AS projectName'],
    join: [
      {
        entity: ProjectEntity,
        alias: 'b',
        condition: 'a.projectUuid = b.uuid',
        type: 'innerJoin',
      },
    ],
    where: async ctx => {
      if (ctx.admin.username == 'admin') {
        return [];
      } else {
        return [
          [
            // 根据人的角色,查询角色对应的项目,查出项目对应的页面
            'a.projectUuid in (select DISTINCT projectUuid from project_role where roleId in (select roleId from base_sys_user_role where userId = :userId))',
            { userId: ctx.admin.userId },
          ],
        ];
      }
    },
  },
})
export class PagesAdminController extends BaseController {
  @Inject()
  pagesService: PagesService;

  @Inject()
  ctx: Context;

  @Post('/getPagesListByProjectUuid', { summary: '根据项目uuid获取页面列表' })
  async getPagesListByProjectUuid(@Body('projectUuid') projectUuid: string) {
    if (!projectUuid) {
      throw new CoolCommException('项目uuid不能为空');
    }
    return this.ok(
      await this.pagesService.getPagesListByProjectUuid(
        projectUuid,
        this.ctx.admin.roleIds
      )
    );
  }

  @Post('/getPageInfoByIdOrUuid', { summary: '根据页面id或者uui获取页面详情' })
  async getPageInfoByIdOrUuid(
    @Body('uuid') uuid: string,
    @Body('id') id: string
  ) {
    if (uuid === undefined && id === undefined) {
      throw new CoolCommException('页面uuid或id不能为空');
    }
    return this.ok(
      await this.pagesService.getPageInfoByIdOrUuid(
        id,
        uuid,
        this.ctx.admin.roleIds
      )
    );
  }
}
