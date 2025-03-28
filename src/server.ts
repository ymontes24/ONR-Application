import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongoDB from './config/mongodb';
import sequelize from './config/postgresql';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API de gestión de comunidades residenciales funcionando correctamente' });
});

app.get('/mongo-test', (_req: Request, res: Response) => {
  res.json({ message: 'Conexión a MongoDB establecida correctamente' });
});

app.get('/postgres-test', (_req: Request, res: Response) => {
  res.json({ message: 'Conexión a PostgreSQL establecida correctamente' });
});

const startServer = async () => {
  try {
    await connectMongoDB();
    
    await sequelize.authenticate();
    
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();