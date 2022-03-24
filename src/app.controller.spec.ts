import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';

import { DatabaseModule } from './database';
import { ConfigModule } from './config';

import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, TerminusModule, DatabaseModule],
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get status', () => {
    it('status', async () => {
      const received = await controller.status();
      expect(received).toStrictEqual({
        status: 'ok',
        info: {
          disk: { status: 'up' },
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
          database: { status: 'up' },
          redis: { status: 'up' },
        },
        error: {},
        details: {
          disk: { status: 'up' },
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
          database: { status: 'up' },
          redis: { status: 'up' },
        },
      });
    });
  });
});
