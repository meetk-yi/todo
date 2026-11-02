import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TrpcService } from '../trpc/trpc.service';
import { TodoService } from './todo.service';

@Injectable()
export class TodoRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly todoService: TodoService,
  ) {}

  // Parameter properties are assigned before field initializers, so
  // `this.trpc` and `this.todoService` are available here.
  readonly router = this.trpc.router({
    list: this.trpc.procedure
      .query(() => this.todoService.list()),

    getById: this.trpc.procedure
      .input(z.object({ id: z.string().uuid() }))
      .query(({ input }) => {
        const todo = this.todoService.getById(input.id);
        if (!todo) throw new TRPCError({ code: 'NOT_FOUND', message: 'Todo not found' });
        return todo;
      }),

    create: this.trpc.procedure
      .input(z.object({ title: z.string().min(1).max(200).trim() }))
      .mutation(({ input }) => this.todoService.create(input.title)),

    update: this.trpc.procedure
      .input(
        z.object({
          id: z.string().uuid(),
          title: z.string().min(1).max(200).trim().optional(),
          completed: z.boolean().optional(),
        }),
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        const todo = this.todoService.update(id, data);
        if (!todo) throw new TRPCError({ code: 'NOT_FOUND', message: 'Todo not found' });
        return todo;
      }),

    delete: this.trpc.procedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(({ input }) => {
        const deleted = this.todoService.delete(input.id);
        if (!deleted) throw new TRPCError({ code: 'NOT_FOUND', message: 'Todo not found' });
        return { id: input.id };
      }),
  });
}
