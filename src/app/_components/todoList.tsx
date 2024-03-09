'use client';
import { useState } from 'react';
import { trpc } from '../_trpc/client';
import { Button, Input, Label } from 'react-aria-components';
import { serverClient } from '../_trpc/serverClient';

interface Props {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["todos"]["getTodos"]>>
};


export const TodoList = ({ initialTodos }:Props) => {
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

  const deletTodo = trpc.todos.deleteTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const [newTodo, setNewTodo] = useState('');

  return (
    <div>
      <h1>Todo List</h1>
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
      <div className="text-3xl">
        {getTodos.data?.map((todo) => (
          <div className="flex gap-4 items-center" key={todo.id}>
            <Input
              id={`checl-${todo.id}`}
              type="checkbox"
              checked={!!todo.done}
              style={{ zoom: 1.5 }}
              onChange={async () => { toggleTodo.mutate({ id: todo.id, done: todo.done ? 0 : 1 }); }}
            />
            <Label htmlFor={`check-${todo.id}`} className={todo.done ? 'line-through' : ''}>
              {todo.text}</Label>
              <Button className='border border-black rounded-lg py-2 px-4 text-sm' onPress={async () => { deletTodo.mutate(todo.id); }}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
