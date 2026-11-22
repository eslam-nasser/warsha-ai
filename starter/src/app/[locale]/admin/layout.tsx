import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// The shared admin shell. Admin screens are minimal, dense and fast, and never indexed.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  const t = await getTranslations("admin");
  const nav = [
    { href: "/admin", label: t("nav.overview") },
    { href: "/admin/settings", label: t("nav.settings") },
  ] as const;
  return (
    <div className="flex min-h-svh">
      <aside className="w-56 shrink-0 border-e bg-sidebar px-3 py-4 text-sidebar-foreground">
        <p className="px-2 pb-4 text-sm font-semibold">{t("title")}</p>
        <nav className="flex flex-col gap-1 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-2 py-1.5 hover:bg-sidebar-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-6 block px-2 text-xs text-muted-foreground hover:underline">
          {t("back")}
        </Link>
      </aside>
      <main className="flex-1 px-6 py-4">{children}</main>
    </div>
  );
}
