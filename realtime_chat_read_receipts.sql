-- ==============================================================================
-- REALTIME CHATS & READ RECEIPTS SQL MIGRATION (Supabase / PostgreSQL)
-- Run this in your Supabase SQL Editor to enable real-time messaging,
-- delivery tracking, read receipts, and relational receipt history.
-- ==============================================================================

-- 1. User Read-Receipt Privacy Preference on profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'read_receipts_enabled'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN read_receipts_enabled BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- 2. Ensure chats table & columns exist
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    investor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(startup_id, investor_id)
);

CREATE INDEX IF NOT EXISTS idx_chats_startup ON public.chats(startup_id);
CREATE INDEX IF NOT EXISTS idx_chats_investor ON public.chats(investor_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON public.chats(updated_at DESC);

-- 3. Ensure messages table has delivery & read receipt columns
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    status TEXT DEFAULT 'sent',
    file_name TEXT,
    file_size TEXT,
    duration NUMERIC,
    reactions JSONB DEFAULT '[]'::jsonb,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN status TEXT DEFAULT 'sent';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'delivered_at'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'read_at'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Normalize any unexpected status values and enforce status constraint
UPDATE public.messages SET status = 'sent' WHERE status IS NULL OR status NOT IN ('sent', 'delivered', 'read');

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_status_check;
ALTER TABLE public.messages
    ADD CONSTRAINT messages_status_check CHECK (status IN ('sent', 'delivered', 'read'));

-- Indexes for fast unread counting, chat loading, and realtime filtering
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_unread ON public.messages(chat_id, sender_id, status) WHERE status <> 'read';

-- 4. Relational Message Read Receipts Table
CREATE TABLE IF NOT EXISTS public.message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    reader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(message_id, reader_id)
);

CREATE INDEX IF NOT EXISTS idx_read_receipts_chat_reader ON public.message_read_receipts(chat_id, reader_id);
CREATE INDEX IF NOT EXISTS idx_read_receipts_message ON public.message_read_receipts(message_id);

-- 5. Enable Row Level Security & Policies
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;

-- Chats RLS
DROP POLICY IF EXISTS "Users can view their chats" ON public.chats;
CREATE POLICY "Users can view their chats" ON public.chats
    FOR SELECT USING (auth.uid() = investor_id OR auth.uid() = startup_id);

DROP POLICY IF EXISTS "Users can insert chats" ON public.chats;
CREATE POLICY "Users can insert chats" ON public.chats
    FOR INSERT WITH CHECK (auth.uid() = investor_id OR auth.uid() = startup_id);

DROP POLICY IF EXISTS "Users can update chats" ON public.chats;
CREATE POLICY "Users can update chats" ON public.chats
    FOR UPDATE USING (auth.uid() = investor_id OR auth.uid() = startup_id)
    WITH CHECK (auth.uid() = investor_id OR auth.uid() = startup_id);

-- Messages RLS
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.messages;
CREATE POLICY "Users can view messages in their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE id = messages.chat_id AND (investor_id = auth.uid() OR startup_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can insert messages in their chats" ON public.messages;
CREATE POLICY "Users can insert messages in their chats" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE id = messages.chat_id AND (investor_id = auth.uid() OR startup_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Authors can update message content" ON public.messages;
DROP POLICY IF EXISTS "Recipients can update message status" ON public.messages;
DROP POLICY IF EXISTS "Participants can update message status and receipts" ON public.messages;

CREATE POLICY "Participants can update message status and receipts" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE id = messages.chat_id AND (investor_id = auth.uid() OR startup_id = auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE id = messages.chat_id AND (investor_id = auth.uid() OR startup_id = auth.uid())
        )
    );

