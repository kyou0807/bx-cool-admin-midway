import { App, Inject, MidwayFrameworkType, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BuildProjectConfigEntity } from '../entity/build_project_config';
import { ProjectRoleEntity } from '../entity/project_role';
import { BuildConfigLogEntity } from '../entity/build_config_log';
import { BaseSysUserRoleEntity } from '../../base/entity/sys/user_role';
import { CacheManager } from '@midwayjs/cache';
import { socketType } from '../../../socket/socketType';
import { Application as SocketApplication } from '@midwayjs/socketio';
import * as _ from 'lodash';
import { PagesEntity } from '../entity/pages';
/**
 * 描述
 */
@Provide()
export class BuildProjectConfigService extends BaseService {
  @InjectEntityModel(BuildProjectConfigEntity)
  buildProjectConfigEntity: Repository<BuildProjectConfigEntity>;

  @InjectEntityModel(ProjectRoleEntity)
  projectRoleEntity: Repository<ProjectRoleEntity>;

  @InjectEntityModel(BuildConfigLogEntity)
  buildConfigLogEntity: Repository<BuildConfigLogEntity>;

  @InjectEntityModel(BaseSysUserRoleEntity)
  baseSysUserRoleEntity: Repository<BaseSysUserRoleEntity>;

  @InjectEntityModel(PagesEntity)
  pagesEntity: Repository<PagesEntity>;

  @Inject()
  cacheManager: CacheManager;

  @App(MidwayFrameworkType.WS_IO)
  socketApp: SocketApplication;

  async build(id, roleIdList) {
    console.log('taskid: ', id);

    let buildConfig = await this.buildProjectConfigEntity.findOne({ id });

    let pagesList = await this.pagesEntity.find({
      projectUuid: buildConfig.projectUuid,
    });
    if (pagesList.length == 0) {
      throw new CoolCommException('该项目没有页面,构建失败');
    }

    // 获取项目所属的角色
    let projectRoleList = await this.projectRoleEntity.find({
      projectUuid: buildConfig.projectUuid,
    });
    if (roleIdList.indexOf('1') === -1) {
      // 查询这个项目所属的权限

      // 与当前用户的权限列表进行交集,如果有就可以查询,如果没有就报错
      let roleList = projectRoleList.filter(v => roleIdList.indexOf(v) > -1);
      if (roleList.length == 0) {
        throw new CoolCommException('您没有权限访问该项目的页面');
      }
    }
    if (buildConfig.buildType == 1) {
      throw new CoolCommException('当前项目正在打包,请稍后.');
    }

    //  执行 cmd buildConfig
    if (buildConfig.cmd) {
      // 状态改为进行中
      await this.buildProjectConfigEntity.save({
        ...buildConfig,
        buildType: 1,
      });

      // 打包开始

      setTimeout(async () => {
        // 打包完成 插入数据
        await this.buildConfigLogEntity.save({
          taskId: id,
          status: 1,
          detail: '打包成功!!',
          downloadUrl: '123123123',
        });
        // 修改状态
        await this.buildProjectConfigEntity.save({
          ...buildConfig,
          buildType: 0,
        });

        // 发送消息
        // 角色id列表
        let roleIds = projectRoleList.map(role => role.roleId);
        // 获取对应角色的人员列表.
        let userRoleList = await this.baseSysUserRoleEntity
          .createQueryBuilder()
          .andWhere('roleId in (:roleIds)', {
            roleIds: !_.isEmpty(roleIds) ? roleIds : [null],
          })
          .getMany();
        // 从redis里查询clientId
        let clientIdListPromise = userRoleList.map(userRole => {
          return this.cacheManager.get(`socket:${userRole.userId}`);
        });
        // admin 的账号添加进去
        clientIdListPromise.push(this.cacheManager.get('socket:1'));
        let list = await Promise.all(clientIdListPromise);

        let clientIdsList = [];

        // 数组合并
        list.forEach(l => {
          clientIdsList = clientIdsList.concat(l);
        });
        console.log('clientIdsList: ', clientIdsList);
        // 发送消息
        if (!_.isEmpty(clientIdsList)) {
          this.socketApp
            .of('/bxAdmin')
            .to(clientIdsList)
            .emit(socketType.build_project_success);
        }
      }, 10000);
    }

    console.log('buildConfig: ', buildConfig);

    return '开始打包,请稍后!';
  }
}
