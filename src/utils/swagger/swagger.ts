import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'shopiAngular REST API developed and maintained by Asoh Yanick using Typescript, Express.js, and MongoDB',
            version: '1.0.0',
            description:'API Documentation',
        },
        servers:[
            {
                url: 'http://localhost:8000',
            },
        ],
    },
    apis: ['./src/routes/**/*.ts'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export const setupSwagger = (app:Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
