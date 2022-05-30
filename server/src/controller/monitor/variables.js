const Knex = require('knex');

module.exports = app => {
  const writeConfig = async (id) => {
    try {
        const server = await app.db('server')
            .select('ip', 'port')
            .first()
            .where({
                id: id
            });

        return ({
            client: process.env.DB_CLIENT,
            connection: {
                host: server.ip,
                port: server.port,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_AUDIT,
                timezone: 'UTC'
            },
            pool: { min: 2, max: 10 },
            migrations: {
                tableName: 'migrations'
            }
        })
    } catch (error) {
        return error.message
    }
  }

  const systemVariablesList = async(req, res) => {
    try {
      const sql = `CALL audit.sp_monitor_system_variables();`;

      const db = Knex(await writeConfig(req.query.server_id))
      const sqlQuery = await db.raw(sql);
      db.destroy();

      return res.json(sqlQuery[0][0]);
    } catch (error) {
      return res.json({ erro: error.message });
    }
  }

  const setVariable = async (req, res) => {
    try {
      const sql = `SET GLOBAL `+ req.query.variable +` = '`+ req.query.value +`';`;

      const db = Knex(await writeConfig(req.query.server_id))
      const sqlQuery = await db.raw(sql);
      db.destroy();

      return res.json(sqlQuery[0][0]);
    } catch (error) {
      return res.json({ erro: error.message });
    }
  }

  return {
    systemVariablesList,
    setVariable
  }
}