import { Hero } from './components/Hero';
import { Authority } from './components/Authority';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f8f9] text-[#0f172a] selection:bg-[#0b2b35]/20 selection:text-[#0b2b35]">
      <main className="flex-grow">
        <Hero />
        <Authority />
      </main>
      <Footer />
    </div>
  );
}