import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../lib/i18n";

export function BackButton() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <button
      onClick={() => router.history.back()}
      className="btn-ghost inline-flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" /> {t.common.back}
    </button>
  );
}
