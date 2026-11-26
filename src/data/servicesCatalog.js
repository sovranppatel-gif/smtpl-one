import serviceVideoIcon from "../assets/icons-opt/6.webp";
import serviceDesignIcon from "../assets/icons-opt/7.webp";
import serviceMarketingIcon from "../assets/icons-opt/8.webp";
import serviceAiIcon from "../assets/icons-opt/9.webp";
import serviceAnimationIcon from "../assets/icons-opt/10.webp";
import serviceWritingIcon from "../assets/icons-opt/11.webp";
import serviceDataIcon from "../assets/icons-opt/12.webp";
import serviceWebIcon from "../assets/icons-opt/13.webp";
import servicePhotoIcon from "../assets/icons-opt/14.webp";
import serviceInfluencerIcon from "../assets/icons-opt/15.webp";
import serviceAppIcon from "../assets/icons-opt/16.webp";
import serviceUiIcon from "../assets/icons-opt/17.webp";
import serviceScriptIcon from "../assets/icons-opt/18.webp";
import serviceVoiceIcon from "../assets/icons-opt/19.webp";
import serviceMoreIcon from "../assets/icons-opt/20.webp";

export const ENQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "QUOTED",
  "CONVERTED",
  "CLOSED",
];

export const CONTACT_PREFERENCES = ["Call", "WhatsApp", "Email"];

