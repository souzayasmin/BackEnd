// Espera o carregamento completo do conteúdo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona o formulário de login através do ID "login-form"
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    // Adiciona um evento "submit" ao formulário para capturar o envio
    loginForm.addEventListener("submit", function (event) {
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
    });
  }
});
