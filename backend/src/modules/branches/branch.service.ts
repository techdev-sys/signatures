import { supabase } from '../../database/supabase.js';

export async function getBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select(`
      id,
      name,
      code,
      address,
      city,
      country,
      phone,
      is_open,
      accepting_orders
    `)
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
