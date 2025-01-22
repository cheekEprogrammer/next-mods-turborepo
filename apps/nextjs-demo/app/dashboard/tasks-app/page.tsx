import React from "react";
import { readRecords } from "@/lib/supabase/supabaseActions";
import Task from "./_components/task";
import AddTask from "./_components/add-task";

const Page = async () => {
  const { data: tasks, error } = await readRecords("tasks");

  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center bg-neutral-50">
      <h1 className="font-bold text-2xl mb-4">Tasks App</h1>
      <div className="max-w-sm w-full bg-white px-2 py-1 h-[70vh] rounded-lg border shadow-lg">
        <div className="flex items-center gap-2 w-full mt-2">
          <AddTask />
        </div>
        <div className="overflow-y-auto flex-1 h-[calc(70vh-3.5rem)]">
          {tasks && tasks?.length > 0 ? (
            <ul>
              {tasks.map(({ task, id, completed }) => (
                <Task key={id} task={task} id={id} completed={completed} />
              ))}
            </ul>
          ) : (
            <p className="text-center mt-5 text-neutral-400">
              No Tasks. Why not add one?
            </p>
          )}
        </div>
      </div>

      <p className="mt-5 text-neutral-600">
        Created by{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://www.next-mods.com"
          target="_blank"
        >
          next-mods.com
        </a>
      </p>
    </div>
  );
};

export default Page;
