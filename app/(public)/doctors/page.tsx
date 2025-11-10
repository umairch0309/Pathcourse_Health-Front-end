import Footer from "../footer";
import Header from "../header";
import PoliciesSection from "../policies";
import AllDoctors from "./all-doctors";
import Banner from "./doctor-banner";

export default function Page() {
  return (
    <div>
      <Header />
      <Banner />
      <AllDoctors />
      <PoliciesSection />
      <Footer />
    </div>
  );
}