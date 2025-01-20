"use client";

import React from "react";
import ForgotPassword from "./forgot-password";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

const AuthEmailForm = ({ choice }: { choice: "signin" | "signup" }) => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const router = useRouter();
  const choiceLabel = choice.replace("sign", "Sign ");

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return;
    }

    try {
      const supabase = supabaseClient();

      if (choice === "signin") {
        // Sign in user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
          // toast.error(error.message);
        } else {
          // sendGAEvent("event", "login", { method: "email" });
          router.refresh();
        }
      } else {
        // Sign up user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `${firstName} ${lastName}`,
            },
          },
        });

        // console.log(data, error);
        if (error) {
          alert(error.message);
          // toast.error(error.message);
        }

        if (data.user && !data.session && !error) {
          alert("Please check your email for confirmation instructions.");
          // toast.success(
          //   "Please check your email for confirmation instructions."
          // );

          // Uncomment line below to send GA event to google analytics
          // sendGAEvent("event", "sign_up", { method: "email" });

          router.push("/auth/signin");
        }
      }
    } catch (error) {
      alert(JSON.stringify(error));
      // toast.error(JSON.stringify(error));
    } finally {
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      <div className="grid w-full items-center gap-1.5">
        <label className="font-medium text-sm" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          placeholder="jdoe@gmail.com"
          className="px-3 py-2 rounded-lg shadow border"
        />
      </div>

      {choice === "signup" && (
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              disabled={loading}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              placeholder="John"
              autoComplete="given-name"
              className="px-3 py-2 rounded-lg shadow border"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="lastName">
              Last Name
            </label>
            <input
              autoComplete="family-name"
              type="text"
              placeholder="Doe"
              disabled={loading}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              className="px-3 py-2 rounded-lg shadow border"
            />
          </div>
        </div>
      )}

      <div className="grid w-full items-center gap-1.5">
        <div className="flex justify-between items-center">
          <label className="font-medium text-sm" htmlFor="password">
            Password
          </label>
          {choice === "signin" && <ForgotPassword />}
        </div>
        <input
          type="password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          className="px-3 py-2 rounded-lg shadow border"
        />
      </div>
      {choice === "signup" && (
        <div className="grid w-full items-center gap-1.5">
          <label className="font-medium text-sm" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            disabled={loading}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            className="px-3 py-2 rounded-lg shadow border"
          />
        </div>
      )}
      <button
        type="submit"
        disabled={
          !email ||
          !password ||
          loading ||
          (choice === "signup" && !confirmPassword) ||
          (choice === "signup" && !firstName) ||
          (choice === "signup" && !lastName) ||
          (choice === "signup" && password !== confirmPassword)
        }
        className="bg-black cursor-pointer disabled:cursor-auto text-sm disabled:bg-neutral-400 text-white font-medium w-full p-2 rounded-lg disabled:active:scale-100 active:scale-[0.98] shadow border transition-all duration-150"
      >
        {choiceLabel}
      </button>
    </form>
  );
};

export default AuthEmailForm;