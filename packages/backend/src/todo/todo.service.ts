import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable()
export class TodoService {
  private readonly store = new Map<string, Todo>();

  list(): Todo[] {
    return [...this.store.values()].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }

  getById(id: string): Todo | undefined {
    return this.store.get(id);
  }

  create(title: string): Todo {
    const todo: Todo = {
      id: randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.store.set(todo.id, todo);
    return todo;
  }

  update(id: string, data: Partial<Pick<Todo, 'title' | 'completed'>>): Todo | null {
    const todo = this.store.get(id);
    if (!todo) return null;
    const updated: Todo = { ...todo, ...data };
    this.store.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
