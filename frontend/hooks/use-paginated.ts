"use client";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage, type Page } from "../lib/api";

export interface Paginated<T> {
  page: number;
  totalPages: number;
  data: Page<T> | null;
  loading: boolean;
  error: string;
  setPage: (page: number) => void;
  reload: () => void;
}

/** Carrega uma listagem paginada da API; reaproveitado pelos quatro CRUDs. */
export function usePaginated<T>(path: string, pageSize = 10): Paginated<T> {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api<Page<T>>(`${path}?page=${page}&pageSize=${pageSize}`, { signal: controller.signal })
      .then((result) => setData(result))
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setError(errorMessage(reason));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, page, pageSize, version]);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));
  return { page, totalPages, data, loading, error, setPage, reload };
}
