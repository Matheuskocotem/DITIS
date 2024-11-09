export function formatCpf(cpf) {
  let formattedCpf = cpf.replace(/\D/g, '');

  if (formattedCpf.length <= 11) {
    formattedCpf = formattedCpf.replace(/(\d{3})(\d)/, "$1.$2");
    formattedCpf = formattedCpf.replace(/(\d{3})(\d)/, "$1.$2");
    formattedCpf = formattedCpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return formattedCpf;
}
