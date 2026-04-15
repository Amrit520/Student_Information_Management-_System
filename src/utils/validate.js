function isIntInRange(n, min, max) {
  const x = Number(n);
  return Number.isInteger(x) && x >= min && x <= max;
}

function requireString(value, fieldName, maxLen = 255) {
  if (typeof value !== "string") return `${fieldName} must be a string`;
  const v = value.trim();
  if (!v) return `${fieldName} is required`;
  if (v.length > maxLen) return `${fieldName} is too long (max ${maxLen})`;
  return null;
}

function optionalString(value, fieldName, maxLen = 255) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return `${fieldName} must be a string`;
  if (value.trim().length > maxLen) return `${fieldName} is too long (max ${maxLen})`;
  return null;
}

function requireEmail(email) {
  if (typeof email !== "string") return "Email must be a string";
  const v = email.trim();
  if (!v) return "Email is required";
  if (v.length > 120) return "Email is too long (max 120)";
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  if (!ok) return "Email format is invalid";
  return null;
}

module.exports = {
  isIntInRange,
  requireString,
  optionalString,
  requireEmail
};

