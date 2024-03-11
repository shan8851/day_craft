import { BookmarksSection } from "./_components/bookmarks";
import { Pomodoro } from "./_components/pomodoro";
import { TodoList } from "./_components/todoList";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const todos = await serverClient.todos.getTodos();
  const bookmarks = await serverClient.bookmarks.getBookmarks();
  const pomodoroSettings = await serverClient.pomodoro.getSettings();
  return (
    <main className="flex min-h-screen flex-col gap-4 p-6">
     <div className="flex flex-col">
      <h1 className="text-6xl">Deikurafuto</h1>
      <p>Keep on top of your day</p>
     </div>
     <TodoList initialTodos={todos} />
     <BookmarksSection initialBookmarks={bookmarks} />
     <Pomodoro settings={pomodoroSettings} />
    </main>
  );
}
