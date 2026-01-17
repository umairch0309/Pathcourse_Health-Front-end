import OtherDoctors from "../doctors/[id]/other-doctors"
import Footer from "../footer"
import Header from "../header"
import InfoSection from "../info-section"
import PoliciesSection from "../policies"
import Banner from "./service-banner"
import ServicePage from "./service-page"

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
  )
}
