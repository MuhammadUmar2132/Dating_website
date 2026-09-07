import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText, Heart } from "lucide-react";

import { BubbaOfficialRulesAccordion } from "@/app/components/bubba/legal/BubbaOfficialRulesAccordion";
import { BubbaShell } from "@/app/components/bubba/BubbaShell";
import { BUBBA_LEGAL_DOCS, getLegalDoc } from "@/lib/bubba-legal";

import "@/styles/bubba.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BUBBA_LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Not found — Bubba" };
  return { title: `${doc.title} — Bubba`, description: doc.intro };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);

  if (!doc) {
    notFound();
  }

  const isRichHero = Boolean(doc.eyebrow || doc.illustration || doc.simpleVersion);

  return (
    <BubbaShell showCapture={false}>
      <div className={`bb-shell ${isRichHero ? "bb-shell--wide" : "bb-shell--narrow"} bb-doc`}>
        {isRichHero ? (
          <header className="bb-legal-hero">
            <div className="bb-legal-hero-top">
              <div className="bb-legal-hero-copy">
                {doc.eyebrow ? (
                  <p className="bb-legal-hero-eyebrow">{doc.eyebrow}</p>
                ) : null}
                <h1 className="bb-legal-hero-title">{doc.title}</h1>
                <p className="bb-legal-hero-intro">{doc.intro}</p>
                <p className="bb-legal-hero-updated">Last updated {doc.updated}</p>
              </div>

              {doc.illustration ? (
                <div className="bb-legal-hero-art" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doc.illustration} alt="" />
                </div>
              ) : null}
            </div>

            {doc.simpleVersion ? (
              <div className="bb-legal-simple-card">
                <div className="bb-legal-simple-main">
                  <div className="bb-legal-simple-icon" aria-hidden="true">
                    <FileText size={24} strokeWidth={1.8} />
                  </div>
                  <div className="bb-legal-simple-content">
                    <p className="bb-legal-simple-eyebrow">THE SIMPLE VERSION</p>
                    <p className="bb-legal-simple-text">{doc.simpleVersion.text}</p>
                  </div>
                </div>

                <div className="bb-legal-simple-side">
                  <p className="bb-legal-simple-note">{doc.simpleVersion.note}</p>
                  <Heart size={20} strokeWidth={1.6} className="bb-legal-simple-heart" />
                </div>
              </div>
            ) : null}
          </header>
        ) : (
          <>
            <h1 className="bb-display bb-display--md bb-doc-title">{doc.title}</h1>
            <p className="bb-doc-updated">Last updated: {doc.updated}</p>
            <p className="bb-lede" style={{ marginBottom: 32 }}>
              {doc.intro}
            </p>
          </>
        )}

        {doc.summary ? (
          <section className="bb-doc-summary">
            <h2>{doc.summary.heading}</h2>
            <dl>
              {doc.summary.items.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {doc.slug === "official-rules" ? (
          <BubbaOfficialRulesAccordion />
        ) : (
          <div className="bb-doc-body">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                {section.awaitingCopy ? (
                  <div className="bb-doc-placeholder">
                    <p>
                      <strong>Copy needed.</strong> This section is laid out and
                      ready — drop in the approved wording from counsel to
                      publish it.
                    </p>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}
      </div>
    </BubbaShell>
  );
}
