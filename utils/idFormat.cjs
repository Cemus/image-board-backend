function idFormat(id) {
  const idNumber = id.replace(/\D/g, "");
  return idNumber.substring(0, 8);
}

module.exports = { idFormat };
