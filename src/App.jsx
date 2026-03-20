import { useState, useEffect, useRef } from "react";

const PAGES = {
  HOME: "home",
  FOR_YOU: "for-you",
  FREE_SESSION: "free-session",
  CORPORATE: "corporate",
  ABOUT: "about",
  CONTACT: "contact",
};

// ─── Animate on scroll hook ───
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Shared Components ───
function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setOpen(false); }, [page]);

  const link = (label, target) => (
    <button
      onClick={() => setPage(target)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
        letterSpacing: "0.04em", textTransform: "uppercase",
        color: page === target ? "#2E5650" : "#3a3a3a",
        fontWeight: page === target ? 600 : 400,
        padding: "4px 0", transition: "color 0.3s",
      }}
    >{label}</button>
  );

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,248,244,0.95)" : "rgba(250,248,244,0.8)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(46,86,80,0.1)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={() => setPage(PAGES.HOME)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{
              fontFamily: "'Mercado', serif", fontSize: "1.5rem",
              fontWeight: 600, color: "#2E5650", letterSpacing: "-0.02em",
            }}>WeWomen</span>
          </button>

          {/* Desktop nav */}
          <div style={{
            display: "flex", alignItems: "center", gap: 32,
          }} className="desktop-nav">
            {link("For You", PAGES.FOR_YOU)}
            {link("Corporate", PAGES.CORPORATE)}
            {link("About", PAGES.ABOUT)}
            {link("Contact", PAGES.CONTACT)}
            <button
              onClick={() => setPage(PAGES.FOR_YOU)}
              style={{
                background: "#2E5650", color: "#fff", border: "none",
                borderRadius: 100, padding: "10px 22px", cursor: "pointer",
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                fontWeight: 600, letterSpacing: "0.03em",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = "0 4px 20px rgba(46,86,80,0.3)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
            >Free Session</button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-menu-btn"
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "none", flexDirection: "column", gap: 5, padding: 8,
            }}
          >
            <span style={{ width: 24, height: 2, background: "#3a3a3a", borderRadius: 2, transition: "all 0.3s", transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ width: 24, height: 2, background: "#3a3a3a", borderRadius: 2, transition: "all 0.3s", opacity: open ? 0 : 1 }} />
            <span style={{ width: 24, height: 2, background: "#3a3a3a", borderRadius: 2, transition: "all 0.3s", transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          maxHeight: open ? 400 : 0, overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(.22,1,.36,1)",
          background: "rgba(250,248,244,0.98)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 24px 24px" }}>
            {link("For You", PAGES.FOR_YOU)}
            {link("Corporate", PAGES.CORPORATE)}
            {link("About", PAGES.ABOUT)}
            {link("Contact", PAGES.CONTACT)}
            <button
              onClick={() => setPage(PAGES.FOR_YOU)}
              style={{
                background: "#2E5650", color: "#fff", border: "none",
                borderRadius: 100, padding: "12px 22px", cursor: "pointer",
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                fontWeight: 600, marginTop: 4,
              }}
            >Free Session — It's Free</button>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#2E5650", color: "#E0E8EA", padding: "80px 24px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 48, marginBottom: 64,
        }}>
          <div>
            <span style={{
              fontFamily: "'Mercado', serif", fontSize: "1.8rem",
              fontWeight: 600, color: "#85a49a",
            }}>WeWomen</span>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
              lineHeight: 1.7, color: "#a3b5ab", marginTop: 16,
              fontStyle: "italic",
            }}>Your Health, Finally Understood.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#85a49a", marginBottom: 4 }}>Navigate</span>
            {[["For You", PAGES.FOR_YOU], ["Free Session", PAGES.FREE_SESSION], ["Corporate", PAGES.CORPORATE], ["About", PAGES.ABOUT]].map(([l, p]) => (
              <button key={p} onClick={() => setPage(p)} style={{
                background: "none", border: "none", color: "#b5c4ba", cursor: "pointer",
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem", textAlign: "left",
                padding: 0, transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "#b5c4ba"}
              >{l}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#85a49a", marginBottom: 4 }}>Get in Touch</span>
            <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem", color: "#b5c4ba" }}>hello@wewomen.fit</span>
            <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem", color: "#b5c4ba" }}>+31 6 13 46 63 79</span>
            <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem", color: "#b5c4ba" }}>IJburg, Amsterdam</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#85a49a", marginBottom: 4 }}>Stay in the loop</span>
            <p style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem", color: "#a3b5ab", lineHeight: 1.6 }}>New programmes, upcoming sessions, and the occasional piece of advice worth reading.</p>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <input placeholder="Your email" style={{
                flex: 1, padding: "10px 14px", border: "1px solid #3d5c55",
                borderRadius: 8, background: "rgba(255,255,255,0.05)",
                color: "#E0E8EA", fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                outline: "none",
              }} />
              <button style={{
                background: "#2E5650", color: "#fff", border: "none",
                borderRadius: 8, padding: "10px 16px", cursor: "pointer",
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem", fontWeight: 600,
              }}>Join</button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem", color: "#5E6B6E" }}>© 2026 WeWomen. All rights reserved.</span>
          <span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem", color: "#5E6B6E" }}>For Women, By Women</span>
        </div>
      </div>
    </footer>
  );
}

