import { getFormatter, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// Placeholder public page. The design agent replaces it in stage 4 and Build.
const LAST_UPDATED = new Date("2026-01-01T00:00:00Z");

export default async function HomePage() {
  const t = await getTranslations("home");
  const format = await getFormatter();
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{t("heading")}</h1>
      <p className="text-lg text-muted-foreground">{t("lead")}</p>
      <div>
        <Button nativeButton={false} render={<Link href="/admin" />}>{t("cta")}</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("updated", { date: format.dateTime(LAST_UPDATED, { dateStyle: "long" }) })}
      </p>
    </main>
  );
}
