"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePaginated } from "../../hooks/use-paginated";
import { api, errorMessage, fetchAll } from "../../lib/api";
import { resources, type BusinessRecord, type Resource } from "../../lib/resources";
import { DataTable, type Column } from "../ui/data-table";
import { Feedback } from "../ui/field";
import { Pagination } from "../ui/pagination";

/** Tela de listagem paginada usada pelos quatro CRUDs. */
export function RecordList({ resource }: { resource: Resource }) {
  const list = usePaginated<BusinessRecord>(`/${resource}`);
  const clientNames = useClientNames(resource === "projetos");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  async function remove(record: BusinessRecord) {
    if (!window.confirm(`Excluir “${record.name}”? Esta ação não pode ser desfeita.`)) return;
    setBusyId(record.id);
    setMessage("");
    try {
      await api(`/${resource}/${record.id}`, { method: "DELETE" });
      if (list.data?.items.length === 1 && list.page > 1) list.setPage(list.page - 1);
      else list.reload();
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  }
  return (
    <>
      <ListHeader resource={resource} />
      <Feedback message={message || list.error} />
      {list.loading ? (
        <p role="status">Carregando registros…</p>
      ) : (
        list.data && (
          <>
            <DataTable
              rows={list.data.items}
              columns={columnsFor(resource, clientNames)}
              rowKey={(record) => record.id}
              caption={`${list.data.total} registro(s) na sua conta`}
              emptyMessage="Nenhum registro nesta página. Cadastre o primeiro."
              actions={(record) => (
                <RowActions
                  editHref={`/painel/${resource}/${record.id}/editar`}
                  deleting={busyId === record.id}
                  disabled={busyId !== null}
                  onDelete={() => void remove(record)}
                />
              )}
            />
            <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} />
          </>
        )
      )}
    </>
  );
}

function ListHeader({ resource }: { resource: Resource }) {
  return (
    <div className="admin-title">
      <h1>{resources[resource].title}</h1>
      <Link className="admin-button" href={`/painel/${resource}/novo`}>
        Cadastrar {resources[resource].singular}
      </Link>
    </div>
  );
}

function RowActions({
  editHref,
  deleting,
  disabled,
  onDelete,
}: {
  editHref: string;
  deleting: boolean;
  disabled: boolean;
  onDelete: () => void;
}) {
  return (
    <>
      <Link href={editHref}>Editar</Link>
      <button type="button" disabled={disabled} onClick={onDelete}>
        {deleting ? "Excluindo…" : "Excluir"}
      </button>
    </>
  );
}

/** Colunas de cada cadastro; projetos mostram o cliente vinculado. */
function columnsFor(
  resource: Resource,
  clientNames: Map<number, string>,
): Column<BusinessRecord>[] {
  const name: Column<BusinessRecord> = { header: "Nome", cell: (record) => record.name };
  const description: Column<BusinessRecord> = {
    header: "Descrição",
    cell: (record) => record.description,
  };
  switch (resource) {
    case "clientes":
      return [name, { header: "E-mail", cell: (record) => record.email }, description];
    case "parceiros":
      return [
        name,
        {
          header: "Site",
          cell: (record) => (
            <a href={record.website} target="_blank" rel="noopener noreferrer">
              {record.website}
            </a>
          ),
        },
        description,
      ];
    case "projetos":
      return [
        name,
        {
          header: "Cliente",
          cell: (record) => clientNames.get(record.clientId ?? 0) ?? "Carregando…",
        },
        description,
      ];
    default:
      return [name, description];
  }
}

/** Nomes dos clientes, para exibir o relacionamento na lista de projetos. */
function useClientNames(enabled: boolean): Map<number, string> {
  const [names, setNames] = useState<Map<number, string>>(new Map());
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetchAll<BusinessRecord>("/clientes")
      .then((clients) => {
        if (active) setNames(new Map(clients.map((client) => [client.id, client.name])));
      })
      .catch(() => {
        if (active) setNames(new Map());
      });
    return () => {
      active = false;
    };
  }, [enabled]);
  return names;
}
