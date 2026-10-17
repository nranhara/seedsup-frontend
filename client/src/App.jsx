import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import RecommendationForm from "./Components/RecommendationForm";
import Footer from "./Components/Footer";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-white">

      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-180px] top-[120px] h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[140px]" />

        <div className="absolute bottom-[-180px] right-[-180px] h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>

      <Navbar />

      <main>
        <Hero />

        <section
          id="recommend"
          className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:px-8"
        >
          <RecommendationForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;