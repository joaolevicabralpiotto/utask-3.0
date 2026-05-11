import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Card } from "./entities/Card";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres", // Geralmente 'postgres'
    password: "1310",
    database: "utask_db",
    synchronize: true, // Isso cria as tabelas automaticamente (use apenas em desenvolvimento!)
    logging: false,
    entities: [User, Card], // Aqui entrarão nossos modelos de Usuário e Card     futuramente
    migrations: [],
    subscribers: [],
});
