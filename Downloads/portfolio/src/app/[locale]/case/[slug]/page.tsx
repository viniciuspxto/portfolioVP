import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase, Case, pick } from "@/lib/supabase";
import { dict, categories, Locale } from "@/lib/dict";
import { Reveal, ProgressBar, SplitHeading } from "@/components/motion";

export const revalidate = 60;

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = dict[locale as Locale];

  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (!data) notFound();
  const c = data as Case;

  const { data: nextData } = await supabase
    .from("cases")
    .select("slug,title_pt,title_en,accent,cover_url")
    .eq("published", true)
    .neq("slug", slug)
    .order("sort_order", { ascending: true })
    .limit(1);
  const next = nextData?.[0];

  const l = locale as Locale;

  return (
    <article style={{ ["--case-accent" as string]: c.accent }}>
      <ProgressBar />

      {/* ── Hero full-bleed ──────────────────────────────────────────────── */}
      <header className="relative w-full h-[85vh] overflow-hidden bg-[color:var(--color-coal)]">
        {c.cover_url ? (
          <Image
            src={c.cover_url}
            alt={pick(c, "title", locale)}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${c.accent} 0%, #0c0c0e 130%)` }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Back link */}
        <div className="absolute top-8 left-0 right-0 px-8 md:px-16 z-10">
          <Link
            href={`/${locale}`}
            className="font-mono text-xs text-white/60 hover:text-white transition-colors"
          >
            ← {t.backHome}
          </Link>
        </div>

        {/* Title at bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16 z-10">
          <p className="font-mono text-xs tracking-[0.14em] uppercase mb-4" style={{ color: c.accent }}>
            {categories[c.category]?.[l] ?? c.category}
          </p>
          <h1 className="font-display font-medium text-white text-4xl md:text-7xl leading-[1.0] max-w-5xl">
            <SplitHeading text={pick(c, "title", locale)} delay={0.1} />
          </h1>
          {pick(c, "tagline", locale) && (
            <p className="mt-4 text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              {pick(c, "tagline", locale)}
            </p>
          )}
        </div>
      </header>

      {/* ── Metadata strip ───────────────────────────────────────────────── */}
      <div className="border-b hairline">
        <dl className="mx-auto max-w-6xl px-6 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-y-6">
          {([
            [t.client, c.client],
            [t.role, pick(c, "role", locale)],
            [t.year, c.year],
            [locale === "pt" ? "Categoria" : "Category", categories[c.category]?.[l] ?? c.category],
          ] as [string, string | null][])
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="border-l-2 pl-4" style={{ borderColor: c.accent }}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1.5 text-sm font-medium">{v}</dd>
              </div>
            ))}
        </dl>
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      {pick(c, "overview", locale) && (
        <section className="mx-auto max-w-6xl px-6 md:px-8 py-24 md:py-32 grid md:grid-cols-12 gap-8">
          <Reveal className="md:col-span-3">
            <h2 className="eyebrow sticky top-24">{t.context}</h2>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-5">
            <p className="text-2xl md:text-3xl leading-[1.5] font-display font-medium">
              {pick(c, "overview", locale)}
            </p>
          </Reveal>
        </section>
      )}

      {/* ── Primeira imagem da galeria — full-bleed ───────────────────────── */}
      {c.gallery?.[0] && (
        <div className="w-full aspect-[16/7] overflow-hidden relative">
          <Image src={c.gallery[0]} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      )}

      {/* ── Objetivos ────────────────────────────────────────────────────── */}
      {c.objectives?.length > 0 && (
        <section className="border-t hairline">
          <div className="mx-auto max-w-6xl px-6 md:px-8 py-24 grid md:grid-cols-12 gap-8">
            <Reveal className="md:col-span-3">
              <h2 className="eyebrow sticky top-24">{t.objectives}</h2>
            </Reveal>
            <div className="md:col-span-8 md:col-start-5 grid gap-5">
              {c.objectives.map((o, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="flex gap-5 items-baseline border-b hairline pb-5">
                    <span className="font-mono text-xs shrink-0" style={{ color: c.accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg md:text-xl font-medium">{o[l] || o.pt}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Processo — cada etapa com imagem full-bleed ───────────────────── */}
      {c.process?.length > 0 && (
        <section className="border-t hairline">
          <div className="mx-auto max-w-6xl px-6 md:px-8 pt-24 pb-8">
            <Reveal>
              <h2 className="eyebrow">{t.process}</h2>
            </Reveal>
          </div>

          {c.process.map((s, i) => (
            <div key={i} className="mb-0">
              {/* Texto da etapa */}
              <div className="mx-auto max-w-6xl px-6 md:px-8 py-16 grid md:grid-cols-12 gap-8 items-start">
                <Reveal className="md:col-span-4">
                  <span className="font-mono text-sm block mb-3" style={{ color: c.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-medium text-2xl md:text-3xl">
                    {l === "en" && s.title_en ? s.title_en : s.title_pt}
                  </h3>
                </Reveal>
                <Reveal className="md:col-span-7 md:col-start-6" delay={0.1}>
                  <p className="text-lg text-[color:var(--color-mist)] leading-relaxed">
                    {l === "en" && s.body_en ? s.body_en : s.body_pt}
                  </p>
                </Reveal>
              </div>

              {/* Imagem full-bleed da etapa */}
              {s.image_url && (
                <div className={`w-full overflow-hidden relative ${i % 2 === 0 ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
                  <Image src={s.image_url} alt="" fill sizes="100vw" className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ── Resultados — fundo escuro ─────────────────────────────────────── */}
      {c.results?.length > 0 && (
        <section className="bg-[color:var(--color-coal)] text-white">
          <div className="mx-auto max-w-6xl px-6 md:px-8 py-28 md:py-36">
            <Reveal>
              <h2 className="eyebrow !text-white/40">{t.results}</h2>
            </Reveal>
            <div className="mt-16 grid sm:grid-cols-3 gap-12">
              {c.results.map((m, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p
                    className="font-display font-semibold text-6xl md:text-7xl"
                    style={{ color: c.accent }}
                  >
                    {m.value}
                  </p>
                  <p className="mt-4 text-white/55 text-sm leading-relaxed">
                    {l === "en" && m.label_en ? m.label_en : m.label_pt}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Galeria de imagens ────────────────────────────────────────────── */}
      {(c.gallery?.length ?? 0) > 1 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8 mb-10">
            <Reveal>
              <h2 className="eyebrow">{locale === "pt" ? "Galeria" : "Gallery"}</h2>
            </Reveal>
          </div>

          {/* Primeira imagem grande (col-span 2) */}
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {c.gallery.slice(1).map((url, i) => (
                <Reveal
                  key={i}
                  delay={(i % 3) * 0.08}
                  className={i === 0 ? "md:col-span-2" : ""}
                >
                  <div
                    className={`relative overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
                      className="object-cover hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Próximo case ─────────────────────────────────────────────────── */}
      {next && (
        <div className="border-t hairline">
          <a
            href={`/${locale}/case/${next.slug}`}
            className="group block relative overflow-hidden"
            style={{ ["--case-accent" as string]: next.accent }}
          >
            {/* Background image sutil */}
            {next.cover_url && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                <Image src={next.cover_url} alt="" fill sizes="100vw" className="object-cover" />
              </div>
            )}
            <div className="relative mx-auto max-w-6xl px-6 md:px-8 py-20 md:py-28">
              <p className="eyebrow">{t.nextCase}</p>
              <p className="font-display font-medium text-3xl md:text-6xl mt-4 transition-colors duration-300 group-hover:text-[color:var(--case-accent)] leading-tight max-w-3xl">
                {l === "en" && next.title_en ? next.title_en : next.title_pt}
                <span className="inline-block ml-4 transition-transform duration-300 group-hover:translate-x-2">→</span>
              </p>
            </div>
          </a>
        </div>
      )}
    </article>
  );
}
