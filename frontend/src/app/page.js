import DailyDeals from "@/components/landingPage/DailyDeals";
import Hero from "@/components/landingPage/Hero";
import Navbar from "@/components/landingPage/Navbar";
import PopularCategories from "@/components/landingPage/PopularCategories";
import LuxurySection from "@/components/landingPage/LuxurySection";
import NewArrivals from "@/components/landingPage/NewArrivals";

export default function Home() {
  return (
  <main className="max-w-7xl mx-auto py-24">
    <Navbar/>
    <Hero />
    <PopularCategories />
    <DailyDeals />
    <LuxurySection />
    <NewArrivals />
  </main>

  );
}
