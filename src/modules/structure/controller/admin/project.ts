/*
 * @Description:项目管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 15:35:51
 * @LastEditTime: 2022-04-28 13:02:33
 */
import { Provide, Inject } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { ProjectEntity } from '../../entity/project';
import { BaseSysUserEntity } from '../../../base/entity/sys/user';
import { ProjectService } from '../../service/project';
import { ProjectRoleEntity } from '../../entity/project_role';
import { SelectQueryBuilder } from 'typeorm';
import { BaseSysRoleEntity } from '../../../base/entity/sys/role';
const uuid = require('node-uuid');
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ProjectEntity,
  service: ProjectService,
  insertParam: ctx => {
    return {
      // 获得当前登录的后台用户ID，需要请求头传Authorization参数
      userId: ctx.admin.userId,
      uuid: uuid.v4(),
    };
  },
  listQueryOp: {
    select: [
      'a.id',
      'a.uuid',
      'a.name',
      'a.createTime',
      'b.name AS projectName',
    ],
    join: [
      {
        entity: BaseSysUserEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
        type: 'innerJoin',
      },
      {
        entity: ProjectRoleEntity,
        alias: 'c',
        condition: 'a.uuid = c.projectUuid',
        type: 'leftJoin',
      },
    ],
    where: async ctx => {
      if (ctx.admin.username == 'admin') {
        return [];
      } else {
        return [
          [
            'c.roleId in  (	select roleId from base_sys_user_role  where userId = :userId) ',
            { userId: ctx.admin.userId },
          ],
        ];
      }
    },
    extend: async (find: SelectQueryBuilder<ProjectEntity>) => {
      find.groupBy('a.uuid,a.id,a.NAME,b.NAME');
    },
  },
  pageQueryOp: {
    select: ['a.*', 'b.name AS userName', ' GROUP_CONCAT(d.name) AS roleName'],
    join: [
      {
        entity: BaseSysUserEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
        type: 'innerJoin',
      },
      {
        entity: ProjectRoleEntity,
        alias: 'c',
        condition: 'a.uuid = c.projectUuid',
        type: 'leftJoin',
      },
      {
        entity: BaseSysRoleEntity,
        alias: 'd',
        condition: 'c.roleId = d.id',
        type: 'leftJoin',
      },
    ],
    where: async ctx => {
      if (ctx.admin.username == 'admin') {
        return [];
      } else {
        return [
          [
            'c.roleId in  (	select roleId from base_sys_user_role  where userId = :userId) ',
            { userId: ctx.admin.userId },
          ],
        ];
      }
    },
    extend: async (find: SelectQueryBuilder<ProjectEntity>) => {
      find.groupBy('a.id');
    },
  },
})
export class ProjectAdminController extends BaseController {
  @Inject()
  projectService: ProjectService;
}
