import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle2 } from "lucide-react";

// ── Formspree form ID ──────────────────────────────────────────────────────────
// 1. Go to https://formspree.io → sign up free → New Form
// 2. Replace "YOUR_FORM_ID" below with your actual form ID (e.g. "xpwzabcd")
// 3. Formspree free tier = 50 submissions/month, no backend needed
const FORMSPREE_ID = "YOUR_FORM_ID";
// ──────────────────────────────────────────────────────────────────────────────

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // If Formspree ID is configured, use it; otherwise fall back to mailto
    if (FORMSPREE_ID !== "YOUR_FORM_ID") {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus("sent");
          setForm({ name: "", email: "", message: "" });
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    } else {
      // Fallback: open mailto
      const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:chandakpalak78@gmail.com?subject=${subject}&body=${body}`);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    }

    if (status === "sent") {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section label + heading */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">GET IN TOUCH</p>
          <div className="flex items-end gap-4 mb-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Let's <span className="text-gradient">Connect</span>
            </h2>
            <div className="h-1 flex-1 max-w-xs bg-gradient-primary rounded-full mb-3 hidden sm:block" />
          </div>
          <p className="text-muted-foreground max-w-xl">
            I'm always open to new opportunities and collaborations. Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — contact info */}
          <div className="space-y-5">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "chandakpalak78@gmail.com",
                href: "mailto:chandakpalak78@gmail.com",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+91 9156942778",
                href: "tel:9156942778",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "Pune, Maharashtra, India",
                href: undefined,
                gradient: "from-cyan-500 to-blue-600",
              },
            ].map((item) => {
              const Wrapper = item.href ? "a" : "div";
              return (
                <Wrapper
                  key={item.label}
                  {...(item.href ? { href: item.href } : {})}
                  className="group glass border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 card-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                  </div>
                </Wrapper>
              );
            })}

            {/* Social links */}
            <div className="glass border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Find me on</p>
              <div className="flex gap-3">
                {[
                  { href: "https://github.com/palakchandak261", icon: Github, label: "GitHub" },
                  { href: "https://linkedin.com/in/palakchandak-44b84733a", icon: Linkedin, label: "LinkedIn" },
                  { href: "mailto:chandakpalak78@gmail.com", icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center gap-2 glass border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contact form with Formspree */}
          <div className="glass border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-1">Send a Message</h3>
            <p className="text-xs text-muted-foreground mb-5">
              I typically respond within 24 hours.
            </p>

            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-lg text-foreground">Message Sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-primary hover:underline mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Palak Chandak"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Hi Palak, I'd love to connect about..."
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    Something went wrong. Please email me directly at chandakpalak78@gmail.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full btn-shimmer text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-transform duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === "sending" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
