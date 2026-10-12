"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api, errorMessage } from "../../lib/api";
import { resources, type BusinessRecord, type Page, type Resource } from "../../lib/resources";
import { Field, Feedback } from "./field";
export function RecordForm({ resource, id }: { resource: Resource; id?: number }) {
  const router = useRouter();
  const [record, setRecord] = useState<BusinessRecord | null>(null);
  const [clients, setClients] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (id) {
          const result = await api<BusinessRecord>(`/${resource}/${id}`);
          if (active) setRecord(result);
        }
        if (resource === "projetos") {
          const items: BusinessRecord[] = [];
          let page = 1;
          while (true) {
            const result = await api<Page<BusinessRecord>>(`/clientes?page=${page}&pageSize=50`);
            items.push(...result.items);
            if (!active || items.length >= result.total || result.items.length === 0) break;
            page++;
          }
          if (active) setClients(items);
        }
      } catch (error) {
        if (active) {
          setMessage(errorMessage(error));
          setLoadFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [resource, id]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload: Omit<BusinessRecord, "id"> = {
      name: String(form.get("name")).trim(),
      description: String(form.get("description")).trim(),
    };
    if (resource === "clientes") payload.email = String(form.get("email")).trim();
    if (resource === "parceiros") payload.website = String(form.get("website")).trim();
    if (resource === "projetos") payload.clientId = Number(form.get("clientId"));
    if (payload.name.length < 2 || payload.description.length < 2) {
      setMessage("Nome e descrição precisam de pelo menos 2 caracteres.");
      return;
    }
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setMessage("Informe um e-mail válido.");
      return;
    }
    if (payload.website && !/^https?:\/\//.test(payload.website)) {
      setMessage("O endereço precisa começar com http:// ou https://.");
      return;
    }
    setBusy(true);
    try {
      await api(`/${resource}${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      router.push(`/painel/${resource}`);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link href={`/painel/${resource}`}>← Voltar à listagem</Link>
      <h1>
        {id ? "Editar" : "Cadastrar"} {resources[resource].singular}
      </h1>
      <Feedback message={message} />
      {loading ? (
        <p>Carregando…</p>
      ) : (
        !loadFailed && (
          <form className="admin-card admin-form" onSubmit={submit}>
            <Field
              name="name"
              label="Nome"
              minLength={2}
              maxLength={120}
              defaultValue={record?.name}
            />
            <label className="admin-field" htmlFor="description">
              Descrição
              <textarea
                id="description"
                name="description"
                required
                minLength={2}
                maxLength={1000}
                defaultValue={record?.description}
              />
            </label>
            {resource === "clientes" && (
              <Field
                name="email"
                label="E-mail do cliente"
                type="email"
                maxLength={254}
                defaultValue={record?.email}
              />
            )}
            {resource === "parceiros" && (
              <Field
                name="website"
                label="Site do parceiro"
                type="url"
                placeholder="https://exemplo.com"
                maxLength={500}
                defaultValue={record?.website}
              />
            )}
            {resource === "projetos" && (
              <>
                <label className="admin-field" htmlFor="clientId">
                  Cliente
                  <select
                    id="clientId"
                    name="clientId"
                    required
                    defaultValue={record?.clientId ?? ""}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>
                {clients.length === 0 && (
                  <p>
                    Cadastre um <Link href="/painel/clientes/novo">cliente</Link> antes de criar um
                    projeto.
                  </p>
                )}
              </>
            )}
            <button
              className="admin-button"
              disabled={busy || (resource === "projetos" && clients.length === 0)}
            >
              {busy ? "Salvando…" : "Salvar"}
            </button>
          </form>
        )
      )}
    </>
  );
}
