import { supabase, Case, pick } from "@/lib/supabase";
import { dict, categories, Locale } from "@/lib/dict";
import { Reveal, SplitHeading, ParallaxCard } from "@/components/motion";

export const revalidate = 60;

const MARQUEE_ITEMS = [
  "Product Design",
  "UX Research",
  "Brand Identity",
  "Design Systems",
  "Prototipagem",
  "Discovery",
  "Visual Design",
  "Estratégia",
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

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-44 md:pb-24">
        <Reveal>
          <p className="eyebrow">{t.heroEyebrow}</p>
        </Reveal>

        <h1 className="font-display font-semibold text-[11vw] md:text-[6rem] lg:text-[7rem] leading-[0.95] mt-6 tracking-tight">
          <SplitHeading text={t.heroLine1} delay={0.05} />
          <br />
          <SplitHeading
            text={t.heroLine2}
            className="text-[color:var(--color-mist)]"
            delay={0.2}
          />
        </h1>

        <Reveal delay={0.5} className="mt-10 max-w-xl">
          <p className="text-lg md:text-xl text-[color:var(--color-mist)] leading-relaxed">
            {t.heroSub}
          </p>
        </Reveal>
      </section>

      {/* ── Marquee strip ────────────────────────────────────────────────── */}
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
      <section id="work" className="mx-auto max-w-6xl px-6 py-20 md:py-32 grid gap-24 md:gap-36">
        <Reveal className="flex items-baseline justify-between">
          <h2 className="eyebrow">{t.work}</h2>
          <span className="font-mono text-xs text-[color:var(--color-mist)]">
            {String(cases.length).padStart(2, "0")}
          </span>
        </Reveal>

        {cases.map((c, i) => (
          <ParallaxCard
            key={c.id}
            href={`/${locale}/case/${c.slug}`}
            title={pick(c, "title", locale)}
            tagline={pick(c, "tagline", locale)}
            accent={c.accent}
            coverUrl={c.cover_url}
            index={i}
            portrait={i % 2 !== 0}
            categoryLabel={categories[c.category]?.[locale as Locale] ?? c.category}
            year={c.year}
            viewLabel={t.viewCase}
          />
        ))}
      </section>

      {/* ── About strip ──────────────────────────────────────────────────── */}
      <section className="bg-[color:var(--color-coal)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="eyebrow !text-white/40 mb-6">{locale === "pt" ? "Sobre" : "About"}</p>
            <p className="font-display font-semibold text-3xl md:text-5xl leading-[1.1]">
              {locale === "pt"
                ? "Designer focado em produto, pesquisa e identidade visual."
                : "Designer focused on product, research and visual identity."}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-white/60 text-lg leading-relaxed">
              {locale === "pt"
                ? "Trabalho na interseção entre estratégia de negócio, comportamento do usuário e execução visual — transformando problemas complexos em experiências claras e memoráveis."
                : "I work at the intersection of business strategy, user behaviour and visual craft — turning complex problems into clear, memorable experiences."}
            </p>
            <a
              href={`/${locale}#contact`}
              className="inline-block mt-8 font-medium text-white underline underline-offset-4 hover:text-[color:var(--color-ultra)] transition-colors"
            >
              {t.contactCta} →
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
