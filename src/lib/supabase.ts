import { createClient } from '@supabase/supabase-js'
import { getAccessKey } from './accessKey'

const SUPABASE_URL = 'https://ibcimbyahddjllhcchhv.supabase.co'
// Chave publicável — pública por design; a proteção real é feita por RLS no banco
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SQHEjsZQo1fwT2c7wCjg1w_QuX9DnnA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: {
    headers: { 'x-access-key': getAccessKey() ?? '' },
  },
})
