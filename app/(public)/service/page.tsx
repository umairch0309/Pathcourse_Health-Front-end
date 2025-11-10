import Footer from "../footer";
import Header from "../header";
import ServicePage from "./service-page";
import PoliciesSection from "../policies";
import Banner from "./service-banner";
import InfoSection from "../info-section";
import OtherDoctors from "../doctors/[id]/other-doctors";

export default function Page() {
  return (
    <div>
      <Header />
      <Banner />
      <ServicePage />
      <InfoSection />
      <OtherDoctors />
      <PoliciesSection />
      <Footer />
    </div>
  );
}