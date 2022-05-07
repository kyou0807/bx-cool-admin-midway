/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-16 14:54:30
 * @LastEditTime: 2022-05-06 14:58:13
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
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 描述
 */
@EntityModel('component')
export class ComponentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '', description: '组件id' })
  id: number;

  @Column({ comment: '组件名称', nullable: true })
  @ApiProperty({ example: '', description: '组件名称' })
  name: string;

  @Column({ comment: '组件分类', nullable: true })
  @ApiProperty({ example: '', description: '组件分类' })
  type: string;
}
