import { useState, useRef } from 'react';
import { trpc } from './lib/trpc';

export default function App() {
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useContext();

  const { data: todos = [], isLoading } = trpc.todo.list.useQuery();

  const create = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.list.invalidate();
      setNewTitle('');
    },
  });

  const update = trpc.todo.update.useMutation({
    onSuccess: () => {
      utils.todo.list.invalidate();
      setEditId(null);
    },
  });

  const remove = trpc.todo.delete.useMutation({
    onSuccess: () => utils.todo.list.invalidate(),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    create.mutate({ title: newTitle });
  };

  const startEdit = (id: string, title: string) => {
    setEditId(id);
    setEditTitle(title);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editTitle.trim()) return;
    update.mutate({ id: editId, title: editTitle });
  };

  const handleToggle = (id: string, completed: boolean) => {
    update.mutate({ id, completed: !completed });
  };

  const pending = todos.filter(t => !t.completed).length;

  return (
    <div className="container">
      <h1>todos</h1>

      <form className="add-form" onSubmit={handleCreate}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit" disabled={create.isLoading}>
          Add
        </button>
      </form>

      {isLoading ? (
        <p className="status">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="status">Nothing here yet — add your first todo above.</p>
      ) : (
        <>
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={todo.completed ? 'done' : ''}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, todo.completed)}
                />

                {editId === todo.id ? (
                  <form className="edit-form" onSubmit={handleUpdate}>
                    <input
                      ref={editInputRef}
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span onDoubleClick={() => startEdit(todo.id, todo.title)}>
                      {todo.title}
                    </span>
                    <button
                      className="del"
                      aria-label="Delete"
                      onClick={() => remove.mutate({ id: todo.id })}
                    >
                      ×
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <p className="footer">
            {pending} item{pending !== 1 ? 's' : ''} left · double-click to edit
          </p>
        </>
      )}
    </div>
  );
}
