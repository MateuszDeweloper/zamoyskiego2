import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertiesSection from './components/PropertiesSection';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <PropertiesSection />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}