function Btn({ children, variant = "primary", onClick, style: s = {} }) {
  const base = {
    border: "none", borderRadius: 100, cursor: "pointer",
    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
    fontWeight: 600, letterSpacing: "0.02em",
    transition: "all 0.25s ease", display: "inline-flex",
    alignItems: "center", gap: 8,
  };
  const styles = {
    primary: { ...base, background: "#2E5650", color: "#fff", padding: "14px 32px", ...s },
    secondary: { ...base, background: "transparent", color: "#2E5650", padding: "14px 32px", border: "2px solid #2E5650", ...s },
    soft: { ...base, background: "rgba(46,86,80,0.08)", color: "#2E5650", padding: "14px 32px", ...s },
    rose: { ...base, background: "#b04646", color: "#fff", padding: "14px 32px", ...s },
  };
  return (
    <button
      onClick={onClick} style={styles[variant] || styles.primary}
      onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = variant === "primary" ? "0 6px 24px rgba(46,86,80,0.25)" : variant === "rose" ? "0 6px 24px rgba(176,70,70,0.3)" : "none"; }}
      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
    >{children}</button>
  );
}

function SectionLabel({ children, color = "#85a49a" }) {
  return (
    <span style={{
      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.72rem",
      textTransform: "uppercase", letterSpacing: "0.16em",
      color, fontWeight: 600,
    }}>{children}</span>
  );
}


// ═══════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════
function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "120px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(133,164,154,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(133,164,154,0.06) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 800, textAlign: "center", position: "relative" }}>
          <FadeIn>
            <SectionLabel color="#b04646">Evidence-based women's health</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
              fontWeight: 500, lineHeight: 1.15, color: "#2E5650",
              marginTop: 20, marginBottom: 24, letterSpacing: "-0.02em",
            }}>
              Your body is changing.{" "}
              <span style={{ color: "#2E5650" }}>We help you understand it.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.15rem",
              lineHeight: 1.7, color: "#5E6B6E", maxWidth: 560,
              margin: "0 auto 40px",
            }}>
              Evidence-based health education for women — whether you're preparing for what's ahead or already in the middle of it.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={() => setPage(PAGES.FOR_YOU)}>For me →</Btn>
              <Btn variant="rose" onClick={() => setPage(PAGES.CORPORATE)}>For my organisation →</Btn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Middle content */}
      <section style={{
        padding: "100px 24px", background: "#f3ede2",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 400, lineHeight: 1.3, color: "#2E5650",
              marginBottom: 24,
            }}>Let's be honest — something shifted.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.05rem",
              lineHeight: 1.8, color: "#4D5B5E",
            }}>
              The energy vanished. The sleep went sideways. Your body stopped playing by the old rules. And nobody told you why — or that hormones, stress, training and nutrition are all connected. Consider this your missing manual.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ marginTop: 36 }}>
              <Btn variant="soft" onClick={() => setPage(PAGES.CONTACT, "Free session — Understanding Your Body After 35")}>Start with our free session →</Btn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What we offer */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>How we help</SectionLabel>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 500, color: "#2E5650", marginTop: 12, marginBottom: 56,
            }}>Two ways to work with us</h2>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
          }}>
            <FadeIn delay={0.1}>
              <div style={{
                background: "#ffffff", borderRadius: 20, padding: "48px 36px",
                border: "1px solid rgba(133,164,154,0.2)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onClick={() => setPage(PAGES.FOR_YOU)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "rgba(133,164,154,0.15)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "1.6rem", marginBottom: 24,
                }}>✦</div>
                <h3 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.4rem",
                  fontWeight: 500, color: "#2E5650", marginBottom: 12,
                }}>For You</h3>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                  lineHeight: 1.7, color: "#5E6B6E", marginBottom: 24,
                }}>
                  Live sessions, online programmes, in-person classes in Amsterdam, and one-to-one coaching. For women who want to understand their bodies and take action.
                </p>
                <span style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                  color: "#2E5650", fontWeight: 600,
                }}>Explore options →</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div style={{
                background: "#ffffff", borderRadius: 20, padding: "48px 36px",
                border: "1px solid rgba(229,139,127,0.25)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onClick={() => setPage(PAGES.CORPORATE)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "rgba(229,139,127,0.15)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "1.6rem", marginBottom: 24,
                }}>◈</div>
                <h3 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.4rem",
                  fontWeight: 500, color: "#b04646", marginBottom: 12,
                }}>For Organisations</h3>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                  lineHeight: 1.7, color: "#5E6B6E", marginBottom: 24,
                }}>
                  Structured workplace programmes that support women through perimenopause and beyond. Pilots, cohorts, and long-term partnerships available.
                </p>
                <span style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                  color: "#b04646", fontWeight: 600,
                }}>Learn more →</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "100px 24px", background: "#2E5650" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <SectionLabel><span style={{ color: "rgba(255,255,255,0.5)" }}>Words from women</span></SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <blockquote style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              fontWeight: 400, fontStyle: "italic", lineHeight: 1.5,
              color: "#fff", margin: "32px 0 20px", padding: 0, border: "none",
            }}>
              "You've opened my mind — and my mindset. You two have given us a huge gift."
            </blockquote>
            <span style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
              color: "rgba(255,255,255,0.7)",
            }}>— Workshop participant</span>
          </FadeIn>

          <div style={{ height: 40 }} />

          <FadeIn delay={0.2}>
            <blockquote style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              fontWeight: 400, fontStyle: "italic", lineHeight: 1.6,
              color: "rgba(255,255,255,0.9)", margin: "0 0 20px", padding: 0, border: "none",
            }}>
              "Sarah and Stef explained everything clearly and gave us practical tools to actually do something about it. For too long, women's health has taken a backseat. Bravo to WeWomen."
            </blockquote>
            <span style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
              color: "rgba(255,255,255,0.7)",
            }}>— Workshop participant</span>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <FadeIn>
          <h2 style={{
            fontFamily: "'Mercado', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 400, color: "#2E5650", marginBottom: 16,
          }}>Not sure where to start?</h2>
          <p style={{
            fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1rem",
            color: "#5E6B6E", marginBottom: 32, maxWidth: 460, margin: "0 auto 32px",
          }}>
            Join our free 45-minute live session and see how we work — no commitment needed.
          </p>
          <Btn onClick={() => setPage(PAGES.CONTACT, "Free session — Understanding Your Body After 35")}>Reserve my free spot →</Btn>
        </FadeIn>
      </section>
    </div>
  );
}


