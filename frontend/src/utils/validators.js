/**
 * Conjunto de funções de validação para formulários
 */

/**
 * Valida um CPF
 * @param {string} cpf - CPF a ser validado (com ou sem máscara)
 * @returns {boolean} Retorna true se o CPF for válido
 */
export const isValidCpf = (cpf) => {
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // CPF deve ter 11 dígitos
  if (cleanCpf.length !== 11) return false;
  
  // Verifica CPFs com todos os dígitos iguais (inválidos)
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Cálculo do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder > 9 ? 0 : remainder;
  
  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder > 9 ? 0 : remainder;
  
  // Verifica se os dígitos calculados são iguais aos dígitos do CPF
  return (
    digit1 === parseInt(cleanCpf.charAt(9)) &&
    digit2 === parseInt(cleanCpf.charAt(10))
  );
};

/**
 * Validador de CPF que retorna mensagem de erro ou vazio se válido
 * @param {string} cpf - CPF a ser validado (com ou sem máscara)
 * @returns {string|null} Mensagem de erro ou null se for válido
 */
export const validateCpf = (cpf) => {
  if (!cpf) return 'CPF é obrigatório';
  
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) {
    return 'CPF deve ter 11 dígitos';
  }
  
  if (!isValidCpf(cpf)) {
    return 'CPF inválido';
  }
  
  return null;
};

/**
 * Valida um endereço de e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} Retorna true se o e-mail for válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validador de e-mail que retorna mensagem de erro ou vazio se válido
 * @param {string} email - E-mail a ser validado
 * @returns {string|null} Mensagem de erro ou null se for válido
 */
export const validateEmail = (email) => {
  if (!email) return 'E-mail é obrigatório';
  if (!isValidEmail(email)) return 'E-mail inválido';
  return null;
};

/**
 * Valida uma senha
 * @param {string} password - Senha a ser validada
 * @param {number} minLength - Tamanho mínimo da senha (default: 8)
 * @returns {boolean} Retorna true se a senha for válida
 */
export const isValidPassword = (password, minLength = 8) => {
  return password.length >= minLength;
};

/**
 * Validador de senha que retorna mensagem de erro ou vazio se válida
 * @param {string} password - Senha a ser validada
 * @param {number} minLength - Tamanho mínimo da senha (default: 8)
 * @returns {string|null} Mensagem de erro ou null se for válida
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) return 'Senha é obrigatória';
  
  if (password.length < minLength) {
    return `Senha deve ter pelo menos ${minLength} caracteres`;
  }
  
  return null;
};

/**
 * Valida se duas senhas são iguais
 * @param {string} password - Senha principal
 * @param {string} confirmPassword - Confirmação da senha
 * @returns {boolean} Retorna true se as senhas forem iguais
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validador de confirmação de senha
 * @param {string} password - Senha principal
 * @param {string} confirmPassword - Confirmação da senha
 * @returns {string|null} Mensagem de erro ou null se as senhas forem iguais
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirmação de senha é obrigatória';
  if (!passwordsMatch(password, confirmPassword)) return 'As senhas não conferem';
  return null;
};

/**
 * Criador de validadores obrigatórios
 * @param {string} fieldName - Nome do campo para a mensagem de erro
 * @returns {Function} Função validadora
 */
export const createRequiredValidator = (fieldName) => {
  return (value) => {
    if (!value || value.trim() === '') {
      return `${fieldName} é obrigatório`;
    }
    return null;
  };
};
