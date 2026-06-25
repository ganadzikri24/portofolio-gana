import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    
    return NextResponse.json(data || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Check if a profile exists
    const { data: existing } = await supabaseAdmin
      .from('profile')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      result = await supabaseAdmin
        .from('profile')
        .update(body)
        .eq('id', existing.id)
        .select();
    } else {
      result = await supabaseAdmin
        .from('profile')
        .insert([body])
        .select();
    }

    if (result.error) throw result.error;
    return NextResponse.json(result.data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
