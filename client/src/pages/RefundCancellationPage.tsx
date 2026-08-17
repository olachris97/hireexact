import React from 'react';
import LegalPage from './LegalPage';
export default function RefundCancellationPage() {
  return <LegalPage eyebrow="Service policy" title="Refund & Cancellation Policy" intro="This policy explains how cancellations and refunds are handled for HireExact services and hiring requests." sections={[
    {title:"1. Hiring requests", paragraphs:["Submitting an interview or hiring request does not by itself create an employment contract or guarantee that a candidate will be hired. If a paid service is involved, the applicable commercial terms presented at purchase or engagement also apply."]},
    {title:"2. Cancellations", paragraphs:["Contact HireExact as soon as possible at Support@hire-exact.com or +1 303-720-6109 to request a cancellation or change. Requests are reviewed based on the stage of service and applicable agreement."]},
    {title:"3. Refunds", paragraphs:["Where a refund is available, the amount and timing may depend on the service purchased, work already performed, third-party costs and applicable agreement. Approved refunds are generally returned through the original payment method where reasonably possible."]},
    {title:"4. Contact", paragraphs:["Include your name, company, relevant request details and any reference number when requesting a refund or cancellation."]}
  ]} />;
}