---
slug: how-to-enable-rls
title: How to Enable Row Level Security in Supabase
authors: [cheekyprogrammer]
# tags: []
---

Supabase is one of the go-to backend solutions for many developers, offering powerful features like real-time capabilities and authentication. One of its standout features is Row Level Security (RLS), which ensures that users can only access the data they are authorized to see. In this article, I'll guide you through enabling RLS for a specific table in Supabase, assuming you already have Supabase set up with Next Mods. If you haven’t set it up yet, please refer to [this guide](../../docs/functions/supabase) for instructions first.

<!-- truncate -->

## What is Row Level Security (RLS)?

Row Level Security ([RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)) is a database feature that allows you to restrict access to rows in a table based on rules you provide. This feature is essential for applications that handle sensitive data, as it helps enforce rules ensuring that each user only sees data they are permitted to access. This provides end-to-end user security.

## Steps to Enable RLS in Supabase

Let’s walk through the steps to enable RLS in a Supabase table and ensure it works seamlessly with the Supabase function provided by Next Mods.

### Step 1: Set Up Your Table

If you already have a table in Supabase where you want to enable RLS, you may skip this step. For demonstration, we’ll create a simple `tasks` table if it’s not already set up.

1. Goto the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new) in your Supabase project.
<!--
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (Foreign Key referencing the user's ID)
   - `task`: Text
   - `completed`: Boolean (default: false) -->

2. Copy and paste the following code into the editor then click on Run:

```sql
CREATE TABLE tasks (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique id for the task
user_id UUID NOT NULL, -- User ID from auth.users
task TEXT NOT NULL, -- Task description
completed BOOLEAN DEFAULT FALSE, -- Task completion status
CONSTRAINT fk_user FOREIGN KEY (user_id) -- Foreign key constraint
REFERENCES auth.users (id)
ON DELETE CASCADE -- Deletes tasks when user is deleted
);
```

You'll get a message saying `Success. No rows returned` once completed.

### Step 2: Enable Row Level Security

Now, let’s enable RLS for the `tasks` table to ensure users can only access their own tasks. If you are using your own table, replace `tasks` with your table name.

1. Navigate to the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new) for your Supabase project.
2. Copy and paste the following block into the editor:

```sql
-- Enable Row Level Security on the tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see their own tasks
CREATE POLICY "Users can view their own tasks"
ON tasks
FOR SELECT
USING (user_id = auth.uid());

-- Create a policy that allows users to insert their own tasks
CREATE POLICY "Users can insert their own tasks"
ON tasks
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create a policy that allows users to update their own tasks
CREATE POLICY "Users can update their own tasks"
ON tasks
FOR UPDATE
USING (user_id = auth.uid());

-- Create a policy that allows users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
ON tasks
FOR DELETE
USING (user_id = auth.uid());
```

3. Click "Run" to execute these commands. You'll get a message saying `Success. No rows returned` once completed. This action enables RLS and establishes the necessary policies for task access.

### Step 3: Benefit with Next Mods

The Supabase Next Mods function comes pre-configured to work out of box as-is. No more changes are needed and you can start using your table securely. Any queries to this table will check to see if the user making the request is the intended user or not. If it is an unauthorized request then no results will be returned.

We have included helper functions to perform CRUD operations on any table you have in your project.

```javascript
import { readRecords, createRecord, updateRecord, deleteRecord } from "@/lib/supabase/supabaseActions";

const { data, error } = await createRecord("tasks", {
  task: "Get eggs",
  completed: false,
}); // Create

const { data, error } = await readRecords("tasks"); // Read

const { data, error } = await updateRecord("tasks", id: "<UUID>", { completed: true }) // Update

const { data, error } = await deleteRecord("tasks", id: "<UUID>") // Delete
```

As you can see, you do not have to worry about user id's or who is trying to access the table. Just query it and let RLS handle the security!

### Step 4: Testing Your RLS Setup

To ensure that RLS is functioning correctly, run a few tests with different users:

1. Authenticate as a user (you can use Supabase's built-in authentication features).
2. Try to create tasks and see if they are accessible only by the corresponding `user_id`.
3. Attempt to access records created by another user; the queries should return no results, confirming that RLS is applied effectively.

## Conclusion

Enabling Row Level Security in Supabase is a straightforward yet powerful way to manage user data privacy. With Next Mods streamlining the setup process, developers can implement secure and efficient applications quickly. With RLS, you can ensure that every user's experience is tailored to their own data, building trust and security into your applications.
