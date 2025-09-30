export function isValidFullName(name) {
  return /^[A-Za-zğüşöçİĞÜŞÖÇ\s]+$/.test(name);
}

export function isValidPhone(phone) {
  return /^\d{11}$/.test(phone);
}

export function isValidEmail(email) {
  // basit email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
