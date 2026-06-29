const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabaseAdmin.from('projects').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Columns:', data.length > 0 ? Object.keys(data[0]) : 'Table is empty, cannot infer columns from empty data. Attempting to insert a test row and rollback...');
    
    // Test what columns exist by sending a dummy insert that will fail or succeed
    const payload = {
        title: "test",
        title_id: "test",
        category: "test",
        category_id: "test",
        type: "article",
        description: "test",
        description_id: "test",
        videoUrl: "",
        tools: [],
        thumbnail: "",
        images: [],
        content: [],
        content_id: [],
        is_hidden: true,
        order_index: 999
    };
    const { error: insertError } = await supabaseAdmin.from('projects').insert([payload]);
    if (insertError) {
      console.log('Insert Error:', insertError);
    } else {
      console.log('Insert succeeded! Columns exist.');
      // delete it
      await supabaseAdmin.from('projects').delete().eq('title', 'test');
    }
  }
}
check();
