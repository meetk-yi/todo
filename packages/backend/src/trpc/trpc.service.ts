import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';

@Injectable()
export class TrpcService {
  private readonly t = initTRPC.create();

  // Expose primitives so routers can build procedures without re-initialising tRPC
  readonly procedure = this.t.procedure;
  readonly router = this.t.router;
}
