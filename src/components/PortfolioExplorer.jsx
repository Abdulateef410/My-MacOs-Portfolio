import { useEffect, useRef, useState } from "react";
import { ContactRound, Cpu, Folder, Info, Mail, MessageSquareQuote, X } from "lucide-react";
import { locations, techStack } from "#constants";
import "./PortfolioExplorer.css";

const sections = [
  { id: "about", label: "About", Icon: Info },
  { id: "projects", label: "Projects", Icon: Folder },
  { id: "contact", label: "Contact", Icon: ContactRound },
  { id: "skills", label: "Skills", Icon: Cpu },
  { id: "testimonials", label: "Testimonials", Icon: MessageSquareQuote },
];

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();
const CONTACT_REQUEST_TIMEOUT_MS = 45_000;

const getProjectDetails = (project) => {
  const files = project.children ?? [];

  return {
    description: files.find((file) => file.fileType === "txt")?.description ?? [],
    image: files.find((file) => file.fileType === "img")?.imageUrl,
    github: files.find((file) => file.linkType === "github")?.href,
    demo: files.find((file) => file.linkType === "live-demo")?.href,
  };
};

const SectionHeading = ({ title, description }) => {
  const headingId = `explorer-${title.toLowerCase()}-title`;
  return (
    <header className="explorer-section-heading">
      <p className="explorer-eyebrow">Portfolio</p>
      <h1 id={headingId}>{title}</h1>
      {description && <p className="explorer-section-description">{description}</p>}
    </header>
  );
};

const AboutSection = () => (
  <section className="explorer-section explorer-about-section" aria-label="About">
    <div className="explorer-about-copy">
      <p>
        Hi there, I'm <span className="explorer-about-highlight">DevAbdul</span>, a software developer building at the intersection of web development, AI, Web3, and scalable systems.</p>
      <p>
        I enjoy creating products and exploring how modern software systems are designed and scaled. Currently, I'm building GeoTech, a community-driven initiative helping developers become better engineers through consistent learning, building, and collaboration.
      </p>
      <p>
        My focus is on full-stack development, AI engineering, Web3, and system design. Every project I build is a step toward creating technology that can scale and impact millions of people.
      </p>
    </div>
  </section>
);

