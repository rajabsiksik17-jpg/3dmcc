export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 6) return "••••";
  const last = digits.slice(-3);
  const first = digits.slice(0, 3);
  return `+${first}••••${last}`;
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "—";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}•••@${domain}`;
}

export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
