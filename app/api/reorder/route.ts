import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const { tableName, items } = await request.json();
    
    // items is expected to be an array of objects: [{ id: 1, order_index: 0 }, { id: 2, order_index: 1 }, ...]
    if (!tableName || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const promises = items.map((item: any) => 
      supabaseAdmin
        .from(tableName)
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
