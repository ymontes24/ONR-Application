import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {serve, setup} from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import connectMongoDB from './config/mongodb';
import sequelize from './config/postgresql';
import { initModels as initPostgresModels } from './API/postgres/models';

// Importar rutas consolidadas
import mongodbRoutes from './API/mongo/routes/routes';
import postgresqlRoutes from './API/postgres/routes/routes';
import combinedRoutes from './API/common/routes/routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/combined', combinedRoutes);
app.use('/api/mongo', mongodbRoutes);
app.use('/api/pg', postgresqlRoutes);

app.use('/api-docs', serve, setup(swaggerSpec));

// Iniciar servidor
const startServer = async () => {
  try {
    await connectMongoDB();
    console.log('MongoDB conectado correctamente');

    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente');

    await initPostgresModels();
    console.log('Modelos de PostgreSQL inicializados correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`API docs disponibles en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error instanceof Error 
      ? error.message 
      : String(error));
    process.exit(1);
  }
};

startServer();