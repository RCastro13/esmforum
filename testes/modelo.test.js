const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

// Novo teste para cadastrar respostas e verificar a contagem
test('Testando cadastro de respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual é a capital da França?');
  const id_resposta1 = modelo.cadastrar_resposta(id_pergunta, 'Paris');
  const id_resposta2 = modelo.cadastrar_resposta(id_pergunta, 'Lyon');
  
  // Verifica se as respostas foram cadastradas corretamente
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('Paris');
  expect(respostas[1].texto).toBe('Lyon');
  
  // Verifica a contagem de respostas
  const num_respostas = modelo.get_num_respostas(id_pergunta);
  expect(num_respostas).toBe(2);
});

// Novo teste para verificar a função get_pergunta
test('Testando obter uma pergunta por ID', () => {
  const id_pergunta = modelo.cadastrar_pergunta('O que é Node.js?');
  const pergunta = modelo.get_pergunta(id_pergunta);
  
  // Verifica se a pergunta retornada é a mesma que foi cadastrada
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('O que é Node.js?');
});

// Novo teste para verificar a função get_respostas
test('Testando obter respostas para uma pergunta específica', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual é a linguagem de programação mais popular?');
  modelo.cadastrar_resposta(id_pergunta, 'JavaScript');
  modelo.cadastrar_resposta(id_pergunta, 'Python');
  
  const respostas = modelo.get_respostas(id_pergunta);
  
  // Verifica se o número de respostas é o esperado
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('JavaScript');
  expect(respostas[1].texto).toBe('Python');
});