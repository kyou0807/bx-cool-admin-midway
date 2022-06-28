import { App, Inject, Logger } from '@midwayjs/decorator';
import { BaseCoolQueue, CoolQueue } from '@cool-midway/task';
import { TaskInfoService } from '../service/info';
import { Job } from 'bullmq';
import { IMidwayApplication } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
/**
 * 任务
 */
@CoolQueue()
export abstract class TaskInfoQueue extends BaseCoolQueue {
  @App()
  app: IMidwayApplication;

  @Logger()
  logger: ILogger;

  @Inject()
  taskInfoService: TaskInfoService;

  async data(job: Job, done: any): Promise<void> {
    this.logger.info('buildProjectByUuid task start.');
    this.logger.info(job);
    try {
      const result = await this.taskInfoService.invokeService(job.data.service);
      this.taskInfoService.record(job.data, 1, JSON.stringify(result));
    } catch (error) {
      console.log('任务异常: ', error);
      this.taskInfoService.record(job.data, 0, error.message);
    }
    if (!job.data.isOnce) {
      this.taskInfoService.updateNextRunTime(job.data.id);
      this.taskInfoService.updateStatus(job.data.id);
    }
    done();
  }
}
