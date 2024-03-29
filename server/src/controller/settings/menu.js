/**
 * @author Rafael Machado
 * @class Menu
 * @description Função Controller Class
 * @param {this} app
 */

const validate = require('validate.js')

module.exports = app => {

  const validateSalvar = {
    name: { presence: true, type: 'string' },
    description: { presence: true, type: 'string' },
    url: { presence: true, type: 'string' },
    icon: { presence: true, type: 'string' },
    // icon_color: { presence: false, type: 'string' },
    order: { presence: true, type: 'string' }
    // parent_id: { presence: false, type: 'integer' },
  }

  const validateEditar = {
    id: { presence: true, type: 'integer' },
    ...validateSalvar
  }

  const isUniqueConstraintError = async (err) => {
    if (!err) return false;

    var re = /^Duplicate entry/;
    return re.test(err.sqlMessage);
  }

  const dropdown = async (_req, res) => {
    try {
      const findAll = await app.db("menu")
        .column(
          "menu.id",
          "menu.name",
          "menu.url",
          "menu.parent_id",
          "menu_pai.name as menu_pai_name"
        )
        .select()
        .leftJoin('menu as menu_pai', 'menu_pai.id', 'menu.parent_id')
        .where({
          'menu.deleted_at': null
        });

      return res.json(findAll);
    } catch (error) {
      return res.json({ erro: error });
    }
  };

  const listar = async (req, res) => {
    try {
      const resp = await app.db('menu')
        .select('id', 'name', 'description', 'url', 'icon', 'order', 'icon_color', 'parent_id')
        .modify(function(queryBuilder) {
          if (req.query.orderBy) {
            queryBuilder.orderBy(req.query.orderBy)
          }
          else
            queryBuilder.orderByRaw('coalesce(??, ??), ??', ['parent_id', 'order', 'order'])
          })
        .whereNull('deleted_at')
        .modify(function(queryBuilder) {
          if (req.query.name) {
            queryBuilder.where('name', 'like', '%' + req.query.name + '%')
          }
        });

      return res.json(resp)
    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  const exibir = async (req, res) => {
    try {
      const resp = await app.db('menu')
      .where({
        id: req.params.id
      })
      .first()

      return res.json(resp)
    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  const editar = async (req, res) => {
    try {
      const err = validate(req.body, validateEditar)
      if (err) return res.json(err)

      const findOne = await app.db('menu')
      .where({
        id: req.body.id
      })
      .first()

      if (!findOne) throw new Error('Menu não encontrado')

      await app.db('menu')
        .where({
          id: req.body.id
        })
        .update({
          name: req.body.name,
          description: req.body.description,
          url: req.body.url,
          icon: req.body.icon,
          icon_color: req.body.icon_color,
          order: req.body.order,
          parent_id: req.body.parent_id
        })

      return res.json({ message: 'Alterado' })
    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  const salvar = async (req, res) => {
    try {
      const err = validate(req.body, validateSalvar)
      if (err) return res.json(err)

      await app.db('menu')
        .insert({
          name: req.body.name,
          description: req.body.description,
          url: req.body.url,
          icon: req.body.icon,
          icon_color: req.body.icon_color,
          order: req.body.order,
          parent_id: req.body.parent_id
        })

      return res.json({ message: 'Inserido' })
    } catch (error) {
      return res.json({ erro: (isUniqueConstraintError(error) ? 'Menu já cadastrado' : error.message) })
    }
  }

  const deletar = async (req, res) => {
    try {
      const findOne = await app.db('menu')
        .where({
          id: req.params.id
        })
        if (!findOne.length) throw new Error('Menu não encontrado')

      await app.db('menu')
        .where({
          id: req.params.id
        })
        .del()

      return res.json({ message: 'Deletado' })

    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  return {
    dropdown,
    listar,
    exibir,
    editar,
    salvar,
    deletar
  };
};
