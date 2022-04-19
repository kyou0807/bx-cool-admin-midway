/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-16 14:54:30
 * @LastEditTime: 2022-04-18 14:12:45
 */
/*
 * @Description:组件列表
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-15 17:20:11
 * @LastEditTime: 2022-04-16 14:25:10
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 描述
 */
@EntityModel('component')
export class ComponentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '组件名称', nullable: true })
  name: string;

  @Column({ comment: '组件分类', nullable: true })
  type: string;
}
