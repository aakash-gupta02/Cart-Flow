
import { Search, Mic, Sparkles, ArrowRight, Compass, BadgeCheck, Plus, Clock, TrendingUp, Gift } from "lucide-react";
import Image from "next/image";
import AsideDock from "./AsideDock";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden rounded-[4rem] bg-gradient-to-r from-[#e8ebe7] to-[#c6cac8] p-6 md:px-12">



      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-2 p-3 sm:p-6">

        <div className="order-1 lg:order-1 lg:col-span-5 flex flex-col justify-center ">
          <div className="max-w-xl lg:max-w-lg space-y-4 px-3 sm:px-0">
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

            <div className="mt-6 flex items-center gap-3">
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


        <div className="relative order-1 lg:order-1 lg:col-span-5 h-96 w-2xl ">
          <div className="w-full h-full ">

            <Image
              src="/hero-pic.png"
              alt="Happy shopper wearing headphones"
              fill
              className="object-cover"
            />
          </div>
        </div>
    
    <AsideDock />

      </div>

      <div className="px-6 sm:px-10 pb-10 max-w-3xl ">
        <div className="rounded-[1.75rem] bg-white p-3 sm:p-4 ring-1 ring-neutral-200 shadow-sm">

          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-3">
            <Search className="h-5 w-5 text-neutral-500" />
            <input type="text" placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-neutral-500" />
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-neutral-200">
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 font-medium flex items-center justify-between">
              Recent
              <Clock className="h-4 w-4" />
            </button>
            <button
              className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 font-medium flex items-center justify-between">
              Popular Items
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-800 font-medium flex items-center justify-between">
              Special Offers For You
              <Gift className="h-4 w-4" />
            </button>
            <div className="hidden md:block"></div>
            <button
              className="rounded-2xl bg-violet-600 text-white px-4 py-3 text-sm font-medium flex items-center justify-center gap-2">
              Show All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>


    </section>
  );
}
