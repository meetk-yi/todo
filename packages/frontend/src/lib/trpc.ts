import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '@todo-trpc/backend';

// The AppRouter type imported above is ONLY a type — it is erased at build
// time. At runtime the frontend just talks HTTP to localhost:3000/trpc.
// tRPC's value: the compiler guarantees every call matches the backend schema.
export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});
