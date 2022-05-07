import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 角色菜单
 */
@EntityModel('base_sys_role_menu')
export class BaseSysRoleMenuEntity extends BaseEntity {
  @Column({ comment: '角色ID', type: 'bigint' })
  @ApiProperty({ example: '1', description: '角色ID' })
  roleId: number;

  @Column({ comment: '菜单ID', type: 'bigint' })
  @ApiProperty({ example: '1', description: '菜单ID' })
  menuId: number;
}
