import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DATABASE_AUTH_TOKEN (first 10 chars):', process.env.DATABASE_AUTH_TOKEN?.substring(0, 10));
console.log('Current directory:', process.cwd());
console.log('.env exists in current dir:', require('fs').existsSync(path.join(process.cwd(), '.env')));
