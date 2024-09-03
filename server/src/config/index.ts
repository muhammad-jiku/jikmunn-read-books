import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DB_URI,
  default: {
    user_pass: process.env.DEFAULT_USER_PASS,
    customer_pass: process.env.DEFAULT_CUSTOMER_PASS,
    author_pass: process.env.DEFAULT_AUTHOR_PASS,
    admin_pass: process.env.DEFAULT_ADMIN_PASS,
  },
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
