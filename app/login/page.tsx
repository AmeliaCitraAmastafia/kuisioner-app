import { signIn } from "@/auth";
import Link from "next/link";

type LoginPageProps = { searchParams: Promise<{ error?: string }> };

const errorMessages: Record<string, string> = {
  AccessDenied: "Akun Anda tidak memiliki akses sebagai admin.",
  CallbackRouteError: "Login Google gagal. Silakan coba lagi.",
  Configuration: "Konfigurasi autentikasi belum lengkap.",
  OAuthAccountNotLinked: "Akun Google ini tidak dapat digunakan untuk login.",
  OAuthCallbackError: "Terjadi kesalahan saat kembali dari Google.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error
    ? errorMessages[error] ?? "Login gagal. Silakan coba lagi."
    : null;

  async function loginWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/admin" });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Login Admin</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Masuk menggunakan akun Google untuk mengakses dashboard admin.
        </p>
        {errorMessage && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>
        )}
        <form action={loginWithGoogle} className="mt-6">
          <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700">
            Login dengan Google
          </button>
        </form>
        <Link href="/" className="mt-4 block text-center text-sm font-medium text-slate-600 hover:text-slate-900">
          Kembali ke kuesioner
        </Link>
      </section>
    </main>
  );
}
