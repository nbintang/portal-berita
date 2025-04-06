import LoginForm from "@/app/login/_components/LoginForm";

export default function Login() {
  return (
    <main className="grid min-h-screen place-items-center">
      <section>
        <div>
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground text-sm">Login to your account</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
