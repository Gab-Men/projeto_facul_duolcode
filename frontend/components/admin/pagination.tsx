interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

/** Generic previous/next pagination used by any paginated listing. */
export function Pagination({ page, total, pageSize, onChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className="admin-pagination" aria-label="Paginação">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span aria-current="page">
        Página {page} de {pages}
      </span>
      <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Próxima
      </button>
    </nav>
  );
}
