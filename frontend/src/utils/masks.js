/**
 * Conjunto de funções de máscaras para formulários
 */

/**
 * Aplica máscara de CPF: 123.456.789-00
 * @param {string} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const maskCpf = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const cpf = value.replace(/\D/g, '');
  
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  } else if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  } else {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  }
};

/**
 * Aplica máscara de telefone: (11) 98765-4321 ou (11) 3456-7890
 * @param {string} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const maskPhone = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const phone = value.replace(/\D/g, '');
  
  if (phone.length <= 2) {
    return `(${phone}`;
  } else if (phone.length <= 6) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  } else if (phone.length <= 10) { // Telefone fixo
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  } else { // Celular
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
  }
};

/**
 * Aplica máscara de CEP: 12345-678
 * @param {string} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const maskCep = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const cep = value.replace(/\D/g, '');
  
  if (cep.length <= 5) {
    return cep;
  } else {
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  }
};

/**
 * Aplica máscara de data: 01/01/2023
 * @param {string} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const maskDate = (value) => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const date = value.replace(/\D/g, '');
  
  if (date.length <= 2) {
    return date;
  } else if (date.length <= 4) {
    return `${date.slice(0, 2)}/${date.slice(2)}`;
  } else {
    return `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;
  }
};

/**
 * Aplica máscara monetária: R$ 1.234,56
 * @param {string|number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const maskCurrency = (value) => {
  if (value === null || value === undefined) return '';
  
  // Converte para string e remove caracteres não numéricos
  let number = String(value).replace(/\D/g, '');
  
  // Converte para número e formata
  number = (parseInt(number, 10) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  
  return number;
};

/**
 * Remove todas as máscaras e retorna apenas números
 * @param {string} value - Valor com máscara
 * @returns {string} Apenas números
 */
export const unmask = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};
