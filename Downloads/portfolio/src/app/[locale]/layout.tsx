import Link from "next/link";
import { dict, Locale } from "@/lib/dict";
import { notFound } from "next/navigation";
import { ScrollAwareHeader } from "@/components/motion";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "pt" && locale !== "en") notFound();
  const t = dict[locale as Locale];

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollAwareHeader>
        <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="font-display font-semibold tracking-tight text-lg"
          >
            vinicius<span style={{ color: "var(--case-accent, var(--color-ultra))" }}>.</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href={`/${locale}#work`} className="nav-link text-sm text-[color:var(--color-mist)]">
              <span className="nav-link__text">{t.work}</span>
              <span className="nav-link__clone" aria-hidden>{t.work}</span>
            </a>
            <a href={`/${locale}#contact`} className="nav-link text-sm text-[color:var(--color-mist)]">
              <span className="nav-link__text">{t.contactCta}</span>
              <span className="nav-link__clone" aria-hidden>{t.contactCta}</span>
            </a>
            <div className="font-mono text-xs flex gap-2">
              <Link href="/pt" className={locale === "pt" ? "underline underline-offset-4" : "text-[color:var(--color-mist)]"}>PT</Link>
              <span className="text-[color:var(--color-line)]">/</span>
              <Link href="/en" className={locale === "en" ? "underline underline-offset-4" : "text-[color:var(--color-mist)]"}>EN</Link>
            </div>
          </div>
        </nav>
      </ScrollAwareHeader>

      <main className="flex-1 pt-14">{children}</main>

      <footer id="contact" className="bg-[color:var(--color-coal)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <p className="eyebrow !text-white/50">{t.heroEyebrow}</p>
          <h2 className="font-display font-semibold text-4xl md:text-6xl mt-4 max-w-3xl leading-[1.05]">
            {t.contactTitle}
          </h2>
          <p className="mt-6 text-white/60 max-w-xl text-lg">{t.contactSub}</p>
          <a
            href="mailto:peixotovi@gmail.com"
            className="inline-block mt-10 rounded-full px-8 py-4 font-medium text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--case-accent, var(--color-ultra))" }}
          >
            {t.contactCta}
          </a>
          <div className="mt-24 pt-8 border-t border-white/10 flex items-center justify-between text-sm text-white/40">
            <span>© {new Date().getFullYear()} Vinicius Peixoto</span>
            <span className="font-mono text-xs">{t.footer}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
