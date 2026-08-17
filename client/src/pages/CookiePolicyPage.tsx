import React from 'react';
import LegalPage from './LegalPage';
export default function CookiePolicyPage() {
  return <LegalPage eyebrow="Legal" title="Cookie Policy" intro="This Cookie Policy explains how cookies and similar technologies may be used when you visit HireExact." sections={[
    {title:"1. What cookies are", paragraphs:["Cookies are small text files stored on your device by a website. Similar technologies may remember settings, maintain sessions or support website functionality."]},
    {title:"2. How HireExact uses cookies and storage", bullets:["Essential technologies needed to deliver and secure the website.","Session or browser storage used for functions such as maintaining an authenticated admin session.","Preference or functionality technologies where needed to operate a requested feature."]},
    {title:"3. Managing cookies", paragraphs:["Most browsers allow you to block or delete cookies through their settings. Blocking essential cookies or storage can prevent parts of the website from working correctly."]},
    {title:"4. Updates and contact", paragraphs:["We may update this policy when our technology changes. Questions can be sent to Support@hire-exact.com or +1 303-720-6109."]}
  ]} />;
}