import Footer from "../footer"
import Header from "../header"
import PoliciesSection from "../policies"
import Banner from "./about-banner"
import AboutSection from "./about-page"

export default function Page() {
  return (
    <div>
      <Header />
      <Banner />
      <AboutSection />
      {/* <InfoSection />
      <Specialists />
      <PortalsSection /> */}
      <PoliciesSection />
      <Footer />
    </div>
  )
}