// ═══════════════════════════════════════
// FOR YOU PAGE
// ═══════════════════════════════════════
function ForYouPage({ setPage }) {
  const tag = (label, color = "#85a49a") => (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 100,
      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.68rem",
      fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
      color, background: color === "#fff" ? "rgba(255,255,255,0.2)" : `${color}11`,
    }}>{label}</span>
  );

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "140px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>For You</SectionLabel>
            <h1 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 500, lineHeight: 1.2, color: "#2E5650",
              marginTop: 16, marginBottom: 20,
            }}>
              The more you understand your body, the more you can trust it.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.05rem",
              lineHeight: 1.7, color: "#5E6B6E",
            }}>
              Whether changes have started or not, understanding your body after 35 gives you the head start most women wish they'd had.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── START HERE ── */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              background: "linear-gradient(135deg, #85a49a 0%, #6b8f84 100%)",
              borderRadius: 24, padding: "48px 40px", color: "#fff",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -60, right: -60,
                width: 200, height: 200, borderRadius: "50%",
                background: "rgba(133,164,154,0.06)",
              }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {tag("Start here", "#fff")}
                {tag("Free", "#fff")}
              </div>
              <h2 style={{
                fontFamily: "'Mercado', serif", fontSize: "1.6rem",
                fontWeight: 500, marginBottom: 10,
              }}>Understanding Your Body After 35</h2>
              <p style={{
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                lineHeight: 1.7, opacity: 0.9, maxWidth: 480, marginBottom: 24,
              }}>
                A free 45-minute live session. Science-backed, practical, open to any woman 35+.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <button
                  onClick={() => setPage(PAGES.FOR_YOU)}
                  style={{
                    background: "#fff", color: "#85a49a", border: "none",
                    borderRadius: 100, padding: "14px 28px", cursor: "pointer",
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                    fontWeight: 600, transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                >Reserve my spot →</button>
                <span style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                  opacity: 0.7,
                }}>Wed April 8 · 19:30 CET</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ONLINE PROGRAMMES ── */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>Online Programmes</SectionLabel>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "1.4rem",
              fontWeight: 500, color: "#2E5650", marginTop: 10, marginBottom: 28,
            }}>Learn at your own pace</h2>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Featured: 4-week */}
            <FadeIn delay={0.05}>
              <div style={{
                background: "#ffffff", borderRadius: 20, padding: "40px 36px",
                border: "1px solid rgba(133,164,154,0.15)",
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {tag("Live programme")}
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 100,
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.68rem",
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "#fff", background: "#e58b7f",
                  }}>Now open</span>
                </div>
                <h3 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.4rem",
                  fontWeight: 500, color: "#2E5650", marginBottom: 6,
                }}>Your Body After 35</h3>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                  lineHeight: 1.7, color: "#4D5B5E", marginBottom: 20,
                }}>
                  4 live Wednesday evening sessions with Sarah and Stef. One topic per week — so you leave with the full picture.
                </p>

                <div className="grid-4" style={{ marginBottom: 24 }}>
                  {[
                    ["Week 1", "Why everything feels different"],
                    ["Week 2", "Training smarter, not harder"],
                    ["Week 3", "Nutrition without the noise"],
                    ["Week 4", "Stress, sleep & recovery"],
                  ].map(([w, t], i) => (
                    <div key={i} style={{
                      background: "#fff", borderRadius: 12, padding: "14px 16px",
                      border: "1px solid rgba(133,164,154,0.12)",
                    }}>
                      <span style={{
                        fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.68rem",
                        textTransform: "uppercase", letterSpacing: "0.1em",
                        color: "#85a49a", fontWeight: 600,
                      }}>{w}</span>
                      <p style={{
                        fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.84rem",
                        color: "#3a3a3a", marginTop: 3, lineHeight: 1.4,
                      }}>{t}</p>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.4rem",
                    fontWeight: 500, color: "#2E5650",
                  }}>€129</span>
                  <span style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                    color: "#b04646", fontWeight: 600,
                    background: "rgba(176,70,70,0.08)", padding: "5px 12px",
                    borderRadius: 100,
                  }}>Founding: €97 (first 10)</span>
                  <span style={{ flex: 1 }} />
                  <Btn variant="primary" onClick={() => setPage(PAGES.CONTACT, "Your Body After 35 — 4-week programme")} style={{ padding: "12px 24px", fontSize: "0.85rem" }}>Sign up →</Btn>
                </div>
              </div>
            </FadeIn>

            {/* Two smaller online products side by side */}
            <div className="grid-4-cards">
              <FadeIn delay={0.1}>
                <div style={{
                  background: "#fff", borderRadius: 16, padding: "28px 24px",
                  border: "1px solid rgba(0,0,0,0.06)", height: "100%",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ marginBottom: 12 }}>{tag("Recorded workshop")}</div>
                  <h4 style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.05rem",
                    fontWeight: 500, color: "#2E5650", marginBottom: 6,
                  }}>Know Your Floor</h4>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                    color: "#5E6B6E", lineHeight: 1.6, flex: 1, marginBottom: 16,
                  }}>Everything women are never taught about pelvic floor health. 90 minutes, watch anytime, as many times as you like.</p>
                  <div style={{
                    borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{
                      fontFamily: "'Mercado', serif", fontSize: "1.1rem",
                      fontWeight: 500, color: "#2E5650",
                    }}>€39</span>
                    <span onClick={() => setPage(PAGES.CONTACT, "Know Your Floor — Pelvic health webinar")} style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem",
                      color: "#2E5650", fontWeight: 600, cursor: "pointer",
                    }}>Get access →</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div style={{
                  background: "#fff", borderRadius: 16, padding: "28px 24px",
                  border: "1px solid rgba(0,0,0,0.06)", height: "100%",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ marginBottom: 12 }}>{tag("On demand")}</div>
                  <h4 style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.05rem",
                    fontWeight: 500, color: "#2E5650", marginBottom: 6,
                  }}>Stronger Together Workout Pack</h4>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                    color: "#5E6B6E", lineHeight: 1.6, flex: 1, marginBottom: 16,
                  }}>Strength, core, mobility and cardio workouts from home. Designed for women, all levels welcome.</p>
                  <div style={{
                    borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{
                      fontFamily: "'Mercado', serif", fontSize: "1.1rem",
                      fontWeight: 500, color: "#2E5650",
                    }}>€27</span>
                    <span onClick={() => setPage(PAGES.CONTACT, "Stronger Together Workout Pack")} style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem",
                      color: "#2E5650", fontWeight: 600, cursor: "pointer",
                    }}>Get the pack →</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── IN AMSTERDAM ── */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>In Amsterdam</SectionLabel>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "1.4rem",
              fontWeight: 500, color: "#2E5650", marginTop: 10, marginBottom: 28,
            }}>Train with us in person</h2>
          </FadeIn>

          <div className="grid-4-cards">
            <FadeIn delay={0.05}>
              <div style={{
                background: "#fff", borderRadius: 16, padding: "28px 24px",
                border: "1px solid rgba(0,0,0,0.06)", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ marginBottom: 12 }}>{tag("Group class")}</div>
                <h4 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.05rem",
                  fontWeight: 500, color: "#2E5650", marginBottom: 6,
                }}>Stronger Together</h4>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                  color: "#5E6B6E", lineHeight: 1.6, flex: 1, marginBottom: 16,
                }}>Energising group workout that builds strength, confidence and wellbeing. All levels.</p>
                <div style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                  color: "#4D5B5E", marginBottom: 16, lineHeight: 1.6,
                }}>
                  <span style={{ color: "#8A9599" }}>📍</span> Naar Zee, IJburg · <span style={{ color: "#8A9599" }}>🗓</span> Mon 18:30
                </div>
                <div style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.1rem",
                    fontWeight: 500, color: "#2E5650",
                  }}>€15<span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem", color: "#8A9599", fontWeight: 400 }}>/class</span></span>
                  <span onClick={() => setPage(PAGES.CONTACT, "Group classes — IJburg, Amsterdam")} style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem",
                    color: "#2E5650", fontWeight: 600, cursor: "pointer",
                  }}>Sign up →</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{
                background: "#fff", borderRadius: 16, padding: "28px 24px",
                border: "1px solid rgba(0,0,0,0.06)", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ marginBottom: 12 }}>{tag("Group class")}</div>
                <h4 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.05rem",
                  fontWeight: 500, color: "#2E5650", marginBottom: 6,
                }}>Power Up</h4>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                  color: "#5E6B6E", lineHeight: 1.6, flex: 1, marginBottom: 16,
                }}>Balance, agility, speed, mobility and core. Challenging, effective, and fun.</p>
                <div style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                  color: "#4D5B5E", marginBottom: 16, lineHeight: 1.6,
                }}>
                  <span style={{ color: "#8A9599" }}>📍</span> Naar Zee, IJburg · <span style={{ color: "#8A9599" }}>🗓</span> Wed 18:30
                </div>
                <div style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.1rem",
                    fontWeight: 500, color: "#2E5650",
                  }}>€15<span style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem", color: "#8A9599", fontWeight: 400 }}>/class</span></span>
                  <span onClick={() => setPage(PAGES.CONTACT, "Group classes — IJburg, Amsterdam")} style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem",
                    color: "#2E5650", fontWeight: 600, cursor: "pointer",
                  }}>Sign up →</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PERSONAL COACHING ── */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>Personal Coaching</SectionLabel>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "1.4rem",
              fontWeight: 500, color: "#2E5650", marginTop: 10, marginBottom: 28,
            }}>One-to-one support</h2>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div style={{
              background: "#ffffff", borderRadius: 20, padding: "36px 32px",
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}>
              {[
                { title: "Personal Training", who: "with Sarah", desc: "Tailored training designed around your body, goals and life.", tag: "Movement" },
                { title: "Nutrition Coaching", who: "with Stef", desc: "A clear, honest approach to eating well — one that works for your life.", tag: "Nutrition" },
                { title: "Lifestyle Coaching", who: "with Sarah & Stef", desc: "Movement, nutrition, stress, sleep — looked at as a whole, not in isolation.", tag: "Holistic" },
              ].map((item, i) => (
                <div key={i}>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 100,
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.68rem",
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "#85a49a", background: "rgba(133,164,154,0.1)",
                    marginBottom: 12,
                  }}>{item.tag}</span>
                  <h4 style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.05rem",
                    fontWeight: 500, color: "#2E5650", marginBottom: 2,
                  }}>{item.title}</h4>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.78rem",
                    color: "#8A9599", marginBottom: 8,
                  }}>{item.who}</p>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                    color: "#5E6B6E", lineHeight: 1.6,
                  }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{
              marginTop: 20, display: "flex",
              alignItems: "center", gap: 16, flexWrap: "wrap",
            }}>
              <Btn variant="soft" onClick={() => setPage(PAGES.CONTACT, "Personal coaching")} style={{ padding: "12px 24px", fontSize: "0.85rem" }}>Book a free discovery call →</Btn>
              <span style={{
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                color: "#5E6B6E",
              }}>From €95/session · In person or online</span>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}


