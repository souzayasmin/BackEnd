const connect = require("../db/connect");

module.exports = class userController {
  // Função para criação de usuário
  static async createUser(req, res) {
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !telefone || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
        error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO usuario (nome, email, telefone, senha) VALUES ('${nome}', '${email}', '${telefone}', '${senha}')`;
      try {
        connect.query(query, function (err, results) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "O email já está vinculado a outro usuário" });
            } else {
              return res.status(500).json({
                error: "erro interno do servidor :(",
              });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário cadastrado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  // Função para login POST
  static async loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Os campos devem ser preenchidos" });
    }
    const query = `SELECT * FROM usuario WHERE email = ? AND senha = ?`;
    const values = [email, senha];

    try {
      connect.query(query, values, function (err, results) {
        if (results.length === 0) {
          return res.status(404).json({ error: "Email ou senha incorretos" });
        }
        return res.status(200).json({
          message: "Login realizado com sucesso",
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // função para alteração PUT
  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, nome, email, telefone, senha } = req.body;

    //Validar se todos os campos foram peenchidos
    if (!id || !nome || !email || !telefone || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET nome=?, email=?, telefone=?, senha=? WHERE id_usuario=?`;
    const values = [nome, email, telefone, senha, id];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              error: "Email já esta cadastrado por outro usuario",
            });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuario atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Função para exclusão DELETE
  static async deleteUser(req, res) {
    const usuarioId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [usuarioId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuario excluido com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }
  
  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista Usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }
};
