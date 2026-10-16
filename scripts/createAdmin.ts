import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tymudevqzzlewgtngrld.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bXVkZXZxenpsZXdndG5ncmxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjEwNTA4NSwiZXhwIjoyMTA3NjgxMDg1fQ.XGQyBxrb5d3x5UU4fwLvCvNC9jAavLMttmqqCbE147o';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupAdmin() {
  const adminEmail = 'francoinvestimentoss@gmail.com';
  const adminPassword = 'Ocnarf.020299';
  const adminName = 'Administrador Odi Silva';

  console.log(`Setting up admin user: ${adminEmail}...`);

  // Check if user already exists
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const existingUser = usersData.users.find(
    (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  let userId: string;

  if (existingUser) {
    console.log(`User already exists with ID: ${existingUser.id}. Updating password and confirming email...`);
    userId = existingUser.id;
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        nome: adminName,
        role: 'admin',
      },
      app_metadata: {
        role: 'admin',
      },
    });

    if (updateError) {
      console.error('Error updating user:', updateError.message);
      return;
    }
  } else {
    console.log('Creating new admin user...');
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        nome: adminName,
        role: 'admin',
      },
      app_metadata: {
        role: 'admin',
      },
    });

    if (createError) {
      console.error('Error creating user:', createError.message);
      return;
    }
    userId = createData.user.id;
  }

  console.log(`User confirmed with ID: ${userId}`);

  // Upsert profile in public.profiles table
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: userId,
    nome: adminName,
    email: adminEmail,
    role: 'admin',
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.warn('Profile upsert note:', profileError.message);
  } else {
    console.log('Profile successfully set as admin in public.profiles!');
  }

  console.log('✅ Admin user configured successfully!');
}

setupAdmin().catch(console.error);
