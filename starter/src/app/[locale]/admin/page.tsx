import { getTranslations } from "next-intl/server";

export default async function AdminOverviewPage() {
  const t = await getTranslations("admin.overview");
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">{t("heading")}</h1>
      <p className="text-sm text-muted-foreground">{t("empty")}</p>
    </section>
  );
}
