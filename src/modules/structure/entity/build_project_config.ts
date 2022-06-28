import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';
import { ApiProperty } from '@midwayjs/swagger';
const uuid = require('node-uuid');

/**
 * 描述
 */
@EntityModel('build_project_config')
export class BuildProjectConfigEntity extends BaseEntity {
  @Column({ comment: '配置ID', default: uuid.v1() })
  @ApiProperty({ example: '', description: '配置ID' })
  uuid: string;

  @Column({ comment: '配置所属的项目的uuid' })
  @ApiProperty({ example: '', description: '配置所属的项目的uuid' })
  projectUuid: string;

  @Column({ comment: '打包命令' })
  @ApiProperty({ example: 'npm run build', description: '打包命令' })
  cmd: string;

  @Column({ comment: '当前状态 0:停止 1:进行中', default: 0, type: 'tinyint' })
  @ApiProperty({ example: '', enum: [0, 1], description: '状态' })
  buildType: number;
}
