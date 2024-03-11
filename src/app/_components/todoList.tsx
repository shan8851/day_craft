'use client';
import React, { useState } from 'react';
import { trpc } from '../_trpc/client';
import { Button, Input, Label, Popover } from 'react-aria-components';
import { serverClient } from '../_trpc/serverClient';

interface Props {
  initialTodos: Awaited<ReturnType<(typeof serverClient)['todos']['getTodos']>>;
}

export const TodoList = ({ initialTodos }: Props) => {
  const getTodos = trpc.todos.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const addTodo = trpc.todos.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const toggleTodo = trpc.todos.toggleTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const archiveTodo = trpc.todos.archiveTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const deletTodo = trpc.todos.deleteTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  let triggerRef = React.useRef(null);

  return (
    <div className="p-4 border border-black">
      <h1 className="text-3xl">Todo List Section</h1>

      <div className="text-3xl">
        {getTodos.data
          ?.filter((todo) => todo.archived === 0)
          .map((todo) => (
            <div className="flex gap-4 items-center" key={todo.id}>
              <Input
                id={`check-${todo.id}`}
                type="checkbox"
                checked={!!todo.done}
                style={{ zoom: 1.5 }}
                onChange={async () => {
                  toggleTodo.mutate({ id: todo.id, done: todo.done ? 0 : 1 });
                }}
              />
              <Label
                htmlFor={`check-${todo.id}`}
                className={todo.done ? 'line-through' : ''}
              >
                {todo.text}
              </Label>
              <Button
                className="border border-black rounded-lg py-2 px-4 text-sm"
                onPress={async () => {
                  deletTodo.mutate(todo.id);
                }}
              >
                Delete
              </Button>
              <Button
                className="border border-black rounded-lg py-2 px-4 text-sm"
                onPress={async () => {
                  archiveTodo.mutate({
                    id: todo.id,
                    archived: todo.archived ? 0 : 1,
                  });
                }}
              >
                Archive
              </Button>
            </div>
          ))}
      </div>
      <Button ref={triggerRef} onPress={() => setShowAddTodo(true)}>
        Add new todo
      </Button>
      <Popover
            placement='end'
      triggerRef={triggerRef}
      isOpen={showAddTodo}
      onOpenChange={setShowAddTodo}
      className='py-2 px-4 border border-grey-200 rounded-xl bg-white'
      >
      <div className="flex gap-2">
          <Input
            className="text-black"
            placeholder="Enter new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button
            isDisabled={!newTodo}
            onPress={async () => {
              if (newTodo.trim() === '') return;
              await addTodo.mutate(newTodo);
              setNewTodo('');
            }}
          >
            Add
          </Button>
        </div>
      </Popover>
    </div>
  );
};
