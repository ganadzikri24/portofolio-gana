import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY']);

async function fixOrder(tableName) {
  console.log(`Memperbaiki urutan untuk tabel ${tableName}...`);
  // Fetch all rows ordered by id ASC (this matches the insertion order from JSON)
  const { data, error } = await supabase.from(tableName).select('id').order('id', { ascending: true });
  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return;
  }

  // We want the first item (id ASC) to have the NEWEST date, so it appears at the TOP when ordered DESC.
  // We'll base the date on right now, and subtract 1 minute for each subsequent item.
  const now = Date.now();
  for (let i = 0; i < data.length; i++) {
    const newDate = new Date(now - (i * 60000)).toISOString();
    await supabase.from(tableName).update({ created_at: newDate }).eq('id', data[i].id);
  }
  console.log(`✅ Urutan ${tableName} berhasil diperbaiki!`);
}

async function main() {
  await fixOrder('experience');
  await fixOrder('certifications');
  await fixOrder('education');
  await fixOrder('skills');
  await fixOrder('projects');
}

main().catch(console.error);
