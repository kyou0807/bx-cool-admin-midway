/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-24 13:18:37
 * @LastEditTime: 2022-06-28 11:08:57
 */
import { Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { PagesEntity } from '../entity/pages';
import { ProjectRoleEntity } from '../entity/project_role';

/**
 * 描述
 */
@Provide()
export class PagesService extends BaseService {
  @InjectEntityModel(PagesEntity)
  pagesEntity: Repository<PagesEntity>;

  @InjectEntityModel(ProjectRoleEntity)
  projectRoleEntity: Repository<ProjectRoleEntity>;

  // 根据项目uuid查询页面,要判断用户权限的
  async getPagesListByProjectUuid(projectUuid, roleIdList) {
    // 如果用户是超级管理员,就不进行权限判断
    if (roleIdList.indexOf('1') === -1) {
      // 查询这个项目所属的权限
      let projectRoleList = await this.projectRoleEntity.find({ projectUuid });
      // 与当前用户的权限列表进行交集,如果有就可以查询,如果没有就报错
      let roleList = projectRoleList.filter(v => roleIdList.indexOf(v) > -1);
      if (roleList.length == 0) {
        throw new CoolCommException('您没有权限访问该项目的页面');
      }
    }

    let list = await this.pagesEntity.find({ projectUuid });
    return list.map(item => {
      delete item.json;
      return item;
    });
  }

  async getPageInfoByIdOrUuid(id, uuid, roleIdList) {
    const pagesList = await this.nativeQuery(
      'select * from pages where id =? or uuid =?',
      [id, uuid]
    );
    if (pagesList.length == 0) {
      return {};
    }
    let pagesObj = pagesList[0];

    // 如果用户是超级管理员,就不进行权限判断
    if (roleIdList.indexOf('1') === -1) {
      // 查询这个项目所属的权限
      let projectRoleList = await this.projectRoleEntity.find({
        projectUuid: pagesObj.projectUuid,
      });
      // 与当前用户的权限列表进行交集,如果有就可以查询,如果没有就报错
      let roleList = projectRoleList.filter(v => roleIdList.indexOf(v) > -1);
      if (roleList.length == 0) {
        throw new CoolCommException('您没有权限访问该项目的页面');
      }
    }
    // bolb字段转string
    pagesObj.json = pagesObj.json.toString('utf-8');
    return pagesObj;
  }
}
