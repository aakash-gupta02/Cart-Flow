import { Search, Mic, Sparkles, ArrowRight, Compass, Clock, TrendingUp, Gift } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden rounded-b-[3rem] lg:rounded-b-[4rem] bg-gradient-to-r from-[#e8ebe7] to-[#c6cac8] p-4 md:p-6 lg:p-8">

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center pt-12 pb-8 px-4 sm:px-6">

        <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
          <div className="max-w-xl space-y-4">
            <p
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-neutral-700 text-xs font-medium ring-1 ring-neutral-200">
              <Sparkles className="h-4 w-4" />
              Best Service
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
              Let’s Shop
              <br />
              All‑In‑One
            </h1>
            <p className="mt-3 text-neutral-700 text-base sm:text-lg">
              Visit collectibles and follow your passion.
              <br />
              Discover brands, deals, and curated picks
              tailored to you.
            </p>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <a href="#deals"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-3 text-sm font-medium">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium ring-1 ring-neutral-200">
                Explore
                <Compass className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-6 w-full h-80 sm:h-96 lg:h-[32rem]">
          <Image
            src="/hero-pic.png"
            alt="Happy shopper wearing headphones"
            fill
            className="object-contain object-center"
            priority
          />
        </div>

      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-[1.75rem] bg-white/80 backdrop-blur-sm p-3 sm:p-4 ring-1 ring-neutral-200 shadow-sm">

          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-3">
            <Search className="h-5 w-5 text-neutral-500" />
            <input type="text" placeholder="Search for anything..."
              className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-neutral-500" />
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-neutral-200">
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <button
              className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 font-medium flex items-center justify-between">
              Recent
              <Clock className="h-4 w-4" />
            </button>
            <button
              className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 font-medium flex items-center justify-between">
              Popular
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 font-medium flex items-center justify-between col-span-2 sm:col-span-1">
              Offers
              <Gift className="h-4 w-4" />
            </button>
            <div className="hidden md:block"></div>
            <button
              className="rounded-2xl bg-violet-600 text-white px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 col-span-2 sm:col-span-3 md:col-span-1">
              Show All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
