import type { NextPage } from "next";
import HomeLayout from "src/components/HomeLayout";
import IntroductionSection from "components/landing/IntroductionSection";
import Container from "components/Container";
import HowToSection from "components/landing/HowToSection";
import FeatureSuggestion from "components/landing/FeatureSuggestion";

const Home: NextPage = () => {
  return (
    <HomeLayout>
      <Container className="flex flex-col gap-10">
        <IntroductionSection />
        <HowToSection />
        <FeatureSuggestion />
      </Container>
    </HomeLayout>
  );
};

export default Home;
