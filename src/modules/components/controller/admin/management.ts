/*
 * @Description:组件列表
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-16 14:35:36
 * @LastEditTime: 2022-04-16 14:37:28
 */
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { ComponentEntity } from '../../entity/main/component';
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ComponentEntity,
})
export class componentsAdminController extends BaseController {}
