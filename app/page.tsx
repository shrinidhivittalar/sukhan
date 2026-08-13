import { redirect } from "next/navigation";
import Studio from "./studio";
import { getServerSession } from "./lib/session";

// The gate must run per-request; a cached render would leak one reader's
// studio to the next visitor.
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return <Studio user={session.user} />;
}
