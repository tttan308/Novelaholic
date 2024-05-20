export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
}

export const database_config = () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
  },
});
