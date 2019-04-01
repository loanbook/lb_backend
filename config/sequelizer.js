require('dotenv').config();


module.exports  = {
    "development": {
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "host": process.env.DB_HOSTNAME,
      "port": process.env.DB_PORT,
      "dialect": "postgres",
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": {
      "username": process.env.PROD_DB_USERNAME,
      "password": process.env.PROD_DB_PASSWORD,
      "database": process.env.PROD_DB_NAME,
      "host": process.env.PROD_DB_HOSTNAME,
      "port": process.env.PROD_DB_PORT,
      "dialect": process.env.PROD_DB_DIALECT
    }
};
