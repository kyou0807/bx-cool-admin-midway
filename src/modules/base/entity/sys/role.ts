import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column, Index } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 角色
 */
@EntityModel('base_sys_role')
export class BaseSysRoleEntity extends BaseEntity {
  @Column({ comment: '用户ID' })
  @ApiProperty({ example: '123', description: '用户ID' })
  userId: string;

  @Index({ unique: true })
  @Column({ comment: '名称' })
  @ApiProperty({ example: '张三', description: '名称' })
  name: string;

  @Index({ unique: true })
  @Column({ comment: '角色标签', nullable: true, length: 50 })
  @ApiProperty({ example: 'admin', description: '角色标签' })
  label: string;

  @Column({ comment: '备注', nullable: true })
  @ApiProperty({ example: '', description: '备注' })
  remark: string;

  @Column({ comment: '数据权限是否关联上下级', default: 1 })
  @ApiProperty({ example: 1, description: '数据权限是否关联上下级' })
  relevance: number;
}
