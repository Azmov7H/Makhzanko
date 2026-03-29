import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get('saas_token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    // The Rust backend also checks for Cookie: saas_token=..., but passing as Bearer
    // or relying on Next.js passing the cookies forward. We can forward the cookie directly:
    headers['Cookie'] = `saas_token=${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Some endpoints might return empty body (e.g. 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) as T : {} as T;
}

// Example usage to replace Next.js Server Actions:
//
// export async function getProducts(page = 1) {
//   return fetchApi(`/products?page=${page}`, { cache: 'no-store' });
// }
//
// export async function createSale(data: any) {
//   return fetchApi(`/sales`, {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }
