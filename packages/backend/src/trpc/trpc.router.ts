import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TodoRouter } from '../todo/todo.router';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly todoRouter: TodoRouter,
  ) {}

  // TypeScript infers the full procedure type graph from here — this is what
  // the frontend imports as `AppRouter` for end-to-end type safety.
  readonly appRouter = this.trpc.router({
    todo: this.todoRouter.router,
  });
}

export type AppRouter = InstanceType<typeof TrpcRouter>['appRouter'];
