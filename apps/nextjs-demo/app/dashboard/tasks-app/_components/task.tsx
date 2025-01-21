"use client";

import { deleteRecord, updateRecord } from "@/lib/supabase/supabaseActions";
import React from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";

const Task = ({ id, task }: { id: string; task: string }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const [newTask, setNewTask] = React.useState(task);
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <li
      key={id}
      className="group my-2 border h-10 transition-all duration-150 cursor-pointer hover:shadow px-3 py-2 rounded-lg relative"
    >
      {isDelete && (
        <p className="z-10 bg-neutral-100 w-full h-10 rounded-lg absolute transform top-0 left-0 flex items-center justify-center">
          <span className="animate-pulse">Deleting...</span>
        </p>
      )}
      {isEdit ? (
        <div className="flex gap-2 items-center absolute right-2">
          <button
            onClick={async () => {
              const { error } = await updateRecord(
                "tasks",
                id,
                { task: newTask },
                "/dashboard/tasks-app"
              );
              setIsEdit(false);
            }}
            disabled={newTask === task || !newTask}
            className="h-6 disabled:bg-neutral-50 disabled:active:scale-100 active:scale-[0.95] px-2 rounded-lg border shadow bg-green-100"
          >
            <IoMdCheckmark />
          </button>
          <button
            onClick={async () => {
              setNewTask(task);
              setIsEdit(false);
            }}
            className="h-6 active:scale-[0.95] px-2 rounded-lg border shadow bg-red-100"
          >
            <IoMdClose />
          </button>
        </div>
      ) : (
        <div className="hidden group-hover:flex gap-2 items-center absolute right-2">
          <button
            onClick={() => {
              setIsEdit(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 1);
            }}
            className="h-6 active:scale-[0.95] px-2 rounded-lg border shadow bg-orange-100"
          >
            <MdModeEdit />
          </button>
          <button
            onClick={async () => {
              setIsDelete(true);
              const { error } = await deleteRecord(
                "tasks",
                id,
                "/dashboard/tasks-app"
              );
            }}
            className="h-6 active:scale-[0.95] px-2 rounded-lg border shadow bg-red-100"
          >
            <MdDeleteForever />
          </button>
        </div>
      )}
      {isEdit ? (
        <input
          value={newTask}
          ref={inputRef}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 h-full w-[75%] py-2"
        />
      ) : (
        <p className="truncate">{task}</p>
      )}
    </li>
  );
};

export default Task;
