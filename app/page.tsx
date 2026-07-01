import { supabaseAdmin } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60;

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
    supabaseAdmin.from('projects').select('*').eq('is_hidden', false).order('display_order', { ascending: true }),
    supabaseAdmin.from('profile').select('*').limit(1).single(),
    supabaseAdmin.from('education').select('*').order('display_order', { ascending: true }),
    supabaseAdmin.from('experience').select('*').order('display_order', { ascending: true }),
    supabaseAdmin.from('skills').select('*').order('display_order', { ascending: true }),
    supabaseAdmin.from('certifications').select('*').order('display_order', { ascending: true }),
    supabaseAdmin.from('contacts').select('*').order('display_order', { ascending: true })
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
