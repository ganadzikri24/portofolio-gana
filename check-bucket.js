const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabaseAdmin.storage.getBucket('portfolio-images');
  if (error) {
    console.error('Error fetching bucket:', error);
    // try creating it
    console.log('Attempting to create bucket...');
    const { data: createData, error: createError } = await supabaseAdmin.storage.createBucket('portfolio-images', { public: true });
    if (createError) {
       console.error('Error creating bucket:', createError);
    } else {
       console.log('Bucket created successfully!', createData);
    }
  } else {
    console.log('Bucket exists:', data);
  }
}
check();
