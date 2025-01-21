"use server";

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
}
