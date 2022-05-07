/*
 * @Description:日志管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-27 22:51:41
 * @LastEditTime: 2022-04-29 14:28:51
 */
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { TaskLogEntity } from '../../entity/log';
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TaskLogEntity,
  pageQueryOp: {
    // 让title字段支持模糊查询
    where: async ctx => {
      let { taskId } = ctx.request.body;
      if (taskId) {
        return [['a.taskId = :taskId', { taskId }]];
      } else {
        return [];
      }
    },
  },
})
export class TaskLogController extends BaseController {}
