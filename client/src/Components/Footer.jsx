const Footer = () => {
  return (
    <footer className="border-t border-white/7 bg-black/20">

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">

        <div>
          <p className="text-sm font-semibold text-slate-300">
            Smart Seed Supplier Matching System
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            Intelligent supplier recommendations for smarter agricultural
            decisions.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          SeedAI
        </div>

      </div>

    </footer>
  );
};

export default Footer;