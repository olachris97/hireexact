import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { WageBridgeSection } from '../components/WageBridgeSection';
import { TalentSection } from '../components/TalentSection';
import { VettingSection } from '../components/VettingSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';
import { AiTalentMatcherModal } from '../components/AiTalentMatcherModal';
import { BookInterviewModal } from '../components/BookInterviewModal';
import { TalentApplyModal } from '../components/TalentApplyModal';
import { Candidate } from '../types';

export default function MarketingPage() {
  const [aiMatcherOpen, setAiMatcherOpen] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const openHireModal = (candidate?: Candidate | null) => {
    setSelectedCandidate(candidate ?? null);
    setHireModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <Navbar
        onOpenAiMatcher={() => setAiMatcherOpen(true)}
        onOpenHireModal={() => openHireModal(null)}
        onOpenApplyModal={() => setApplyModalOpen(true)}
      />

      <main>
        <HeroSection onOpenHireModal={() => openHireModal(null)} onOpenAiMatcher={() => setAiMatcherOpen(true)} />
        <HowItWorksSection />
        <WageBridgeSection onOpenHireModal={() => openHireModal(null)} />
        <TalentSection onSelectCandidate={(c) => openHireModal(c)} />
        <VettingSection />
        <TestimonialsSection />
        <CtaSection onOpenHireModal={() => openHireModal(null)} onOpenApplyModal={() => setApplyModalOpen(true)} />
      </main>

      <Footer />

      <AiTalentMatcherModal
        isOpen={aiMatcherOpen}
        onClose={() => setAiMatcherOpen(false)}
        onSelectRecommendedCandidate={() => {
          setAiMatcherOpen(false);
          openHireModal(null);
        }}
      />
      <BookInterviewModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        selectedCandidate={selectedCandidate}
      />
      <TalentApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} />
    </div>
  );
}
