/*
 * @Description:接口管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 14:36:32
 * @LastEditTime: 2022-04-22 15:21:28
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
const uuid = require('node-uuid');

/**
 * 描述
 */
@EntityModel('interface')
export class InterfaceEntity extends BaseEntity {
  @Column({ comment: '接口名称' })
  name: string;

  @Column({ comment: '接口url' })
  url: string;

  @Column({ comment: '接口ID', default: uuid.v1() })
  uuid: string;

  @Column({ comment: '接口参数', type: 'json' })
  params: string;

  @Column({ comment: '项目uuid' })
  projectUuid: string;
}
