/*
 * @Description:项目管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 09:33:51
 * @LastEditTime: 2022-05-19 16:02:20
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';
const uuid = require('node-uuid');
/**
 * 描述
 */
@EntityModel('project')
export class ProjectEntity extends BaseEntity {
  @Column({ comment: '项目名称' })
  @ApiProperty({ example: '', description: '项目名称' })
  name: string;

  @Column({ comment: '项目描述', default: '' })
  @ApiProperty({ example: '', description: '项目描述' })
  description: string;

  @Column({ comment: '项目ID', default: uuid.v1() })
  @ApiProperty({ example: '', description: '项目ID' })
  uuid: string;

  @Column({ comment: '创建人' })
  @ApiProperty({ example: '', description: '创建人' })
  userId: number;

  @Column({ comment: '任务id', default: 0 })
  @ApiProperty({ example: '0', description: '任务id' })
  taskId: number;

  // 页面列表
  @ApiProperty({ example: '', description: '页面列表' })
  pagesList: string[];

  // 角色ID列表 哪些角色能看到这个项目,默认为创建者的角色
  @ApiProperty({
    example: '',
    description: '角色ID列表 哪些角色能看到这个项目,默认为创建者的角色',
  })
  roleIdList: number[];
}