// ═══════════════════════════════════════
// FREE SESSION PAGE
// ═══════════════════════════════════════
function FreeSessionPage({ setPage }) {
  return (
    <div>
      <section style={{
        padding: "140px 24px 80px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(133,164,154,0.06) 0%, transparent 70%)",
        }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <span style={{
              display: "inline-block", background: "#2E5650", color: "#fff",
              padding: "6px 18px", borderRadius: 100, marginBottom: 24,
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            }}>Free · 45 Minutes · Online</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 500, lineHeight: 1.2, color: "#2E5650",
              marginBottom: 12,
            }}>Understanding Your Body After 35</h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.1rem",
              lineHeight: 1.7, color: "#5E6B6E", fontStyle: "italic",
              marginBottom: 40,
            }}>
              A free live session with Sarah & Stef — before confusion or symptoms start.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Btn onClick={() => setPage(PAGES.CONTACT, "Free session — Understanding Your Body After 35")}>Save My Spot — It's Free →</Btn>
          </FadeIn>
        </div>
      </section>

      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.05rem",
              lineHeight: 1.8, color: "#4D5B5E", textAlign: "center",
              marginBottom: 56,
            }}>
              Your hormones, energy, sleep, stress and training are all connected. Most women are never taught how. This session changes that — grounded in science, free of jargon, built for any woman 35+.
            </p>
          </FadeIn>

          {/* Session details */}
          <div className="grid-4" style={{ marginBottom: 56, gap: 20 }}>
            {[
              { icon: "📅", label: "Date", value: "Wednesday April 8" },
              { icon: "🕐", label: "Time", value: "19:30 CET" },
              { icon: "💻", label: "Where", value: "Online (Google Meet)" },
              { icon: "💶", label: "Cost", value: "Free" },
            ].map((d, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{
                  textAlign: "center", padding: "28px 20px",
                  background: "#ffffff", borderRadius: 16,
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>{d.icon}</div>
                  <span style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.72rem",
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    color: "#8A9599",
                  }}>{d.label}</span>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1rem",
                    fontWeight: 600, color: "#2E5650", marginTop: 4,
                  }}>{d.value}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* What you'll learn */}
          <FadeIn>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "1.5rem",
              fontWeight: 500, color: "#2E5650", marginBottom: 28,
              textAlign: "center",
            }}>What we'll cover</h2>
          </FadeIn>

          <div style={{
            display: "flex", flexDirection: "column", gap: 20,
            marginBottom: 56,
          }}>
            {[
              { num: "01", title: "What's actually changing", desc: "The hormonal shifts happening in your body right now — explained simply.", color: "#85a49a" },
              { num: "02", title: "How to move differently", desc: "Why strength training matters more now than ever — and what to rethink about exercise.", color: "#85a49a" },
              { num: "03", title: "How to calm your system", desc: "Why stress hits differently now — and one breathing technique you'll practise live.", color: "#85a49a" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  display: "flex", gap: 20, alignItems: "flex-start",
                  padding: "28px 24px", background: "#fff",
                  borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)",
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.8rem",
                    fontWeight: 300, color: item.color, lineHeight: 1,
                    minWidth: 40,
                  }}>{item.num}</span>
                  <div>
                    <h3 style={{
                      fontFamily: "'Mercado', serif", fontSize: "1.1rem",
                      fontWeight: 500, color: "#2E5650", marginBottom: 4,
                    }}>{item.title}</h3>
                    <p style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                      lineHeight: 1.7, color: "#5E6B6E",
                    }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Bottom CTA */}
          <FadeIn>
            <div style={{
              textAlign: "center", padding: "48px 32px",
              background: "#f3ede2", borderRadius: 20,
            }}>
              <p style={{
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                color: "#5E6B6E", fontStyle: "italic", marginBottom: 8,
              }}>No prior knowledge needed. No symptoms required.</p>
              <p style={{
                fontFamily: "'Mercado', serif", fontSize: "1.3rem",
                fontWeight: 500, color: "#2E5650", marginBottom: 24,
              }}>Just curiosity.</p>
              <Btn onClick={() => setPage(PAGES.CONTACT, "Free session — Understanding Your Body After 35")}>Save My Spot →</Btn>

              <div style={{
                marginTop: 40, paddingTop: 32,
                borderTop: "1px solid rgba(0,0,0,0.06)",
              }}>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                  color: "#8A9599", marginBottom: 12,
                }}>Already know you want more?</p>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                  color: "#4D5B5E", marginBottom: 16,
                }}>
                  Our 4-week live series <strong>Your Body After 35</strong> covers everything in proper depth. Founding cohort: €97 for the first 10.
                </p>
                <Btn variant="soft" onClick={() => setPage(PAGES.CONTACT, "Your Body After 35 — 4-week programme")}>See the full programme →</Btn>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}


