import swaggerJsdoc from "swagger-jsdoc";

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "AI Asset Generator API",

            version: "1.0.0",

            description:
                "Backend API AI Asset Generator"

        },

        servers: [

            {

                url: "http://localhost:5000"

            }

        ]

    },

    apis: [

        "./src/routes/*.ts"

    ]

};

export const swaggerSpec =
    swaggerJsdoc(options);