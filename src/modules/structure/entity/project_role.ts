/*
 * @Description:项目角色
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-23 15:36:46
 * @LastEditTime: 2022-04-23 15:38:32
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';

/**
 * 描述
 */
@EntityModel('project_role')
export class ProjectRoleEntity extends BaseEntity {
  @Column({ comment: '项目uuid' })
  projectUuid: string;

  @Column({ comment: '角色ID', type: 'bigint' })
  roleId: number;
}
