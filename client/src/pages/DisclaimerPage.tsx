import React from 'react';
import LegalPage from './LegalPage';
export default function DisclaimerPage() {
  return <LegalPage eyebrow="Legal" title="Disclaimer" intro="Information and tools on HireExact are provided for general informational and hiring-support purposes and are not legal, tax, employment or financial advice." sections={[
    {title:"1. Hiring information", paragraphs:["Candidate profiles, skills, experience, availability, match scores and other information are intended to assist evaluation. Users should independently verify information material to a hiring decision."]},
    {title:"2. AI-generated information", paragraphs:["AI Talent Matcher results may contain errors, omissions or unsuitable recommendations. AI output should be reviewed by a qualified human decision-maker and should not be the sole basis for a consequential decision."]},
    {title:"3. No employment guarantee", paragraphs:["HireExact does not guarantee that a candidate will be hired, perform in a particular way, remain available or achieve a particular business result."]},
    {title:"4. Contact", paragraphs:["HireExact Ltd, 1500 N Grant St Ste C, Denver, CO 80203, United States. Support@hire-exact.com. +1 303-720-6109."]}
  ]} />;
}