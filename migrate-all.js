import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_SERVICE_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const dataEN = JSON.parse(fs.readFileSync('./data/portfolio.json', 'utf8'));
const dataID = JSON.parse(fs.readFileSync('./data/portfolio-id.json', 'utf8'));

async function migrateAll() {
  console.log("🚀 Memulai Migrasi Data (Profile, Education, Experience, Skills, Certifications)...");

  // 1. Profile
  console.log("Migrasi Profile...");
  const profilePayload = {
    name: dataEN.profile.name,
    title: dataEN.profile.title,
    title_id: dataID.profile.title,
    description: dataEN.profile.description,
    description_id: dataID.profile.description,
    photo: dataEN.profile.photo
  };
  await supabase.from('profile').delete().neq('id', 0); // clear existing
  await supabase.from('profile').insert([profilePayload]);

  // 2. Education
  console.log("Migrasi Education...");
  await supabase.from('education').delete().neq('id', 0);
  for (let i = 0; i < dataEN.education.length; i++) {
    const item = dataEN.education[i];
    const itemID = dataID.education.find(e => e.id === item.id) || item;
    await supabase.from('education').insert([{
      institution: item.institution,
      year: item.year,
      degree: item.degree,
      degree_id: itemID.degree,
      logo: item.logo
    }]);
  }

  // 3. Experience
  console.log("Migrasi Experience...");
  await supabase.from('experience').delete().neq('id', 0);
  for (let i = 0; i < dataEN.experience.length; i++) {
    const item = dataEN.experience[i];
    const itemID = dataID.experience.find(e => e.id === item.id) || item;
    await supabase.from('experience').insert([{
      role: item.role,
      role_id: itemID.role,
      company: item.company,
      year: item.year,
      description: item.description || "",
      description_id: itemID.description || ""
    }]);
  }

  // 4. Skills
  console.log("Migrasi Skills...");
  await supabase.from('skills').delete().neq('id', 0);
  for (let i = 0; i < dataEN.skills.length; i++) {
    const item = dataEN.skills[i];
    const itemID = dataID.skills.find(e => e.name === item.name) || item;
    await supabase.from('skills').insert([{
      name: item.name,
      category: item.category,
      category_id: itemID.category,
      logo: item.logo
    }]);
  }

  // 5. Certifications (more)
  console.log("Migrasi Certifications (More)...");
  await supabase.from('certifications').delete().neq('id', 0);
  for (let i = 0; i < dataEN.more.length; i++) {
    const item = dataEN.more[i];
    const itemID = dataID.more[i] || item; // assuming same order since no id
    await supabase.from('certifications').insert([{
      title: item.title,
      title_id: itemID.title,
      issuer: item.issuer,
      year: item.year
    }]);
  }

  console.log("✅ MIGRASI SELESAI!");
}

migrateAll().catch(console.error);
