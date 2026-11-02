# todo-trpc

Minimal full-stack todo app — **NestJS** backend + **React** frontend wired together end-to-end with **tRPC**.

## What tRPC buys you here

The `AppRouter` type is exported from the backend and imported (type-only) in the frontend.  
`createTRPCReact<AppRouter>()` infers every procedure's input and output — so calling `trpc.todo.create.useMutation()` is fully type-checked against the Zod schema in the backend with zero codegen.

## Project structure

```
todo-trpc/
├── packages/
│   ├── backend/          # NestJS — tRPC router mounted at /trpc
│   │   └── src/
│   │       ├── trpc/     # TrpcService (initTRPC), TrpcRouter (appRouter), TrpcModule
│   │       └── todo/     # TodoService (in-memory Map), TodoRouter (procedures)
│   └── frontend/         # Vite + React
│       └── src/
│           ├── lib/trpc.ts   # tRPC + React Query client setup
│           ├── App.tsx       # CRUD UI
│           └── main.tsx
└── package.json          # npm workspaces root
```

## Running

```bash
# 1. Install everything from the root (workspace hoisting)
npm install

# 2. Start both servers concurrently
npm run dev
```

| Service  | URL                       |
|----------|---------------------------|
| Backend  | http://localhost:3000/trpc |
| Frontend | http://localhost:5173      |

## API (tRPC procedures)

All procedures are under the `todo` namespace.

| Procedure         | Type     | Input                                      | Description          |
|-------------------|----------|--------------------------------------------|----------------------|
| `todo.list`       | query    | —                                          | All todos, sorted    |
| `todo.getById`    | query    | `{ id: uuid }`                             | Single todo          |
| `todo.create`     | mutation | `{ title: string (1–200) }`                | Add a todo           |
| `todo.update`     | mutation | `{ id, title?, completed? }`               | Edit title / toggle  |
| `todo.delete`     | mutation | `{ id: uuid }`                             | Remove a todo        |

Data lives in a `Map<string, Todo>` in the `TodoService` singleton — restart the server to reset.
