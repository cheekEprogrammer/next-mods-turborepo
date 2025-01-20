"use client";

import { supabaseClient } from "@/lib/supabase/supabaseClient";
import React from "react";

/**
 * OAuthButton component allows users to sign in or sign up using various OAuth providers.
 *
 * @param {"signin" | "signup"} choice - The type of authentication action, either "signin" or "signup".
 * @param {"google" | "github" | "facebook" | "azure"} provider - The OAuth provider to use for authentication.
 * @param {string} [next="/"] - (optional) The URL to redirect to after successful authentication. Defaults to "/".
 *
 * @returns {JSX.Element} A button element that triggers the OAuth sign-in process.
 *
 * @example
 * <OAuthButton choice="signin" provider="google" next="/dashboard" />
 */
const OAuthButton = ({
  choice,
  provider,
  next = "/",
}: {
  choice: "signin" | "signup";
  provider: "google" | "github" | "facebook" | "azure";
  next?: string;
}): JSX.Element => {
  const choiceLabel = choice.replace("sign", "Sign ");
  async function handleSignIn() {
    // Define the type for options
    type OAuthOptions = {
      redirectTo: string;
      scope?: string; // Optional scope property
    };

    const options: OAuthOptions = {
      redirectTo: location.origin + `/auth/callback/oauth?next=${next}`,
    };

    if (provider === "azure") {
      options.scope = "email";
    }
    console.log(options, "OPTIONS...");
    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    // console.log(error);

    if (error) {
      // Uncomment the following line to show a toast notification
      // toast.error(`Unable to signin to ${provider}. ${error.message}`);
      alert(`Unable to signin to ${provider}. ${error.message}`);
    } else {
      // Uncomment the following lines to send events to Google Tag Manager and/or Google Analytics
      // sendGTMEvent({ event: "login", method: provider });
      // sendGAEvent("event", "login", { method: provider });
    }
  }
  return (
    <button
      onClick={handleSignIn}
      type="submit"
      className="cursor-pointer disabled:cursor-auto disabled:bg-neutral-400 font-medium text-sm w-full p-2 rounded-lg disabled:active:scale-100 active:scale-[0.98] shadow border transition-all duration-150"
    >
      {choiceLabel} with <span className="capitalize">{provider}</span>
    </button>
  );
};

export default OAuthButton;
