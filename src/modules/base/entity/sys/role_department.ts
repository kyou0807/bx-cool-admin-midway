import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 角色部门
 */
@EntityModel('base_sys_role_department')
export class BaseSysRoleDepartmentEntity extends BaseEntity {
  @Column({ comment: '角色ID', type: 'bigint' })
  @ApiProperty({ example: '1', description: '角色ID' })
  roleId: number;

  @Column({ comment: '部门ID', type: 'bigint' })
  @ApiProperty({ example: '1', description: '部门ID' })
  departmentId: number;
}