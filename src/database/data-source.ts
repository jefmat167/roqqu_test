import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "roqqu",
  synchronize: true,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],  
} as DataSourceOptions);
