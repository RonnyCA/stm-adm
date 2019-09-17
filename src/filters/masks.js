export function cpfOrCnpjMask(value) {
  if (!value) {
    return;
  }
  if (value.length > 11) {
    return `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12, 14)}`;
  }
  return `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9, 12)}`;
}

export function telefoneMask(telefone) {
  if (!telefone) {
    return;
  }
  if (telefone.length > 10) {
    return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 3)} ${telefone.substring(3, 7)}-${telefone.substring(7, 11)}`;
  }
  return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6, 10)}`;
}
