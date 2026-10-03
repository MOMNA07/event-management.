import { useEffect, useState } from 'react'
import { ArrowRight, Camera, Check, ChevronDown, Clock3, MapPin, Menu, Phone, Quote, Star, Utensils, X } from 'lucide-react'
import { createReservation, getMenuItems } from './lib/supabase'
import './App.css'

const INITIAL_FORM_STATE = {
  customer_name: '',
  phone_number: '',
  guests_count: '2',
  reservation_date: '',
  reservation_time: '20:00',
  special_request: ''
}

const REVIEWS = [
  {
    id: 1,
    name: 'Hamza Malik',
    role: 'Local Guide',
    rating: 5,
    comment: 'The ambience by the canal during sunset is unbeatable! BBQ was super juicy and fresh.',
  },
  {
    id: 2,
    name: 'Ayesha Khan',
    role: 'Food Enthusiast',
    rating: 5,
    comment: 'Best hi-tea experience in Faisalabad. Open garden seating makes every family dinner special.',
  },
  {
    id: 3,
    name: 'Bilal Ahmed',
    role: 'Regular Guest',
    rating: 4.8,
    comment: 'Their Malai Tikka and mint lemonade are top-notch. Quick service and friendly staff.',
  }
]

function App() {
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('all')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM_STATE)

  const todayDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    let isMounted = true
    getMenuItems().then((data) => {
      if (isMounted && data) setItems(data)
    })
    return () => { isMounted = false }
  }, [])

  const filteredItems = category === 'all' ? items : items.filter((item) => item.category === category)
  
  const openBooking = () => { 
    setModalOpen(true)
    setMobileOpen(false) 
  }

  const updateForm = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const submitReservation = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await createReservation(form)
      setModalOpen(false)
      setForm(INITIAL_FORM_STATE)
      setToast('Your table request is on its way. We will call to confirm.')
      
      const timer = setTimeout(() => setToast(''), 4500)
      return () => clearTimeout(timer)
    } catch (err) {
      console.error('Failed to reserve table:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0b1329] text-gray-100 min-h-screen selection:bg-amber-500 selection:text-black">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#0b1329]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between transition-all">
        <a className="flex items-center gap-3 group" href="#top">
          <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
            <Utensils size={20} />
          </span>
          <span className="font-serif text-lg font-bold tracking-wide flex flex-col leading-none">
            Khayyam Kinara
            <small className="text-[10px] font-sans text-amber-500 tracking-widest uppercase mt-1">Food Garden · Faisalabad</small>
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
          <a href="#story" className="hover:text-amber-400 transition-colors">Our Story</a>
          <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
          <a href="#highlights" className="hover:text-amber-400 transition-colors">Highlights</a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
          <a href="#location" className="hover:text-amber-400 transition-colors">Location</a>
          <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
        </nav>

        <button className="hidden md:flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-amber-600/20 active:scale-95" onClick={openBooking}>
          Book a table <ArrowRight size={15} />
        </button>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-300 p-2" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0b1329] border-b border-white/10 p-6 flex flex-col gap-4 text-base font-medium md:hidden shadow-2xl">
            <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
            <a href="#story" onClick={() => setMobileOpen(false)}>Our Story</a>
            <a href="#menu" onClick={() => setMobileOpen(false)}>Menu</a>
            <a href="#highlights" onClick={() => setMobileOpen(false)}>Highlights</a>
            <a href="#reviews" onClick={() => setMobileOpen(false)}>Reviews</a>
            <a href="#location" onClick={() => setMobileOpen(false)}>Location</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
            <button className="flex items-center justify-center gap-2 bg-amber-500 text-black font-semibold py-3 rounded-xl mt-2" onClick={openBooking}>
              Book a table <ArrowRight size={16} />
            </button>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="about">
          <div>
            <p className="text-xs font-semibold text-amber-500 tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-amber-500"></span> Est. 2017 · Canal-side dining
            </p>
            <h1 className="text-4xl sm:text-6xl font-serif leading-tight text-white mb-6">
              Where every<br />
              <em className="italic text-amber-400 font-normal">sunset</em> tastes<br />
              better.
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              A lively garden by the water, bringing Faisalabad together over fire-kissed BBQ, generous plates and evenings worth lingering over.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-7 py-3.5 rounded-full text-base transition-all shadow-xl shadow-amber-600/20 active:scale-95" onClick={openBooking}>
                Reserve your table <ArrowRight size={18} />
              </button>
              <a className="flex items-center gap-2 text-gray-300 hover:text-white px-5 py-3 font-medium transition-colors" href="#menu">
                Explore menu <ChevronDown size={16} />
              </a>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400 uppercase tracking-widest pt-6 border-t border-white/10">
              <span>Family dining</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Live BBQ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Outdoor garden</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-tr from-amber-500/20 to-slate-800 border border-white/10 shadow-2xl relative">
              <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80')" }}></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#0b1329] border border-amber-500/30 p-5 rounded-2xl shadow-xl flex flex-col items-center">
              <strong className="text-xl font-serif text-amber-400">Kinara</strong>
              <span className="text-xs text-gray-400">Since 2017</span>
            </div>
          </div>
        </section>

        {/* INFO STRIP */}
        <section className="bg-slate-900/60 border-y border-white/10 py-8 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <MapPin className="text-amber-500 shrink-0 mt-1" size={24} />
              <div>
                <b className="block text-white text-sm">Find us</b>
                <span className="text-xs text-gray-400">Canal Road, 1KM from Jhall Flyover</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock3 className="text-amber-500 shrink-0 mt-1" size={24} />
              <div>
                <b className="block text-white text-sm">Open daily</b>
                <span className="text-xs text-gray-400">04:00 PM - 01:00 AM</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-amber-500 shrink-0 mt-1" size={24} />
              <div>
                <b className="block text-white text-sm">Reservations</b>
                <span className="text-xs text-gray-400">0320 2662223</span>
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5" id="story">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-amber-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-amber-500"></span> Discover Khayyam Kinara
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif text-white mb-6">
              Crafted with passion, <em className="italic text-amber-400 font-normal">served with love.</em>
            </h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              Founded in 2017, Khayyam Kinara Food Garden was built on a simple vision: creating a relaxed canal-side atmosphere where families and friends gather over authentic recipes and grilled delicacies.
            </p>
          </div>
        </section>

        {/* MENU SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20" id="menu">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <p className="text-xs font-semibold text-amber-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500"></span> From our kitchen
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif text-white">
                A table full of <em className="italic text-amber-400 font-normal">good things.</em>
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Recipes rooted in home, made for sharing. Our menu follows the seasons and the appetite.
            </p>
          </div>

          {/* Menu Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              ['all', 'All dishes'], 
              ['desi', 'Desi classics'], 
              ['bbq', 'From the grill'], 
              ['buffet', 'Hi-tea & buffet'], 
              ['fastfood', 'Fast food']
            ].map(([value, label]) => (
              <button 
                key={value} 
                className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                  category === value 
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`} 
                onClick={() => setCategory(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <article className="glass-card rounded-2xl overflow-hidden group transition-all" key={item.id}>
                <div className="h-52 bg-slate-800 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.image_url})` }}>
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                    {item.category}
                  </span>
                  <button 
                    className="absolute bottom-4 right-4 bg-amber-500 hover:bg-amber-400 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0"
                    aria-label={`Reserve ${item.name}`} 
                    onClick={openBooking}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{item.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                      <Star size={12} fill="currentColor" /> {item.rating}
                    </span>
                  </div>
                  <strong className="text-amber-500 text-lg font-bold">PKR {Number(item.price).toLocaleString()}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HIGHLIGHT SECTION */}
        <section className="w-full bg-slate-900/40 border-y border-white/10 py-20" id="highlights">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="w-full h-[400px] rounded-3xl bg-cover bg-center border border-white/10 shadow-2xl" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80')" }} />
            <div>
              <p className="text-xs font-semibold text-amber-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500"></span> The Kinara feeling
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif text-white mb-6">
                Come for the view.<br />
                <em className="italic text-amber-400 font-normal">Stay for the feast.</em>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                There is a certain magic to dinner when the canal catches the last light. Our open garden, glowing grills and easy hospitality make every visit feel like an occasion.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8 pt-6 border-t border-white/10">
                <div>
                  <strong className="block text-2xl font-serif text-amber-400">7+</strong>
                  <span className="text-xs text-gray-400">years of hosting</span>
                </div>
                <div>
                  <strong className="block text-2xl font-serif text-amber-400">4.8</strong>
                  <span className="text-xs text-gray-400">guest rating</span>
                </div>
                <div>
                  <strong className="block text-2xl font-serif text-amber-400">100%</strong>
                  <span className="text-xs text-gray-400">made with heart</span>
                </div>
              </div>
              <button className="border border-amber-500/50 hover:bg-amber-500 hover:text-black text-amber-400 font-semibold px-6 py-3 rounded-full text-sm transition-all flex items-center gap-2" onClick={openBooking}>
                Plan your evening <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20" id="reviews">
          <div className="mb-12">
            <p className="text-xs font-semibold text-amber-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-amber-500"></span> Word of mouth
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif text-white">
              What our <em className="italic text-amber-400 font-normal">guests say.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="glass-card p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <Quote size={32} className="text-amber-500/40 mb-4" />
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(rev.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-sm leading-relaxed mb-6">"{rev.comment}"</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <strong className="block text-white text-sm font-semibold">{rev.name}</strong>
                  <small className="text-xs text-gray-400">{rev.role}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LOCATION SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10" id="location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-amber-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500"></span> Make an evening of it
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif text-white">
                Your next<br />
                <em className="italic text-amber-400 font-normal">great meal</em><br />
                is this way.
              </h2>
            </div>
            <div className="glass-card p-8 rounded-3xl flex flex-col gap-4">
              <MapPin size={32} className="text-amber-500" />
              <h3 className="text-xl font-bold text-white">Canal Road, Faisalabad</h3>
              <p className="text-gray-300 text-sm">1KM from Jhall Flyover<br />Faisalabad, Punjab</p>
              <a href="https://maps.google.com/?q=Khayyam+Kinara+Food+Garden+Faisalabad" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm hover:underline mt-2">
                Get directions <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/10 py-16 px-6" id="contact">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <a className="flex items-center gap-3 mb-4" href="#top">
              <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Utensils size={20} /></span>
              <span className="font-serif text-lg font-bold">Khayyam Kinara</span>
            </a>
            <p className="text-gray-400 text-sm">Good food. Open skies.<br />A place to gather.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <b className="text-white mb-2">Explore</b>
            <a href="#about" className="hover:text-amber-400">About Us</a>
            <a href="#story" className="hover:text-amber-400">Our Story</a>
            <a href="#menu" className="hover:text-amber-400">The Menu</a>
            <a href="#reviews" className="hover:text-amber-400">Reviews</a>
            <a href="#location" className="hover:text-amber-400">Find Us</a>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <b className="text-white mb-2">Connect</b>
            <a href="tel:03202662223" className="hover:text-amber-400">0320 2662223</a>
            <a href="mailto:hello@khayyamkinara.pk" className="hover:text-amber-400">hello@khayyamkinara.pk</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-400 mt-2">
              <Camera size={16} /> Instagram
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between text-xs text-gray-500 gap-4">
          <span>© 2024 Khayyam Kinara Food Garden</span>
          <span>Made for slow evenings.</span>
        </div>
      </footer>

      {/* RESERVATION MODAL */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-[#0b1329] border border-amber-500/30 p-8 rounded-3xl max-w-lg w-full relative shadow-2xl">
            <button className="absolute top-6 right-6 text-gray-400 hover:text-white" onClick={() => setModalOpen(false)} aria-label="Close modal">
              <X size={20} />
            </button>
            <p className="text-xs text-amber-500 uppercase tracking-widest mb-1">Your table awaits</p>
            <h2 id="modal-title" className="text-2xl font-serif text-white mb-2">Reserve a table</h2>
            <p className="text-xs text-gray-400 mb-6">Tell us when you would like to join us. We will call to confirm.</p>

            <form onSubmit={submitReservation} className="space-y-4 text-xs">
              <div>
                <label htmlFor="customer_name" className="block text-gray-300 mb-1">Full name</label>
                <input 
                  required 
                  id="customer_name"
                  name="customer_name" 
                  value={form.customer_name} 
                  onChange={updateForm} 
                  placeholder="Your name" 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-gray-300 mb-1">Phone number</label>
                <input 
                  required 
                  id="phone_number"
                  name="phone_number" 
                  value={form.phone_number} 
                  onChange={updateForm} 
                  placeholder="03XX XXXXXXX" 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guests_count" className="block text-gray-300 mb-1">Guests</label>
                  <select 
                    id="guests_count"
                    name="guests_count" 
                    value={form.guests_count} 
                    onChange={updateForm} 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="reservation_date" className="block text-gray-300 mb-1">Date</label>
                  <input 
                    required 
                    type="date" 
                    id="reservation_date"
                    min={todayDate}
                    name="reservation_date" 
                    value={form.reservation_date} 
                    onChange={updateForm} 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reservation_time" className="block text-gray-300 mb-1">Preferred time</label>
                <select 
                  id="reservation_time"
                  name="reservation_time" 
                  value={form.reservation_time} 
                  onChange={updateForm} 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option>18:00</option>
                  <option>19:00</option>
                  <option>20:00</option>
                  <option>21:00</option>
                  <option>22:00</option>
                  <option>23:00</option>
                </select>
              </div>
              <div>
                <label htmlFor="special_request" className="block text-gray-300 mb-1">
                  Special request <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea 
                  id="special_request"
                  name="special_request" 
                  value={form.special_request} 
                  onChange={updateForm} 
                  placeholder="Birthday, outdoor seating..." 
                  rows="3" 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
              <button 
                disabled={loading} 
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? 'Sending request...' : <><Check size={16} /> Send reservation request</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-2xl border border-amber-400">
          <Check size={18} /> {toast}
        </div>
      )}
    </div>
  )
}

export default App