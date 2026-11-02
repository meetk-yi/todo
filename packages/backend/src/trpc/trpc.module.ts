import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { TodoRouter } from '../todo/todo.router';
import { TodoService } from '../todo/todo.service';

@Module({
  providers: [TrpcService, TrpcRouter, TodoRouter, TodoService],
})
export class TrpcModule implements NestModule {
  constructor(private readonly trpcRouter: TrpcRouter) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        createExpressMiddleware({
          router: this.trpcRouter.appRouter,
          createContext: () => ({}),
        }),
      )
      .forRoutes('trpc');
  }
}
