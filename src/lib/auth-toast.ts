
export function withAuthToast(destination: string): string {
  const url = new URL(destination, "http://localhost");
  url.searchParams.set("authToast", "login");

  return `${url.pathname}${url.search}${url.hash}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}