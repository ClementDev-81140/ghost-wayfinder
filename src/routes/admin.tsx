import { requireAdmin } from "@/lib/auth";
{ Outlet, createFileRoute } from "@tanstack/react-router";

import { AdminNav } from "@/components/hud/AdminNav";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => requireAdmin(),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <main className="mx-auto max-w-6xl px-3 pb-16 tac-boot">
      <AdminNav />
      <Outlet />
    </main>
  );
}
