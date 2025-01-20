"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
// import { sendGTMEvent } from "@next/third-parties/google";

const SignoutButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = supabaseClient();
    const { error } = await supabase.auth.signOut();
    // console.log(error);

    if (error) {
      //   toast.error(`Unable to signout. ${error.message}`);
      alert(`Unable to signout. ${error.message}`);
    } else {
      //   sendGTMEvent({ event: "logout" });
      (document.getElementById("signout_modal") as HTMLDialogElement).close();
      router.refresh();
    }
  }

  return (
    <>
      <div
        onClick={() =>
          (
            document.getElementById("signout_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        {children}
      </div>
      <dialog id="signout_modal" className="rounded-lg shadow max-w-sm w-full">
        <div className="max-w-md p-4 rounded-lg shadow border relative w-full mx-5 md:mx-auto flex flex-col">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">Are you sure you want to sign out?</p>
          <div className="self-end flex gap-2">
            <button
              className="px-3 py-2"
              onClick={() => {
                (
                  document.getElementById("signout_modal") as HTMLDialogElement
                ).close();
              }}
            >
              No
            </button>
            <button
              className="px-3 py-2 bg-black text-white rounded"
              onClick={() => handleSignOut()}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SignoutButton;