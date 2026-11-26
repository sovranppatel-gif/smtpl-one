import React, { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import {
  CONTACT_PREFERENCES,
  SERVICES_CATALOG,
  findServiceBySlugOrName,
} from "../../data/servicesCatalog.js";
import { submitServiceEnquiry } from "../../utils/serviceEnquiryStorage.js";

function useAccessibleDialog(isOpen, onClose) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevActive = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const container = dialogRef.current;
      if (!container) return;
      const firstFocusable = container.querySelector(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      (firstFocusable || container).focus();
    }, 10);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll(
          "button:not([disabled]), [href], input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (prevActive && typeof prevActive.focus === "function") {
        prevActive.focus();
      }
    };
  }, [isOpen, onClose]);

  return dialogRef;
}

export function ServiceDetailModal({ service, onClose, onRequestQuote }) {
  const titleId = useId();
  const dialogRef = useAccessibleDialog(Boolean(service), onClose);

  if (!service) return null;

  return (
    <div
      className="cc-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="cc-modal-panel cc-detail-modal"
      >
        <div className="cc-modal-header">
          <div className="cc-modal-title-group">
            <span className="cc-modal-service-icon">
              <img
                src={service.image}
                alt=""
                aria-hidden="true"
                width={38}
                height={38}
              />
            </span>
            <div>
              <span className="cc-section-kicker">Service Details</span>
              <h2 id={titleId} className="cc-modal-title">
                {service.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${service.name} details`}
            className="cc-modal-close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="cc-modal-body">
          <div className="cc-detail-overview">
            <h3>Service Overview</h3>
            <p>{service.overview}</p>
          </div>

          <div className="cc-detail-columns">
            <section className="cc-detail-box" aria-label="Example deliverables">
              <h4>
                <ClipboardCheck size={17} aria-hidden="true" />
                Example Deliverables
              </h4>
              <ul>
                {service.deliverables.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cc-detail-box" aria-label="Information needed from client">
              <h4>
                <FileText size={17} aria-hidden="true" />
                What Helps Us Scope Your Project
              </h4>
              <ul>
                {service.clientRequirements.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className="cc-detail-note">
            Scope, deliverables, and pricing are finalized based on your specific
            project requirements after our team reviews your brief.
          </p>
        </div>

        <div className="cc-modal-footer">
          <button type="button" onClick={onClose} className="cc-btn cc-btn-outline">
            Back to Services
          </button>
          <button
            type="button"
            onClick={() => onRequestQuote(service)}
            className="cc-btn cc-btn-gold"
          >
            Request Quote <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

const initialFormState = (service) => ({
  serviceSlug: service?.slug || SERVICES_CATALOG[0].slug,
  fullName: "",
  businessName: "",
  email: "",
  mobile: "",
  city: "",
  requirement: "",
  estimatedBudget: "",
  preferredDeadline: "",
  contactPreference: "Call",
  consentAccepted: false,
  website: "", // Honeypot
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ServiceEnquiryModal({
  isOpen,
  initialService,
  source = "service-card",
  onClose,
}) {
  const titleId = useId();
  const dialogRef = useAccessibleDialog(isOpen, onClose);
  const [form, setForm] = useState(() => initialFormState(initialService));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialFormState(initialService));
    setFieldErrors({});
    setSubmitError("");
    setSubmittedRecord(null);
    setSubmitting(false);
    submitLockRef.current = false;
  }, [isOpen, initialService]);

  if (!isOpen) return null;

  const activeService =
    findServiceBySlugOrName(form.serviceSlug) || SERVICES_CATALOG[0];

  const handleField = (name) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (submitError) setSubmitError("");
  };

  const validateClient = () => {
    const errs = {};
    if (!activeService) errs.serviceSlug = "Please select a service.";
    if (form.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (at least 2 characters).";
    }
    const mobileDigits = form.mobile.replace(/\D/g, "");
    if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      errs.mobile = "Please enter a valid 10 to 15 digit mobile/WhatsApp number.";
    }
    const trimmedEmail = form.email.trim();
    if (trimmedEmail && !EMAIL_RE.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address.";
    }
    if (form.contactPreference === "Email" && !trimmedEmail) {
      errs.email = "Email is required when Email is selected as contact preference.";
    }
    if (form.requirement.trim().length < 10) {
      errs.requirement =
        "Please describe your project requirement (at least 10 characters).";
    }
    if (!form.consentAccepted) {
      errs.consentAccepted =
        "Please confirm consent so our team can respond to this enquiry.";
    }
    return errs;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitLockRef.current || submitting) return;

    const errs = validateClient();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setSubmitError("Please fix the highlighted fields before submitting.");
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    setFieldErrors({});

    try {
      const saved = await submitServiceEnquiry({
        serviceSlug: activeService.slug,
        serviceName: activeService.name,
        source,
        fullName: form.fullName.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        city: form.city.trim(),
        requirement: form.requirement.trim(),
        estimatedBudget: form.estimatedBudget.trim(),
        preferredDeadline: form.preferredDeadline.trim(),
        contactPreference: form.contactPreference,
        consentAccepted: form.consentAccepted,
        website: form.website,
      });
      setSubmittedRecord(saved);
    } catch (err) {
      setSubmitError(
        err?.message ||
          "Unable to save your enquiry right now. Please try again later."
      );
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }
  };

  return (
    <div
      className="cc-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="cc-modal-panel cc-enquiry-modal"
      >
        <div className="cc-modal-header">
          <div className="cc-modal-title-group">
            <span className="cc-modal-service-icon">
              <img
                src={activeService.image}
                alt=""
                aria-hidden="true"
                width={34}
                height={34}
              />
            </span>
            <div>
              <span className="cc-section-kicker">Service Enquiry</span>
              <h2 id={titleId} className="cc-modal-title">
                Request a Quote
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close service enquiry form"
            className="cc-modal-close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {submittedRecord ? (
          <div className="cc-modal-body cc-enquiry-success" role="status" aria-live="polite">
            <div className="cc-success-badge" aria-hidden="true">
              <CheckCircle2 size={34} />
            </div>
            <h3>Enquiry Received</h3>
            <p className="cc-success-lead">
              Your enquiry for <strong>{submittedRecord.serviceName}</strong> has
              been saved. Our team will reach out via{" "}
              <strong>{submittedRecord.contactPreference}</strong>.
            </p>
            <div className="cc-ref-card">
              <span>Enquiry Reference</span>
              <strong>{submittedRecord.referenceCode}</strong>
            </div>
            <div className="cc-modal-footer cc-modal-footer-center">
              <button
                type="button"
                onClick={() => {
                  setSubmittedRecord(null);
                  setForm(initialFormState(activeService));
                }}
                className="cc-btn cc-btn-outline"
              >
                Submit Another Enquiry
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cc-btn cc-btn-navy"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="cc-enquiry-form">
            <div className="cc-modal-body">
              {submitError && (
                <div className="cc-form-alert" role="alert">
                  <AlertCircle size={18} aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Honeypot field for bot filtering */}
              <div className="cc-honeypot" aria-hidden="true">
                <label htmlFor="cc-enq-website">Website</label>
                <input
                  id="cc-enq-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleField("website")}
                />
              </div>

              <div className="cc-form-grid">
                <div className="cc-form-group cc-col-span-2">
                  <label htmlFor="cc-enq-service">
                    Selected Service <span className="cc-req">*</span>
                  </label>
                  <select
                    id="cc-enq-service"
                    name="serviceSlug"
                    value={form.serviceSlug}
                    onChange={handleField("serviceSlug")}
                    aria-invalid={Boolean(fieldErrors.serviceSlug)}
                  >
                    {SERVICES_CATALOG.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.serviceSlug && (
                    <span className="cc-field-error">{fieldErrors.serviceSlug}</span>
                  )}
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-name">
                    Client Full Name <span className="cc-req">*</span>
                  </label>
                  <input
                    id="cc-enq-name"
                    name="fullName"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    placeholder="e.g. Ananya Verma"
                    value={form.fullName}
                    onChange={handleField("fullName")}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                  />
                  {fieldErrors.fullName && (
                    <span className="cc-field-error">{fieldErrors.fullName}</span>
                  )}
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-business">Business Name (Optional)</label>
                  <input
                    id="cc-enq-business"
                    name="businessName"
                    type="text"
                    maxLength={160}
                    autoComplete="organization"
                    placeholder="Company or brand name"
                    value={form.businessName}
                    onChange={handleField("businessName")}
                  />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-mobile">
                    Mobile / WhatsApp Number <span className="cc-req">*</span>
                  </label>
                  <input
                    id="cc-enq-mobile"
                    name="mobile"
                    type="tel"
                    required
                    maxLength={24}
                    autoComplete="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={form.mobile}
                    onChange={handleField("mobile")}
                    aria-invalid={Boolean(fieldErrors.mobile)}
                  />
                  {fieldErrors.mobile && (
                    <span className="cc-field-error">{fieldErrors.mobile}</span>
                  )}
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-email">
                    Email {form.contactPreference === "Email" ? <span className="cc-req">*</span> : "(Optional)"}
                  </label>
                  <input
                    id="cc-enq-email"
                    name="email"
                    type="email"
                    maxLength={160}
                    autoComplete="email"
                    required={form.contactPreference === "Email"}
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleField("email")}
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                  {fieldErrors.email && (
                    <span className="cc-field-error">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-city">City / Location (Optional)</label>
                  <input
                    id="cc-enq-city"
                    name="city"
                    type="text"
                    maxLength={100}
                    autoComplete="address-level2"
                    placeholder="e.g. Raipur, Mumbai, Remote"
                    value={form.city}
                    onChange={handleField("city")}
                  />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-pref">Contact Preference</label>
                  <select
                    id="cc-enq-pref"
                    name="contactPreference"
                    value={form.contactPreference}
                    onChange={handleField("contactPreference")}
                  >
                    {CONTACT_PREFERENCES.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-budget">Estimated Budget (Optional)</label>
                  <input
                    id="cc-enq-budget"
                    name="estimatedBudget"
                    type="text"
                    maxLength={120}
                    placeholder="e.g. ₹15,000 – ₹30,000"
                    value={form.estimatedBudget}
                    onChange={handleField("estimatedBudget")}
                  />
                </div>

                <div className="cc-form-group">
                  <label htmlFor="cc-enq-deadline">Preferred Deadline (Optional)</label>
                  <input
                    id="cc-enq-deadline"
                    name="preferredDeadline"
                    type="text"
                    maxLength={120}
                    placeholder="e.g. Within 2 weeks / Specific date"
                    value={form.preferredDeadline}
                    onChange={handleField("preferredDeadline")}
                  />
                </div>

                <div className="cc-form-group cc-col-span-2">
                  <label htmlFor="cc-enq-req">
                    Project Requirement <span className="cc-req">*</span>
                  </label>
                  <textarea
                    id="cc-enq-req"
                    name="requirement"
                    required
                    rows={4}
                    maxLength={2500}
                    placeholder={`Share your goals, deliverables, or references for ${activeService.name}...`}
                    value={form.requirement}
                    onChange={handleField("requirement")}
                    aria-invalid={Boolean(fieldErrors.requirement)}
                  />
                  <div className="cc-field-meta">
                    {fieldErrors.requirement ? (
                      <span className="cc-field-error">{fieldErrors.requirement}</span>
                    ) : (
                      <span>Minimum 10 characters</span>
                    )}
                    <span>{form.requirement.length}/2500</span>
                  </div>
                </div>

                <div className="cc-col-span-2">
                  <label className="cc-consent-row">
                    <input
                      type="checkbox"
                      name="consentAccepted"
                      checked={form.consentAccepted}
                      onChange={handleField("consentAccepted")}
                      aria-invalid={Boolean(fieldErrors.consentAccepted)}
                    />
                    <span>
                      I consent to Scholars Mediatech storing and using these
                      enquiry details to contact me regarding{" "}
                      <strong>{activeService.name}</strong>.{" "}
                      <span className="cc-req">*</span>
                    </span>
                  </label>
                  {fieldErrors.consentAccepted && (
                    <span className="cc-field-error">{fieldErrors.consentAccepted}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="cc-modal-footer">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="cc-btn cc-btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="cc-btn cc-btn-navy"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="cc-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Enquiry <ArrowRight size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
