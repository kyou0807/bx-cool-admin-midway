/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-20 17:18:02
 * @LastEditTime: 2022-05-06 12:26:01
 */
/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-20 17:00:53
 * @LastEditTime: 2022-04-20 17:11:04
 */
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 描述
 */
@EntityModel('value_set')
export class valueSetEntity extends BaseEntity {
  @Column({ comment: '值集分类中文名称' })
  @ApiProperty({ example: '中文', description: '值集中文名' })
  cname: string;

  @Column({ comment: '值集分类英文名称' })
  @ApiProperty({ example: 'en', description: '值集分类英文名称' })
  ename: string;

  @Column({ comment: '值集内容' })
  @ApiProperty({ example: '1', description: '值集内容' })
  value: string;

  @Column({ comment: '值集标题' })
  @ApiProperty({ example: 'title', description: '值集标题' })
  title: string;

  @Column({ comment: '值集对应的pid', default: 0 })
  @ApiProperty({ example: '0', description: '值集对应的pid' })
  pid: number;
}
