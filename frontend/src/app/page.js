import DailyDeals from "@/components/landingPage/DailyDeals";
import Hero from "@/components/landingPage/Hero";
import Navbar from "@/components/landingPage/Navbar";
import PopularCategories from "@/components/landingPage/PopularCategories";
import LuxurySection from "@/components/landingPage/LuxurySection";
import NewArrivals from "@/components/landingPage/NewArrivals";
import Marquee from "@/components/landingPage/Marquee";
import NewsletterSection from "@/components/landingPage/NewsLetterSection";
import Footer from "@/components/landingPage/Footer";

export default function Home() {
  return (
  <main className="max-w-7xl mx-auto pt-24">
    <Navbar/>
    <Hero />
    <PopularCategories />
    <DailyDeals />
    <LuxurySection />
    <NewArrivals />
    <Marquee />
    <Footer />
  </main>

  );
}
