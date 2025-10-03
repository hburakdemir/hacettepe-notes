import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import registerRoutes from './routes/registerRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import postRoutes from './routes/postRoutes.js';
import savedPostRoutes from './routes/savedpostRoutes.js';
import updateprofileRutes from './routes/updateprofileRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*',
}));

app.use(express.json()); 

app.use((req, res, next) => {
  console.log('Content-Type:', req.headers['content-type']);
  next();
});



if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', loginRoutes);
app.use('/api/posts', postRoutes);
app.use('/api',userRoutes);
app.use('/api/auth', registerRoutes);
app.use('/api/saved-posts', savedPostRoutes);
app.use('/api/update-profile', updateprofileRutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
