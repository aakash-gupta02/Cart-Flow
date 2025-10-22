import Hero from "@/components/landingPage/Hero";
import Navbar from "@/components/landingPage/Navbar";
import PopularCategories from "@/components/landingPage/PopularCategories";

export default function Home() {
  return (
  <main className="max-w-7xl mx-auto py-24">
    <Navbar/>
    <Hero />
    <PopularCategories />
    {/* <Hero /> */}
  </main>

  );
}
