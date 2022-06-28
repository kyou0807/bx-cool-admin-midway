/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 10:52:34
 * @LastEditTime: 2022-06-28 10:23:03
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';
const uuid = require('node-uuid');
/**
 * 描述
 */
@EntityModel('pages')
export class PagesEntity extends BaseEntity {
  @Column({ comment: '页面名称' })
  @ApiProperty({ example: '', description: '页面名称' })
  name: string;

  @Column({ comment: '页面ID', default: uuid.v1() })
  @ApiProperty({ example: '', description: '页面ID' })
  uuid: string;

  @Column({ comment: '页面url' })
  @ApiProperty({ example: '', description: '页面url' })
  url: string;

  @Column({ comment: '宽度' })
  @ApiProperty({ example: '', description: '宽度' })
  width: number;

  @Column({ comment: '高度' })
  @ApiProperty({ example: '', description: '高度' })
  height: number;

  @Column({ comment: '页面json', type: 'mediumblob' })
  @ApiProperty({ example: '', description: '页面json' })
  json: string;

  @Column({ comment: '项目uuid' })
  @ApiProperty({ example: '', description: '项目uuid' })
  projectUuid: string;

  // 接口列表
  @ApiProperty({ example: '', description: '接口列表' })
  interfaceList: string[];

  @ApiProperty({ example: '', description: '组件列表' })
  componentsList: string[];
}
