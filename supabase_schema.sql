-- Enterprise Schema for Smart Redirect System (Supabase)
-- Target Project: mftokblsuoknxxveqeib

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);

-- Callback Events table
CREATE TABLE IF NOT EXISTS public.callback_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clickid text NOT NULL,
  project_code text NOT NULL,
  incoming_status text NOT NULL,
  update_result text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT callback_events_pkey PRIMARY KEY (id)
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id),
  project_code text NOT NULL UNIQUE,
  project_name text,
  base_url text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'paused'::text, 'deleted'::text])),
  has_prescreener boolean NOT NULL DEFAULT false,
  prescreener_url text,
  country text DEFAULT 'Global'::text,
  is_multi_country boolean NOT NULL DEFAULT false,
  country_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  token_prefix text,
  token_counter integer DEFAULT 0,
  complete_cap integer NOT NULL DEFAULT 0,
  complete_target integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- Responses table
CREATE TABLE IF NOT EXISTS public.responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id),
  project_code text,
  uid text,
  supplier_token text,
  session_token text,
  status text NOT NULL DEFAULT 'in_progress'::text CHECK (status = ANY (ARRAY['in_progress'::text, 'started'::text, 'complete'::text, 'terminate'::text, 'quota'::text, 'security_terminate'::text, 'duplicate_ip'::text, 'duplicate_string'::text, 'click'::text, 'terminated'::text, 'quota_full'::text])),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  duration_seconds integer,
  revenue numeric DEFAULT 0,
  cost numeric DEFAULT 0,
  margin numeric DEFAULT 0,
  fraud_score integer NOT NULL DEFAULT 0,
  ip text,
  user_agent text,
  device_type text,
  country_code text,
  clickid text UNIQUE,
  hash text,
  last_landing_page text,
  reason text,
  geo_mismatch boolean DEFAULT false,
  vpn_flag boolean DEFAULT false,
  updated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT responses_pkey PRIMARY KEY (id)
);

-- Postback Logs table (Optional, but useful for testing/debugging)
CREATE TABLE IF NOT EXISTS public.postback_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES public.responses(id),
    url TEXT NOT NULL,
    method TEXT DEFAULT 'GET',
    request_body TEXT,
    response_code INTEGER,
    response_body TEXT,
    update_result TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Analytics Function (Kept intact to match UI usage pattern)
CREATE OR REPLACE FUNCTION get_project_analytics()
RETURNS TABLE (
    project_id UUID,
    project_name TEXT, 
    client_name TEXT,
    status TEXT,
    clicks BIGINT, 
    completes BIGINT, 
    terminates BIGINT, 
    quota_full BIGINT, 
    conversion_rate NUMERIC
) LANGUAGE sql AS $$
    SELECT 
        p.id as project_id,
        p.project_code as project_name, 
        COALESCE(c.name, 'Unknown Client') as client_name,
        p.status,
        COUNT(r.id) FILTER (WHERE r.status = 'click') as clicks,
        COUNT(r.id) FILTER (WHERE r.status = 'complete') as completes,
        COUNT(r.id) FILTER (WHERE r.status IN ('terminate', 'terminated')) as terminates,
        COUNT(r.id) FILTER (WHERE r.status IN ('quota', 'quota_full')) as quota_full,
        CASE 
            WHEN COUNT(r.id) FILTER (WHERE r.status = 'click') > 0 
            THEN ROUND((COUNT(r.id) FILTER (WHERE r.status = 'complete')::NUMERIC / COUNT(r.id) FILTER (WHERE r.status = 'click')::NUMERIC) * 100, 2)
            ELSE 0 
        END as conversion_rate
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN responses r ON r.project_id = p.id
    GROUP BY p.id, p.project_code, c.name, p.status;
$$;
