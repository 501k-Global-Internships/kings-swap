import Footer from "./Footer";
import GridImages from "./GridImages";
import Hero from "./Hero";
import KingsSwap from "./KingsSwap";
import Swap from "./Swap";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Swap />
      <GridImages />
      <KingsSwap />
      <Footer />
    </div>
  );
};

export default LandingPage;
