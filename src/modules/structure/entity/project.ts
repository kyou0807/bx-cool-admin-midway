/*
 * @Description:项目管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 09:33:51
 * @LastEditTime: 2022-04-22 15:20:04
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
const uuid = require('node-uuid');
/**
 * 描述
 */
@EntityModel('project')
export class ProjectEntity extends BaseEntity {
  @Column({ comment: '项目名称' })
  name: string;

  @Column({ comment: '项目描述' })
  description: string;

  @Column({ comment: '项目ID', default: uuid.v1() })
  uuid: string;

  @Column({ comment: '创建人' })
  userId: number;

  // 页面列表
  pagesList: string[];

  // 角色ID列表 哪些角色能看到这个项目,默认为创建者的角色
  roleIdList: number[];
}
