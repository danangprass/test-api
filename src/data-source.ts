import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { FailedSent } from "./entity/FailedSent"
import * as dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, FailedSent],
    migrations: [],
    subscribers: [],
})
