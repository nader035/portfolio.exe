const fs = require('fs');
const path = require('path');

const dir = 'src/environments';
const file = 'environment.ts';
const devFile = 'environment.development.ts';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const content = `export const environment = {
  production: true,
  supabaseUrl: '${process.env.SUPABASE_URL || "https://placeholder.supabase.co"}',
  supabaseKey: '${process.env.SUPABASE_KEY || "placeholder-key"}'
};`;

const devContent = `export const environment = {
  production: false,
  supabaseUrl: '${process.env.SUPABASE_URL || "https://placeholder.supabase.co"}',
  supabaseKey: '${process.env.SUPABASE_KEY || "placeholder-key"}'
};`;

fs.writeFileSync(path.join(dir, file), content);
fs.writeFileSync(path.join(dir, devFile), devContent);

console.log(`Generated ${file} and ${devFile} successfully!`);
