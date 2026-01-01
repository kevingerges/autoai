import { Linkedin, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Integrations", "Pricing", "Roadmap", "Changelog"],
  Company: ["About", "Careers", "Blog", "Press Kit", "Contact"],
  Resources: ["Documentation", "API Reference", "Help Center", "Community", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Security", "Compliance"],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-t border-gray-800">
      <div className="container-max section-padding py-16 lg:py-20">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#" className="text-h6 font-medium text-background">
              AutoAI
            </a>
            <p className="text-body-sm text-gray-400 mt-3 max-w-[240px]">
              AI-powered sales assistant for modern dealerships
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-500 hover:text-background transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-eyebrow uppercase text-background tracking-widest mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-body-sm text-gray-500 hover:text-background transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-gray-600">
            © 2024 AutoAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-body-sm text-gray-600 hover:text-gray-400 transition-colors">
              Privacy
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-body-sm text-gray-600 hover:text-gray-400 transition-colors">
              Terms
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="text-body-sm text-gray-600 hover:text-gray-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
