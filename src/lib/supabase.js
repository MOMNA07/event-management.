import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const localMenu = [
  { id: '1', name: 'Mutton Karahi', category: 'desi', price: 1850, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85' },
  { id: '2', name: 'Kinara BBQ Platter', category: 'bbq', price: 2450, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: '3', name: 'Chicken Biryani', category: 'desi', price: 650, rating: 4.7, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85' },
  { id: '4', name: 'Smoky Beef Burger', category: 'fastfood', price: 790, rating: 4.6, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85' },
  { id: '5', name: 'Family Hi-Tea', category: 'buffet', price: 1299, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85' },
  { id: '6', name: 'Malai Tikka', category: 'bbq', price: 1250, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85' },
]

export async function getMenuItems() {
  if (!supabase) return localMenu
  const { data, error } = await supabase.from('menu_items').select('*').eq('is_available', true).order('rating', { ascending: false })
  return error ? localMenu : data
}

export async function createReservation(values) {
  if (!supabase) return { data: values, error: null }
  const { data, error } = await supabase.from('reservations').insert({ ...values, guests_count: Number(values.guests_count) }).select().single()
  if (error) throw error
  return { data, error }
}

export { supabase }
