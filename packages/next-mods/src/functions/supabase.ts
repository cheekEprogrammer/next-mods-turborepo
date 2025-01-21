import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { FunctionModule } from "../types";
import { logger } from "../utils/logger";
import { getConfig, NextModsConfig } from "../utils/get-config";
import { input, confirm, Separator, select } from "@inquirer/prompts";
import { addEnvVariable, removeEnvVariable } from "../utils/fs";

// Define the structure and file contents
const filesAndContents = ({ next, src }: { next: string; src: boolean }) => [
  {
    path: "auth/_components/auth-email-form.tsx",
    content: `"use client";

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
              full_name: \`\${firstName} \${lastName}\`,
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

export default AuthEmailForm;`,
  },
  {
    path: "auth/_components/forgot-password.tsx",
    content: `"use client";

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
        redirectTo: \`\${process.env.NEXT_PUBLIC_URL}/auth/callback/email?next=/auth/update-password\`,
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

export default ForgotPassword;`,
  },
  {
    path: "auth/_components/oauth-button.tsx",
    content: `"use client";

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
      redirectTo: location.origin + \`/auth/callback/oauth?next=\${next}\`,
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
      // toast.error(\`Unable to signin to \${provider}. \${error.message}\`);
      alert(\`Unable to signin to \${provider}. \${error.message}\`);
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
`,
  },
  {
    path: "auth/_components/display-pathname.tsx",
    content: `"use client";

import { usePathname } from "next/navigation";

export default function DisplayPathname() {
  const pathname = usePathname();
  return <>{pathname}</>;
}`,
  },
  {
    path: "auth/_components/signout-button.tsx",
    content: `"use client";

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
      //   toast.error(\`Unable to signout. \${error.message}\`);
      alert(\`Unable to signout. \${error.message}\`);
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

export default SignoutButton;`,
  },
  {
    path: "auth/[choice]/page.tsx",
    content: `import { notFound } from "next/navigation";
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

export default Page;`,
  },
  {
    path: "auth/callback/email/route.ts",
    content: `import { supabaseServer } from "@/lib/supabase/supabaseServer";
import { type EmailOtpType } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      redirectTo.pathname = \`/auth/error?error_code=\${error.code}&error=\${error.name}&error_description=\${error.message}\`;
      return NextResponse.redirect(redirectTo);
    }
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  return notFound();
}`,
  },
  {
    path: "auth/callback/oauth/route.ts",
    content: `import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/supabaseServer";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(\`\${origin}\${next}\`);
    } else {
      return NextResponse.redirect(
        \`\${origin}/auth/error?error_code=\${error.code}&error=\${error.name}&error_description=\${error.message}\`
      );
    }
  }

  return notFound();
}`,
  },
  {
    path: "auth/error/page.tsx",
    content: `import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  return (
    <div className="h-dvh w-dvw bg-neutral-50 flex flex-col items-center justify-center">
      <div className="max-w-sm w-full p-5 bg-red-100 border border-error/20 shadow rounded-lg text-center">
        <h1 className="font-bold mt-2 text-2xl tracking-wide capitalize">
          Error {String(params?.error_code).replaceAll("_", " ")}
        </h1>
        <p className="text-xl capitalize">
          {params && String(params?.error).replaceAll("_", " ")}
        </p>
        <p className="mt-1">{params?.error_description}</p>
      </div>
    </div>
  );
};

export default Page;`,
  },
];