// ═══════════════════════════════════════
// CORPORATE PAGE
// ═══════════════════════════════════════
function CorporatePage({ setPage }) {
  return (
    <div>
      <section style={{
        padding: "140px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -150,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(229,139,127,0.06) 0%, transparent 70%)",
        }} />
        <div style={{ maxWidth: 740, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <SectionLabel color="#b04646">For Organisations</SectionLabel>
            <h1 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 500, lineHeight: 1.2, color: "#b04646",
              marginTop: 16, marginBottom: 20,
            }}>
              Invest in the women who keep your organisation running.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.05rem",
              lineHeight: 1.7, color: "#5E6B6E",
            }}>
              Your most experienced employees are navigating a stage of life that affects energy, focus, sleep and long-term health. Most organisations do nothing about it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What we do */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              background: "#ffffff", borderRadius: 20, padding: "48px",
            }}>
              <p style={{
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.05rem",
                lineHeight: 1.8, color: "#4D5B5E", marginBottom: 0,
              }}>
                WeWomen brings evidence-based health education directly into your workplace. We help women understand what's changing, build sustainable habits, and show up at their strongest.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How we work with you */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel color="#b04646">How we work with you</SectionLabel>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "1.6rem",
              fontWeight: 500, color: "#b04646", marginTop: 12, marginBottom: 56,
            }}>Three levels of support</h2>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24, alignItems: "stretch",
          }}>
            {/* EDUCATE */}
            <FadeIn>
              <div style={{
                background: "#fff", borderRadius: 20, padding: "36px 28px",
                border: "1px solid rgba(0,0,0,0.06)", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  width: 32, height: 3, borderRadius: 2, marginBottom: 20,
                  background: "#e58b7f",
                }} />
                <h3 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.3rem",
                  fontWeight: 500, color: "#b04646", marginBottom: 6,
                }}>Educate</h3>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                  color: "#8A9599", marginBottom: 20,
                }}>Open the conversation</p>
                <div style={{
                  display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 24,
                }}>
                  {["Half-day or full-day kickstart workshop", "Lunch & learn sessions (single topic)", "Manager awareness briefing", "Online resource access for all participants"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#b04646", fontSize: "0.8rem", marginTop: 2 }}>✓</span>
                      <span style={{
                        fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.86rem",
                        lineHeight: 1.5, color: "#4D5B5E",
                      }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 20,
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.15rem",
                    fontWeight: 500, color: "#b04646",
                  }}>From €2,500</span>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.78rem",
                    color: "#8A9599", marginTop: 4,
                  }}>Per session · group size flexible</p>
                </div>
              </div>
            </FadeIn>

            {/* EMPOWER */}
            <FadeIn delay={0.1}>
              <div style={{
                background: "#e58b7f", borderRadius: 20, padding: "36px 28px",
                color: "#fff", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  width: 32, height: 3, borderRadius: 2, marginBottom: 20,
                  background: "rgba(255,255,255,0.35)",
                }} />
                <h3 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.3rem",
                  fontWeight: 500, marginBottom: 6,
                }}>Empower</h3>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                  opacity: 0.7, marginBottom: 20,
                }}>Change behaviour</p>
                <div style={{
                  display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 24,
                }}>
                  {["6-week pilot or 12-week cohort programme", "Live sessions + weekly digital support", "Baseline & endline pulse checks", "Impact summary with HR recommendations", "Optional: monthly half-day format"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 2 }}>✓</span>
                      <span style={{
                        fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.86rem",
                        lineHeight: 1.5, opacity: 0.9,
                      }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 20,
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.15rem",
                    fontWeight: 500,
                  }}>€4,500 – €12,000</span>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.78rem",
                    opacity: 0.6, marginTop: 4,
                  }}>Depends on length and group size</p>
                </div>
              </div>
            </FadeIn>

            {/* EMBED */}
            <FadeIn delay={0.2}>
              <div style={{
                background: "#fff", borderRadius: 20, padding: "36px 28px",
                border: "1px solid rgba(0,0,0,0.06)", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  width: 32, height: 3, borderRadius: 2, marginBottom: 20,
                  background: "#e58b7f",
                }} />
                <h3 style={{
                  fontFamily: "'Mercado', serif", fontSize: "1.3rem",
                  fontWeight: 500, color: "#b04646", marginBottom: 6,
                }}>Embed</h3>
                <p style={{
                  fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                  color: "#8A9599", marginBottom: 20,
                }}>Build it into your culture</p>
                <div style={{
                  display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 24,
                }}>
                  {["Multiple cohorts per year", "Manager enablement sessions", "Internal champion training", "Quarterly impact reviews", "1:1 coaching & specialist add-ons"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#b04646", fontSize: "0.8rem", marginTop: 2 }}>✓</span>
                      <span style={{
                        fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.86rem",
                        lineHeight: 1.5, color: "#4D5B5E",
                      }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 20,
                }}>
                  <span style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.15rem",
                    fontWeight: 500, color: "#b04646",
                  }}>From €2,000/month</span>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.78rem",
                    color: "#8A9599", marginTop: 4,
                  }}>Plus cohort delivery fees</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              background: "#f3ede2", borderRadius: 20, padding: "56px 48px",
              textAlign: "center",
            }}>
              {/* Header + KLM logo */}
              <p style={{
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem",
                textTransform: "uppercase", letterSpacing: "0.1em", color: "#b04646",
                marginBottom: 16,
              }}>Trusted by</p>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c7/KLM_logo.svg"
                alt="KLM Royal Dutch Airlines"
                style={{ height: 48, marginBottom: 32, opacity: 0.85 }}
              />
              <p style={{
                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1rem",
                color: "#5E6B6E", lineHeight: 1.8, marginBottom: 40, maxWidth: 600,
                margin: "0 auto 40px",
              }}>
                We delivered our 12-week programme to women at KLM — and the results speak for themselves.
              </p>

              {/* Stats row */}
              <div style={{
                display: "flex", justifyContent: "center", gap: 48, marginBottom: 48,
                flexWrap: "wrap",
              }}>
                {[
                  { stat: "94%", label: "felt more confident about their health" },
                  { stat: "89%", label: "made lasting lifestyle changes" },
                  { stat: "4.8/5", label: "average programme rating" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center", minWidth: 160 }}>
                    <p style={{
                      fontFamily: "'Mercado', serif", fontSize: "2rem",
                      color: "#b04646", marginBottom: 8,
                    }}>{s.stat}</p>
                    <p style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.8rem",
                      color: "#5E6B6E", lineHeight: 1.5, maxWidth: 160,
                    }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div style={{
                display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
              }}>
                {[
                  { quote: "I finally understand what's happening in my body — and I feel so much more in control.", name: "Programme participant, KLM" },
                  { quote: "The sessions were eye-opening. I wish I'd had this knowledge ten years ago.", name: "Programme participant, KLM" },
                  { quote: "It brought our team closer together and started conversations we'd never had before.", name: "Programme participant, KLM" },
                ].map((t, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 16, padding: "28px 24px",
                    flex: "1 1 240px", maxWidth: 280, textAlign: "left",
                  }}>
                    <p style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                      color: "#4D5B5E", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16,
                    }}>"{t.quote}"</p>
                    <p style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem",
                      color: "#8A9599",
                    }}>— {t.name}</p>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: "'Mercado', serif", fontSize: "1.2rem",
                fontWeight: 500, color: "#b04646", marginTop: 40,
              }}>
                If that's you, let's talk.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "20px 24px 100px", textAlign: "center" }}>
        <FadeIn>
          <Btn variant="rose" onClick={() => setPage(PAGES.CONTACT, "Corporate — Employer fit call")}>Book an employer fit call →</Btn>
          <p style={{
            fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
            color: "#8A9599", marginTop: 16,
          }}>20 minutes. No commitment. Just a conversation.</p>
        </FadeIn>
      </section>
    </div>
  );
}


