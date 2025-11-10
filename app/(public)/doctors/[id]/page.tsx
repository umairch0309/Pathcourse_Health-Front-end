import Footer from "../../footer";
import Header from "../../header";
import PoliciesSection from "../../policies";
import Banner from "./details-banner";
import DoctorDetails from "./doctor-details";
import OtherDoctors from "./other-doctors";
import Testimonial from "./reviews";

export default function Page() {
  return (
    <div>
      <Header />
      <Banner />
      <DoctorDetails />
      <Testimonial />
      <OtherDoctors />
      <PoliciesSection />
      <Footer />
    </div>
  );
}