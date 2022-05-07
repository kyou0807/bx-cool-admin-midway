/*
 * @Description:项目角色
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-23 15:36:46
 * @LastEditTime: 2022-05-06 15:22:49
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 描述
 */
@EntityModel('project_role')
export class ProjectRoleEntity extends BaseEntity {
  @Column({ comment: '项目uuid' })
  @ApiProperty({ example: '', description: '项目uuid' })
  projectUuid: string;

  @Column({ comment: '角色ID', type: 'bigint' })
  @ApiProperty({ example: '', description: '角色ID' })
  roleId: number;
}
