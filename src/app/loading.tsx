import { getI18n } from "locales/server";
import { Loader2 } from "lucide-react";

export default async function Loading() {
  const t = await getI18n();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          {t("loading_message")}
        </p>
      </div>
    </div>
  );
}
