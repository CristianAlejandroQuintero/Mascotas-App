import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Contacto from './Contacto.jsx'
import Citas from './Citas.jsx'
import { CitasProvider } from './CitasContext.jsx'
import Entrenamiento from './Entrenamiento.jsx'
import Estetica from './Estetica.jsx'
import Funerarios from './Funerarios.jsx'
import Marketing from './Marketing.jsx'
import Veterinaria from './Veterinaria.jsx'
import Login from './Login.jsx'
import Admin from './Admin.jsx'

const services = [
  {
    icon: '🩺',
    name: 'Veterinaria',
    path: '/veterinaria',
    description:
      'Consultas, vacunas y cuidados preventivos para que tu compañero esté siempre saludable.',
    color: 'mint',
  },
  {
    icon: '✂️',
    name: 'Estética',
    path: '/estetica',
    description:
      'Baño, corte y mimos. Una experiencia relajante para que luzca y se sienta increíble.',
    color: 'peach',
  },
  {
    icon: '🐾',
    name: 'Entrenamiento',
    path: '/entrenamiento',
    description:
      'Aprendizaje positivo para fortalecer el vínculo y disfrutar cada paseo juntos.',
    color: 'lavender',
  },
  {
    icon: '🌈',
    name: 'Funerarios',
    path: '/funerarios',
    description:
      'Acompañamiento respetuoso y cálido para honrar la vida de quienes dejan huella.',
    color: 'blue',
  },
  {
    icon: '📣',
    name: 'Marketing',
    path: '/marketing',
    description:
      'Soluciones creativas para marcas y profesionales que comparten el amor por los animales.',
    color: 'yellow',
  },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <Link className="brand" to="/#inicio" onClick={closeMenu} aria-label="Mascotas Pro, inicio">
        <span className="brand-mark" aria-hidden="true">🐾</span>
        <span>Mascotas<span className="brand-highlight">Pro</span></span>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        className={`site-nav${menuOpen ? ' is-open' : ''}`}
        id="site-navigation"
        aria-label="Navegación principal"
      >
        <Link to="/#inicio" onClick={closeMenu}>Inicio</Link>
        <Link to="/#servicios" onClick={closeMenu}>Servicios</Link>
        <Link to="/#contacto" onClick={closeMenu}>Contacto</Link>
        <Link to="/citas" onClick={closeMenu}>Mis citas</Link>
        <Link to="/login" onClick={closeMenu}>Personal</Link>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-copy">
        <span className="eyebrow"><span aria-hidden="true">✦</span> Todo el amor que merecen</span>
        <h1 id="hero-title">Su bienestar es nuestra <span>felicidad.</span></h1>
        <p>
          Cuidamos a quienes hacen de cada día algo especial. Encuentra en un solo lugar
          todo lo que tu mascota necesita para vivir feliz.
        </p>
        <a className="button button-primary" href="#contacto">
          Agendar cita <span aria-hidden="true">→</span>
        </a>
        <div className="hero-note">
          <span className="note-avatars" aria-hidden="true">🐶 🐱</span>
          <span>Cuidado cercano, con mucho amor</span>
        </div>
      </div>
      <div className="hero-art" aria-label="Ilustración de un perrito feliz" role="img">
        <span className="hero-spark spark-one" aria-hidden="true">✳</span>
        <span className="hero-spark spark-two" aria-hidden="true">✦</span>
        <span className="hero-spark spark-three" aria-hidden="true">·</span>
        <div className="hero-sun" />
        <div className="pet-illustration" aria-hidden="true">🐕</div>
        <div className="hero-caption"><span>♡</span> Amor en cada cuidado</div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="services section-wrap" id="servicios" aria-labelledby="services-title">
      <div className="section-heading">
        <span className="eyebrow">Un equipo que te acompaña</span>
        <h2 id="services-title">Todo para sus mejores días</h2>
        <p>Servicios pensados para cuidar, consentir y celebrar a tu mejor amigo.</p>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <Link
            className="service-card"
            key={service.name}
            to={service.path}
            aria-label={`Ver servicio de ${service.name}`}
          >
            <div className={`service-icon ${service.color}`} aria-hidden="true">
              {service.icon}
            </div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <span className="service-card-cta">
              Conoce más <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-about">
          <Link className="brand footer-brand" to="/#inicio">
            <span className="brand-mark" aria-hidden="true">🐾</span>
            <span>Mascotas<span className="brand-highlight">Pro</span></span>
          </Link>
          <p>Una familia dedicada a cuidar a los que llenan tu vida de alegría.</p>
        </div>
        <div className="footer-info">
          <h2>Estamos para ayudarte</h2>
          <a href="mailto:hola@mascotaspro.com">hola@mascotaspro.com</a>
          <p>Lunes a sábado · 9:00 a 18:00</p>
        </div>
        <div className="footer-social">
          <h2>Síguenos</h2>
          <div className="social-links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mascotas Pro. Todos los derechos reservados.</span>
        <Link to="/#inicio">Hecho con amor por los animales <span aria-hidden="true">♡</span></Link>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Contacto />
    </>
  )
}

function getActiveSession() {
  try {
    const session = JSON.parse(window.localStorage.getItem('mascotasProSession') || 'null')
    if (
      session &&
      typeof session.correo === 'string' &&
      ['admin', 'trabajador'].includes(session.rol)
    ) {
      return session
    }
  } catch (error) {
    console.error('No se pudo validar la sesión almacenada.', error)
  }

  return null
}

function ProtectedAdminRoute() {
  const location = useLocation()
  const session = getActiveSession()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Admin session={session} />
}

function App() {
  const location = useLocation()
  const session = getActiveSession()

  useEffect(() => {
    const sectionId = decodeURIComponent(location.hash.slice(1))
    if (!sectionId) return undefined

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [location.hash, location.pathname])

  if (session && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <>
      {!session && <Header />}
      <main>
        <CitasProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/veterinaria" element={<Veterinaria />} />
            <Route path="/estetica" element={<Estetica />} />
            <Route path="/entrenamiento" element={<Entrenamiento />} />
            <Route path="/funerarios" element={<Funerarios />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedAdminRoute />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </CitasProvider>
      </main>
      {!session && <Footer />}
    </>
  )
}

export default App
