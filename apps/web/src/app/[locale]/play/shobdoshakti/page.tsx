import { setRequestLocale } from "next-intl/server";
import { Container } from "@alapon/ui";
import { GameShell } from "@/components/shobdoshakti/GameShell";

export default async function ShobdoShaktiPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <Container className="py-6 sm:py-10">
      <GameShell />
    </Container>
  );
}
