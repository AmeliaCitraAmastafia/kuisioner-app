import { auth } from "@/auth";

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && getAdminEmails().has(email.toLowerCase()));
}

export async function getAdminSession() {
  const session = await auth();
  const email = session?.user?.email;

  return { session, isAdmin: isAdminEmail(email) };
}

export async function requireAdminApi(): Promise<Response | null> {
  const { session, isAdmin } = await getAdminSession();

  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized: silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  if (!isAdmin) {
    return Response.json(
      { message: "Forbidden: akun Anda tidak memiliki akses sebagai admin." },
      { status: 403 }
    );
  }

  return null;
}
