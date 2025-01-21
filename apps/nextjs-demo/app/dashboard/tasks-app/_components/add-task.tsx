"use client";

import { createRecord } from "@/lib/supabase/supabaseActions";
import React from "react";

const AddTask = () => {
  const [loading, setLoading] = React.useState(false);
  const [newTask, setNewTask] = React.useState("");
  return (
    <div className="flex items-center gap-2 w-full h-10">
      <input
        placeholder="Task name"
        disabled={loading}
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="flex-1 h-full px-3 rounded-lg border shadow-sm disabled:bg-neutral-50"
      />
      <button
        disabled={loading || !newTask}
        className="bg-blue-500 h-full disabled:bg-neutral-800 text-white px-4 active:scale-[0.98] transition-all duration-150 rounded-lg"
        onClick={async () => {
          setLoading(true);
          const { error } = await createRecord(
            "tasks",
            { task: newTask },
            "/dashboard/tasks-app"
          );
          setNewTask("");
          setLoading(false);
        }}
      >
        {loading ? <span className="animate-pulse">...</span> : "+"}
      </button>
    </div>
  );
};

export default AddTask;
