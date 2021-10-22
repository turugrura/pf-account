module.exports = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/modules/**/*{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  autoLoadEntities: true,
};
