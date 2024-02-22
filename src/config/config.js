import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command(); 
const environment = program.opts().mode;

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

console.log("Mode Option: ", program.opts().mode);

dotenv.config({
    path: environment === "prod" ? "./src/config/.env.production" : "./src/config/.env.development"
});
//node src/server.js --mode prod or devnode src/server.js --mode prod

export default {
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
}