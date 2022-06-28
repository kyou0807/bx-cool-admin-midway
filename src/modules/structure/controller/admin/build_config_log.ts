import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { BuildConfigLogEntity } from '../../entity/build_config_log';
/**
 * 描述
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BuildConfigLogEntity,
  pageQueryOp: {
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
export class BuildConfigLogController extends BaseController {}
