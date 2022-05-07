import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 菜单
 */
@EntityModel('base_sys_menu')
export class BaseSysMenuEntity extends BaseEntity {
  @Column({ comment: '父菜单ID', type: 'bigint', nullable: true })
  @ApiProperty({ example: '1', description: '父菜单ID' })
  parentId: number;

  @Column({ comment: '菜单名称' })
  @ApiProperty({ example: '菜单A', description: '菜单名称' })
  name: string;

  @Column({ comment: '菜单地址', nullable: true })
  @ApiProperty({ example: 'home', description: '菜单地址' })
  router: string;

  @Column({ comment: '权限标识', nullable: true })
  @ApiProperty({ example: '', description: '权限标识' })
  perms: string;

  @Column({
    comment: '类型 0：目录 1：菜单 2：按钮',
    default: 0,
    type: 'tinyint',
  })
  @ApiProperty({
    example: 0,
    enum: [0, 1, 2],
    description: '权限标识',
  })
  type: number;

  @Column({ comment: '图标', nullable: true })
  @ApiProperty({ example: '', description: '图标' })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  @ApiProperty({ example: '', description: '排序' })
  orderNum: number;

  @Column({ comment: '视图地址', nullable: true })
  @ApiProperty({ example: '', description: '视图地址' })
  viewPath: string;

  @Column({ comment: '路由缓存', default: true })
  @ApiProperty({ example: '', description: '路由缓存' })
  keepAlive: boolean;

  // 父菜单名称
  @ApiProperty({ example: '', description: '父菜单名称' })
  parentName: string;

  @Column({ comment: '是否显示', default: true })
  @ApiProperty({ example: true, description: '是否显示' })
  isShow: boolean;
}
