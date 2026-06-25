import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from("contacts").update(body).eq("id", params.id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from("contacts").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
