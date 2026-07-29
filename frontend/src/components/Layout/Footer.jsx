import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Blog", path: "#" },
    ],
    customer: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns", path: "#" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Cookie Policy", path: "#" },
      { name: "Security", path: "#" },
    ],
  };

    const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

  return (
    <footer className="glass border-t border-[hsla(var(--glass-border))] mt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight bg-gradient-to-r
             from-orange-400 via-orange-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
              ShopSphere
            </h2>

            <p className="text-muted-foreground mb-6">
              Your trusted partner for online shopping. Discover amazing
              products with exceptional quality and service.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>support@shopmate.com</span>
              </div>

              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Company
            </h3>

            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Customer Service
            </h3>

            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Legal
            </h3>

            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass-panel mb-12">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Stay Connected
            </h3>

            <p className="text-muted-foreground">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email" placeholder="Enter your email"
              className=" flex-1 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white
              placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"/>

            <button
              type="submit"
              className="px-6 py-3 gradient-primary rounded-full font-semibold bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 hover:opacity-90 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[hsla(var(--glass-border))]">
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[hsla(var(--glass-border))]">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} aria-label={social.label}
                  className="p-3 rounded-full glass-card transition-all duration-300 hover:bg-gradient-to-r
                hover:from-orange-400 hover:via-orange-500 hover:to-red-500 hover:scale-110 hover:shadow-lg"
                >
                  <social.icon className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              © 2026 ShopSphere. All rights reserved.
            </p>

            <p className="text-muted-foreground text-xs mt-1">
              Design & Developed By{" "}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">TechGuy 360</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;