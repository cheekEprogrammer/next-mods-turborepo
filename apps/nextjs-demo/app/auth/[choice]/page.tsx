import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import AuthEmailForm from "../_components/auth-email-form";
import OAuthButton from "../_components/oauth-button";

const Page = async ({
  params,
}: {
  params: Promise<{ choice: "signin" | "signup" }>;
}) => {
  const { choice } = await params;
  if (choice !== "signin" && choice !== "signup") notFound();
  const choiceLabel = choice.replace("sign", "Sign ");

  return (
    <div className="h-dvh w-dvw bg-neutral-50 flex items-center justify-center">
      <div className="max-w-sm w-full bg-white shadow border p-5 rounded-lg">
        <h1 className="font-semibold text-lg">{choiceLabel}</h1>
        <p className="mt-1 mb-5 text-sm text-neutral-500 font-medium">
          Enter your email below to{" "}
          <span className="lowercase">{choiceLabel}</span>
        </p>
        <AuthEmailForm choice={choice} />
        <div className="mt-5 mb-4">
          <OAuthButton choice={choice} provider="google" next="/dashboard" />
        </div>
        {choice === "signin" ? (
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link className="hover:underline font-medium" href="/auth/signup">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link className="hover:underline font-medium" href="/auth/signin">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;