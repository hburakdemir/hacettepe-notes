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

export function isValidPassword(password) {
  // 5 karakter, en az 1 büyük harf ve en az 1 noktalama işareti
  return /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/.test(password);
}