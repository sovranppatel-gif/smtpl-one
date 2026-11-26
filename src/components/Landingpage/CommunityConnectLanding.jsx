import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons-opt/logo.webp";
import heroEditorScene from "../../assets/hero/home-editor-scene.webp";
import maleFreelancerImage from "../../assets/icons/28.webp";
import femaleClientImage from "../../assets/icons/29.webp";
import processSearchIcon from "../../assets/icons-opt/22.webp";
import processDeliveryIcon from "../../assets/icons-opt/26.webp";
import processReviewIcon from "../../assets/icons-opt/27.webp";
import freelancerIcon from "../../assets/icons-opt/2.webp";
import clientIcon from "../../assets/icons-opt/3.webp";
import secureIcon from "../../assets/icons-opt/4.webp";
import {
  SERVICES_CATALOG,
  findServiceBySlugOrName,
} from "../../data/servicesCatalog.js";
import {
  ServiceDetailModal,
  ServiceEnquiryModal,
} from "./ServiceModals.jsx";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Globe2,
  Headset,
  Instagram,
  Layers,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Menu,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Twitter,
  UserRound,
  X,
  Youtube,
} from "lucide-react";
import { defaultLandingSettings, getLandingSettings } from "../../utils/siteSettings.js";
import "./CommunityConnectLanding.css";

const HERO_BENEFITS = [
  {
    title: "Curated Digital Talent",
    subtitle: "Skilled creators across design, video & tech",
    image: freelancerIcon,
  },
  {
    title: "Client Project Support",
    subtitle: "Guided matching & scope alignment",
    image: clientIcon,
  },
  {
    title: "15 Service Categories",
    subtitle: "Creative, marketing & engineering solutions",
    Icon: Layers,
  },
  {
    title: "Transparent Collaboration",
    subtitle: "Clear deliverables & direct communication",
    image: secureIcon,
  },
];

const PROCESS_STEPS = [
  {
    title: "Connect",
    description: "Apply as a freelancer or send a client project enquiry.",
    image: freelancerIcon,
  },
  {
    title: "Share Scope",
    description: "Outline your skills or project requirements clearly.",
    image: processSearchIcon,
  },
  {
    title: "Collaborate",
    description: "Align with the right team and get work underway.",
    image: processDeliveryIcon,
  },
  {
    title: "Deliver",
    description: "Bring creative and digital deliverables to completion.",
    image: processReviewIcon,
  },
];

const COMMUNITY_PILLARS = [
  {
    tag: "Talent Network",
    title: "Skill-Focused Onboarding",
    description:
      "Freelancers submit their skills, portfolio samples, and preferred categories through our community intake form for review.",
    icon: Sparkles,
  },
  {
    tag: "Client Enquiries",
    title: "Guided Service Matching",
    description:
      "Businesses can enquire across 15 creative, marketing, and engineering disciplines and connect directly with our coordination team.",
    icon: Briefcase,
  },
  {
    tag: "Transparency",
    title: "Clear Scope Before Kickoff",
    description:
      "Deliverables, timelines, and pricing expectations are discussed upfront before any engagement begins.",
    icon: ShieldCheck,
  },
  {
    tag: "Support",
    title: "Direct Human Assistance",
    description:
      "Reach our team by phone, email, or WhatsApp for onboarding questions, project enquiries, and ongoing support.",
    icon: Headset,
  },
];

const FAQ_ITEMS = [
  {
    question: "What is Community Connect?",
    answer:
      "Community Connect is an initiative by Scholars Mediatech to bring together freelancers, creative professionals, and businesses seeking reliable digital and creative services.",
  },
  {
    question: "How do I hire a creator or agency?",
    answer:
      "Explore our 15 service categories, choose the capability you need, and send a client enquiry through the contact section below so our team can assist you with the right fit.",
  },
  {
    question: "Is the pricing fixed or negotiable?",
    answer:
      "Pricing depends on project scope, deliverables, and timeline. Confirm all deliverables, milestones, and costs with our team before starting an engagement.",
  },
  {
    question: "How do payments and refunds work?",
    answer:
      "Payment schedules and refund terms are shared clearly for each confirmed engagement. For help with an active order or billing question, contact our support team directly.",
  },
  {
    question: "Can I register as a creator?",
    answer:
      "Yes. Use the Join as Freelancer button to open the Community Join Form and submit your skills, experience, and portfolio details.",
  },
];

