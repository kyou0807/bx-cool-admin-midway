/*
 * @Description:该文件没有项目意义,仅用于导出模型
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-20 17:14:09
 * @LastEditTime: 2022-05-06 15:24:14
 */
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { valueSetEntity } from '../../entity/sys/value_set';
import { BaseSysUserRoleEntity } from '../../entity/sys/user_role';
import { BaseSysRoleEntity } from '../../entity/sys/role';
import { ApiExtraModel } from '@midwayjs/swagger';
import { BaseSysRoleMenuEntity } from '../../entity/sys/role_menu';
import { BaseSysRoleDepartmentEntity } from '../../entity/sys/role_department';
import { BaseSysMenuEntity } from '../../entity/sys/menu';
import { BaseSysDepartmentEntity } from '../../entity/sys/department';
import { ComponentEntity } from '../../../components/entity/main/component';
import { TaskInfoEntity } from '../../../task/entity/info';
import { TaskLogEntity } from '../../../task/entity/log';
import { ProjectEntity } from '../../../structure/entity/project';
import { ProjectRoleEntity } from '../../../structure/entity/project_role';
import { PagesEntity } from '../../../structure/entity/pages';
import { InterfaceEntity } from '../../../structure/entity/interface';

/**
 * 描述
 */
@Provide()
@CoolController()
@ApiExtraModel([
  BaseSysRoleEntity,
  valueSetEntity,
  BaseSysUserRoleEntity,
  BaseSysRoleMenuEntity,
  BaseSysRoleDepartmentEntity,
  BaseSysMenuEntity,
  BaseSysDepartmentEntity,
  ComponentEntity,
  TaskInfoEntity,
  TaskLogEntity,
  ProjectEntity,
  ProjectRoleEntity,
  PagesEntity,
  InterfaceEntity,
])
export class SwaggerController extends BaseController {}