// ═══════════════════════════════════════
// ABOUT PAGE (bonus — needed for nav)
// ═══════════════════════════════════════
function AboutPage({ setPage }) {
  return (
    <div>
      <section style={{ padding: "140px 24px 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>About</SectionLabel>
            <h1 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 500, lineHeight: 1.2, color: "#2E5650",
              marginTop: 16, marginBottom: 24,
            }}>We started asking questions. We couldn't stop.</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1.05rem",
              lineHeight: 1.8, color: "#4D5B5E", marginBottom: 20,
            }}>
              Women's health has been an afterthought for too long. The information exists — nobody made it their job to give it to you.
            </p>
            <p style={{
              fontFamily: "'Mercado', serif", fontSize: "1.2rem",
              fontWeight: 500, color: "#2E5650",
            }}>That's what we're here to change.</p>
          </FadeIn>
        </div>
      </section>

      {/* What drives us */}
      <section style={{ padding: "60px 24px", background: "#f3ede2" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Mercado', serif", fontSize: "1.5rem",
              fontWeight: 500, color: "#2E5650", marginBottom: 20,
            }}>What drives us</h2>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1rem",
              lineHeight: 1.8, color: "#4D5B5E", marginBottom: 20,
            }}>
              No quick fixes. No scare tactics. Just clear, practical information that changes how women live. Small, consistent changes built on real knowledge beat any crash programme.
            </p>
            <p style={{
              fontFamily: "'Mercado', serif", fontSize: "1.15rem",
              color: "#2E5650", fontWeight: 500,
            }}>
              We're not here to add years to your life. We're here to add life to your years.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Meet us */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>Meet us</SectionLabel>
          </FadeIn>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 40, marginTop: 32,
          }}>
            {[
              {
                name: "Sarah",
                intro: "I'm a personal trainer and women's health specialist with a background in both fitness and psychology. I'm a mother of two and an expat in Amsterdam.",
                belief: "I believe every woman deserves to feel seen — not judged, not dismissed, just genuinely heard. When you feel safe, something opens up.",
                certs: "Personal Trainer (EIF) · Pre & Postnatal Coach (ISSA) · CES · Women's Coaching Specialist (GGS) · Fitness & Motivation Coach (EIF)",
              },
              {
                name: "Stef",
                intro: "I spent over a decade as a media executive before following my passion for sports and women's health. Originally from Germany and a mother of two.",
                belief: "My goal is to take what feels complicated or out of reach and make it something you can actually grasp — and act on.",
                certs: "Personal Trainer (NASM) · Pre & Postnatal Coach (GGS) · Menopause Specialist (GGS) · Nutrition Coach (PN1) · Metabolic Health (PN)",
              },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  background: "#ffffff", borderRadius: 20, padding: "40px 32px",
                  borderTop: "3px solid #85a49a",
                }}>
                  <h3 style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.4rem",
                    fontWeight: 500, color: "#2E5650", marginBottom: 16,
                  }}>Hi, I'm {p.name}.</h3>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.92rem",
                    lineHeight: 1.7, color: "#4D5B5E", marginBottom: 16,
                  }}>{p.intro}</p>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.92rem",
                    lineHeight: 1.7, color: "#4D5B5E", marginBottom: 20,
                    fontStyle: "italic",
                  }}>{p.belief}</p>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.78rem",
                    color: "#8A9599", lineHeight: 1.6,
                  }}>{p.certs}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1rem",
              lineHeight: 1.8, color: "#4D5B5E", marginTop: 48,
              textAlign: "center", maxWidth: 600, margin: "48px auto 0",
            }}>
              Together we've delivered our programme to women — online, in person, and inside organisations like KLM. We built WeWomen for every woman who wants to understand her body better.
            </p>
          </FadeIn>
        </div>
      </section>

      <section style={{ padding: "20px 24px 100px", textAlign: "center" }}>
        <FadeIn>
          <Btn onClick={() => setPage(PAGES.CONTACT, "Free session — Understanding Your Body After 35")}>Start with our free session →</Btn>
        </FadeIn>
      </section>
    </div>
  );
}


