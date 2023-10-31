# PI-Analise-Dados (Frontend)

Este projeto foi criado utilizando o React [Create React App](https://github.com/facebook/create-react-app).

## Sobre

Este projeto é do PI (Projeto Integrador ) do curso de Engenheria de Computação da Univesp. O principal tema é análise de dados utilizando datasets públicos

## Requisitos

Para executar este projeto você precisa também estar executando o backend deste sistema, que está localizado em 
https://github.com/lucasdclopes/PI-Analise-Dados

Também é necessário instalar o node.js + npm. Os testes foram feitos na versão LTS 18.16.0, que inclui o npm 9.51
https://nodejs.org/en/download

## Dependências

Com os requisitos atendidos. É necessário instalar as dependências. Com um prompt de comando, navegue até o diretório onde o repositório foi clonado e execute o comando `npm install`. A execução do comando pode levar alguns minutos.

## Executando

Com tudo instalado, ainda no diretório clonado, execute `npm start` e aguarde alguns segundos. Normalmente o browser será aberto no endereço correto. Se não abrir, a URL padrão é  [http://localhost:3000](http://localhost:3000)

## Endereço do backend

Caso esteja executando o backend em um endereço customizado ou em outra máquina, é possível alterar o o http host no arquivo `src/services/HttpService/index.jsx` e altere o valor da variável `urlBase`
