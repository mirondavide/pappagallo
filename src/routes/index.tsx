import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'

export const Route = createFileRoute('/')({
  component: PizzeriaPage,
})

// ─── Hours schedule ───
const SCHEDULE: Record<string, [string, string][]> = {
  Mon: [['11:30', '14:30'], ['18:00', '01:00']],
  Tue: [['11:30', '14:30'], ['18:00', '01:00']],
  Wed: [['11:30', '14:30'], ['18:00', '01:00']],
  Thu: [['11:30', '14:30'], ['18:00', '01:00']],
  Fri: [['11:30', '14:30'], ['18:00', '01:00']],
  Sat: [['11:30', '14:30'], ['18:00', '01:00']],
  Sun: [['11:30', '14:30'], ['18:00', '01:00']],
}

const DAY_NAMES_IT: Record<string, string> = {
  Mon: 'Lunedi', Tue: 'Martedi', Wed: 'Mercoledi',
  Thu: 'Giovedi', Fri: 'Venerdi', Sat: 'Sabato', Sun: 'Domenica',
}

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function isOpenNow(): boolean {
  const now = new Date()
  const dayKey = DAY_KEYS[now.getDay()]
  const currentMin = now.getHours() * 60 + now.getMinutes()
  const slots = SCHEDULE[dayKey]

  for (const [open, close] of slots) {
    const openMin = timeToMinutes(open)
    let closeMin = timeToMinutes(close)

    if (closeMin <= openMin) {
      // Crosses midnight
      if (currentMin >= openMin || currentMin < closeMin) return true
    } else {
      if (currentMin >= openMin && currentMin < closeMin) return true
    }
  }

  // Check if we're in the early hours of a slot that started yesterday
  const yesterday = DAY_KEYS[(now.getDay() + 6) % 7]
  const ySlots = SCHEDULE[yesterday]
  for (const [open, close] of ySlots) {
    const closeMin = timeToMinutes(close)
    const openMin = timeToMinutes(open)
    if (closeMin <= openMin && currentMin < closeMin) return true
  }

  return false
}

// ─── Scroll observer hook ───
function useScrollFade() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-section, .stagger-children')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.12 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ─── Parrot component ───
function Parrot({ className = '', size = 'text-6xl' }: { className?: string; size?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const handleClick = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetHeight
    el.style.animation = 'squawk 0.5s ease'
  }, [])

  return (
    <span
      ref={ref}
      onClick={handleClick}
      className={`inline-block cursor-pointer animate-bob select-none ${size} ${className}`}
      role="img"
      aria-label="pappagallo"
    >
      &#x1F99C;
    </span>
  )
}

