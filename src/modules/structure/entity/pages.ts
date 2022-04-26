/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 10:52:34
 * @LastEditTime: 2022-04-24 22:34:13
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
const uuid = require('node-uuid');
/**
 * 描述
 */
@EntityModel('pages')
export class PagesEntity extends BaseEntity {
  @Column({ comment: '页面名称' })
  name: string;

  @Column({ comment: '页面ID', default: uuid.v1() })
  uuid: string;

  @Column({ comment: '页面url' })
  url: string;

  @Column({ comment: '宽度' })
  width: number;

  @Column({ comment: '高度' })
  height: number;

  @Column({ comment: '页面json', type: 'json' })
  json: string;

  @Column({ comment: '项目uuid' })
  projectUuid: string;

  // 接口列表
  interfaceList: string[];

  componentsList: string[];
}