-- Read Receipts RLS
DROP POLICY IF EXISTS "Chat participants can view read receipts" ON public.message_read_receipts;
CREATE POLICY "Chat participants can view read receipts" ON public.message_read_receipts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE id = message_read_receipts.chat_id AND (investor_id = auth.uid() OR startup_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Recipients can insert their own read receipts" ON public.message_read_receipts;
CREATE POLICY "Recipients can insert their own read receipts" ON public.message_read_receipts
    FOR INSERT WITH CHECK (
        auth.uid() = reader_id AND
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE id = message_read_receipts.chat_id AND (investor_id = auth.uid() OR startup_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Recipients can update their own read receipts" ON public.message_read_receipts;
CREATE POLICY "Recipients can update their own read receipts" ON public.message_read_receipts
    FOR UPDATE USING (auth.uid() = reader_id)
    WITH CHECK (auth.uid() = reader_id);

-- 6. Database Triggers for Data Integrity & Sync
-- Prevent non-senders from mutating immutable message fields AND prevent senders from forging read/delivery receipts
CREATE OR REPLACE FUNCTION public.protect_message_immutable_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.role() = 'authenticated' AND auth.uid() IS DISTINCT FROM OLD.sender_id THEN
        NEW.id := OLD.id;
        NEW.chat_id := OLD.chat_id;
        NEW.sender_id := OLD.sender_id;
        NEW.content := OLD.content;
        NEW.type := OLD.type;
        NEW.file_name := OLD.file_name;
        NEW.file_size := OLD.file_size;
        NEW.duration := OLD.duration;
        NEW.created_at := OLD.created_at;
    ELSIF auth.role() = 'authenticated' AND auth.uid() = OLD.sender_id THEN
        NEW.id := OLD.id;
        NEW.chat_id := OLD.chat_id;
        NEW.sender_id := OLD.sender_id;
        NEW.status := OLD.status;
        NEW.delivered_at := OLD.delivered_at;
        NEW.read_at := OLD.read_at;
        NEW.created_at := OLD.created_at;
    END IF;

    IF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
        NEW.delivered_at := timezone('utc'::text, now());
    END IF;

    IF NEW.status = 'read' THEN
        NEW.delivered_at := COALESCE(NEW.delivered_at, OLD.delivered_at, timezone('utc'::text, now()));
        NEW.read_at := COALESCE(NEW.read_at, OLD.read_at, timezone('utc'::text, now()));
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_message_fields ON public.messages;
CREATE TRIGGER trg_protect_message_fields
    BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.protect_message_immutable_fields();

-- Automatically bump chats.updated_at whenever a new message is inserted
CREATE OR REPLACE FUNCTION public.sync_chat_updated_at_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.chats
    SET updated_at = GREATEST(updated_at, NEW.created_at)
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_chat_updated_at ON public.messages;
CREATE TRIGGER trg_sync_chat_updated_at
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.sync_chat_updated_at_on_message();

-- Keep messages.status & messages.read_at synchronized when a receipt row is added
CREATE OR REPLACE FUNCTION public.sync_message_status_from_receipt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.messages
    SET
        status = 'read',
        delivered_at = COALESCE(delivered_at, NEW.read_at),
        read_at = COALESCE(read_at, NEW.read_at)
    WHERE id = NEW.message_id
      AND sender_id <> NEW.reader_id
      AND status <> 'read';
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_message_read_receipt ON public.message_read_receipts;
CREATE TRIGGER trg_sync_message_read_receipt
    AFTER INSERT OR UPDATE ON public.message_read_receipts
    FOR EACH ROW EXECUTE FUNCTION public.sync_message_status_from_receipt();

-- 7. Atomic RPCs for Fast Read & Delivery Receipts
CREATE OR REPLACE FUNCTION public.mark_chat_messages_read(p_chat_id UUID)
RETURNS TABLE(message_id UUID, read_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_now TIMESTAMP WITH TIME ZONE := timezone('utc'::text, now());
BEGIN
    IF v_uid IS NULL THEN
        RETURN;
    END IF;

    -- Verify caller belongs to this chat
    IF NOT EXISTS (
        SELECT 1 FROM public.chats
        WHERE id = p_chat_id AND (startup_id = v_uid OR investor_id = v_uid)
    ) THEN
        RETURN;
    END IF;

    -- Insert relational read receipts for all unread incoming messages in the chat
    INSERT INTO public.message_read_receipts (message_id, chat_id, reader_id, read_at)
    SELECT m.id, m.chat_id, v_uid, v_now
    FROM public.messages m
    WHERE m.chat_id = p_chat_id
      AND m.sender_id <> v_uid
      AND m.status <> 'read'
    ON CONFLICT (message_id, reader_id)
    DO UPDATE SET read_at = COALESCE(public.message_read_receipts.read_at, EXCLUDED.read_at);

    -- Update messages table status & read_at directly and return updated IDs
    RETURN QUERY
    UPDATE public.messages m
    SET
        status = 'read',
        delivered_at = COALESCE(m.delivered_at, v_now),
        read_at = COALESCE(m.read_at, v_now)
    WHERE m.chat_id = p_chat_id
      AND m.sender_id <> v_uid
      AND m.status <> 'read'
    RETURNING m.id, m.read_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_message_delivered(p_message_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_now TIMESTAMP WITH TIME ZONE := timezone('utc'::text, now());
BEGIN
    IF v_uid IS NULL THEN
        RETURN FALSE;
    END IF;

    UPDATE public.messages m
    SET
        status = 'delivered',
        delivered_at = COALESCE(m.delivered_at, v_now)
    FROM public.chats c
    WHERE m.id = p_message_id
      AND m.chat_id = c.id
      AND (c.startup_id = v_uid OR c.investor_id = v_uid)
      AND m.sender_id <> v_uid
      AND m.status = 'sent';

    RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_chat_messages_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_message_delivered(UUID) TO authenticated;

-- 8. Enable Supabase Realtime Publication & Full Replica Identity
ALTER TABLE public.chats REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.message_read_receipts REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chats'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'message_read_receipts'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.message_read_receipts;
        END IF;
    END IF;
END $$;

NOTIFY pgrst, 'reload_schema';
