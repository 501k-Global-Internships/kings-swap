import Footer from "./Footer";
import GridImages from "./GridImages";
import Hero from "./Hero";
import KingsSwap from "./KingsSwap";
import Navbar from "./Navbar";
import Swap from "./Swap";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Swap />
      <GridImages />
      <KingsSwap />
      <Footer />
    </div>
  );
};

export default LandingPage;
