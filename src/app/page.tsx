import Hero from "@/components/hero/hero";
import HeroAbout from "@/components/hero/hero-about";
import HeroStack from "@/components/hero/hero-stack";
import HeroProject from "@/components/hero/hero-project";
import HeroContact from "@/components/hero/hero-contact";
import Footer from "@/components/footer/footer";
const Home = () => {
  return (
    <div className="w-full relative">
      <div className="w-full sm:w-md lg:w-xl mx-auto px-4 py-10 flex flex-col gap-10 text-[15px]">
        <Hero />
        <HeroAbout />
        <HeroStack />
        <HeroProject />
        {/* <HeroBlogs /> */}
        <HeroContact />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
