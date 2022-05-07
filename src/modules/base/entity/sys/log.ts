import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column, Index } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 系统日志
 */
@EntityModel('base_sys_log')
export class BaseSysLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', nullable: true, type: 'bigint' })
  @ApiProperty({ example: '', description: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '行为', length: 100 })
  @ApiProperty({ example: '', description: '行为' })
  action: string;

  @Index()
  @Column({ comment: 'ip', nullable: true, length: 50 })
  @ApiProperty({ example: '', description: 'ip' })
  ip: string;

  @Index()
  @Column({ comment: 'ip地址', nullable: true, length: 50 })
  @ApiProperty({ example: '', description: 'ip地址' })
  ipAddr: string;

  @Column({ comment: '参数', nullable: true, type: 'text' })
  @ApiProperty({ example: '', description: '参数' })
  params: string;
}
