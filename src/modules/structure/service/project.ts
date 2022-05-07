/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-23 15:41:18
 * @LastEditTime: 2022-04-28 16:08:06
 */
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { ProjectRoleEntity } from '../entity/project_role';
import { ProjectEntity } from '../entity/project';
import { TaskInfoEntity } from '../../task/entity/info';
/**
 * 描述
 */
@Provide()
export class ProjectService extends BaseService {
  @InjectEntityModel(ProjectEntity)
  projectEntity: Repository<ProjectEntity>;

  @InjectEntityModel(ProjectRoleEntity)
  projectRoleEntity: Repository<ProjectRoleEntity>;

  @InjectEntityModel(TaskInfoEntity)
  taskInfoEntity: Repository<TaskInfoEntity>;

  /**
   * 项目新增
   */
  async add(param) {
    // 保存项目
    await this.projectEntity.save(param);

    // 更新项目角色表
    await this.updateProjectRole(param);

    // 创建一个任务,用于打包发布
    let taskInfo = await this.taskInfoEntity.save({
      every: 1000,
      limit: 1,
      name: `${param.name}-项目打包`,
      remark: `${param.name}-项目打包`,
      service: `taskSystemService.buildProjectByUuid("${param.uuid}")`,
      status: 0,
      taskType: 1,
      type: 1,
    });
    console.log('taskInfo: ', taskInfo);
    console.log('param: ', param);
    param.taskId = taskInfo.id;

    await this.projectEntity.save(param);

    return param;
  }

  async update(param) {
    // 保存项目
    await this.projectEntity.save(param);
    // 更新项目角色表
    await this.updateProjectRole(param);
    return param;
  }

  async info(id) {
    let info = await this.projectEntity.findOne({ id });
    const projectRole = await this.nativeQuery(
      'select a.roleId from project_role a where a.projectUuid = ?',
      [info.uuid]
    );
    if (info && projectRole) {
      info.roleIdList = projectRole.map(item => parseInt(item.roleId));
    }

    return info;
  }

  /**
   * @description: 根据project 来更新项目角色表
   * @param {*} project
   * @return {*}
   * @author: 池樱千幻
   */
  async updateProjectRole(project) {
    await this.projectRoleEntity.delete({ projectUuid: project.uuid });
    if (project.roleIdList) {
      for (const roleId of project.roleIdList) {
        await this.projectRoleEntity.save({
          projectUuid: project.uuid,
          roleId,
        });
      }
    }
  }
}