// ═══════════════════════════════════════
// CONTACT PAGE (simple — needed for nav)
// ═══════════════════════════════════════
function ContactPage({ interest, setInterest }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const interests = [
    "Free session — Understanding Your Body After 35",
    "Your Body After 35 — 4-week programme",
    "Know Your Floor — Pelvic health webinar",
    "Stronger Together Workout Pack",
    "Group classes — IJburg, Amsterdam",
    "Personal coaching",
    "Corporate — Employer fit call",
    "General enquiry",
  ];

  const is = {
    padding: "14px 18px", border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 12, fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: "0.9rem", background: "#fff", outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  return (
    <div>
      <section style={{ padding: "140px 24px 100px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>Contact</SectionLabel>
            <h1 style={{
              fontFamily: "'Mercado', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 500, color: "#2E5650", marginTop: 16, marginBottom: 20,
            }}>We'd love to hear from you.</h1>
            <p style={{
              fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "1rem",
              lineHeight: 1.7, color: "#5E6B6E", marginBottom: 40,
            }}>
              Whether you have a question, want to bring WeWomen into your organisation, or just want to say hello — we're here.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              display: "flex", flexDirection: "column", gap: 20,
              marginBottom: 48,
            }}>
              {[
                { label: "Email", value: "hello@wewomen.fit", href: "mailto:hello@wewomen.fit" },
                { label: "WhatsApp", value: "+31 6 13 46 63 79", href: "https://wa.me/31613466379" },
                { label: "Location", value: "IJburg, Amsterdam" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <span style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                    color: "#8A9599", textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{item.label}</span>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                      color: "#2E5650", fontWeight: 500, textDecoration: "none",
                      borderBottom: "1px solid rgba(0,0,0,0.1)",
                    }}>{item.value}</a>
                  ) : (
                    <span style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.95rem",
                      color: "#2E5650", fontWeight: 500,
                    }}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ background: "#ffffff", borderRadius: 20, padding: "40px 32px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "rgba(46,86,80,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px", fontSize: "1.5rem", color: "#2E5650",
                  }}>✓</div>
                  <h3 style={{
                    fontFamily: "'Mercado', serif", fontSize: "1.3rem",
                    fontWeight: 500, color: "#2E5650", marginBottom: 8,
                  }}>Thanks{name ? `, ${name}` : ""}!</h3>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                    color: "#5E6B6E", lineHeight: 1.6, marginBottom: 4,
                  }}>We'll get back to you within 2 business days.</p>
                  {interest && <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.82rem",
                    color: "#8A9599",
                  }}>Re: {interest}</p>}
                  <button
                    onClick={() => { setSent(false); setName(""); setEmail(""); setMsg(""); setInterest(""); }}
                    style={{
                      background: "none", border: "none", color: "#2E5650",
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.85rem",
                      fontWeight: 600, cursor: "pointer", marginTop: 20,
                    }}
                  >Send another message</button>
                </div>
              ) : (
                <>
                  <p style={{
                    fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.9rem",
                    color: "#5E6B6E", marginBottom: 24,
                  }}>Tell us what you're interested in and we'll get back to you within 2 business days.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                      <select value={interest || ""} onChange={e => setInterest(e.target.value)} style={{
                        ...is, appearance: "none", WebkitAppearance: "none",
                        cursor: "pointer", color: interest ? "#2C2C2C" : "#8A9599", paddingRight: 40,
                      }}>
                        <option value="">I'm interested in...</option>
                        {interests.map((o, i) => <option key={i} value={o}>{o}</option>)}
                      </select>
                      <span style={{
                        position: "absolute", right: 18, top: "50%",
                        transform: "translateY(-50%)", pointerEvents: "none",
                        color: "#8A9599", fontSize: "0.7rem",
                      }}>▼</span>
                    </div>
                    <input placeholder="First name" value={name} onChange={e => setName(e.target.value)} style={is} />
                    <input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} style={is} />
                    <textarea placeholder="Anything else? (optional)" rows={3} value={msg} onChange={e => setMsg(e.target.value)} style={{ ...is, resize: "vertical" }} />
                    <Btn
                      variant="rose"
                      onClick={() => { if (name && email) setSent(true); }}
                      style={{ opacity: (name && email) ? 1 : 0.5 }}
                    >Send →</Btn>
                    <p style={{
                      fontFamily: "'Montserrat Alternates', sans-serif", fontSize: "0.75rem",
                      color: "#8A9599", textAlign: "center",
                    }}>Or email us directly at hello@wewomen.fit</p>
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}


// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const [interest, setInterest] = useState("");

  const navigate = (p, intr) => {
    setPage(p);
    if (intr) setInterest(intr);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = {
    [PAGES.HOME]: <HomePage setPage={navigate} />,
    [PAGES.FOR_YOU]: <ForYouPage setPage={navigate} />,
    [PAGES.FREE_SESSION]: <FreeSessionPage setPage={navigate} />,
    [PAGES.CORPORATE]: <CorporatePage setPage={navigate} />,
    [PAGES.ABOUT]: <AboutPage setPage={navigate} />,
    [PAGES.CONTACT]: <ContactPage interest={interest} setInterest={setInterest} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #faf8f4; overflow-x: hidden; }
        ::selection { background: rgba(133,164,154,0.3); }
        input:focus, textarea:focus { border-color: #85a49a !important; }
        button { font-family: inherit; }
        html { scroll-behavior: smooth; }

        .grid-4 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 820px) {
          .grid-4 { grid-template-columns: repeat(4, 1fr); }
        }
        .grid-4-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 480px) {
          .grid-4-cards { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <Nav page={page} setPage={navigate} />
      <main style={{ minHeight: "100vh" }}>
        {pages[page]}
      </main>
      <Footer setPage={navigate} />
    </>
  );
}
