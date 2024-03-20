import { Knex } from 'knex';

export const knexConfigSieger: Knex.Config = {
  client: 'mysql',
  connection: {
    // host: process.env.DB_HOST_SIEGER,
    // user: process.env.DB_USER_SIEGER,
    // password: process.env.DB_PASSWORD_SIEGER,
    // database: process.env.DB_DATABASE_SIEGER,
    host: 'srvdados01.stelladesign.local',
    user: 'growdev',
    password: 'growdev@stella',
    database: '02970s001',
  },
};

export const knexConfigCesar: Knex.Config = {
  client: 'mysql',
  connection: {
    host: 'archi02.stelladesign.local',
    user: 'growdev',
    password: '7k03zO$2',
    database: 'cc_contab_desenv',
    // database: 'cc_contab',
  },
};
