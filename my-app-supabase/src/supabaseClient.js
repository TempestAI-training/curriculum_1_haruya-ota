import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbklddmegdunbuieayuc.supabase.co'
const supabaseKey = 'sb_publishable_HvAMKyTfVU6pfqsphaUmGw_AZ3I1mb7'
export const supabase = createClient(supabaseUrl, supabaseKey);


