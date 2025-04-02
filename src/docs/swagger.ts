import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ONR API',
            version: '0.1.0',
            description:
                'API for managing residential communities with MongoDB and PostgreSQL',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }], 
    },
    apis: [
        path.join(__dirname, '../API/common/routes/*.ts'),
        path.join(__dirname, '../API/postgres/routes/*.ts'),
        path.join(__dirname, '../API/mongo/routes/*.ts'),        
    ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;