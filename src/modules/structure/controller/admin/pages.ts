/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 15:37:02
 * @LastEditTime: 2022-04-25 23:12:36
 */
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { PagesEntity } from '../../entity/pages';
import { ProjectEntity } from '../../entity/project';
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
export class PagesAdminController extends BaseController {}
