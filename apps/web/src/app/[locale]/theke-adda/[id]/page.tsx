import { setRequestLocale } from "next-intl/server";
import { PostThread } from "@/components/adda/PostThread";

export default async function PostPage({
  params: { locale, id }
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);

  return <PostThread postId={id} />;
}
