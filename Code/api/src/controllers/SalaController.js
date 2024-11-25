const Sala = require("../db/connect"); 

// Função para listar todas as salas
async function listarSalas(req, res) {
  try {
    const salas = await Sala.find();
    res.status(200).json(salas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Função para buscar uma sala por ID
async function getAllSala(req, res) {
  try {
    const sala = await Sala.findById(req.params.id);
    if (sala == null) {
      return res.status(404).json({ message: "Sala não encontrada" });
    }
    res.status(200).json(sala);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Função para criar uma nova sala
async function createSala(req, res) {
  const sala = new Sala({
    horarios_disponiveis: req.body.horarios_disponiveis,
    classificacao: req.body.classificacao,
  });

  try {
    const novaSala = await sala.save();
    res.status(201).json(novaSala);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Função para atualizar uma sala existente
async function updateSala(req, res) {
  try {
    const sala = await Sala.findById(req.params.id);
    if (sala == null) {
      return res.status(404).json({ message: "Sala não encontrada" });
    }

    // Atualizar os campos da sala
    sala.horarios_disponiveis =
      req.body.horarios_disponiveis || sala.horarios_disponiveis;
    sala.classificacao = req.body.classificacao || sala.classificacao;

    const salaAtualizada = await sala.save();
    res.status(200).json(salaAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Função para deletar uma sala
async function deleteSala(req, res) {
  try {
    const sala = await Sala.findById(req.params.id);
    if (sala == null) {
      return res.status(404).json({ message: "Sala não encontrada" });
    }

    await sala.remove();
    res.status(200).json({ message: "Sala deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  listarSalas,
  getAllSala,
  createSala,
  updateSala,
  deleteSala,
};
