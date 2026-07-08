import { supabase, Case, pick } from "@/lib/supabase";
import { dict, categories, Locale } from "@/lib/dict";
import { Reveal, SplitHeading, CasesGrid } from "@/components/motion";

export const revalidate = 60;

const MARQUEE_ITEMS = [
  "Product Design", "UX Research", "Brand Identity",
  "Design Systems", "Prototipagem", "Discovery",
  "Visual Design", "Estratégia",
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = dict[locale as Locale];

  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const cases = (data ?? []) as Case[];
  const marquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const caseItems = cases.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: pick(c, "title", locale),
    subtitle: pick(c, "role", locale) || (categories[c.category]?.[locale as Locale] ?? c.category),
    accent: c.accent,
    coverUrl: c.cover_url,
    flexWeight: 1,
  }));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-52 md:pb-28">
        <Reveal>
          <p className="eyebrow">{t.heroEyebrow}</p>
        </Reveal>

        <h1 className="font-display font-medium text-[12vw] md:text-[7.5rem] leading-[0.92] mt-8 tracking-tight">
          <SplitHeading text={t.heroLine1} delay={0.05} />
          <br />
          <SplitHeading
            text={t.heroLine2}
            className="text-[color:var(--color-mist)]"
            delay={0.2}
          />
        </h1>

        <Reveal delay={0.55} className="mt-12 flex items-start gap-16 flex-wrap">
          <p className="text-lg text-[color:var(--color-mist)] leading-relaxed max-w-md">
            {t.heroSub}
          </p>
          <div className="text-right">
            <p className="eyebrow mb-1">{locale === "pt" ? "Disponível para projetos" : "Available for projects"}</p>
            <p className="font-mono text-xs text-[color:var(--color-ink)]">
              {locale === "pt" ? "São Paulo, Brasil · Remoto" : "São Paulo, Brazil · Remote"}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <div className="border-t border-b hairline overflow-hidden py-4 select-none">
        <div className="flex whitespace-nowrap">
          <div className="marquee-track flex gap-10 pr-10">
            {marquee.map((item, i) => (
              <span key={i} className="font-mono text-xs tracking-[0.14em] uppercase text-[color:var(--color-mist)]">
                {item}
                <span className="ml-10 text-[color:var(--color-line)]">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cases ────────────────────────────────────────────────────────── */}
      <section id="work" className="pt-20 md:pt-28 pb-28 md:pb-40">
        <div className="mx-auto max-w-6xl px-6 mb-10 flex items-baseline justify-between">
          <h2 className="eyebrow">{t.work}</h2>
          <span className="font-mono text-xs text-[color:var(--color-mist)]">
            {String(cases.length).padStart(2, "0")}
          </span>
        </div>

        {/* Grid 2 colunas — sem padding lateral para ir de borda a borda */}
        <CasesGrid items={caseItems} basePath={`/${locale}`} />

        <div className="mx-auto max-w-6xl px-6 mt-10">
          <Reveal delay={0.2}>
            <a
              href={`/${locale}#contact`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-mist)] hover:text-[color:var(--color-ink)] transition-colors"
            >
              {locale === "pt" ? "Iniciar um projeto" : "Start a project"} →
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section className="bg-[color:var(--color-coal)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-28 md:py-40 grid md:grid-cols-2 gap-20 items-center">
          <Reveal>
            <p className="eyebrow !text-white/30 mb-6">{locale === "pt" ? "Sobre" : "About"}</p>
            <p className="font-display font-medium text-3xl md:text-5xl leading-[1.1]">
              {locale === "pt"
                ? "Designer focado em produto, pesquisa e identidade visual."
                : "Designer focused on product, research and visual identity."}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-white/55 text-lg leading-relaxed">
              {locale === "pt"
                ? "Trabalho na interseção entre estratégia de negócio, comportamento do usuário e execução visual — transformando problemas complexos em experiências claras e memoráveis."
                : "I work at the intersection of business strategy, user behaviour and visual craft — turning complex problems into clear, memorable experiences."}
            </p>
            <a
              href={`/${locale}#contact`}
              className="inline-block mt-10 font-medium text-white underline underline-offset-4 hover:text-white/60 transition-colors"
            >
              {t.contactCta} →
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
