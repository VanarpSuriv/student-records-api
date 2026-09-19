import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const port = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || './database/students.db';

const app = createApp(dbPath);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database path: ${dbPath}`);
});
