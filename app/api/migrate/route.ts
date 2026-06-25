import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'portfolio.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const projects = data.projects || [];

    if (projects.length === 0) {
      return NextResponse.json({ message: 'No projects found in JSON' });
    }

    // Format data for Supabase
    const payload = projects.map((p: any) => ({
      title: p.title || '',
      title_id: p.title || '', // English as default for ID if missing
      category: p.category || '',
      category_id: p.category || '',
      thumbnail: p.thumbnail || '',
      type: p.type || 'seamless-image',
      images: p.images || [],
      videoUrl: p.videoUrl || '',
      description: p.description || '',
      description_id: p.description || '',
      tools: p.tools || [],
      is_hidden: false
    }));

    // Insert to Supabase
    const { data: insertedData, error } = await supabaseAdmin
      .from('projects')
      .insert(payload)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, count: insertedData.length, data: insertedData });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
