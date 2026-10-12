import Link from "next/link";
export default function Dashboard() {
  return (
    <>
      <p className="admin-eyebrow">ÁREA DE GESTÃO</p>
      <h1>Seu trabalho, organizado.</h1>
      <p>Comece cadastrando um cliente. Depois, registre um projeto vinculado a ele.</p>
      <div className="admin-grid">
        {[
          ["clientes", "Clientes", "Empresas e pessoas que você atende."],
          ["servicos", "Serviços", "Soluções que sua empresa oferece."],
          ["parceiros", "Parceiros", "Contatos que colaboram com seu trabalho."],
          ["projetos", "Projetos", "Trabalhos vinculados aos seus clientes."],
        ].map(([slug, name, text]) => (
          <Link className="admin-card" href={`/painel/${slug}`} key={slug}>
            <h2>{name}</h2>
            <p>{text}</p>
            <span>Abrir →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
