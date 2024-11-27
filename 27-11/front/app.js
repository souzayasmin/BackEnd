//Chama a função createUser para a associação ao evento de envio a formulário
document
  .getElementById("formulario-registro")
  .addEventListener("submit", createUser);

document.addEventListener("DOMContentLoaded", createUser);
document.addEventListener("DOMContentLoaded", loginUser);
function createUser(event) {
  //Previne o comportamento padrao do formulario, ou seja, impede que ele seja enviado e recarregue a pagina
  event.preventDefault();

  //Captura os valores dos campos do formularios
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  //Requisição HTTP para o endpoint de cadastro de usuario
  fetch("http://localhost:5000/api/v1/user", {
    //Realiza uma chamada http para o servidor(a rota definida)
    method: "POST",
    headers: {
      //A requisição será em formato json
      "Content-Type": "application/json",
    },
    //Transforma os dados do formulario de uma string json para serem enviados no corpo da req
    body: JSON.stringify({ nome, telefone, email, senha }),
  })
    .then((response) => {
      //Tratamento da resposta do servidor / API
      if (response.ok) {
        //verifica se a resposta foi bem sucedida (status 2xx(duzentos e alguma coisa))
        return response.json();
      }
      //Convertendo o erro em formato JSON
      return response.json().then((err) => {
        //Mensagem retornada do servidor acessada pela chave "error"
        throw new Error(err.error);
      });
    }) //Fechamento da then(response)
    .then((data) => {
      //executa a resposta de sucesso - retorna ao usuario final

      //Exibe um alerta para o usuario final (front)
      alert(data.message);
      window.location.href = "login.html";
      console.log(data.message);

      //Reseta os campos do formulario após o sucesso do cadastro
      document.getElementById("formulario-registro").reset();
    })
    .catch((error) => {
      //Captura qualquer erro que ocorra durante o processo de requisição / resposta

      //Exibe alerta (front) com o erro processado
      alert("Erro no cadastro " + error.message);
      console.error("Erro:", error.message);
    });
} //Fechamento createUser

function loginUser(event) {
  // Previne o comportamento padrão de recarregar a página ao enviar o formulário
  event.preventDefault();
  // Captura os valores dos campos de email e senha no formulário
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // Realiza uma requisição POST para a API de login
  fetch("http://localhost:5000/api/v1/userLogin", {
    method: "POST", // Define o método da requisição como POST
    headers: {
      "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
    },
    body: JSON.stringify({ email, senha }), // Converte os dados de login para JSON e envia no corpo da requisição
  })
    // Processa a resposta da API
    .then((response) => {
      if (response.ok) {
        // Se a resposta for bem-sucedida (status 200), retorna o conteúdo como JSON
        return response.json();
      }
      // Caso a resposta seja um erro, converte a resposta para JSON e lança um erro com a mensagem da API
      return response.json().then((err) => {
        throw new Error(err.error); // Usa a mensagem de erro recebida
      });
    })

    // Trata a resposta de sucesso
    .then((data) => {
      alert(data.message); // Exibe a mensagem de sucesso ao usuário
      window.location.href = "inicial.html"; // Redireciona para a página inicial
    })

    // Trata erros na requisição ou resposta
    .catch((error) => {
      alert("Erro no login: " + error.message); // Exibe a mensagem de erro ao usuário
    });
}
