const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!apiBaseUrl) {
  console.warn('VITE_API_BASE_URL no configurada. Usando valor por defecto http://localhost:8080/api');
}

export const ENV = {
  API_BASE_URL: apiBaseUrl ?? 'http://localhost:8080/api'
};
