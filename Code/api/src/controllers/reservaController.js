const connect = require("../db/connect");

module.exports = class reservaController {
  static async createReserva(req, res) {
    const { fkcpf, fkid_salas, data_hora, duracao } = req.body;

    // Validação de campos obrigatórios
    if (!fkcpf || !fkid_salas || !data_hora || !duracao) {
        return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    // Conversão de data_hora e cálculo de horário de fim
    const inicio = new Date(data_hora).getTime(); // Convertendo data_hora para milissegundos
    const duracaoArray = duracao.split(":").map(Number); // Dividindo duração em horas, minutos e segundos
    const duracaoMs = ((duracaoArray[0] * 60 + duracaoArray[1]) * 60 + duracaoArray[2]) * 1000; // Convertendo para milissegundos
    const fim = inicio + duracaoMs; // Calculando o horário de fim em milissegundos

    // Query para buscar reservas existentes na mesma sala e validar conflitos
    const queryCheck = `
        SELECT * FROM reservas 
        WHERE fkid_salas = ?
    `;

    const queryInsert = `
        INSERT INTO reservas (fkcpf, fkid_salas, data_hora, duracao) 
        VALUES (?, ?, ?, ?)
    `;

    try {
        // Buscar reservas existentes na mesma sala
        connect.query(queryCheck, [fkid_salas], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erro ao verificar a disponibilidade da sala" });
            }

            // Verificar conflitos manualmente
            for (const reserva of results) {
                const reservaInicio = new Date(reserva.data_hora).getTime(); // Convertendo data_hora do banco para milissegundos
                const reservaDuracao = reserva.duracao.split(":").map(Number); // Dividindo a duração do banco
                const reservaDuracaoMs = ((reservaDuracao[0] * 60 + reservaDuracao[1]) * 60 + reservaDuracao[2]) * 1000; // Convertendo para ms
                const reservaFim = reservaInicio + reservaDuracaoMs; // Calculando horário de fim da reserva

                // Verificar se há sobreposição de horários
                if ((inicio >= reservaInicio && inicio < reservaFim) || // Início está dentro de outra reserva
                    (fim > reservaInicio && fim <= reservaFim) ||       // Fim está dentro de outra reserva
                    (reservaInicio >= inicio && reservaFim <= fim)) {   // Outra reserva está completamente dentro da nova
                    return res.status(409).json({ error: "A sala já está reservada nesse horário" });
                }
            }

            // Inserir a reserva no banco de dados
            connect.query(queryInsert, [fkcpf, fkid_salas, data_hora, duracao], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Erro ao criar a reserva" });
                }
                return res.status(201).json({ message: "Reserva criada com sucesso" });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}


  static async getAllReservas(req, res) {
    const query = `SELECT * FROM reservas`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Reservas", reservas: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateReserva(req, res) {
    const { id_reserva, fkcpf, fkid_salas, data_hora, duracao } = req.body;

    if (!id_reserva || !fkcpf || !fkid_salas || !data_hora || !duracao) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }

    const queryUpdate = `
      UPDATE reservas 
      SET fkcpf=?, fkid_salas=?, data_hora=?, duracao=? 
      WHERE id_reserva = ?
    `;
    const values = [fkcpf, fkid_salas, data_hora, duracao, id_reserva];

    try {
      connect.query(queryUpdate, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Reserva não encontrada" });
        }
        return res.status(200).json({ message: "Reserva atualizada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteReserva(req, res) {
    const reservaId = req.params.id;
    const queryDelete = `DELETE FROM reservas WHERE id_reserva=?`;
    const values = [reservaId];

    try {
      connect.query(queryDelete, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno no servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        return res.status(200).json({ message: "Reserva excluída com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};