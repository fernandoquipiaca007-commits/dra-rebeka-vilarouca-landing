import { Hero } from './components/Hero';
import { Authority } from './components/Authority';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-beige text-text-dark selection:bg-maroon/20 selection:text-maroon">
      <main className="flex-grow">
        <Hero />
        <Authority />
      </main>
      <Footer />
    </div>
  );
}
