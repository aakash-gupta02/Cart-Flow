import Navbar from "@/components/landingPage/Navbar";

export default function pageLayout({children}) {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  );
};
