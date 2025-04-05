import RegisterForm from "@/app/register/_components/RegisterForm";

export default function Register() {
  return (
    <main className="grid place-items-center min-h-screen">
      <section>
        <div>
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-sm text-muted-foreground">Create a new account</p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}
