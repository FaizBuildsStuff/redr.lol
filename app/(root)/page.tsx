import FAQSection from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Hero from "@/components/Hero";
import PricingSection from "@/components/Pricing";
import StatsSection from "@/components/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
