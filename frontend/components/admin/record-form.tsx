"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api, errorMessage, fetchAll } from "../../lib/api";
import {
  resources,
  type BusinessRecord,
  type RecordPayload,
  type Resource,
} from "../../lib/resources";
import { validateRecord } from "../../lib/validation";
import { Button } from "../ui/button";
import { Feedback, Field, SelectField, TextAreaField } from "../ui/field";

/** Tela de cadastro (sem id) ou edição (com id), separada da listagem. */
export function RecordForm({ resource, id }: { resource: Resource; id?: number }) {
  const router = useRouter();
  const { record, clients, loading, loadError } = useFormData(resource, id);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = readPayload(resource, new FormData(event.currentTarget));
    const invalid = validateRecord(resource, payload);
    setMessage(invalid ?? "");
    if (invalid) return;
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
  const needsClient = resource === "projetos" && clients.length === 0;
  return (
    <>
      <Link href={`/painel/${resource}`}>← Voltar à listagem</Link>
      <h1>
        {id ? "Editar" : "Cadastrar"} {resources[resource].singular}
      </h1>
      <Feedback message={message || loadError} />
      {loading ? (
        <p>Carregando…</p>
      ) : (
        !loadError && (
          <form className="admin-card admin-form" onSubmit={submit}>
            <Field
              name="name"
              label="Nome"
              minLength={2}
              maxLength={120}
              defaultValue={record?.name}
            />
            <TextAreaField
              name="description"
              label="Descrição"
              minLength={2}
              maxLength={1000}
              defaultValue={record?.description}
            />
            <ResourceFields resource={resource} record={record} clients={clients} />
            <Button loading={busy} loadingText="Salvando…" disabled={needsClient}>
              Salvar
            </Button>
          </form>
        )
      )}
    </>
  );
}

/** Campos que mudam conforme o cadastro. */
function ResourceFields({
  resource,
  record,
  clients,
}: {
  resource: Resource;
  record: BusinessRecord | null;
  clients: BusinessRecord[];
}) {
  if (resource === "clientes")
    return (
      <Field
        name="email"
        label="E-mail do cliente"
        type="email"
        maxLength={254}
        defaultValue={record?.email}
      />
    );
  if (resource === "parceiros")
    return (
      <Field
        name="website"
        label="Site do parceiro"
        type="url"
        placeholder="https://exemplo.com"
        maxLength={500}
        defaultValue={record?.website}
      />
    );
  if (resource === "projetos")
    return (
      <>
        <SelectField
          name="clientId"
          label="Cliente"
          placeholder="Selecione um cliente"
          options={clients.map((client) => ({ value: client.id, label: client.name }))}
          defaultValue={record?.clientId ?? ""}
        />
        {clients.length === 0 && (
          <p>
            Cadastre um <Link href="/painel/clientes/novo">cliente</Link> antes de criar um projeto.
          </p>
        )}
      </>
    );
  return null;
}

function readPayload(resource: Resource, form: FormData): RecordPayload {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const payload: RecordPayload = { name: text("name"), description: text("description") };
  if (resource === "clientes") payload.email = text("email");
  if (resource === "parceiros") payload.website = text("website");
  if (resource === "projetos") payload.clientId = Number(form.get("clientId"));
  return payload;
}

/** Carrega o registro (na edição) e a lista de clientes (para projetos). */
function useFormData(resource: Resource, id?: number) {
  const [record, setRecord] = useState<BusinessRecord | null>(null);
  const [clients, setClients] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [current, clientList] = await Promise.all([
          id ? api<BusinessRecord>(`/${resource}/${id}`) : Promise.resolve(null),
          resource === "projetos" ? fetchAll<BusinessRecord>("/clientes") : Promise.resolve([]),
        ]);
        if (!active) return;
        setRecord(current);
        setClients(clientList);
      } catch (error) {
        if (active) setLoadError(errorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [resource, id]);
  return { record, clients, loading, loadError };
}
