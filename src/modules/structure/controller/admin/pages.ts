/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 15:37:02
 * @LastEditTime: 2022-08-30 14:56:50
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
const _ = require('lodash');
const fs = require('fs');
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PagesEntity,
  service: PagesService,
  infoIgnoreProperty: ['json'],
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
    select: [
      'a.id',
      'a.height',
      'a.width',
      'a.name',
      'a.projectUuid',
      'a.url',
      'a.uuid',
      'a.createTime',
      'b.name AS projectName',
    ],
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

  /**
   * 文件上传
   */
  @Post('/uploadPageByJson', { summary: '文件上传,数据入库' })
  async upload() {
    if (_.isEmpty(this.ctx.files)) {
      throw new CoolCommException('上传文件为空');
    }

    const file = this.ctx.files[0];
    // 利用临时路径,读取文件
    let fileData = fs.readFileSync(file.data);

    let pages = this.ctx.fields;

    pages.json = fileData.toString();
    pages.id = Number(pages.id);

    return this.ok(await this.pagesService.update(pages));
  }
}
