"use client";

import { supabaseClient } from "@/lib/supabase/supabaseClient";
import React from "react";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleReset() {
    setLoading(true);
    if (!email) {
      // toast.error("Please enter an email");
      alert("Please enter an email");
      setLoading(false);
      return;
    }

    try {
      const supabase = supabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback/email?next=/auth/update-password`,
      });

      if (error) {
        // toast.error(error.message);
        alert(error.message);
        return;
      }
      setEmail("");
      (document.getElementById("forgot_password") as HTMLDialogElement).close();
      alert(
        "If you have a valid account, you will receive an email with further instructions"
      );
      // toast.success(
      //   "If you have a valid account, you will receive an email with further instructions"
      // );
    } catch (error) {
      alert(JSON.stringify(error));
      // toast.error(JSON.stringify(error));
    } finally {
      setLoading(false);
      (document.getElementById("forgot_password") as HTMLDialogElement).close();
    }
  }

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="text-sm hover:underline"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setEmail("");
          (
            document.getElementById("forgot_password") as HTMLDialogElement
          ).showModal();
        }}
      >
        Forgot your password?
      </button>
      <dialog
        id="forgot_password"
        className="p-4 rounded-lg shadow border relative w-full max-w-sm mx-auto"
      >
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">Forgot Password</h3>
          <p className="py-4 grid gap-2 ">
            <label htmlFor="forgottenEmail" className="font-medium text-sm">
              Email
            </label>
            <input
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border shadow rounded-lg border-neutral-400"
              type="email"
              id="forgottenEmail"
            />
          </p>
          <div className="self-end">
            <button
              type="button"
              disabled={loading || !email}
              onClick={handleReset}
              className="bg-black text-sm text-white font-medium px-4 py-2 rounded shadow disabled:bg-neutral-500 active:scale-[0.98] disabled:active:scale-100"
            >
              Submit
            </button>
            <button
              type="button"
              className="p-1 rounded-lg font-bold cursor-pointer absolute top-2 right-3"
              onClick={() =>
                (
                  document.getElementById(
                    "forgot_password"
                  ) as HTMLDialogElement
                ).close()
              }
            >
              X
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ForgotPassword;