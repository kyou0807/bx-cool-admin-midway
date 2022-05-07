import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 任务信息
 */
@EntityModel('task_info')
export class TaskInfoEntity extends BaseEntity {
  @Column({ comment: '任务ID', nullable: true })
  @ApiProperty({ example: '', description: '任务ID' })
  jobId: string;

  @Column({ comment: '任务配置', nullable: true, length: 1000 })
  @ApiProperty({ example: '', description: '任务配置' })
  repeatConf: string;

  @Column({ comment: '名称' })
  @ApiProperty({ example: '', description: '名称' })
  name: string;

  @Column({ comment: 'cron', nullable: true })
  @ApiProperty({ example: '', description: 'cron' })
  cron: string;

  @Column({ comment: '最大执行次数 不传为无限次', nullable: true })
  @ApiProperty({ example: '', description: '最大执行次数 不传为无限次' })
  limit: number;

  @Column({
    comment: '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
    nullable: true,
  })
  @ApiProperty({
    example: '',
    description: '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
  })
  every: number;

  @Column({ comment: '备注', nullable: true })
  @ApiProperty({ example: '', description: '备注' })
  remark: string;

  @Column({ comment: '状态 0:停止 1：运行', default: 1, type: 'tinyint' })
  @ApiProperty({ example: '', enum: [0, 1], description: '状态' })
  status: number;

  @Column({ comment: '开始时间', nullable: true })
  @ApiProperty({ example: '', description: '开始时间' })
  startDate: Date;

  @Column({ comment: '结束时间', nullable: true })
  @ApiProperty({ example: '', description: '结束时间' })
  endDate: Date;

  @Column({ comment: '数据', nullable: true })
  @ApiProperty({ example: '', description: '数据' })
  data: string;

  @Column({ comment: '执行的service实例ID', nullable: true })
  @ApiProperty({ example: '', description: '执行的service实例ID' })
  service: string;

  @Column({ comment: '状态 0:系统 1：用户', default: 0, type: 'tinyint' })
  @ApiProperty({ example: '', enum: [0, 1], description: '状态' })
  type: number;

  @Column({ comment: '下一次执行时间', nullable: true })
  @ApiProperty({ example: '', description: '下一次执行时间' })
  nextRunTime: Date;

  @Column({ comment: '状态 0:cron 1：时间间隔', default: 0, type: 'tinyint' })
  @ApiProperty({ example: '', enum: [0, 1], description: '状态' })
  taskType: number;
}
