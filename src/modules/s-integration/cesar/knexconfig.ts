import { Knex } from 'knex';

export const knexConfigCesar: Knex.Config = {
  client: 'mysql',
  connection: {
    host: 'archi02.stelladesign.local',
    user: 'growdev',
    password: '7k03zO$2',
    database: 'cc_contab',
  },
};
