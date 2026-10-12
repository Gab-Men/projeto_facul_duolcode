"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, errorMessage } from "../../lib/api";
import { resources, type BusinessRecord, type Page, type Resource } from "../../lib/resources";
import { Feedback } from "./field";
export function RecordList({ resource }: { resource: Resource }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<BusinessRecord> | null>(null);
  const [message, setMessage] = useState("");
  const [version, refresh] = useState(0);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage("");
    void api<Page<BusinessRecord>>(`/${resource}?page=${page}&pageSize=10`)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((error) => {
        if (active) {
          setData(null);
          setMessage(errorMessage(error));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resource, page, version]);
  async function remove(record: BusinessRecord) {
    if (!window.confirm(`Excluir “${record.name}”? Esta ação não pode ser desfeita.`)) return;
    setBusyId(record.id);
    setMessage("");
    try {
      await api(`/${resource}/${record.id}`, { method: "DELETE" });
      if (data?.items.length === 1 && page > 1) setPage(page - 1);
      else refresh((value) => value + 1);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  }
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));
  return (
    <>
      <div className="admin-title">
        <h1>{resources[resource].title}</h1>
        <Link className="admin-button" href={`/painel/${resource}/novo`}>
          Cadastrar {resources[resource].singular}
        </Link>
      </div>
      <Feedback message={message} />
      {loading ? (
        <p role="status">Carregando registros…</p>
      ) : (
        data && (
          <>
            <div className="admin-table-wrap">
              <table>
                <caption>{data.total} registro(s) na sua conta</caption>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((record) => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.description}</td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/painel/${resource}/${record.id}/editar`}>Editar</Link>
                          <button disabled={busyId !== null} onClick={() => void remove(record)}>
                            {busyId === record.id ? "Excluindo…" : "Excluir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.items.length === 0 && (
                <p className="admin-empty">Nenhum registro nesta página. Cadastre o primeiro.</p>
              )}
            </div>
            <div className="admin-pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Anterior
              </button>
              <span>
                Página {page} de {pages}
              </span>
              <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
                Próxima
              </button>
            </div>
          </>
        )
      )}
    </>
  );
}
