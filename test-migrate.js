const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  try {
    // 1. Delete all existing projects to prevent duplicates
    console.log("Cleaning up old projects...");
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // delete everything

    if (deleteError) {
      console.error("Delete Error:", deleteError);
      return;
    }

    // 2. Read EN File
    const enPath = path.join(__dirname, 'data', 'portfolio.json');
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const projectsEN = enData.projects || [];

    // 3. Read ID File
    const idPath = path.join(__dirname, 'data', 'portfolio-id.json');
    let projectsID = [];
    if (fs.existsSync(idPath)) {
      const idData = JSON.parse(fs.readFileSync(idPath, 'utf8'));
      projectsID = idData.projects || [];
    }

    console.log(`Found ${projectsEN.length} projects in EN and ${projectsID.length} projects in ID`);

    // 4. Combine data
    const payload = projectsEN.map(p => {
      // Find matching project in ID by original JSON ID
      const pId = projectsID.find(idProj => idProj.id === p.id) || {};

      return {
        title: p.title || '',
        title_id: pId.title || p.title || '',
        category: p.category || '',
        category_id: pId.category || p.category || '',
        thumbnail: p.thumbnail || '',
        type: p.type || 'seamless-image',
        images: p.images || [],
        videoUrl: p.videoUrl || '',
        description: p.description || '',
        description_id: pId.description || p.description || '',
        tools: p.tools || [],
        content: p.content || null,
        content_id: pId.content || p.content || null,
        is_hidden: false
      };
    });

    // 5. Insert combined data
    const { data: insertedData, error } = await supabase
      .from('projects')
      .insert(payload)
      .select();

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Success! Inserted Combined Projects:", insertedData.length);
    }
  } catch (err) {
    console.error("Script Error:", err);
  }
}

migrate();
