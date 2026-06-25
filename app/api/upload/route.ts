import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${uniqueSuffix}-${filename}`;

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      url: publicUrlData.publicUrl,
      path: filePath 
    });
  } catch (error: any) {
    console.error('Upload catch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}
