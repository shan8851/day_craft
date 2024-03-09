import { BookmarksSection } from "./_components/bookmarks";
import { TodoList } from "./_components/todoList";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const todos = await serverClient.todos.getTodos();
  const bookmarks = await serverClient.bookmarks.getBookmarks();
  return (
    <main className="flex min-h-screen flex-col gap-4 p-24">
     <TodoList initialTodos={todos} />
     <BookmarksSection initialBookmarks={bookmarks} />
    </main>
  );
}