function formatPhoneHref(phone = "") {
  const cleaned = String(phone).replace(/[^+\d]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

function formatWhatsAppHref(phone = "") {
  const digits = String(phone).replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function splitCompanyBrand(rawName) {
  const clean = (rawName || "Scholars Mediatech")
    .replace(/\s+pvt\.?\s*ltd\.?$/i, "")
    .trim();
  const match = clean.match(/^(.*?)(mediatech)(.*)$/i);
  return { clean, match };
}

function Header({ settings, onSelectService }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDrawerId = useId();
  const { clean: companyName, match: companyNameParts } = splitCompanyBrand(
    settings.companyName,
  );

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Reviews", href: "#community" },
    { label: "Join Us", href: "#become-creator" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    if (!servicesOpen && !menuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMenuOpen(false);
      }
    };
    const handlePointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [servicesOpen, menuOpen]);

  const handleCategoryPick = (serviceName) => {
    setServicesOpen(false);
    setMenuOpen(false);
    onSelectService(serviceName, { scrollTargetId: "services" });
  };

  return (
    <header className="cc-header sticky top-0 z-50 border-b">
      <div className="cc-header-inner">
        <Link to="/" className="cc-brand-link" onClick={() => setMenuOpen(false)}>
          <img
            src={logo}
            alt="Scholars Mediatech logo"
            width={76}
            height={62}
            className="cc-brand-logo"
          />
          <div className="cc-brand-text">
            <div className="cc-brand-title">
              {companyNameParts ? (
                <>
                  {companyNameParts[1]}
                  <span className="cc-brand-highlight">{companyNameParts[2]}</span>
                  {companyNameParts[3]}
                </>
              ) : (
                companyName
              )}
            </div>
            <div className="cc-brand-subtitle">
              Freelancer Marketplace &amp; Digital Services Platform
            </div>
          </div>
        </Link>

        <nav className="cc-desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            if (item.label === "Services") {
              return (
                <div key={item.label} ref={dropdownRef} className="cc-nav-dropdown">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="menu"
                    onClick={() => setServicesOpen((prev) => !prev)}
                    className="cc-nav-link cc-nav-dropdown-trigger"
                  >
                    {item.label}
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className={`cc-chevron ${servicesOpen ? "is-open" : ""}`}
                    />
                  </button>
                  {servicesOpen && (
                    <div
                      role="menu"
                      aria-label="Service categories"
                      className="cc-services-menu"
                    >
                      {SERVICES_CATALOG.map((service) => (
                        <button
                          key={service.slug}
                          type="button"
                          role="menuitem"
                          onClick={() => handleCategoryPick(service)}
                          className="cc-services-menu-item"
                        >
                          <img
                            src={service.image}
                            alt=""
                            aria-hidden="true"
                            width={28}
                            height={28}
                            loading="lazy"
                          />
                          <span>{service.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <a key={item.label} href={item.href} className="cc-nav-link">
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="cc-header-actions">
          <Link to="/master-admin" className="cc-btn cc-btn-outline">
            Login
          </Link>
          <a href="#become-creator" className="cc-btn cc-btn-navy">
            Get Started <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className="cc-mobile-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls={mobileDrawerId}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div id={mobileDrawerId} className="cc-mobile-drawer">
          <nav aria-label="Mobile navigation" className="cc-mobile-nav">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="cc-mobile-nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="cc-mobile-actions">
            <Link
              to="/master-admin"
              onClick={() => setMenuOpen(false)}
              className="cc-btn cc-btn-outline cc-btn-full"
            >
              Login
            </Link>
            <a
              href="#become-creator"
              onClick={() => setMenuOpen(false)}
              className="cc-btn cc-btn-navy cc-btn-full"
            >
              Get Started <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="cc-hero">
      <div className="cc-hero-media" aria-hidden="true">
        <img
          src={heroEditorScene}
          alt=""
          width={1200}
          height={700}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="cc-hero-bg-img"
        />
        <div className="cc-hero-scrim" />
      </div>

      <div className="cc-container cc-hero-container">
        <div className="cc-hero-inner">
          <div className="cc-hero-copy">
            <p className="cc-hero-kicker">
              CREATE <span aria-hidden="true">•</span> CONNECT{" "}
              <span aria-hidden="true">•</span> GROW
            </p>
            <h1 id="hero-heading" className="cc-hero-title">
              Turn Your Skills into{" "}
              <span className="cc-hero-accent">Opportunities</span>
            </h1>
            <p className="cc-hero-lead">
              A collaborative digital services platform that connects skilled
              freelancers with businesses and organizations for creative,
              marketing, and technical solutions.
            </p>
            <div className="cc-hero-ctas">
              <Link to="/CommunityJoinForm" className="cc-btn cc-btn-gold">
                <img
                  src={processReviewIcon}
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                />
                Join as Freelancer
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href="#services" className="cc-btn cc-btn-outline">
                Hire Talent (Client)
              </a>
            </div>
          </div>
        </div>

        <ul className="cc-benefit-bar" aria-label="Platform highlights">
          {HERO_BENEFITS.map(({ title, subtitle, image, Icon }) => (
            <li key={title} className="cc-benefit-item">
              {image ? (
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                  width={34}
                  height={34}
                  className="cc-benefit-icon"
                />
              ) : (
                <Icon
                  size={28}
                  strokeWidth={1.85}
                  className="cc-benefit-lucide"
                  aria-hidden="true"
                />
              )}
              <div className="cc-benefit-text">
                <strong className="cc-benefit-title">{title}</strong>
                <span className="cc-benefit-sub">{subtitle}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServicesSection({
  selectedServiceSlug,
  onViewDetails,
  onGetQuote,
}) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="cc-section cc-services"
    >
      <div className="cc-container">
        <div className="cc-section-header">
          <h2 id="services-heading" className="cc-section-title cc-title-lined">
            <span className="cc-title-rule" aria-hidden="true" />
            Explore Our Services
            <span className="cc-title-rule" aria-hidden="true" />
          </h2>
          <p className="cc-section-subtitle">
            Creative, technical, and digital services tailored for individuals,
            brands, and growing organizations. Select a service to view scope
            details or request a custom quote.
          </p>
        </div>

        <div className="cc-services-grid">
          {SERVICES_CATALOG.map((service) => {
            const isSelected = selectedServiceSlug === service.slug;
            return (
              <article
                key={service.slug}
                className={`cc-service-card ${isSelected ? "is-selected" : ""}`}
              >
                <div className="cc-service-icon-wrap">
                  <img
                    src={service.image}
                    alt=""
                    aria-hidden="true"
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </div>
                <div className="cc-service-body">
                  <h3 className="cc-service-title">{service.name}</h3>
                  <p className="cc-service-desc">{service.description}</p>
                  <div className="cc-service-actions">
                    <button
                      type="button"
                      onClick={() => onViewDetails(service, "service-card")}
                      className="cc-service-btn-secondary"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onGetQuote(service, "service-card")}
                      className="cc-service-btn-primary"
                    >
                      Get Quote <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CommunityReviewsSection() {
  const trackRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    const step = firstCard
      ? firstCard.getBoundingClientRect().width + 16
      : 320;
    track.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    const step = firstCard
      ? firstCard.getBoundingClientRect().width + 16
      : 320;
    const index = Math.round(track.scrollLeft / Math.max(step, 1));
    setActiveSlide(Math.max(0, Math.min(COMMUNITY_PILLARS.length - 1, index)));
  };

  const handleTrackKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    }
  };

  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="cc-section cc-community"
    >
      <div className="cc-container">
        <div className="cc-community-top">
          <div>
            <span className="cc-section-kicker">Community Standards &amp; Reviews</span>
            <h2 id="community-heading" className="cc-section-title">
              Built for <span className="cc-gold-text">Trusted Collaboration</span>
            </h2>
            <p className="cc-section-subtitle cc-subtitle-left">
              Verified client reviews and project stories will be featured here as
              marketplace engagements are published. Here is how we support every
              collaboration.
            </p>
          </div>
          <div className="cc-carousel-controls" aria-label="Carousel navigation">
            <button
              type="button"
              aria-label="Previous community highlight"
              onClick={() => scrollByCard(-1)}
              className="cc-carousel-btn"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next community highlight"
              onClick={() => scrollByCard(1)}
              className="cc-carousel-btn cc-carousel-btn-primary"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Community collaboration highlights"
          onScroll={handleTrackScroll}
          onKeyDown={handleTrackKeyDown}
          className="cc-carousel-track"
        >
          {COMMUNITY_PILLARS.map(({ tag, title, description, icon: Icon }) => (
            <article key={title} className="cc-pillar-card">
              <div className="cc-pillar-top">
                <span className="cc-pillar-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span className="cc-pillar-tag">{tag}</span>
              </div>
              <h3 className="cc-pillar-title">{title}</h3>
              <p className="cc-pillar-desc">{description}</p>
            </article>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing highlight {activeSlide + 1} of {COMMUNITY_PILLARS.length}
        </p>
      </div>
    </section>
  );
}

function BecomeCreatorSection({ onClientEnquiry }) {
  return (
    <section
      id="become-creator"
      aria-labelledby="connect-heading"
      className="cc-section cc-join"
    >
      <div className="cc-container">
        <div className="cc-section-header">
          <h2 id="connect-heading" className="cc-section-title">
            How to Connect with Us
          </h2>
          <p className="cc-section-subtitle">
            Choose your path and become part of the Scholars Mediatech network.
          </p>
        </div>

        <div className="cc-role-grid">
          <article className="cc-role-card cc-role-freelancer">
            <div className="cc-role-media">
              <img
                src={maleFreelancerImage}
                alt="Freelancer working on a laptop"
                width={320}
                height={240}
                loading="lazy"
                className="cc-role-photo"
              />
            </div>
            <div className="cc-role-copy">
              <h3>I’m a Freelancer</h3>
              <ul>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Submit your professional profile
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Showcase your skills &amp; portfolio
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Share your service categories &amp; availability
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Connect with project opportunities
                </li>
              </ul>
              <Link to="/CommunityJoinForm" className="cc-btn cc-btn-gold cc-role-cta">
                Join as Freelancer <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <article className="cc-role-card cc-role-client">
            <div className="cc-role-copy">
              <h3>I’m a Client</h3>
              <ul>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Share your project requirements
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Explore 15 digital &amp; creative services
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Discuss scope, timeline &amp; pricing upfront
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Coordinate directly with our team
                </li>
              </ul>
              <button
                type="button"
                onClick={onClientEnquiry}
                className="cc-btn cc-btn-gold cc-role-cta"
              >
                Submit Client Enquiry <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="cc-role-media">
              <img
                src={femaleClientImage}
                alt="Client reviewing project plans on a laptop"
                width={320}
                height={240}
                loading="lazy"
                className="cc-role-photo"
              />
            </div>
          </article>
        </div>

        <ol className="cc-steps-strip" aria-label="Getting started steps">
          <li className="cc-steps-heading">
            <strong>Simple Steps to Get Started</strong>
          </li>
          {PROCESS_STEPS.map(({ title, description, image }, index) => (
            <li key={title} className="cc-step-item">
              <span className="cc-step-index" aria-hidden="true">
                0{index + 1}
              </span>
              <img
                src={image}
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                loading="lazy"
              />
              <div className="cc-step-text">
                <span className="cc-step-title">{title}</span>
                <span className="cc-step-desc">{description}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AboutSection({ settings }) {
  const { clean: companyName } = splitCompanyBrand(settings.companyName);
  return (
    <section id="about" aria-labelledby="about-heading" className="cc-section cc-about">
      <div className="cc-container">
        <div className="cc-about-layout">
          <div className="cc-about-brand">
            <img
              src={logo}
              alt={`${companyName} brand mark`}
              width={200}
              height={160}
              loading="lazy"
            />
            <span>Freelancer Marketplace &amp; Digital Services Platform</span>
          </div>

          <div className="cc-about-story">
            <span className="cc-section-kicker">Our Story, Mission &amp; Vision</span>
            <h2 id="about-heading" className="cc-section-title">
              About {companyName}
            </h2>
            <p className="cc-about-lead">
              {companyName} is a digital services and freelancer marketplace that
              brings together creative talent and forward-thinking businesses on
              one trusted platform.
            </p>
            <div className="cc-about-values">
              <article>
                <Target size={28} aria-hidden="true" />
                <h3>Our Mission</h3>
                <p>
                  To create meaningful opportunities for freelancers and deliver
                  impactful digital solutions to clients.
                </p>
              </article>
              <article>
                <Globe2 size={28} aria-hidden="true" />
                <h3>Our Vision</h3>
                <p>
                  To be India’s most trusted platform for digital talent and
                  business growth.
                </p>
              </article>
              <article>
                <BadgeCheck size={28} aria-hidden="true" />
                <h3>Our Values</h3>
                <p>
                  Trust, quality, creativity, transparency and long-term
                  collaboration.
                </p>
              </article>
            </div>
          </div>

          <aside className="cc-about-quote" aria-label="Company motto">
            <span>
              Empowering
              <br />
              Talent.
              <br />
              Enabling
              <br />
              Businesses.
            </span>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const triggerRefs = useRef([]);
  const baseId = useId();

  const handleFaqKeyDown = (event, index) => {
    const count = FAQ_ITEMS.length;
    let nextIndex = null;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % count;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + count) % count;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = count - 1;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      triggerRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="cc-section cc-faq">
      <div className="cc-container">
        <div className="cc-faq-layout">
          <div className="cc-faq-intro">
            <span className="cc-section-kicker">Help Center</span>
            <h2 id="faq-heading" className="cc-section-title">
              Frequently Asked Questions
            </h2>
            <p className="cc-section-subtitle cc-subtitle-left">
              Quick answers to common questions about Community Connect.
            </p>
            <svg
              viewBox="0 0 300 240"
              role="img"
              aria-label="Illustration of question and answer bubbles"
              className="cc-faq-illustration"
            >
              <defs>
                <linearGradient id="faqQuestionGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1b4d89" />
                  <stop offset="100%" stopColor="#092754" />
                </linearGradient>
                <linearGradient id="faqAnswerGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e5b84f" />
                  <stop offset="100%" stopColor="#c28b22" />
                </linearGradient>
              </defs>
              <path
                d="M66 33c-4-10-2-17 1-24M88 30c2-9 7-14 12-19M221 58c5-9 11-13 18-15M244 77c7-5 14-7 21-7M38 176c-9 2-15 7-20 13M52 194c-8 5-12 11-14 18"
                fill="none"
                stroke="#c28b22"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <path
                d="M49 53a20 20 0 0 1 20-20h91a20 20 0 0 1 20 20v91a20 20 0 0 1-20 20h-35l-32 28v-28H69a20 20 0 0 1-20-20z"
                fill="url(#faqQuestionGradient)"
              />
              <text
                x="114"
                y="126"
                fill="#fffdf8"
                fontFamily="Georgia, serif"
                fontSize="80"
                fontWeight="800"
                textAnchor="middle"
              >
                Q
              </text>
              <path
                d="M134 130a19 19 0 0 1 19-19h87a19 19 0 0 1 19 19v65a19 19 0 0 1-19 19h-21v24l-29-24h-37a19 19 0 0 1-19-19z"
                fill="url(#faqAnswerGradient)"
              />
              <text
                x="196"
                y="187"
                fill="#092754"
                fontFamily="Georgia, serif"
                fontSize="60"
                fontWeight="800"
                textAnchor="middle"
              >
                A
              </text>
            </svg>
          </div>

          <div className="cc-faq-list">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const triggerId = `${baseId}-faq-trigger-${index}`;
              const panelId = `${baseId}-faq-panel-${index}`;
              return (
                <article
                  key={item.question}
                  className={`cc-faq-item ${isOpen ? "is-open" : ""}`}
                >
                  <h3 className="cc-faq-heading">
                    <button
                      ref={(el) => {
                        triggerRefs.current[index] = el;
                      }}
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      onKeyDown={(event) => handleFaqKeyDown(event, index)}
                      className="cc-faq-trigger"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        size={19}
                        aria-hidden="true"
                        className={`cc-chevron ${isOpen ? "is-open" : ""}`}
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="cc-faq-panel"
                  >
                    <p>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection({ settings }) {
  const contactPhone =
    settings.contactPhone?.trim() || defaultLandingSettings.contactPhone;
  const contactEmail =
    settings.contactEmail?.trim() || defaultLandingSettings.contactEmail;
  const phoneHref = formatPhoneHref(contactPhone);
  const whatsappHref = formatWhatsAppHref(contactPhone);
  const companyName =
    settings.companyName?.trim() || defaultLandingSettings.companyName;
  const currentYear = new Date().getFullYear();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formNotice, setFormNotice] = useState("");

  const socialLinks = [
    {
      label: "YouTube",
      href: settings.socialLinks?.youtube || defaultLandingSettings.socialLinks.youtube,
      icon: Youtube,
    },
    {
      label: "Instagram",
      href:
        settings.socialLinks?.instagram || defaultLandingSettings.socialLinks.instagram,
      icon: Instagram,
    },
    {
      label: "Facebook",
      href:
        settings.socialLinks?.facebook || defaultLandingSettings.socialLinks.facebook,
      icon: Facebook,
    },
    {
      label: "LinkedIn",
      href:
        settings.socialLinks?.linkedin || defaultLandingSettings.socialLinks.linkedin,
      icon: Linkedin,
    },
    {
      label: "X (Twitter)",
      href: settings.socialLinks?.twitter || defaultLandingSettings.socialLinks.twitter,
      icon: Twitter,
    },
  ].filter((item) => item.href && item.href !== "#");

  const privacyUrl =
    settings.legalLinks?.privacy && settings.legalLinks.privacy !== "#"
      ? settings.legalLinks.privacy
      : null;
  const termsUrl =
    settings.legalLinks?.terms && settings.legalLinks.terms !== "#"
      ? settings.legalLinks.terms
      : null;

  const sendMessage = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const senderName = String(formData.get("name") || "").trim();
    const senderEmail = String(formData.get("email") || "").trim();
    const selectedSubject = String(formData.get("subject") || "Website enquiry").trim();
    const bodyText = String(formData.get("message") || "").trim();

    const encodedSubject = encodeURIComponent(selectedSubject);
    const encodedBody = encodeURIComponent(
      `Name: ${senderName}\nEmail: ${senderEmail}\n\n${bodyText}`,
    );

    setFormNotice(
      `Your email app should now open a draft to ${contactEmail}. Enquiries sent here are emailed directly and are not stored on this website.`,
    );
    window.location.href = `mailto:${contactEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <footer id="contact" className="cc-contact">
      <div className="cc-container">
        <div className="cc-section-header">
          <span className="cc-section-kicker">We’d love to hear from you</span>
          <h2 className="cc-section-title">Get in Touch</h2>
        </div>

        <div className="cc-contact-grid">
          <div className="cc-contact-details">
            <p className="cc-contact-intro">
              Have a project, a question, or need support? Reach out using the
              details below.
            </p>
            {phoneHref && (
              <a href={phoneHref} className="cc-contact-item">
                <span className="cc-contact-icon" aria-hidden="true">
                  <Phone size={18} />
                </span>
                <span>
                  <b>Call Us</b>
                  <small>{contactPhone}</small>
                </span>
              </a>
            )}
            <a href={`mailto:${contactEmail}`} className="cc-contact-item">
              <span className="cc-contact-icon" aria-hidden="true">
                <Mail size={18} />
              </span>
              <span>
                <b>Email Us</b>
                <small>{contactEmail}</small>
              </span>
            </a>
            <div className="cc-contact-item">
              <span className="cc-contact-icon" aria-hidden="true">
                <Globe2 size={18} />
              </span>
              <span>
                <b>Location</b>
                <small>Raipur, Chhattisgarh, India</small>
              </span>
            </div>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="cc-contact-item"
              >
                <span className="cc-contact-icon" aria-hidden="true">
                  <MessageSquareText size={18} />
                </span>
                <span>
                  <b>WhatsApp</b>
                  <small>Chat with our team on WhatsApp</small>
                </span>
              </a>
            )}
          </div>

          <form className="cc-contact-form" onSubmit={sendMessage}>
            <h3>Send Us a Message</h3>
            <label className="cc-field">
              <UserRound size={17} aria-hidden="true" />
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your Name"
                aria-label="Your Name"
              />
            </label>
            <label className="cc-field">
              <Mail size={17} aria-hidden="true" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email Address"
                aria-label="Email Address"
              />
            </label>
            <label className="cc-field">
              <Briefcase size={17} aria-hidden="true" />
              <select
                name="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
                aria-label="Subject or service"
              >
                <option value="" disabled>
                  Subject / Service
                </option>
                <option value="Freelancer enquiry">Freelancer enquiry</option>
                <option value="Client enquiry">Client enquiry</option>
                <option value="Project support">Project support</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="cc-field cc-message-field">
              <MessageSquareText size={17} aria-hidden="true" />
              <textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                placeholder="Tell us about your project or question"
                aria-label="Your Message"
                rows={3}
              />
            </label>
            <p className="cc-form-note">
              Opens your email app addressed to {contactEmail}. Form entries are
              not stored on our servers.
            </p>
            <button type="submit" className="cc-btn cc-btn-navy cc-btn-full">
              Compose Email <ArrowRight size={16} aria-hidden="true" />
            </button>
            {formNotice && (
              <p role="status" aria-live="polite" className="cc-form-status">
                {formNotice}
              </p>
            )}
          </form>

          <aside className="cc-quick-links" aria-label="Quick links and social channels">
            <h3>
              <LinkIcon size={17} aria-hidden="true" /> Quick Links
            </h3>
            <ul className="cc-quick-list">
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#become-creator">Freelancer Guidelines</a>
              </li>
              <li>
                <Link to="/CommunityJoinForm">Community Join Form</Link>
              </li>
              {privacyUrl ? (
                <li>
                  <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </li>
              ) : (
                <li className="cc-quick-muted">Privacy Policy (Coming soon)</li>
              )}
              {termsUrl ? (
                <li>
                  <a href={termsUrl} target="_blank" rel="noopener noreferrer">
                    Terms &amp; Conditions
                  </a>
                </li>
              ) : (
                <li className="cc-quick-muted">Terms &amp; Conditions (Coming soon)</li>
              )}
            </ul>

            {socialLinks.length > 0 && (
              <div className="cc-socials">
                <h4>Follow Us</h4>
                <div className="cc-social-row">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="cc-copyright">
          © {currentYear} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [settings, setSettings] = useState(defaultLandingSettings);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState("");
  const [detailService, setDetailService] = useState(null);
  const [enquiryModalState, setEnquiryModalState] = useState({
    isOpen: false,
    service: null,
    source: "service-card",
  });

  useEffect(() => {
    let mounted = true;
    getLandingSettings()
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .catch(() => {
        if (mounted) setSettings(defaultLandingSettings);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectService = (serviceOrName) => {
    const resolved =
      typeof serviceOrName === "string"
        ? findServiceBySlugOrName(serviceOrName)
        : serviceOrName;
    if (!resolved) return;
    setSelectedServiceSlug(resolved.slug);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    setDetailService(resolved);
  };

  const handleViewDetails = (service) => {
    setSelectedServiceSlug(service.slug);
    setDetailService(service);
  };

  const handleGetQuote = (service, source = "service-card") => {
    const resolved = service || SERVICES_CATALOG[0];
    setSelectedServiceSlug(resolved.slug);
    setDetailService(null);
    setEnquiryModalState({
      isOpen: true,
      service: resolved,
      source,
    });
  };

  const handleClientEnquiry = () => {
    setEnquiryModalState({
      isOpen: true,
      service: findServiceBySlugOrName("more-services") || SERVICES_CATALOG[0],
      source: "client-section",
    });
  };

  return (
    <div className="cc-site">
      <a href="#main-content" className="cc-skip-link">
        Skip to main content
      </a>
      <Header settings={settings} onSelectService={handleSelectService} />
      <main id="main-content">
        <HeroSection />
        <ServicesSection
          selectedServiceSlug={selectedServiceSlug}
          onViewDetails={handleViewDetails}
          onGetQuote={handleGetQuote}
        />
        <CommunityReviewsSection />
        <BecomeCreatorSection onClientEnquiry={handleClientEnquiry} />
        <AboutSection settings={settings} />
        <FaqSection />
      </main>
      <FooterSection settings={settings} />

      <ServiceDetailModal
        service={detailService}
        onClose={() => setDetailService(null)}
        onRequestQuote={(service) => handleGetQuote(service, "service-detail")}
      />

      <ServiceEnquiryModal
        isOpen={enquiryModalState.isOpen}
        initialService={enquiryModalState.service}
        source={enquiryModalState.source}
        onClose={() =>
          setEnquiryModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
