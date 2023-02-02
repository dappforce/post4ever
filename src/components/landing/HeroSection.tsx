import Container from "components/Container";
import Image from "next/image";
import Diamond from "src/assets/diamond.png";
import Button from "components/Button";
import { useBreakpointThreshold } from "src/hooks/use-breakpoint";

const HeroSection = () => {
  const mdUp = useBreakpointThreshold("md");
  return (
    <div
      style={{
        background: "linear-gradient(106.83deg, #ff3ec9 0.85%, #5239ce 103.97%)",
      }}>
      <Container className="flex flex-col-reverse items-center gap-8 py-16 md:grid md:grid-cols-[1.25fr,1fr]">
        <div className="flex flex-col items-center justify-center md:items-start">
          <h1 className="mb-6 text-center font-unbounded text-2xl font-medium !leading-snug text-white md:mb-8 md:text-left md:text-3xl lg:text-4xl">
            Back up your tweets to Subsocial’s censorship resistant network
          </h1>
          <div>
            <Button
              variant="white"
              size={mdUp ? "large" : "medium"}
              className="text-lg"
              href="/crosspost"
              target="_blank">
              Enter App
            </Button>
          </div>
        </div>
        <Image
          className="origin-left sm:w-1/2 md:w-full md:scale-110"
          src={Diamond}
          role="presentation"
          priority
          alt=""
        />
      </Container>
    </div>
  );
};

export default HeroSection;
