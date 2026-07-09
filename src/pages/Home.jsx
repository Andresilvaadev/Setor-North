import Header from '../components/Header'
import Hero from '../components/Hero'
import Catalog from '../components/Catalog'
import DTF from '../components/DTF'
import Drop from '../components/Drop'
import Lookbook from '../components/Lookbook'
import About from '../components/About'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Drop />
        <Catalog />
        <DTF />
        <Lookbook />
        <About />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
