import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Landing/Hero';
import Features from '@/components/layout/Landing/Features';
import Pricing from '@/components/layout/Landing/Pricing';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
