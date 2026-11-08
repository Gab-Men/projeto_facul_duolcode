"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, errorMessage } from "../../lib/api";
import { fetchAllClients, resources, type BusinessRecord, type Page, type Resource } from "../../lib/resources";
import { Feedback } from "./field";
import { Pagination } from "./pagination";
const PAGE_SIZE = 10;

/** Resource-specific column shown next to name and description. */
function detailColumn(
  resource: Resource,
  clientNames: ReadonlyMap<number, string>,
): { title: string; value: (record: BusinessRecord) => string } | null {
  if (resource === "clientes") return { title: "E-mail", value: (record) => record.email ?? "" };
  if (resource === "parceiros") return { title: "Site", value: (record) => record.website ?? "" };
  if (resource === "projetos")
    return { title: "Cliente", value: (record) => clientNames.get(record.clientId ?? 0) ?? "—" };
  return null;
}

export function RecordList({ resource }: { resource: Resource }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<BusinessRecord> | null>(null);
  const [message, setMessage] = useState("");
  const [version, refresh] = useState(0);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientNames, setClientNames] = useState<ReadonlyMap<number, string>>(new Map());
  useEffect(() => {
    if (resource !== "projetos") return;
    let active = true;
    // Names are a convenience; the listing still works if this request fails.
    void fetchAllClients(() => active)
      .then((clients) => {
        if (active) setClientNames(new Map(clients.map((client) => [client.id, client.name])));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [resource]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage("");
    void api<Page<BusinessRecord>>(`/${resource}?page=${page}&pageSize=${PAGE_SIZE}`)
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
  const detail = detailColumn(resource, clientNames);
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
                    {detail && <th>{detail.title}</th>}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((record) => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.description}</td>
                      {detail && <td>{detail.value(record)}</td>}
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
            <Pagination page={page} total={data.total} pageSize={PAGE_SIZE} onChange={setPage} />
          </>
        )
      )}
    </>
  );
}