export const SERVICES_CATALOG = [
  {
    slug: "video-editing",
    name: "Video Editing",
    image: serviceVideoIcon,
    description: "Polished videos for brands, creators and campaigns.",
    overview:
      "Structured video post-production for social reels, brand explainers, YouTube episodes, and promotional campaigns tailored to your brand tone and platform format.",
    deliverables: [
      "Edited primary cut formatted for your target platform aspect ratio",
      "Color correction, audio cleanup, and background music sync",
      "Captions, lower-thirds, and clean title overlays",
      "Export-ready files for web and social distribution",
    ],
    clientRequirements: [
      "Raw footage or cloud drive links",
      "Target platform(s) and preferred aspect ratio",
      "Reference video style, logo, and brand colors",
      "Expected video duration and turnaround timeline",
    ],
  },
  {
    slug: "graphic-design",
    name: "Graphic Design",
    image: serviceDesignIcon,
    description: "Memorable visuals, brand assets and digital artwork.",
    overview:
      "Custom visual communication covering brand assets, social media creatives, marketing collateral, and presentation layouts designed for visual consistency.",
    deliverables: [
      "Print-ready and digital-ready creative files",
      "Social media post sets, banners, and thumbnails",
      "Brand identity elements such as typography and color guides",
      "Editable source files where agreed in project scope",
    ],
    clientRequirements: [
      "Brand logo, colors, and existing style guidelines",
      "Copy/text to include in the design",
      "Dimensions or platforms where designs will be used",
      "Visual references or moodboard examples",
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    image: serviceMarketingIcon,
    description: "Campaigns that connect you with the right audience.",
    overview:
      "Search, social, and campaign planning services focused on helping businesses organize their digital presence, content calendars, and audience outreach.",
    deliverables: [
      "Channel audit and campaign setup recommendations",
      "Content calendar and ad creative coordination",
      "SEO fundamentals and landing page messaging alignment",
      "Periodic campaign summary reports",
    ],
    clientRequirements: [
      "Website URL and active social media handles",
      "Target geography, audience, and primary product/service",
      "Campaign goals and tentative monthly budget range",
      "Access details or brand assets for coordination",
    ],
  },
  {
    slug: "ai-video-creation",
    name: "AI Video Creation",
    image: serviceAiIcon,
    description: "Fresh video concepts made with modern AI tools.",
    overview:
      "Concept-to-edit visual storytelling combining modern AI video generation workflows with human editing, pacing, and brand supervision.",
    deliverables: [
      "Storyboard concept and visual prompt direction",
      "AI-assisted scenes blended with custom editing and transitions",
      "Synced voiceover or background audio track",
      "Final platform-formatted video export",
    ],
    clientRequirements: [
      "Brief concept, script, or key message",
      "Preferred visual style (realistic, stylized, product-focused)",
      "Target duration and aspect ratio",
      "Brand assets or product images to incorporate",
    ],
  },
  {
    slug: "animation-motion-graphics",
    name: "Animation & Motion Graphics",
    image: serviceAnimationIcon,
    description: "Bring your stories and products to life.",
    overview:
      "2D motion graphics, logo animations, product explainers, and kinetic typography crafted to simplify complex ideas and elevate visual storytelling.",
    deliverables: [
      "Concept storyboard and motion style frames",
      "Custom animated sequences, transitions, and icon motion",
      "Audio design and subtitle integration",
      "High-resolution MP4/MOV or web-optimized exports",
    ],
    clientRequirements: [
      "Script or key talking points",
      "Vector brand assets (AI/SVG/EPS) if available",
      "Target length and delivery format",
      "Reference animation examples you like",
    ],
  },
  {
    slug: "content-writing",
    name: "Content Writing",
    image: serviceWritingIcon,
    description: "Clear, engaging words for every platform.",
    overview:
      "Original website copy, blog articles, product descriptions, and social media messaging written around your audience and brand voice.",
    deliverables: [
      "Structured website, blog, or campaign copy drafts",
      "SEO-friendly headings and metadata suggestions",
      "Tone-matched social captions and brand messaging",
      "Clean, proofread documents ready for publishing",
    ],
    clientRequirements: [
      "Topic, target audience, and preferred tone",
      "Approximate word count or page list",
      "Key keywords, product facts, or reference links",
      "Publishing platform and deadline",
    ],
  },
  {
    slug: "data-handling",
    name: "Data Handling",
    image: serviceDataIcon,
    description: "Reliable data entry, research and organization.",
    overview:
      "Structured data entry, spreadsheet organization, desk research, and catalog cleanup to keep business records accurate and easy to use.",
    deliverables: [
      "Cleaned and structured Excel/CSV or Google Sheets files",
      "Formatted product catalogs or directory listings",
      "Web/desk research summaries with source references",
      "Consistent naming, deduplication, and validation checks",
    ],
    clientRequirements: [
      "Sample dataset or template structure",
      "Source files or research criteria",
      "Required output format (XLSX, CSV, Google Sheets)",
      "Volume estimate and target delivery schedule",
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    image: serviceWebIcon,
    description: "Fast, polished websites and digital products.",
    overview:
      "Responsive marketing websites, landing pages, custom web applications, and API integrations built with modern, maintainable web technologies.",
    deliverables: [
      "Responsive frontend across mobile, tablet, and desktop",
      "Clean component architecture and form/API integrations",
      "Basic SEO structure, metadata, and performance checks",
      "Deployment guidance or handover documentation",
    ],
    clientRequirements: [
      "Number of pages or core features required",
      "Existing designs (Figma/links) or reference sites",
      "Domain, hosting, or backend integration needs",
      "Target launch timeline",
    ],
  },
  {
    slug: "photography-videography",
    name: "Photography & Videography",
    image: servicePhotoIcon,
    description: "Capture products, people and special moments.",
    overview:
      "On-location or studio visual capture coordination for products, corporate profiles, events, and brand storytelling assets.",
    deliverables: [
      "Planned shot list aligned with your campaign needs",
      "High-resolution edited photographs or raw video clips",
      "Color-graded selects for web, print, and social media",
      "Organized cloud delivery folder",
    ],
    clientRequirements: [
      "Shoot city/location and preferred dates",
      "Type of shoot (product, event, portrait, commercial)",
      "Approximate number of final deliverables needed",
      "Usage channels and reference moodboard",
    ],
  },
  {
    slug: "influencer-marketing",
    name: "Influencer Marketing",
    image: serviceInfluencerIcon,
    description: "Build authentic connections with creators.",
    overview:
      "Creator outreach, campaign coordination, and content alignment designed to connect your brand with relevant voices across social platforms.",
    deliverables: [
      "Shortlisted creator profiles aligned with your niche",
      "Campaign brief and deliverable coordination",
      "Content review and posting schedule tracking",
      "Post-campaign deliverable wrap-up summary",
    ],
    clientRequirements: [
      "Product/service details and campaign objective",
      "Target region, language, and preferred social platforms",
      "Campaign timeline and creator budget bracket",
      "Key brand guidelines or talking points",
    ],
  },
  {
    slug: "app-development",
    name: "App Development",
    image: serviceAppIcon,
    description: "Useful mobile experiences for your customers.",
    overview:
      "Mobile application design and development for Android, iOS, and cross-platform workflows tailored to business operations and customer engagement.",
    deliverables: [
      "Functional mobile screens and core user flows",
      "Backend API connectivity and authentication integration",
      "Testing builds for Android/iOS review",
      "Store readiness checklist and technical handover",
    ],
    clientRequirements: [
      "Target platform(s): Android, iOS, or both",
      "Core user roles and feature list",
      "Existing backend/API or UI design availability",
      "Expected release timeline",
    ],
  },
  {
    slug: "ui-ux-design",
    name: "UI / UX Design",
    image: serviceUiIcon,
    description: "Intuitive interfaces designed around people.",
    overview:
      "User-centered wireframes, interactive prototypes, and clean UI design systems for websites, dashboards, and mobile applications.",
    deliverables: [
      "User flow diagrams and low-fidelity wireframes",
      "High-fidelity responsive UI screens",
      "Reusable color, typography, and component styles",
      "Developer-ready Figma handoff files",
    ],
    clientRequirements: [
      "Product brief, user personas, or problem statement",
      "List of key screens or journeys to design",
      "Brand guidelines and design inspirations",
      "Target platform (web app, mobile app, marketing site)",
    ],
  },
  {
    slug: "script-writing",
    name: "Script Writing",
    image: serviceScriptIcon,
    description: "Ideas shaped into stories people remember.",
    overview:
      "Structured scripts for explainer videos, brand ads, reels, YouTube videos, and audio narration with clear pacing and visual cues.",
    deliverables: [
      "Concept outline and hook variations",
      "Full script with spoken dialogue and visual direction",
      "Call-to-action alignment tailored to your audience",
      "Revision round based on your feedback",
    ],
    clientRequirements: [
      "Video/audio format and target duration",
      "Product/story details and key points to cover",
      "Target audience and preferred language/tone",
      "Reference videos or scripts if any",
    ],
  },
  {
    slug: "voice-over-dubbing",
    name: "Voice Over & Dubbing",
    image: serviceVoiceIcon,
    description: "Professional voices for audio and video.",
    overview:
      "Clear voiceover recording and dubbing support for commercials, explainers, narration, e-learning modules, and regional adaptations.",
    deliverables: [
      "Clean, noise-reduced voiceover audio recordings",
      "Paced delivery matched to script or video timing",
      "High-quality WAV and MP3 audio files",
      "Optional multi-take variations for key lines",
    ],
    clientRequirements: [
      "Finalized script and pronunciation notes",
      "Preferred language, accent, and vocal tone",
      "Reference video (for timed dubbing/sync)",
      "Audio format requirements and deadline",
    ],
  },
  {
    slug: "more-services",
    name: "More Services",
    image: serviceMoreIcon,
    description: "Find the right specialist for your next idea.",
    overview:
      "Have a custom creative, digital, or technical requirement that combines multiple disciplines or sits outside the listed categories? Share your brief and our team will review how we can help.",
    deliverables: [
      "Requirement discovery and scope clarification",
      "Custom workflow or multi-service coordination",
      "Milestone-aligned deliverable breakdown",
      "Dedicated point of contact during coordination",
    ],
    clientRequirements: [
      "Brief overview of what you want to build or achieve",
      "Preferred skills or service mix needed",
      "Expected timeline and location/remote preference",
      "Any reference links or supporting documents",
    ],
  },
];

export function findServiceBySlugOrName(value) {
  if (!value) return null;
  const needle = String(value).trim().toLowerCase();
  return (
    SERVICES_CATALOG.find(
      (s) => s.slug === needle || s.name.toLowerCase() === needle
    ) || null
  );
}
