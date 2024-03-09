import { TodoList } from "./_components/todoList";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const todos = await serverClient.getTodos();
  return (
    <main className="flex min-h-screen flex-col p-24">
     <TodoList initialTodos={todos} />
    </main>
  );
}
