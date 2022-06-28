/*
 * @Description:
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-23 15:41:18
 * @LastEditTime: 2022-06-27 17:22:45
 */
import { Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { ProjectRoleEntity } from '../entity/project_role';
import { ProjectEntity } from '../entity/project';
import { TaskInfoEntity } from '../../task/entity/info';
import { BaseSysUserRoleEntity } from '../../base/entity/sys/user_role';
import { BuildProjectConfigEntity } from '../entity/build_project_config';
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

  @InjectEntityModel(BuildProjectConfigEntity)
  buildProjectConfigEntity: Repository<BuildProjectConfigEntity>;

  @InjectEntityModel(BaseSysUserRoleEntity)
  baseSysUserRoleEntity: Repository<BaseSysUserRoleEntity>;

  /**
   * 项目新增
   */
  async add(param) {
    let { roleIdList, cmd } = param;
    if (!roleIdList) {
      // 没有角色列表,就去查当前用户的角色
      let userRoleList = await this.baseSysUserRoleEntity.find({
        userId: param.userId,
      });
      if (userRoleList) {
        param.roleIdList = userRoleList.map(item => item.roleId);
      } else {
        throw new CoolCommException('没有找到该用户的角色');
      }
    }
    // 保存项目
    await this.projectEntity.save(param);

    // 更新项目角色表
    await this.updateProjectRole(param);

    // 创建一个打包配置,用于打包发布
    let buildProjectConfig = await this.buildProjectConfigEntity.save({
      projectUuid: param.uuid,
      cmd,
      buildType: 0,
    });
    param.taskId = buildProjectConfig.id;

    await this.projectEntity.save(param);
    return param;
  }

  async delete(ids) {
    let idArr;
    if (ids instanceof Array) {
      idArr = ids;
    } else {
      idArr = ids.split(',');
    }
    for (const id of idArr) {
      let info = await this.projectEntity.findOne({ id });
      if (info) {
        // 删除项目打包配置表
        await this.buildProjectConfigEntity.delete({ id: info.taskId });
        // 删除项目表
        await this.projectEntity.delete({ id });
        // 删除项目所属角色表
        await this.projectRoleEntity.delete({ projectUuid: info.uuid });
      } else {
        throw new CoolCommException('没有找到该项目');
      }
    }
  }

  async update(param) {
    let { roleIdList, cmd } = param;
    // 保存项目
    await this.projectEntity.save(param);
    if (roleIdList) {
      // 更新项目角色表
      await this.updateProjectRole(param);
    }
    // 修改打包命令
    await this.buildProjectConfigEntity.save({
      id: param.taskId,
      cmd,
    });
    return param;
  }

  async info(id) {
    let info = await this.projectEntity.findOne({ id });
    let config = await this.buildProjectConfigEntity.findOne({
      id: info.taskId,
    });
    try {
      const projectRole = await this.nativeQuery(
        'select a.roleId from project_role a where a.projectUuid = ?',
        [info.uuid]
      );
      if (info && projectRole) {
        info.roleIdList = projectRole.map(item => parseInt(item.roleId));
      }
    } catch (error) {
      console.log('error: ', error);
    }
    return {
      ...info,
      cmd: config.cmd,
    };
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
