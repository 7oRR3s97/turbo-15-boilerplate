export function getInitials(name?: string) {
  if (!name) return "";
  const names = name.split(" ");
  const firstName = names[0];
  if (names.length === 1) return firstName[0].toUpperCase();
  const lastName = names[names.length - 1];
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function getFirstLastName(name?: string) {
  if (!name) return "";
  const names = name.split(" ");
  const firstName = names[0];
  if (names.length === 1) return firstName;
  const lastName = names[names.length - 1];
  return `${firstName} ${lastName}`;
}

export function getFirstName(name?: string) {
  if (!name) return undefined;
  const names = name.split(" ");
  const firstName = names[0];
  return firstName;
}

export function getLastName(name?: string) {
  if (!name) return "";
  const names = name.split(" ");
  const lastName = names[names.length - 1];
  return lastName;
}
