/*
 * @Description:接口管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-22 15:38:39
 * @LastEditTime: 2022-04-22 15:38:40
 */
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { InterfaceEntity } from '../../entity/interface';
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: InterfaceEntity,
})
export class InterfaceAdminController extends BaseController {}
