import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,  // Should be false in production
    logging: process.env.SHOW_LOGS === 'true',
    entities: ["src/database/entity/**/*.ts"],  // Define your entity path
    migrations: ["src/database/migration/**/*.ts"],  // Path to your migrations
    subscribers: ["src/database/subscriber/**/*.ts"],
});

