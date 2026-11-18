import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  ShieldCheck,
  Users,
  Scale,
  Mail,
} from 'lucide-react';
import { ConnectUpIcon } from './ui/ConnectUpLogo';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export interface LegalSubsection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: { label: string; text: string }[];
}

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: { label: string; text: string }[];
  subsections?: LegalSubsection[];
}

export interface LegalDocument {
  key: 'privacy' | 'terms';
  title: string;
  lastUpdated: string;
  breadcrumb: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: Record<'privacy' | 'terms', LegalDocument> = {
  privacy: {
    key: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: May 2026',
    breadcrumb: 'Privacy Policy',
    intro:
      'At ConnectUp ("we," "our," or "us"), we respect your privacy and are committed to safeguarding the personal and business information shared by startup founders and investors across our platform. This Privacy Policy explains how we collect, use, share, and protect your data when you use ConnectUp. By accessing or using our services, you agree to the practices described below.',
    sections: [
      {
        id: 'privacy-intro',
        title: '1. Introduction',
        paragraphs: [
          'ConnectUp is dedicated to maintaining a trusted, transparent environment where early-stage founders and verified investors connect directly. Protecting your account credentials, pitch materials, and investment thesis preferences is fundamental to how our platform operates.',
          'We encourage you to review this Privacy Policy periodically, as we may update it to reflect improvements to our product, matching features, or applicable data protection regulations.',
        ],
      },
      {
        id: 'privacy-collect',
        title: '2. Information We Collect',
        subsections: [
          {
            id: 'privacy-personal-data',
            title: '2.1. Personal & Profile Data',
            paragraphs: [
              'We collect information you voluntarily provide when registering, creating a founder or investor profile, uploading pitch materials, or contacting our support team. This includes your name, email address, professional role, startup or fund affiliation, stage focus, target check sizes, and billing details for paid memberships.',
            ],
          },
          {
            id: 'privacy-non-personal-data',
            title: '2.2. Usage & Technical Data',
            paragraphs: [
              'When you navigate ConnectUp, we automatically collect non-identifying technical signals such as browser type, device category, operating system, session timestamps, and feature interactions. These signals help us keep the service fast, reliable, and protected against automated abuse.',
            ],
          },
        ],
      },
      {
        id: 'privacy-use',
        title: '3. How We Use Your Information',
        subsections: [
          {
            id: 'privacy-use-personal',
            title: '3.1. Core Platform & Matching',
            paragraphs: ['We use your profile and account information strictly to operate and improve ConnectUp:'],
            bullets: [
              {
                label: 'Providing Services',
                text: 'To authenticate your account, display your founder or investor profile, and manage subscriptions.',
              },
              {
                label: 'Thesis & Stage Matching',
                text: 'To connect startups with investors aligned on sector, stage, geography, and check size.',
              },
              {
                label: 'Communication',
                text: 'To deliver match alerts, direct message notifications, and responses to your support requests.',
              },
              {
                label: 'Product Improvement',
                text: 'To understand how members discover opportunities and refine matching accuracy.',
              },
            ],
          },
          {
            id: 'privacy-use-technical',
            title: '3.2. Security & Performance',
            paragraphs: ['Technical and aggregated usage data is used primarily to:'],
            bullets: [
              {
                label: 'Enhance User Experience',
                text: 'Identify and resolve navigation bottlenecks, layout issues, and slow queries across devices.',
              },
              {
                label: 'Prevent Unauthorized Access',
                text: 'Detect suspicious login patterns, spam outreach, and scraping attempts to protect member data.',
              },
            ],
          },
        ],
      },
      {
        id: 'privacy-sharing',
        title: '4. Sharing Your Information',
        paragraphs: [
          'ConnectUp does not sell your personal information or pitch decks to third-party data brokers. Information in your public or matched profile is shared only with other verified members according to your visibility preferences and explicit match actions.',
          'We may share limited data with vetted infrastructure providers (such as cloud hosting, authentication, and payment processors) strictly under confidentiality obligations to operate the platform, or where required by applicable law.',
        ],
      },
      {
        id: 'privacy-rights',
        title: '5. Your Rights & Controls',
        paragraphs: [
          'You remain in full control of your ConnectUp account and pitch information. At any time from your account settings or by contacting us, you may:',
        ],
        bullets: [
          {
            label: 'Access & Export',
            text: 'Request a copy of the personal and profile data associated with your account.',
          },
          {
            label: 'Update or Correct',
            text: 'Edit your startup details, investor thesis, or contact preferences directly in your workspace.',
          },
          {
            label: 'Deactivate or Delete',
            text: 'Hide your profile from discovery immediately or request permanent account and data deletion.',
          },
        ],
      },
      {
        id: 'privacy-contact',
        title: '6. Changes & Contact Us',
        paragraphs: [
          'If we make material updates to this Privacy Policy, we will update the revision date at the top of this page and notify active account holders where appropriate.',
          'For privacy questions, data access requests, or deletion inquiries, reach our privacy team at privacy@connectup.app.',
        ],
      },
    ],
  },
  terms: {
    key: 'terms',
    title: 'Terms of Service',
    lastUpdated: 'Last updated: May 2026',
    breadcrumb: 'Terms of Service',
    intro:
      'Welcome to ConnectUp. These Terms of Service ("Terms") govern your access to and use of the ConnectUp website, matching platform, pitch workspace, and related services ("Services"). By creating an account or accessing ConnectUp, you agree to be bound by these Terms.',
    sections: [
      {
        id: 'terms-acceptance',
        title: '1. Acceptance of Terms',
        paragraphs: [
          'ConnectUp provides a digital network connecting startup founders raising capital with angel investors, syndicates, and institutional backers. By using our Services on behalf of yourself, a company, or an investment entity, you represent that you have the authority to bind that organization to these Terms.',
          'If you do not agree with any provision of these Terms, you must discontinue use of the platform.',
        ],
      },
      {
        id: 'terms-platform-role',
        title: '2. Platform Role & Eligibility',
        subsections: [
          {
            id: 'terms-not-broker',
            title: '2.1. Marketplace & Discovery Only',
            paragraphs: [
              'ConnectUp is a founder-and-investor discovery platform, not a registered broker-dealer, investment advisor, or crowdfunding portal. We do not endorse any startup, verify financial projections, or act as an intermediary in securities transactions. All investment decisions, term sheets, and due diligence occur independently between founders and investors.',
            ],
          },
          {
            id: 'terms-eligibility',
            title: '2.2. Member Eligibility',
            paragraphs: [
              'You must be at least 18 years old and legally able to enter into binding contracts to use ConnectUp. Investors accessing regulated deal rooms or private offerings are solely responsible for ensuring they meet applicable accreditation or jurisdictional requirements.',
            ],
          },
        ],
      },
      {
        id: 'terms-accounts',
        title: '3. Accounts & Member Responsibilities',
        subsections: [
          {
            id: 'terms-account-security',
            title: '3.1. Registration & Account Security',
            paragraphs: [
              'You agree to provide accurate, current information during onboarding and to keep your login credentials confidential. You are responsible for all activity occurring under your account and must notify us promptly at support@connectup.app if you suspect unauthorized access.',
            ],
          },
          {
            id: 'terms-conduct',
            title: '3.2. Acceptable Conduct',
            paragraphs: ['To preserve a high-trust network for founders and investors, members agree not to:'],
            bullets: [
              {
                label: 'Misrepresent Identity',
                text: 'Impersonate another founder, investor, or firm, or publish fabricated traction metrics.',
              },
              {
                label: 'Harvest or Scrape Data',
                text: 'Use automated scripts, bots, or scrapers to extract member profiles, emails, or pitch decks.',
              },
              {
                label: 'Unsolicited Spam',
                text: 'Send mass promotional solicitations unrelated to genuine startup-investor evaluation.',
              },
              {
                label: 'Misuse Confidential Decks',
                text: 'Redistribute non-public founder pitch materials outside your internal evaluation team without permission.',
              },
            ],
          },
        ],
      },
      {
        id: 'terms-ip',
        title: '4. Content & Intellectual Property',
        paragraphs: [
          'Founders and investors retain full ownership of all pitch decks, company descriptions, logos, and messages they upload to ConnectUp. You grant ConnectUp a limited, non-exclusive license solely to host, format, and display your content to matched or authorized users as required to deliver the Services.',
          'The ConnectUp brand, user interface, underlying software, matching algorithms, and editorial content remain the exclusive intellectual property of ConnectUp and may not be copied or reverse-engineered.',
        ],
      },
      {
        id: 'terms-subscriptions',
        title: '5. Subscriptions & Termination',
        paragraphs: [
          'Paid memberships renew according to the billing cycle selected at checkout unless canceled prior to renewal. You may cancel or modify your plan at any time through your billing settings.',
          'ConnectUp reserves the right to suspend or terminate accounts that violate these Terms, compromise platform security, or engage in deceptive conduct.',
        ],
      },
      {
        id: 'terms-liability',
        title: '6. Disclaimers & Contact Us',
        paragraphs: [
          'The Services are provided on an "as is" and "as available" basis without warranties of successful fundraising outcomes or investment returns. To the fullest extent permitted by law, ConnectUp is not liable for indirect, incidental, or consequential damages arising from platform use or third-party interactions.',
          'Questions regarding these Terms of Service may be sent to legal@connectup.app.',
        ],
      },
    ],
  },
};

export const LegalView: React.FC<LegalViewProps> = ({ type, onBack }) => {
  const [activeType, setActiveType] = useState<'privacy' | 'terms'>(type);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveType(type);
  }, [type]);

  const doc = LEGAL_DOCUMENTS[activeType];

  // Collect all anchor IDs in order for scroll-spy
  const allTocIds = useMemo(
    () =>
      doc.sections.flatMap((section) => [
        section.id,
        ...(section.subsections?.map((sub) => sub.id) || []),
      ]),
    [doc]
  );

  useEffect(() => {
    setActiveSectionId(doc.sections[0]?.id || '');
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeType, doc]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let currentId = allTocIds[0] || '';

      for (const id of allTocIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const offset = el.getBoundingClientRect().top - containerTop;
        if (offset <= 140) {
          currentId = id;
        }
      }

      if (currentId) {
        setActiveSectionId(currentId);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [allTocIds]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSectionId(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const switchDoc = (nextType: 'privacy' | 'terms') => {
    setActiveType(nextType);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 z-[150] flex flex-col bg-white overflow-y-auto text-zinc-900 font-sans selection:bg-[#FACC15] selection:text-zinc-950"
    >
      {/* Top Documentation Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <span className="hidden sm:inline-block h-4 w-px bg-zinc-200" aria-hidden="true" />

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 flex items-center justify-center p-1 shrink-0">
                <ConnectUpIcon className="w-full h-full" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-950 truncate">
                ConnectUp Legal
              </span>
            </div>
          </div>

          {/* Document Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 shrink-0">
            <button
              type="button"
              onClick={() => switchDoc('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeType === 'privacy'
                  ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => switchDoc('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeType === 'terms'
                  ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-24">
        {/* Clean Editorial Page Title Band (aligned with main center column on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-zinc-200/80">
          <div className="hidden lg:block lg:col-span-3" />
          <div className="lg:col-span-6">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 leading-tight">
              {doc.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">{doc.lastUpdated}</p>
          </div>
          <div className="hidden lg:block lg:col-span-3" />
        </div>

        {/* Three-Column Documentation Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-10">
          {/* LEFT SIDEBAR: Document Navigation & Safeguards */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-7">
              <div>
                <p className="text-xs font-semibold text-zinc-950 mb-3">
                  Legal Documents
                </p>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => switchDoc('privacy')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeType === 'privacy'
                          ? 'bg-zinc-100 text-zinc-950 font-semibold'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>Privacy Policy</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => switchDoc('terms')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeType === 'terms'
                          ? 'bg-zinc-100 text-zinc-950 font-semibold'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>Terms of Service</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-950 mb-3">
                  Trust &amp; Compliance
                </p>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeType !== 'privacy') switchDoc('privacy');
                        setTimeout(() => scrollToSection('privacy-collect'), 50);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Data Collection</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeType !== 'privacy') switchDoc('privacy');
                        setTimeout(() => scrollToSection('privacy-rights'), 50);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Member Data Rights</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeType !== 'terms') switchDoc('terms');
                        setTimeout(() => scrollToSection('terms-platform-role'), 50);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer text-left"
                    >
                      <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Founders &amp; Investors</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection(
                          activeType === 'privacy' ? 'privacy-contact' : 'terms-liability'
                        )
                      }
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer text-left"
                    >
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Legal Contact</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Full Legal Text */}
          <article className="lg:col-span-6 min-w-0">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6"
            >
              <button
                type="button"
                onClick={onBack}
                className="hover:text-zinc-700 transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3 h-3 text-zinc-300" />
              <span>Legal</span>
              <ChevronRight className="w-3 h-3 text-zinc-300" />
              <span className="text-zinc-800 font-medium">{doc.breadcrumb}</span>
            </nav>

            {/* Lead Heading & Intro */}
            <div className="space-y-4 pb-8 border-b border-zinc-200/70">
              <h2 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-zinc-950">
                {doc.title}
              </h2>
              <p className="text-sm sm:text-[15px] text-zinc-600 leading-[1.75]">
                {doc.intro}
              </p>
            </div>

            {/* Numbered Sections */}
            <div className="mt-10 space-y-11">
              {doc.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 space-y-5"
                >
                  <h2 className="text-xl sm:text-[22px] font-semibold tracking-tight text-zinc-950">
                    {section.title}
                  </h2>

                  {section.paragraphs?.map((p, idx) => (
                    <p
                      key={idx}
                      className="text-sm sm:text-[15px] text-zinc-600 leading-[1.75]"
                    >
                      {p}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="list-disc pl-5 space-y-2.5 text-sm sm:text-[15px] text-zinc-600 leading-[1.7]">
                      {section.bullets.map((item, idx) => (
                        <li key={idx}>
                          <strong className="font-semibold text-zinc-900">
                            {item.label}:
                          </strong>{' '}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && (
                    <div className="space-y-7 pt-1">
                      {section.subsections.map((sub) => (
                        <div
                          key={sub.id}
                          id={sub.id}
                          className="scroll-mt-24 space-y-3.5"
                        >
                          <h3 className="text-base sm:text-[17px] font-semibold tracking-tight text-zinc-950">
                            {sub.title}
                          </h3>

                          {sub.paragraphs?.map((p, idx) => (
                            <p
                              key={idx}
                              className="text-sm sm:text-[15px] text-zinc-600 leading-[1.75]"
                            >
                              {p}
                            </p>
                          ))}

                          {sub.bullets && (
                            <ul className="list-disc pl-5 space-y-2.5 text-sm sm:text-[15px] text-zinc-600 leading-[1.7]">
                              {sub.bullets.map((item, idx) => (
                                <li key={idx}>
                                  <strong className="font-semibold text-zinc-900">
                                    {item.label}:
                                  </strong>{' '}
                                  {item.text}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Bottom Document Cross-Link */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-zinc-500">
                  {activeType === 'privacy'
                    ? 'Review platform rules & member conduct'
                    : 'Review how we safeguard member information'}
                </p>
                <p className="text-sm font-semibold text-zinc-950 mt-0.5">
                  {activeType === 'privacy'
                    ? 'Read our Terms of Service'
                    : 'Read our Privacy Policy'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => switchDoc(activeType === 'privacy' ? 'terms' : 'privacy')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FACC15] hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
              >
                <span>
                  {activeType === 'privacy' ? 'Terms of Service' : 'Privacy Policy'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>

          {/* RIGHT SIDEBAR: Sticky On-Page Outline */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                On this page
              </p>
              <ul className="space-y-2 text-xs border-l border-zinc-200 pl-3.5">
                {doc.sections.map((section) => {
                  const isSectionActive = activeSectionId === section.id;
                  return (
                    <li key={section.id} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className={`block text-left w-full leading-snug transition-colors cursor-pointer ${
                          isSectionActive
                            ? 'text-zinc-950 font-semibold'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {section.title}
                      </button>

                      {section.subsections && (
                        <ul className="space-y-1.5 pl-3">
                          {section.subsections.map((sub) => {
                            const isSubActive = activeSectionId === sub.id;
                            return (
                              <li key={sub.id}>
                                <button
                                  type="button"
                                  onClick={() => scrollToSection(sub.id)}
                                  className={`block text-left w-full leading-snug transition-colors cursor-pointer ${
                                    isSubActive
                                      ? 'text-zinc-950 font-semibold'
                                      : 'text-zinc-400 hover:text-zinc-800'
                                  }`}
                                >
                                  {sub.title}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </div>
  );
};
