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

/**
 * Confere a chave contra o banco antes de salvá-la: as políticas RLS só
 * retornam os perfis quando o header x-access-key é válido.
 */
export async function validateAccessKey(key: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'x-access-key': key.trim(),
    },
  })
  if (!res.ok) return false
  const rows: unknown[] = await res.json()
  return rows.length > 0
}
