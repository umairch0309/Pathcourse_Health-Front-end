import Footer from "../footer";
import Header from "../header";
import InfoSection from "../info-section";
import PoliciesSection from "../policies";
import PortalsSection from "../portals";
import Banner from "./about-banner";
import AboutSection from "./about-page";
import Specialists from "./specialists";

export default function Page() {
  return (
    <div>
      <Header />
      <Banner />
      <AboutSection />
      <InfoSection />
      <Specialists />
      <PortalsSection />
      <PoliciesSection />
      <Footer />
    </div>
  );
}