const ProjectsSection = () => {
  const projects = locations.work.children;

  return (
    <section className="explorer-section" aria-labelledby="explorer-projects-title">
      <SectionHeading
        title="Projects"
      />
      <div className="explorer-project-grid">
        {projects.map((project) => {
          const details = getProjectDetails(project);

          return (
            <article className="explorer-project-card" key={project.id}>
              {details.image && (
                <img
                  className="explorer-project-image"
                  src={details.image}
                  alt={`${project.name} screenshot`}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="explorer-project-copy">
                <h2>{project.name}</h2>
                {project.category && (
                  <p className="explorer-project-category">{project.category}</p>
                )}
                {details.description.map((paragraph, index) => (
                  <p key={`${project.id}-${index}`}>{paragraph}</p>
                ))}
                {project.technologies?.length > 0 && (
                  <ul className="explorer-project-technologies" aria-label={`${project.name} technologies`}>
                    {project.technologies.map((technology) => (
                      <li key={`${project.id}-${technology}`}>{technology}</li>
                    ))}
                  </ul>
                )}
                {details.github && (
                  <a href={details.github} target="_blank" rel="noopener noreferrer">
                    GitHub Repository
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {details.demo && (
                  <a href={details.demo} target="_blank" rel="noopener noreferrer">
                    Live Demo
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submissionLock.current) return;

    const form = event.currentTarget;

    if (!FORMSPREE_ENDPOINT) {
      setFeedback({
        type: "error",
        message: "Formspree is not connected yet, so your message was not sent.",
      });
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setFeedback(null);
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(
      () => abortController.abort(),
      CONTACT_REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: abortController.signal,
      });
      const result = await response.json().catch(() => null);

      if (response.status === 429) {
        throw new Error("Too many messages were submitted. Please wait and try again.");
      }

      if (!response.ok) {
        const formErrors = Array.isArray(result?.errors)
          ? result.errors.map(({ message }) => message).filter(Boolean).join(" ")
          : "";
        throw new Error(formErrors || "Formspree could not accept your message. Please try again.");
      }

      form.reset();
      setFeedback({
        type: "success",
        message: "Your message has been sent. Thank you for reaching out.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.name === "AbortError"
            ? "The request timed out or was cancelled. Delivery status is unknown; check before retrying."
            : error instanceof TypeError
              ? "Unable to reach Formspree. Please check your connection and try again."
              : error.message || "Your message could not be sent. Please try again.",
      });
    } finally {
      window.clearTimeout(timeoutId);
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="explorer-section explorer-contact-section"
      aria-labelledby="explorer-contact-title"
    >
      <header className="explorer-contact-heading">
        <h1 id="explorer-contact-title">Need to contact DevAbdul?</h1>
      </header>

      <nav className="explorer-contact-socials" aria-label="Social media links">
        <a
          className="explorer-contact-social-link explorer-contact-social-link--linkedin"
          href="https://www.linkedin.com/in/abdulateef-saheed-a712b625b"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn (opens in a new tab)"
          title="LinkedIn"
        >
          <img src="/icons/linkedin.svg" alt="" aria-hidden="true" />
        </a>
        <a
          className="explorer-contact-social-link explorer-contact-social-link--x"
          href="https://x.com/Abdulateef96341"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter) (opens in a new tab)"
          title="X (Twitter)"
        >
          <img src="/icons/twitter.svg" alt="" aria-hidden="true" />
        </a>
        <a
          className="explorer-contact-social-link explorer-contact-social-link--github"
          href="https://github.com/Abdulateef410"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub (opens in a new tab)"
          title="GitHub"
        >
          <img src="/icons/github.svg" alt="" aria-hidden="true" />
        </a>
        <a
          className="explorer-contact-social-link explorer-contact-social-link--whatsapp"
          href="https://wa.me/2348051198566"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp (opens in a new tab)"
          title="WhatsApp"
        >
          <svg
            className="explorer-contact-social-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.297.298-.495.099-.198.05-.372-.025-.52-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.478 1.064 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.488 1.694.624.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.007-1.412.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.88 9.88 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.437-9.884 9.888-9.884 2.64 0 5.122 1.03 6.987 2.898a9.825 9.825 0 0 1 2.893 6.993c-.002 5.45-4.437 9.884-9.884 9.884m8.411-18.299A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.158 11.89c0 2.096.547 4.143 1.587 5.946L0 24l6.335-1.663a11.878 11.878 0 0 0 5.707 1.454h.005c6.555 0 11.89-5.335 11.892-11.89a11.817 11.817 0 0 0-3.477-8.415z"
            />
          </svg>
        </a>
      </nav>

      <div className="explorer-contact-details">
        <a
          className="explorer-contact-email"
          href="mailto:abdulateefg4@gmail.com"
        >
          <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>abdulateefg4@gmail.com</span>
        </a>
        <a
          className="explorer-contact-whatsapp-number"
          href="https://wa.me/2348051198566"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp (opens in a new tab)"
        >
          +234 805 119 8566
        </a>
      </div>

      <form className="explorer-contact-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <div className="explorer-contact-field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="explorer-contact-field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="explorer-contact-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Write your message..."
            rows="4"
            disabled={isSubmitting}
            required
          />
        </div>
        <button className="explorer-contact-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {feedback && (
          <p
            className={`explorer-contact-feedback explorer-contact-feedback--${feedback.type}`}
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {feedback.message}
          </p>
        )}
      </form>
    </section>
  );
};
const SkillsSection = () => (
  <section className="explorer-section" aria-labelledby="explorer-skills-title">
    <SectionHeading title="Skills" description="Technologies listed in this portfolio." />
    <div className="explorer-skills-grid">
      {techStack.map(({ category, items }) => (
        <article className="explorer-skill-card" key={category}>
          <h2>{category}</h2>
          <ul>
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="explorer-section" aria-labelledby="explorer-testimonials-title">
    <SectionHeading title="Testimonials" description="Feedback from collaborators." />
    <div className="explorer-placeholder">
      <h2>No testimonials have been added yet.</h2>
      <p>This project doesn't currently contain testimonial quotes or images.</p>
    </div>
  </section>
);

const sectionComponents = {
  about: AboutSection,
  projects: ProjectsSection,
  contact: ContactSection,
  skills: SkillsSection,
  testimonials: TestimonialsSection,
};

const PortfolioExplorer = ({
  isOpen,
  isMinimized,
  isMaximized,
  activeSection,
  focusToken,
  onSelectSection,
  onClose,
}) => {
  const windowRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      previousFocusRef.current = document.activeElement;
      windowRef.current?.focus();
    } else if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus?.();
      previousFocusRef.current = null;
    }
  }, [focusToken, isMinimized, isOpen]);

  if (!isOpen) return null;

  const selectedLabel = sections.find(({ id }) => id === activeSection)?.label ?? "About";
  const ActiveSectionComponent = sectionComponents[activeSection] ?? AboutSection;

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key === "Tab" && windowRef.current) {
      const focusableElements = windowRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === windowRef.current) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    }
  };

  return (
    <section
      ref={windowRef}
      id="portfolio-explorer"
      className={`portfolio-explorer${isMaximized ? " is-maximized" : ""}${isMinimized ? " is-minimized" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Portfolio Explorer: ${selectedLabel}`}
      aria-hidden={isMinimized}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <header className="portfolio-explorer__titlebar">
        <p className="portfolio-explorer__window-title">Portfolio Explorer</p>
        <button
          className="portfolio-explorer__close-button"
          type="button"
          aria-label="Close Portfolio Explorer"
          title="Close Portfolio Explorer"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <div className="portfolio-explorer__body">
        <aside className="portfolio-explorer__sidebar">
          <p className="portfolio-explorer__sidebar-heading">
            <Folder className="portfolio-explorer__sidebar-root-icon" aria-hidden="true" />
            <span className="portfolio-explorer__sidebar-heading-text">This Portfolio</span>
          </p>
          <nav aria-label="Portfolio sections" className="portfolio-explorer__section-list">
            {sections.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className={`portfolio-explorer__section-button${activeSection === id ? " is-active" : ""}`}
                aria-current={activeSection === id ? "page" : undefined}
                aria-label={label}
                title={label}
                onClick={() => onSelectSection(id)}
              >
                <Icon className="portfolio-explorer__section-icon" aria-hidden="true" />
                <span className="portfolio-explorer__section-label">{label}</span>
                {activeSection === id && <span className="portfolio-explorer__active-indicator" aria-hidden="true" />}
              </button>
            ))}
          </nav>
        </aside>

        <div className="portfolio-explorer__content" key={activeSection}>
          <ActiveSectionComponent />
        </div>
      </div>
    </section>
  );
};

export default PortfolioExplorer;
