import { supabaseServer } from "@/lib/supabase/supabaseServer";
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
      redirectTo.pathname = `/auth/error?error_code=${error.code}&error=${error.name}&error_description=${error.message}`;
      return NextResponse.redirect(redirectTo);
    }
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  return notFound();
}