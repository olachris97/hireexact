import React from 'react';
import LegalPage from './LegalPage';
export default function TermsOfServicePage() {
  return <LegalPage eyebrow="Legal" title="Terms of Service" intro="These Terms of Service govern your use of the HireExact website and services." sections={[
    {title:"1. HireExact services", paragraphs:["HireExact provides a platform for discovering talent, requesting interviews, submitting talent applications and using related hiring tools."]},
    {title:"2. User responsibilities", paragraphs:["You must provide accurate information and keep account credentials confidential. You must not use the platform for unlawful, deceptive, fraudulent, abusive or unauthorized activity."]},
    {title:"3. Talent and hiring decisions", paragraphs:["Talent profiles are provided to support evaluation. HireExact does not guarantee candidate availability, suitability, employment, performance or any particular hiring outcome. Clients remain responsible for their hiring decisions and applicable employment obligations."]},
    {title:"4. AI Talent Matcher", paragraphs:["AI recommendations may be incomplete or inaccurate and should be independently evaluated. AI output should not be the sole basis for an employment or other consequential decision."]},
    {title:"5. Intellectual property", paragraphs:["HireExact and its website design, branding, software, text and original materials are owned by or licensed to HireExact Ltd and protected by applicable law."]},
    {title:"6. Disclaimers and liability", paragraphs:["To the extent permitted by law, the website and services are provided on an as-available basis. We do not guarantee uninterrupted service or any hiring result. Nothing in these Terms limits liability that cannot lawfully be limited."]},
    {title:"7. Changes", paragraphs:["We may update these Terms or suspend access where reasonably necessary. Continued use after an updated version is posted constitutes acceptance to the extent permitted by law."]},
    {title:"8. Contact", paragraphs:["HireExact Ltd, 1500 N Grant St Ste C, Denver, CO 80203, United States. Support@hire-exact.com. +1 303-720-6109."]}
  ]} />;
}