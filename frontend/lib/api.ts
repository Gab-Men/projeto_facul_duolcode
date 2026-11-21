export const TOKEN_KEY = "duolcode.token";

/** Formato das listagens paginadas devolvidas pela API. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      0,
    );
  }
  if (!response.ok) {
    const body: { message?: string } = await response
      .json()
      .catch(() => ({ message: "O servidor não respondeu. Tente novamente." }));
    if (response.status === 401 && token) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("duolcode:session-expired"));
    }
    throw new ApiError(body.message ?? "Não foi possível concluir a operação.", response.status);
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

/** Busca todas as páginas de uma listagem (por exemplo, para montar o seletor de clientes). */
export async function fetchAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const result = await api<Page<T>>(`${path}?page=${page}&pageSize=50`);
    items.push(...result.items);
    if (items.length >= result.total || result.items.length === 0) return items;
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Não foi possível concluir. Tente novamente.";
}