// Function to set up Supabase
export const supabase: FunctionModule = {
  name: "supabase",
  description: "Set up Supabase and middleware for your Next.js project.",
  uninstall: async () => {
    try {
      const projectRoot = process.cwd();
      const config: NextModsConfig | null = getConfig();
      if (!config) {
        throw new Error("Config file not found.");
      }

      // Remove Supabase packages
      logger.info("> Uninstalling Supabase packages...");
      const packageManager: string = config.packageManager || "npm";
      let uninstallCommand;
      if (packageManager === "yarn") {
        uninstallCommand = "yarn remove @supabase/supabase-js @supabase/ssr";
      } else if (packageManager === "pnpm") {
        uninstallCommand = "pnpm remove @supabase/supabase-js @supabase/ssr";
      } else {
        uninstallCommand = "npm uninstall @supabase/supabase-js @supabase/ssr";
      }
      execSync(uninstallCommand, { stdio: "ignore" });
      logger.success("> Supabase packages uninstalled successfully.");

      // Remove Supabase client files
      logger.info("> Removing Supabase client files...");
      const supabaseDir = path.join(projectRoot, "lib", "supabase");
      fs.removeSync(supabaseDir);
      logger.success("> Supabase client files removed successfully.");

      // Remove Middleware
      logger.info("> Removing middleware...");
      const removeMiddleware = await confirm({
        message: "Do you want to remove middleware?",
        default: true,
      });

      if (removeMiddleware) {
        const middlewarePath = path.join(supabaseDir, "middleware.ts");
        const rootMiddlewarePath = path.join(projectRoot, "middleware.ts");
        fs.removeSync(rootMiddlewarePath);
        fs.removeSync(middlewarePath);
        logger.success("> Middleware removed successfully.");
      }

      // Remove Environment Variables
      logger.info("> Removing environment variables...");
      const removeEnvVariables = await confirm({
        message: "Do you want to remove environment variables?",
        default: true,
      });

      if (removeEnvVariables) {
        removeEnvVariable("NEXT_PUBLIC_SUPABASE_URL");
        removeEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY");
        logger.success("> Environment variables removed successfully.");
      }

      // Remove Auth Pages
      logger.info("> Removing auth pages...");
      const removeAuthPages = await confirm({
        message: "Do you want to remove auth pages?",
        default: true,
      });

      if (removeAuthPages) {
        const projectPath = path.join(
          projectRoot,
          config.isSrcProject ? "src, app" : "app"
        );
        const authDir = path.join(projectPath, "auth");
        fs.removeSync(authDir);
        logger.success("> Auth pages removed successfully.");
      }

      // Remove Protected Route
      logger.warn("> Any protected routes will need to be removed manually.");
    } catch (error) {
      throw error;
    }
  },
  install: async (options: Record<string, any> = {}) => {
    try {
      const projectRoot = process.cwd();
      const config: NextModsConfig | null = getConfig();
      if (!config) {
        logger.error("Please run npx next-mods init first.");
        process.exit(1);
      }

      const packageManager: string = config.packageManager || "npm";

      if (!options.includes("repair")) {
        // Prompt for environment variables
        logger.info(
          "> Please goto https://supabase.com/dashboard, select or create a project to get your Supabase URL and Anon Key."
        );
        const SUPABASE_URL = await input({
          message: "Enter your Supabase URL:",
          validate: (value) =>
            value.startsWith("https://")
              ? true
              : "Please enter a valid Supabase URL starting with 'https://'",
        });
        addEnvVariable("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL);
        const SUPABASE_ANON_KEY = await input({
          message: "Enter your Supabase Anon Key:",
          validate: (value) => {
            if (value.length >= 200) {
              return true;
            } else {
              return "Please enter a valid Supabase Anon Key.";
            }
          },
        });
        addEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPABASE_ANON_KEY);
      }

      // Determine the installation command
      let installCommand;
      if (packageManager === "yarn") {
        installCommand = "yarn add @supabase/supabase-js @supabase/ssr";
      } else if (packageManager === "pnpm") {
        installCommand = "pnpm add @supabase/supabase-js @supabase/ssr";
      } else {
        installCommand = "npm install @supabase/supabase-js @supabase/ssr";
      }

      // Install Supabase package
      logger.info(
        `> Installing @supabase/supabase-js & @supabase/ssr using ${packageManager}...`
      );
      try {
        execSync(installCommand, { stdio: "ignore" });
        logger.success(`> Supabase packages installed successfully.`);
      } catch (error) {
        logger.error(
          `> Error installing Supabase packages:`,
          JSON.stringify(error)
        );
        process.exit(1);
      }

      // Create Supabase client file
      logger.info(`> Creating Supabase client files...`);
      const supabaseDir = path.join(projectRoot, "lib", "supabase");

      try {
        const supabaseClientPath = path.join(supabaseDir, "supabaseClient.ts");
        fs.ensureDirSync(supabaseDir);
        const clientScriptContent = `import { createBrowserClient } from '@supabase/ssr'

export function supabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
`;
        fs.writeFileSync(supabaseClientPath, clientScriptContent);
        logger.success(
          "> Supabase client created at lib/supabase/supabaseClient.ts."
        );

        // Create Supabase server file
        const supabaseServerPath = path.join(supabaseDir, "supabaseServer.ts");
        const serverScriptContent = `import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function supabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The 'setAll' method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
`;
        fs.writeFileSync(supabaseServerPath, serverScriptContent);
        logger.success(
          "> Supabase server created at lib/supabase/supabaseServer.ts."
        );
      } catch (error) {
        logger.error(
          `> Error creating Supabase client/server files:`,
          JSON.stringify(error)
        );
        process.exit(1);
      }

      // Create Middleware
      const createMiddleware = await confirm({
        message: `Do you want to ${options.includes("repair") ? "recreate" : "create"} middleware?`,
        default: true,
      });

      if (createMiddleware) {
        logger.info(
          `> ${options.includes("repair") ? "Recreating" : "Creating"} middleware...`
        );

        try {
          const supabaseMiddlewarePath = path.join(
            supabaseDir,
            "middleware.ts"
          );
          const middlewareSupabaseScriptContent = `import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith('/login') &&
  //   !request.nextUrl.pathname.startsWith('/auth')
  // ) {
  //   // no user, potentially respond by redirecting the user to the login page
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
`;
          fs.writeFileSync(
            supabaseMiddlewarePath,
            middlewareSupabaseScriptContent
          );

          const rootMiddlewarePath = path.join(projectRoot, "middleware.ts");
          const middlewareRootScriptContent = `import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}`;
          fs.writeFileSync(rootMiddlewarePath, middlewareRootScriptContent);

          logger.success(
            `> ${options.includes("repair") ? "Recreated" : "Created"} middleware successfully.`
          );
        } catch (error) {
          logger.error(`> Error creating middleware:`, JSON.stringify(error));
        }
      } else {
        logger.warn(`> Skipping middleware...`);
      }

      // Add helper server actions to users app
      const rootMiddlewarePath = path.join(supabaseDir, "supabaseActions.ts");
      logger.info(
        `> ${options.includes("repair") ? "Recreating" : "Creating"} server actions to lib/supabase/supabaseActions.ts...`
      );

      try {
        const serverActionContent = `"use server";

import { supabaseServer } from "./supabaseServer";

export async function getUser() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user };
}

export async function createRecord(table: string, record: object) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from(table).insert(record);
  if (error) return { error };
  return { data };
}

export async function readRecords(table: string, query: object = {}) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from(table).select().match(query);
  if (error) return { error };
  return { data };
}

export async function updateRecord(table: string, id: string, updates: object) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq("id", id);
  if (error) return { error };
  return { data };
}

export async function deleteRecord(table: string, id: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error };
  return { data };
}`;
        fs.writeFileSync(rootMiddlewarePath, serverActionContent);
        logger.success(
          `> Server actions ${options.includes("repair") ? "re" : ""}created successfully.`
        );
      } catch (error) {
        logger.error(`> Error adding server actions:`, JSON.stringify(error));
      }

      // Add authentication pages
      const addAuthPages = await confirm({
        message: "Do you want to add authentication pages?",
        default: true,
      });

      if (addAuthPages) {
        const next =
          (await input({
            message: "What route should a user goto when they sign in?",
            default: "/dashboard",
            validate: (value) => {
              if (!value.startsWith("/")) {
                return "Please start the route with '/' eg. /dashboard";
              } else {
                return true;
              }
            },
          })) || "/";

        const projectPath = path.join(
          projectRoot,
          options.isSrcProject ? "src, app" : "app"
        );
        const authDir = path.join(projectPath, "auth");
        if (fs.existsSync(authDir)) {
          const answer = await select({
            message:
              "An auth folder already exists. Would you like to rename it or overwrite it?",
            choices: [
              {
                name: "rename",
                value: "rename",
                description:
                  "This will rename the existing auth folder to _auth",
              },
              {
                name: "overwrite",
                value: "overwrite",
                description:
                  "WARNING: This will overwrite the existing auth folder. You will lose data in auth.",
              },
            ],
          });

          if (answer === "rename") {
            try {
              if (fs.existsSync(path.join(projectPath, "_auth"))) {
                logger.info("> Renaming auth folder to __auth...");
                fs.renameSync(authDir, path.join(projectPath, "__auth"));
              } else {
                logger.info("> Renaming auth folder to _auth...");
                fs.renameSync(authDir, path.join(projectPath, "_auth"));
              }

              logger.success("> Auth folder renamed successfully.");
            } catch (error) {
              logger.error(
                "Unable to rename folder. Please rename the auth folder and try again."
              );
              process.exit(1);
            }
          }
        }

        try {
          for (const file of filesAndContents({
            next,
            src: config.isSrcProject,
          })) {
            const filePath = path.join(projectPath, file.path);
            await fs.ensureDir(path.dirname(filePath)); // Ensure the directory exists
            await fs.writeFile(filePath, file.content); // Write the file contents
            logger.info(`> Created ${file.path}`);
          }
        } catch (error) {
          logger.error(`> Error creating files:`, JSON.stringify(error));
          process.exit(1);
        }

        logger.success(`> Auth pages added successfully.`);
      } else {
        logger.warn("> Skipping auth pages...");
      }

      // Add protected route if user wants
      // Add authentication pages
      const addProtectedRoute = await confirm({
        message: "Do you want to add a protected route?",
        default: true,
      });

      if (addProtectedRoute) {
        const routePath =
          (await input({
            message:
              "Please enter the route you whish to create and protect. Use a blank path. This will overwrite files.",
            default: "/dashboard",
            validate: (value) => {
              logger.info(value);
              if (value.startsWith("/auth"))
                return "Pick another route. Auth routes are already protected.";
              if (value.startsWith("/")) {
                logger.info("Checking if path exists, if not create it.");
                const protectedDir = path.join(
                  projectRoot,
                  options.isSrcProject ? "src, app" : "app",
                  value
                );
                try {
                  fs.ensureDirSync(protectedDir);
                  return true;
                } catch (error) {
                  return "Not able to create path";
                }
              }
              return "Please enter a valid route. eg. /dashboard";
            },
          })) || "/dashboard";

        try {
          // Determine the complete file path
          const layoutFilePath = path.join(
            projectRoot,
            options.isSrcProject ? "src, app" : "app",
            routePath,
            "layout.tsx"
          );

          const protectedLayoutContent = `import { getUser } from "@/lib/supabase/supabaseActions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Protected Route",
  description: "Generated by next-mods",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser();
  if (!user) redirect("/auth/signin");

  return <div>{children}</div>;
}`;

          // Write the file content to the specified path
          fs.writeFileSync(layoutFilePath, protectedLayoutContent);

          const pageFilePath = path.join(
            projectRoot,
            options.isSrcProject ? "src, app" : "app",
            routePath,
            "page.tsx"
          );

          const protectedPageContent = `import { getUser } from "@/lib/supabase/supabaseActions";
import React from "react";
import SignoutButton from "${config.isSrcProject ? "@/src/app" : "@/app"}/auth/_components/signout-button";
import DisplayPathname from "${config.isSrcProject ? "@/src/app" : "@/app"}/auth/_components/display-pathname";

const Page = async () => {
  const { user } = await getUser();
  return (
    <div className="py-10 px-5 min-h-dvh w-full bg-neutral-50 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-5 border-2 border-neutral-50">
        <h1 className="font-bold">
          This page is protected with Supabase authentication.
        </h1>
        <code className="mt-1 text-sm">
          You can edit this page at <DisplayPathname />
          /page.tsx
        </code>
        <div className="mt-5 flex gap-2 items-center text-sm bg-gray-800 w-fit pl-3 pr-5 pt-4 rounded-t-lg text-white pb-2">
          {/* Make this an Image component for better performance */}
          <img
            alt="user image"
            src={
              user?.user_metadata?.avatar_url || user?.user_metadata?.picture
            }
            height={512}
            width={512}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <p>{user?.email}</p>
            <p className="font-bold">{user?.user_metadata?.full_name}</p>
          </div>
        </div>

        <pre className="overflow-x-auto p-4 bg-gray-800 text-white text-xs rounded-tr-lg rounded-b-lg">
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>

        <SignoutButton>
          <button className="px-3 mt-5 py-2 w-full bg-black rounded active:scale-[0.98] transition-all duration-150 shadow text-white">
            Sign out
          </button>
        </SignoutButton>
      </div>
      <p className="mt-4 text-sm text-neutral-700">
        Auto-generated by next-mods (
        <a
          className="hover:underline text-blue-800"
          href="https://next-mods.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          next-mods.com
        </a>
        )
      </p>
    </div>
  );
};

export default Page;`;

          // Write the file content to the specified path
          fs.writeFileSync(pageFilePath, protectedPageContent);

          logger.success(
            `> Protected route successfully created at ${routePath}.`
          );
        } catch (error) {
          logger.error(
            `> Error adding server actions: ${JSON.stringify(error)}`
          );
        }
      } else {
        logger.warn("> Skipping protected route...");
      }
    } catch (error) {
      throw error;
    }
  },
};
