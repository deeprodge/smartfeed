// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://epxoujhzsamkpeefiniz.supabase.co'
const supabaseAnonKey = 'sb_secret_yiU1dRXoSwYUwzxXaubjJA_0uW_mXHg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
