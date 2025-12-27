// app/page.js
import HeroSection from '@/app/components/landing/HeroSection';
import FeaturesSection from '@/app/components/landing/FeaturesSection';
import BYOKSection from '@/app/components/landing/BYOKSection';
import HowItWorksSection from '@/app/components/landing/HowItWorksSection';
import StatsSection from '@/app/components/landing/StatsSection';
import CTASection from '@/app/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <BYOKSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}