import { supabaseAdmin } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [
    { data: projects },
    { data: profileData },
    { data: education },
    { data: experience },
    { data: skills },
    { data: certifications },
    { data: contacts }
  ] = await Promise.all([
    supabaseAdmin.from('projects').select('*').eq('is_hidden', false).order('order_index', { ascending: true }).order('id', { ascending: true }),
    supabaseAdmin.from('profile').select('*').limit(1).single(),
    supabaseAdmin.from('education').select('*').order('order_index', { ascending: true }).order('id', { ascending: true }),
    supabaseAdmin.from('experience').select('*').order('order_index', { ascending: true }).order('id', { ascending: true }),
    supabaseAdmin.from('skills').select('*').order('order_index', { ascending: true }).order('id', { ascending: true }),
    supabaseAdmin.from('certifications').select('*').order('order_index', { ascending: true }).order('id', { ascending: true }),
    supabaseAdmin.from('contacts').select('*').eq('is_hidden', false).order('order_index', { ascending: true }).order('id', { ascending: true })
  ]);

  return (
    <HomeClient
      serverProjects={projects || []}
      serverProfile={profileData || null}
      serverEducation={education || []}
      serverExperience={experience || []}
      serverSkills={skills || []}
      serverCertifications={certifications || []}
      serverContacts={contacts || []}
    />
  );
}
