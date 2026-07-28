import { getAdminSummary } from "@/src/lib/summary";
import { requireAdminApi } from "@/src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const data = await getAdminSummary();
    return Response.json(data);
  } catch (error) {
    console.error("Failed to fetch admin summary:", error);
    return Response.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
