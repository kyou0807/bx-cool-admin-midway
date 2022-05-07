/*
 * @Description:系统任务
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-27 14:24:57
 * @LastEditTime: 2022-05-04 16:19:33
 */
import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { ILogger } from '@midwayjs/logger';
import { InjectEntityModel } from '@midwayjs/orm';
import { ProjectEntity } from '../../structure/entity/project';
import { PagesEntity } from '../../structure/entity/pages';
import { Repository } from 'typeorm';
import { FileTools } from '../../../comm/fileTools';
const path = require('path');
/**
 * 描述
 */
@Provide()
export class TaskSystemService extends BaseService {
  @Logger()
  logger: ILogger;

  @InjectEntityModel(ProjectEntity)
  projectEntity: Repository<ProjectEntity>;

  @InjectEntityModel(PagesEntity)
  pagesEntity: Repository<PagesEntity>;

  @Inject()
  fileTools: FileTools;

  @Inject()
  baseDir;

  /**
   * 描述
   */
  async test() {
    this.logger.info('我被调用了');
    return '任务执行成功';
  }

  /**
   * 清除项目
   */
  async cleanProject() {
    this.logger.info('清除项目');
    return '删除成功';
  }

  setTime() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('错误');
      }, 10000);
    });
  }

  /**
   * 根据项目id,进行打包
   */
  async buildProjectByUuid(uuid) {
    let project = await this.projectEntity.findOne({ uuid });
    console.log('project: ', project);
    this.fileTools.createdFolder(`buildProject/${project.uuid}`);
    let zipPath = `buildProject/${project.uuid}/dist-${+new Date()}.zip`;
    await this.fileTools.zipFile(
      path.join(this.baseDir, '../', 'buildProject/dist'),
      path.join(this.baseDir, '../', zipPath)
    );

    let pagesList = await this.pagesEntity.find({ projectUuid: uuid });
    if (pagesList.length > 0) {
      await this.setTime();
      return { msg: '构建成功', downLoadUrl: zipPath };
    } else {
      throw { message: '该项目没有页面,构建失败' };
    }
  }
}
