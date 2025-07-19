import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Home", href: "#" },
      { name: "Deals", href: "#" },
      { name: "Requests", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Contacts", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Login", href: "#" },
      { name: "Sign Up", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer7 = ({
  logo = {
    url: "/home",
    src: "/DawabackNewLogo.png",
    alt: "logo",
    title: "Dawaback",
  },
  sections = defaultSections,
  description = "A collection of components for your startup business or side project.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 Shadcnblocks.com. All rights reserved.",
  legalLinks = defaultLegalLinks,
}) => {
  return (
    <section className="bg-background text-foreground px-6 py-10 md:px-12 lg:px-20">
      <div className="container mx-auto">
        {/* Top: Logo + Description + Socials */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between text-center md:text-left mb-12">
          <div className="flex flex-col items-center md:items-start">
            <Link to={logo.url} className="flex items-center gap-3 mb-4">
              <img src={logo.src} className="h-8" alt={logo.alt} />
              <span className="text-2xl font-bold text-primary">
                {logo.title}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-full md:max-w-md lg:max-w-xl">
              {description}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid gap-8 mt-10 md:mt-0 w-full text-center md:text-center sm:grid-cols-1 md:grid-cols-3 lg:gap-12">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-base mb-2">{section.title}</h4>
                <div className="flex flex-wrap md:flex-col items-center md:items-center justify-center gap-2 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <a
                      key={linkIdx}
                      href={link.href}
                      className="hover:text-primary transition hover:font-semibold"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t pt-6 text-sm flex flex-col md:flex-row justify-between items-center text-muted-foreground gap-4">
          <p className="text-center md:text-left">{copyright}</p>
          <div className="flex gap-4">
            {legalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="hover:text-primary hover:font-medium transition"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Footer7 };
