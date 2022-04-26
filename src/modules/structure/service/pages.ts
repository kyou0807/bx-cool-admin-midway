/*
 * @Description:页面管理
 * @Autor: 池樱千幻
 * @Change: 池樱千幻
 * @Date: 2022-04-24 13:18:37
 * @LastEditTime: 2022-04-24 13:26:23
 */
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { PagesEntity } from '../entity/pages';

/**
 * 描述
 */
@Provide()
export class XxxService extends BaseService {
  @InjectEntityModel(PagesEntity)
  pagesEntity: Repository<PagesEntity>;
}
