-- SQL Schema for Supabase PostgreSQL
-- Copy and paste this script into the Supabase SQL Editor to set up the tables.

-- 1. Create Table for Interview Sets
CREATE TABLE IF NOT EXISTS public.interview_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users.id
    role VARCHAR(255) NOT NULL,
    skill VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    question_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Table for Questions
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID NOT NULL REFERENCES public.interview_sets(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    hint TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Table for User History (Optional audit logs)
CREATE TABLE IF NOT EXISTS public.user_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_type VARCHAR(100) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.interview_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for RLS
CREATE POLICY "Users can insert their own interview sets"
    ON public.interview_sets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interview sets"
    ON public.interview_sets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview sets"
    ON public.interview_sets FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view questions from their own sets"
    ON public.questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.interview_sets
            WHERE public.interview_sets.id = public.questions.set_id
            AND public.interview_sets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert questions to their own sets"
    ON public.questions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interview_sets
            WHERE public.interview_sets.id = public.questions.set_id
            AND public.interview_sets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete questions from their own sets"
    ON public.questions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.interview_sets
            WHERE public.interview_sets.id = public.questions.set_id
            AND public.interview_sets.user_id = auth.uid()
        )
    );
