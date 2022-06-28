import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column, Index } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 描述
 */
@EntityModel('build_config_log')
export class BuildConfigLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '任务ID', nullable: true, type: 'bigint' })
  @ApiProperty({ example: '', description: '任务ID' })
  taskId: number;

  @Column({ comment: '状态 0:失败 1：成功', default: 0, type: 'tinyint' })
  @ApiProperty({ example: '', enum: [0, 1], description: '状态' })
  status: number;

  @Column({ comment: '详情描述', nullable: true, type: 'text' })
  @ApiProperty({ example: '', description: '详情描述' })
  detail: string;

  @Column({ comment: '下载地址', type: 'text' })
  @ApiProperty({ example: '', description: '下载地址' })
  downloadUrl: string;
}