// ─── Main page ───
function PizzeriaPage() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isOpenNow())
    const id = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(id)
  }, [])

  useScrollFade()

  return (
    <>
      {/* ===== NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-crema/80 backdrop-blur-xl border-b border-carbone/5">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
          <a href="#" className="font-display text-xl text-rosso font-bold no-underline">
            Pappagallo <span className="text-base">&#x1F99C;</span>
          </a>
          <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-carbone/60">
            <a href="#dove" className="no-underline hover:text-rosso transition-colors">Dove</a>
            <a href="#orari" className="no-underline hover:text-rosso transition-colors">Orari</a>
            <a href="#contatti" className="no-underline hover:text-rosso transition-colors">Contatti</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden bg-rosso">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-verde/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-rosso-dark/30 blur-3xl" />

        <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
          {/* Parrot perched on top */}
          <div className="mb-4">
            <Parrot size="text-7xl md:text-8xl" />
          </div>

          {/* Wordmark */}
          <h1 className="font-display text-crema leading-[0.9] tracking-tight">
            <span className="block text-[clamp(1rem,3vw,1.4rem)] font-body uppercase tracking-[0.3em] text-crema/60 mb-4">
              Pizzeria
            </span>
            <span className="block text-[clamp(3.5rem,12vw,9rem)] font-bold">
              PAPPA
            </span>
            <span className="block text-[clamp(3.5rem,12vw,9rem)] font-bold -mt-4 md:-mt-8">
              GALLO
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-crema/80 text-base md:text-lg max-w-md mx-auto font-body leading-relaxed">
            La pizza d'asporto di Stezzano<br className="sm:hidden" /> dal cuore italiano.
          </p>

          {/* Rating badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-crema text-sm">
            <span className="text-oro">&#9733;</span>
            <span className="font-semibold">4.2 su Google</span>
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+39035593083"
              className="inline-flex items-center gap-3 bg-crema text-rosso font-bold text-lg px-8 py-4 rounded-full no-underline hover:bg-white hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-black/20"
            >
              <span className="text-2xl">&#128222;</span>
              Chiama ora
            </a>
            <a
              href="https://maps.app.goo.gl/esLQNBm5svgVqzQq9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border-2 border-crema/40 text-crema font-bold text-lg px-8 py-4 rounded-full no-underline hover:bg-white/25 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span className="text-2xl">&#128205;</span>
              Indicazioni
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-crema/40 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scorri</span>
          <span>&#8595;</span>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="bg-verde text-crema py-3 overflow-hidden select-none">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-6 text-sm md:text-base font-bold tracking-wide uppercase mr-6">
              <span>Pizza d'asporto</span>
              <span className="text-crema/40">&bull;</span>
              <span>Servizio a domicilio</span>
              <span className="text-crema/40">&bull;</span>
              <span>Aperti fino all'1:00</span>
              <span className="text-crema/40">&bull;</span>
              <span>Stezzano (BG)</span>
              <span className="text-crema/40">&bull;</span>
              <span>&#x1F99C;</span>
              <span className="text-crema/40">&bull;</span>
              <span>Pizza d'asporto</span>
              <span className="text-crema/40">&bull;</span>
              <span>Servizio a domicilio</span>
              <span className="text-crema/40">&bull;</span>
              <span>Aperti fino all'1:00</span>
              <span className="text-crema/40">&bull;</span>
              <span>Stezzano (BG)</span>
              <span className="text-crema/40">&bull;</span>
              <span>&#x1F99C;</span>
              <span className="text-crema/40 mr-6">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== DOVE SIAMO ===== */}
      <section id="dove" className="py-20 md:py-28 bg-crema">
        <div className="max-w-5xl mx-auto px-4">
          <div className="fade-section mb-12">
            <p className="text-verde font-bold text-xs tracking-[0.25em] uppercase mb-2">Dove trovarci</p>
            <h2 className="font-display text-4xl md:text-5xl text-carbone">Dove siamo</h2>
          </div>

          <div className="fade-section grid md:grid-cols-2 gap-8 items-stretch">
            {/* Map */}
            <div className="rounded-3xl overflow-hidden border-2 border-carbone/8 shadow-xl min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.5!2d9.6497!3d45.6453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478151da381d3c41%3A0x471c928b534d1693!2sPizzeria%20Pappagallo!5e0!3m2!1sit!2sit!4v1700000000000"
                className="w-full h-full min-h-[300px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa Pizzeria Pappagallo"
              />
            </div>

            {/* Address info */}
            <div className="flex flex-col justify-center gap-6 py-4">
              <div>
                <p className="text-carbone/40 text-xs font-bold tracking-widest uppercase mb-2">Indirizzo</p>
                <p className="font-display text-2xl md:text-3xl text-carbone leading-snug">
                  Via Bergamo, 12<br />
                  24040 Stezzano (BG)
                </p>
              </div>
              <div>
                <p className="text-carbone/40 text-xs font-bold tracking-widest uppercase mb-2">Plus Code</p>
                <p className="text-carbone/70 text-base">3F4M+MX Stezzano, BG</p>
              </div>
              <a
                href="https://maps.app.goo.gl/esLQNBm5svgVqzQq9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-verde text-crema font-bold px-6 py-3.5 rounded-full no-underline hover:bg-verde-dark hover:scale-[1.03] active:scale-95 transition-all self-start"
              >
                <span>&#128205;</span>
                Apri in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ORARI ===== */}
      <section id="orari" className="py-20 md:py-28 bg-carbone text-crema">
        <div className="max-w-3xl mx-auto px-4">
          <div className="fade-section flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-verde-light font-bold text-xs tracking-[0.25em] uppercase mb-2">Quando venire</p>
              <h2 className="font-display text-4xl md:text-5xl">Orari</h2>
            </div>
            {/* Open/Closed pill */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold self-start sm:self-auto ${
              open
                ? 'bg-verde-light/20 text-verde-light border border-verde-light/30'
                : 'bg-rosso-light/20 text-rosso-light border border-rosso-light/30'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${open ? 'bg-verde-light animate-pulse' : 'bg-rosso-light'}`} />
              {open ? 'Aperto ora' : 'Chiuso'}
            </div>
          </div>

          {/* Hours table */}
          <div className="stagger-children space-y-0">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const isToday = DAY_KEYS[new Date().getDay()] === day
              return (
                <div
                  key={day}
                  className={`flex items-center justify-between py-4 border-b border-crema/10 ${isToday ? 'text-crema' : 'text-crema/50'}`}
                >
                  <span className={`font-semibold text-base md:text-lg ${isToday ? 'text-verde-light' : ''}`}>
                    {DAY_NAMES_IT[day]}
                    {isToday && <span className="ml-2 text-xs bg-verde-light/20 text-verde-light px-2 py-0.5 rounded-full">Oggi</span>}
                  </span>
                  <span className="font-display text-lg md:text-xl">
                    {SCHEDULE[day].map(([o, c]) => `${o} – ${c}`).join(', ')}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="mt-8 text-crema/30 text-sm text-center">
            Gli orari possono variare nei giorni festivi.
          </p>
        </div>
      </section>

      {/* ===== CONTATTI ===== */}
      <section id="contatti" className="py-20 md:py-28 bg-crema">
        <div className="max-w-4xl mx-auto px-4">
          <div className="fade-section mb-12">
            <p className="text-rosso font-bold text-xs tracking-[0.25em] uppercase mb-2">Scrivici o chiamaci</p>
            <h2 className="font-display text-4xl md:text-5xl text-carbone">Contatti</h2>
          </div>

          <div className="stagger-children grid sm:grid-cols-3 gap-4">
            {/* Phone */}
            <a
              href="tel:+39035593083"
              className="group bg-white rounded-3xl p-8 border-2 border-carbone/6 no-underline text-carbone hover:border-rosso/30 hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg"
            >
              <span className="text-4xl block mb-4">&#128222;</span>
              <p className="text-xs font-bold tracking-widest uppercase text-carbone/40 mb-2">Telefono</p>
              <p className="font-display text-xl md:text-2xl text-rosso group-hover:underline">035 593 083</p>
            </a>

            {/* Address */}
            <a
              href="https://maps.app.goo.gl/esLQNBm5svgVqzQq9"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-8 border-2 border-carbone/6 no-underline text-carbone hover:border-verde/30 hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg"
            >
              <span className="text-4xl block mb-4">&#128205;</span>
              <p className="text-xs font-bold tracking-widest uppercase text-carbone/40 mb-2">Indirizzo</p>
              <p className="font-display text-xl md:text-2xl group-hover:underline">Via Bergamo 12, Stezzano</p>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/pizzeriapappagallo.stezzano/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-8 border-2 border-carbone/6 no-underline text-carbone hover:border-[#1877f2]/30 hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg"
            >
              <span className="text-4xl block mb-4">&#128077;</span>
              <p className="text-xs font-bold tracking-widest uppercase text-carbone/40 mb-2">Facebook</p>
              <p className="font-display text-xl md:text-2xl group-hover:underline">Seguici</p>
            </a>
          </div>

          {/* Delivery callout */}
          <div className="fade-section mt-8 bg-verde/10 border-2 border-verde/20 rounded-2xl p-6 flex items-center gap-4">
            <span className="text-3xl">&#128666;</span>
            <div>
              <p className="font-bold text-verde-dark text-lg">Servizio a domicilio disponibile</p>
              <p className="text-verde-dark/70 text-sm mt-1">Ordina per telefono e ricevi la pizza a casa tua!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-carbone text-crema/30 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Parrot size="text-3xl" className="mb-4 opacity-40" />
          <p className="font-display text-crema/50 text-lg mb-2">Pizzeria Pappagallo</p>
          <p className="text-xs mb-1">Via Bergamo, 12 — 24040 Stezzano (BG)</p>
          <p className="text-xs mb-4">P.IVA: XXXXXXXXXXX</p>
          <p className="text-xs text-crema/20">&copy; 2026 Pizzeria Pappagallo. Tutti i diritti riservati.</p>
        </div>
      </footer>

      {/* ===== STICKY MOBILE CALL BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-rosso/95 backdrop-blur-md border-t border-white/10 safe-area-pb">
        <a
          href="tel:+39035593083"
          className="flex items-center justify-center gap-3 text-crema font-bold text-lg py-4 no-underline active:bg-rosso-dark transition-colors"
        >
          <span className="text-xl">&#128222;</span>
          Chiama 035 593 083
        </a>
      </div>
      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-16 sm:hidden" />
    </>
  )
}
