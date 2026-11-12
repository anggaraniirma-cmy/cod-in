'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CodinLogo, CodinMark } from '@/components/brand/codin-logo'
import {
  Bell,
  Bot,
  ChevronRight,
  CircleCheck,
  Clock3,
  Compass,
  Croissant,
  Droplet,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Truck,
  Wheat,
  X,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// DEMO DATA — no live supplier backend is connected yet. Replace these
// arrays with real API/data-fetching results when the backend is ready.
const suppliers = [
  { name: 'Mitra Boga Prima', initials: 'MB', rating: '4.8', distance: '2.1 km', category: 'Bakery & Pastry', price: 'Rp12.000', stock: '50 kg', eta: '25–35 min', recommended: true },
  { name: 'Sumber Pangan Jaya', initials: 'SP', rating: '4.6', distance: '4.5 km', category: 'Staples & Grains', price: 'Rp11.500', stock: '15 kg', eta: '40–55 min', recommended: false },
  { name: 'Gudang Bahan Nusantara', initials: 'GN', rating: '4.7', distance: '6.8 km', category: 'Oils & Condiments', price: 'Rp11.800', stock: '100 kg', eta: '55–70 min', recommended: false },
]

// DEMO DATA — example order, replace with the real orders feed.
const activeOrders = [
  {
    id: '#CD-240617-08',
    supplier: 'Mitra Boga Prima',
    items: 3,
    status: 'Dikirim',
    statusTone: 'warn' as const,
    eta: 'Hari ini, 14:30 – 15:00',
    step: 3, // 1 Dipesan · 2 Disiapkan · 3 Dikirim · 4 Diterima
  },
  {
    id: '#CD-240616-21',
    supplier: 'Sumber Pangan Jaya',
    items: 5,
    status: 'Diproses',
    statusTone: 'brand' as const,
    eta: 'Besok, 09:00 – 10:30',
    step: 2,
  },
]

const categories: { label: string; hint: string; icon: LucideIcon }[] = [
  { label: 'Bakery & Pastry', hint: 'Tepung, ragi, mentega', icon: Croissant },
  { label: 'Staples & Grains', hint: 'Beras, gula, biji-bijian', icon: Wheat },
  { label: 'Oils & Condiments', hint: 'Minyak, saus, bumbu', icon: Droplet },
  { label: 'Packaging', hint: 'Kemasan & label', icon: Package },
]

const navItems: { label: string; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Find Suppliers', icon: Compass },
  { label: 'My Orders', icon: Package },
  { label: 'Messages', icon: MessageCircle },
]

const examplePrompts = [
  'Aku ingin membuat donat',
  'Cari bahan baku roti',
  'Hitung kebutuhan modal awal',
]

const ORDER_STEPS = ['Dipesan', 'Disiapkan', 'Dikirim', 'Diterima']

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function StatusBadge({ tone, children }: { tone: 'warn' | 'brand'; children: React.ReactNode }) {
  const styles =
    tone === 'warn' ? 'bg-[#fff4e6] text-[#b25e00]' : 'bg-brand-50 text-brand-700'
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
      {children}
    </span>
  )
}

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,36,58,0.04)] ${className}`}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export function MarketplaceDashboard() {
  const [query, setQuery] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [cartCount, setCartCount] = useState(2)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')

  const visible = useMemo(
    () =>
      suppliers.filter((s) =>
        `${s.name} ${s.category} tepung protein tinggi`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  const add = () => {
    setCartCount((n) => n + 1)
    setToast('Produk ditambahkan ke keranjang')
    window.setTimeout(() => setToast(''), 2400)
  }

  const askCodin = () => setChatOpen(true)

  const useExamplePrompt = (prompt: string) => {
    setQuery(prompt)
    setChatInput(prompt)
    setChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      {/* ---------------- Top navigation ---------------- */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 backdrop-blur md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Buka navigasi"
          >
            <Menu />
          </Button>
          <CodinLogo subtitle="B2B Supplier Marketplace" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-ink-muted hover:text-brand-600"
            aria-label="Notifikasi"
          >
            <Bell />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-warn" />
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2 sm:pr-3">
            <div className="grid size-8 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
              AR
            </div>
            <span className="hidden text-sm font-medium sm:block">Ayunda R.</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* ---------------- Sidebar ---------------- */}
        {mobileNav && (
          <div
            className="fixed inset-0 z-20 bg-slate-900/20 lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-hidden
          />
        )}
        <aside
          className={`${
            mobileNav ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-16 left-0 z-30 w-64 shrink-0 border-r border-line bg-white p-4 transition-transform lg:static lg:z-auto lg:translate-x-0`}
        >
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-brand-50 p-3">
            <div className="grid size-9 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
              <Store className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">Kedai Ayunda</p>
              <p className="truncate text-xs text-ink-muted">Bandung, Jawa Barat</p>
            </div>
          </div>

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-ink-muted/70">
            Menu
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon }, i) => {
              const active = i === 0
              return (
                <button
                  key={label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? 'bg-brand-50 font-semibold text-brand-700'
                      : 'text-ink-muted hover:bg-brand-50/60 hover:text-ink'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`size-[18px] ${active ? 'text-brand-600' : 'text-brand-500'}`} />
                  {label}
                </button>
              )
            })}
          </nav>

          <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-ink-muted/70">
            Pengaturan
          </p>
          <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink-muted transition-colors hover:bg-brand-50/60 hover:text-ink">
            <Settings className="size-[18px] text-brand-500" />
            Settings
          </button>

          <div className="mt-8 rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-2 text-brand-600">
              <Sparkles className="size-4" />
              <p className="text-xs font-semibold">Cod&apos;in AI</p>
            </div>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Butuh bantuan memilih bahan? Tanya asisten AI kami.
            </p>
            <Button size="sm" className="mt-3 w-full" onClick={askCodin}>
              <Bot data-icon="inline-start" />
              Tanya Cod&apos;in AI
            </Button>
          </div>
        </aside>

        {/* ---------------- Main ---------------- */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            {/* Greeting + search */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-sm font-medium text-brand-600">Senin, 17 Juni 2024</p>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Selamat pagi, Ayunda!
                </h1>
                <p className="mt-1 text-sm text-ink-muted">
                  Temukan bahan baku dan supplier terbaik untuk usahamu.
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari bahan baku atau supplier..."
                  aria-label="Cari bahan baku atau supplier"
                  className="h-11 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* ---------------- AI chatbot hero ---------------- */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-lg shadow-brand-600/20 md:p-8">
              <div className="relative z-10 max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-white">
                  <Sparkles className="size-3.5" />
                  Cod&apos;in AI Assistant
                </div>
                <h2 className="text-xl font-bold leading-tight md:text-3xl">
                  Mulai Usahamu dengan Lebih Mudah
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
                  Ceritakan produk yang ingin kamu buat. AI kami akan membantu merekomendasikan
                  bahan baku dan menemukan supplier yang sesuai.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => useExamplePrompt(prompt)}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={askCodin}
                  className="mt-5 h-11 bg-white px-5 text-brand-700 hover:bg-brand-50"
                >
                  <Bot data-icon="inline-start" />
                  Tanya Cod&apos;in AI
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </div>
              <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full border-[32px] border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 right-16 size-56 rounded-full border-[24px] border-white/5" />
            </section>

            {/* ---------------- Orders + categories ---------------- */}
            <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              {/* Active orders */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold">Pesanan Aktif</h2>
                  <button className="inline-flex items-center gap-0.5 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Lihat semua <ChevronRight className="size-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {activeOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                            <Truck className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{order.id}</p>
                            <p className="text-xs text-ink-muted">
                              {order.supplier} · {order.items} item
                            </p>
                          </div>
                        </div>
                        <StatusBadge tone={order.statusTone}>{order.status}</StatusBadge>
                      </div>

                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-ink-muted">Estimasi tiba</span>
                        <span className="inline-flex items-center gap-1 text-ink-muted">
                          <Clock3 className="size-3.5" />
                          {order.eta}
                        </span>
                      </div>

                      {/* Progress indicator */}
                      <div className="flex items-center gap-1.5">
                        {ORDER_STEPS.map((step, i) => (
                          <div key={step} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                            <div
                              className={`h-full rounded-full ${
                                i < order.step ? 'bg-brand-600' : 'bg-transparent'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between text-[10px] text-ink-muted">
                        {ORDER_STEPS.map((step, i) => (
                          <span
                            key={step}
                            className={i < order.step ? 'font-semibold text-brand-600' : ''}
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Quick categories */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold">Kategori Cepat</h2>
                  <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Jelajahi
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(({ label, hint, icon: Icon }) => (
                    <button
                      key={label}
                      className="group rounded-2xl border border-line bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(16,36,58,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                    >
                      <div className="mb-2 grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                        <Icon className="size-[18px]" />
                      </div>
                      <p className="text-xs font-semibold text-ink">{label}</p>
                      <p className="mt-0.5 text-[10px] text-ink-muted">{hint}</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* ---------------- Nearby suppliers ---------------- */}
            <section className="mt-8">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Supplier Terdekat</h2>
                  <p className="mt-1 text-xs text-ink-muted">
                    Mitra terpercaya, siap membantu usahamu.
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
                  Data demo
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {visible.map((s) => (
                  <Card key={s.name} className="flex flex-col p-4 transition-shadow hover:shadow-md">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="grid size-11 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">
                        {s.initials}
                      </div>
                      {s.recommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[10px] font-bold text-brand-700">
                          <Sparkles className="size-3" />
                          Rekomendasi
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold">{s.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1 font-medium text-[#b25e00]">
                        <Star className="size-3 fill-current" />
                        {s.rating}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {s.distance}
                      </span>
                    </div>

                    <div className="my-4 border-t border-line pt-3">
                      <p className="text-[11px] font-medium text-brand-600">{s.category}</p>
                      <p className="mt-1 text-xs font-medium">Tepung Protein Tinggi</p>
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="text-base font-semibold">
                            {s.price}
                            <span className="text-xs font-normal text-ink-muted"> / kg</span>
                          </p>
                          <p className="text-[10px] font-medium text-brand-600">
                            {s.stock} tersedia
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-ink-muted">
                          <Clock3 className="size-3" />
                          {s.eta}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={add}
                      variant={s.recommended ? 'default' : 'outline'}
                      className="mt-auto w-full"
                    >
                      Tambah ke keranjang
                    </Button>
                  </Card>
                ))}
                {visible.length === 0 && (
                  <p className="col-span-full rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-ink-muted">
                    Tidak ada supplier yang cocok dengan pencarianmu.
                  </p>
                )}
              </div>
            </section>

            {/* ---------------- Cart summary ---------------- */}
            <section className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <ShoppingCart className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Kamu punya {cartCount} item di keranjang
                  </p>
                  <p className="text-xs text-ink-muted">
                    Periksa item dan lanjutkan ke pembayaran.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="hidden shrink-0 sm:inline-flex">
                Lihat keranjang
              </Button>
            </section>
          </div>
        </main>
      </div>

      {/* ---------------- AI assistant panel (UI only) ---------------- */}
      {chatOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end bg-slate-900/20 p-4 md:items-center md:p-8">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-brand-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <CodinMark className="rounded-lg bg-white p-1.5" />
                <div>
                  <p className="font-semibold">Cod&apos;in AI</p>
                  <p className="text-xs text-white/70">Asisten pengadaan usahamu</p>
                </div>
              </div>
              <Button
                onClick={() => setChatOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/15"
                aria-label="Tutup asisten"
              >
                <X />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-brand-50 p-3 text-sm leading-6 text-ink">
                Hai Ayunda! Ceritakan kebutuhan usahamu hari ini, dan aku bantu carikan supplier
                lokal terbaik.
              </div>

              <div className="flex flex-wrap gap-2">
                {examplePrompts.slice(0, 2).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setChatInput(prompt)}
                    className="rounded-full border border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-600"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="rounded-xl bg-[#f6f9ff] p-3 text-[11px] leading-5 text-ink-muted">
                <span className="font-semibold text-brand-600">Catatan:</span> integrasi AI
                (DeepSeek) belum tersambung. Antarmuka ini siap dihubungkan ke endpoint backend.
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ceritakan kebutuhan bahumu..."
                  aria-label="Pesan untuk Cod'in AI"
                  className="h-11 w-full rounded-xl border border-line px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                <Button size="icon-lg" aria-label="Kirim pesan" className="shrink-0">
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Toast ---------------- */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          <CircleCheck className="size-4 text-white/80" />
          {toast}
        </div>
      )}
    </div>
  )
}
