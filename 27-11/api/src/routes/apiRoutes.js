const router = require("express").Router();
const UserController = require("../controllers/UserController");
const SalaController = require("../controllers/SalaController");

router.post("/user", UserController.createUser); // http://localhost:6000/api/v1/user
router.post("/userLogin", UserController.loginUser); // http://localhost:6000/api/v1/userLogin
router.put("/user", UserController.updateUser); // http://localhost:6000/api/v1/user
router.delete("/user/:id", UserController.deleteUser); // http://localhost:6000/api/v1/user/:id
router.get("/user", UserController.getAllUsers); // http://localhost:6000/api/v1/user

// Rotas do SalaController
router.get("/sala", SalaController.getAllSalas); // http://localhost:6000/api/v1/sala
router.post("/sala", SalaController.createSalas); // http://localhost:6000/api/v1/sala
router.put("/sala/:id_sala", SalaController.updateSala); // http://localhost:6000/api/v1/sala/:id
router.delete("/sala/:id", SalaController.deleteSala); // http://localhost:6000/api/v1/sala/:id

module.exports = router;
