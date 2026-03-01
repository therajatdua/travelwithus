/* ============================================================
   Template: HomeTemplate
   ============================================================
   Page-level layout skeleton — positions organisms & sections.
   Templates define structure; pages inject data.
   ============================================================ */

import type { ReactNode } from "react";

interface HomeTemplateProps {
  hero: ReactNode;
  packages: ReactNode;
}

export default function HomeTemplate({ hero, packages }: HomeTemplateProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 py-12">
      <section>{hero}</section>
      <section>{packages}</section>
    </main>
  );
}
