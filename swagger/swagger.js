const swaggerAutogen = require('swagger-autogen')({
    openapi: '3.0.0',
    autoHeaders: false,
});

const doc = {
    info: {
        title: 'My haloa API',
        description: 'This is the API for the haloa app'
    },
    host: 'localhost:3000',
    components: {
        "@schemas": {
            LoginDto: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string'
                    },
                    password: {
                        type: 'string',
                        format: 'password'
                    }
                }
            },
            RegisterDto: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string'
                    },
                    fullName: {
                        type: 'string'
                    },
                    username: {
                        type: 'string'
                    },
                    password: {
                        type: 'string',
                        format: 'password'
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['../index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);