import { AuthForm } from "../../components/admin/auth-form";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ cadastro?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      {params.cadastro === "ok" && (
        <p className="admin-notice" role="status">
          Conta criada. Entre com seu e-mail e senha.
        </p>
      )}
      <AuthForm />
    </>
  );
}
