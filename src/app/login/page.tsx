import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold">Soy docente / evaluadora</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Ingresá con el email y la contraseña que te dieron desde tu
          institución.
        </p>
        <LoginForm next={next ?? "/panel"} />
      </div>
    </main>
  );
}
