import Hero from "@/components/hero/hero";
import HeroAbout from "@/components/hero/hero-about";
// import HeroStack from "@/components/hero/hero-stack";
import HeroProject from "@/components/hero/hero-project";
import HeroContact from "@/components/hero/hero-contact";
import HeroExperience from "@/components/hero/hero-experience";
import Footer from "@/components/footer/footer";
import Fadeup from "@/components/ui/fadeup";
// import HeroQuote from "@/components/hero/hero-quote";

const Home = () => {
  return (
    <div className="w-full relative">
      <div className="w-full max-w-3xl mx-auto py-16 flex flex-col gap-20 text-[16px]">
        <Hero />
        <HeroExperience />
        {/* <HeroAbout /> */}
        {/* <HeroStack /> */}
        <HeroProject />
        <HeroAbout />
        <HeroContact />
        {/* <HeroQuote /> */}
        <Fadeup delay={0.2} duration={0.6}>
          <Footer />
        </Fadeup>
      </div>
    </div>
  );
};

export default Home;
