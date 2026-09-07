"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Gift,
  Lock,
  Mail,
  Scale,
  Shield,
  Star,
  User,
} from "lucide-react";

import {
  BUBBA_COMPETITION_RULES,
  type CompetitionRule,
} from "@/lib/bubba-legal";

function RuleIcon({ icon }: { icon: CompetitionRule["icon"] }) {
  switch (icon) {
    case "user":
      return <User size={20} strokeWidth={1.8} />;
    case "star":
      return <Star size={20} strokeWidth={1.8} />;
    case "chart":
      return <BarChart3 size={20} strokeWidth={1.8} />;
    case "gift":
      return <Gift size={20} strokeWidth={1.8} />;
    case "badge":
      return <CheckCircle2 size={20} strokeWidth={1.8} />;
    case "shield":
      return <Shield size={20} strokeWidth={1.8} />;
    case "scale":
      return <Scale size={20} strokeWidth={1.8} />;
    case "file":
      return <FileText size={20} strokeWidth={1.8} />;
    default:
      return <FileText size={20} strokeWidth={1.8} />;
  }
}

export function BubbaOfficialRulesAccordion() {
  const [openId, setOpenId] = useState<string | null>("how-invites-work");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleNavClick = (id: string) => {
    setOpenId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="bb-rules-layout" aria-label="Competition Rules Breakdown">
      {/* Left Sidebar */}
      <aside className="bb-rules-sidebar">
        <div className="bb-rules-sidebar-sticky">
          <p className="bb-rules-toc-eyebrow">ON THIS PAGE</p>

          <nav className="bb-rules-nav" aria-label="Rules Navigation">
            {BUBBA_COMPETITION_RULES.map((rule) => {
              const isActive = openId === rule.id;
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => handleNavClick(rule.id)}
                  className={`bb-rules-nav-btn ${isActive ? "bb-rules-nav-btn--active" : ""}`}
                >
                  <span className="bb-rules-nav-num">{rule.number}</span>
                  <span className="bb-rules-nav-text">
                    {rule.title.replace(/^\d+\.\s*/, "")}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="bb-rules-qa-card">
            <div className="bb-rules-qa-top">
              <div className="bb-rules-qa-icon" aria-hidden="true">
                <Mail size={20} strokeWidth={1.8} />
              </div>
              <div className="bb-rules-qa-copy">
                <h4 className="bb-rules-qa-title">Questions?</h4>
                <p className="bb-rules-qa-sub">We&rsquo;re here to help.</p>
              </div>
            </div>
            <a
              href="mailto:ambassadors@bubba.com"
              className="bb-rules-qa-link"
            >
              ambassadors@bubba.com
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </aside>

      {/* Right Accordion List */}
      <div className="bb-rules-content">
        <div className="bb-rules-accordion-group">
          {BUBBA_COMPETITION_RULES.map((rule) => {
            const isOpen = openId === rule.id;
            return (
              <div
                key={rule.id}
                id={rule.id}
                className={`bb-rules-item ${isOpen ? "bb-rules-item--open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(rule.id)}
                  className="bb-rules-header-btn"
                  aria-expanded={isOpen}
                >
                  <div className="bb-rules-header-left">
                    <div className="bb-rules-badge-icon" aria-hidden="true">
                      <RuleIcon icon={rule.icon} />
                    </div>
                    <span className="bb-rules-header-title">{rule.title}</span>
                  </div>

                  {!isOpen ? (
                    <span className="bb-rules-header-preview">
                      {rule.preview}
                    </span>
                  ) : null}

                  <div className="bb-rules-header-chevron" aria-hidden="true">
                    {isOpen ? (
                      <ChevronUp size={20} strokeWidth={1.8} />
                    ) : (
                      <ChevronDown size={20} strokeWidth={1.8} />
                    )}
                  </div>
                </button>

                {isOpen ? (
                  <div className="bb-rules-body">
                    <div className="bb-rules-grid">
                      {rule.columns.map((col) => (
                        <div key={col.title} className="bb-rules-col">
                          <h5 className="bb-rules-col-title">{col.title}</h5>
                          <p className="bb-rules-col-body">{col.body}</p>
                        </div>
                      ))}
                    </div>

                    {rule.note ? (
                      <div className="bb-rules-note-bar">
                        <Lock
                          size={16}
                          strokeWidth={2}
                          className="bb-rules-note-icon"
                          aria-hidden="true"
                        />
                        <span className="bb-rules-note-text">{rule.note}</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3rd Section: Rules Agreement & Back to Ambassador CTA */}
      <div className="bb-rules-cta-card" style={{ gridColumn: "1 / -1" }}>
        <div className="bb-rules-cta-left">
          <div className="bb-rules-cta-sparkles" aria-hidden="true">
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 2C11 8.07513 6.07513 13 0 13C6.07513 13 11 17.9249 11 24C11 17.9249 15.9249 13 22 13C15.9249 13 11 8.07513 11 2Z"
                stroke="#7190BA"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M25.5 17C25.5 20.5899 22.5899 23.5 19 23.5C22.5899 23.5 25.5 26.4101 25.5 30C25.5 26.4101 28.4101 23.5 32 23.5C28.4101 23.5 25.5 20.5899 25.5 17Z"
                stroke="#7190BA"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="bb-rules-cta-copy">
            <p className="bb-rules-cta-eyebrow">PLEASE READ CAREFULLY</p>
            <p className="bb-rules-cta-text">
              By participating in the Bubba Ambassador Program, you agree to these Official
              Competition Rules and to the decisions of Bubba, which are final and binding.
            </p>
          </div>
        </div>

        <Link href="/ambassadors" className="bb-rules-cta-btn">
          Back to ambassador page
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
