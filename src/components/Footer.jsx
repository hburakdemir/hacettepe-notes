import React from "react";
import { Github, Linkedin, Mail, PhoneCall, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#2F5755] text-primary dark:bg-darkbgbutton dark:text-darktext">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 pb-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <img src="/images/logo.png" alt="Logo" className="h-20 " />
        </div>

        <div className="text-sm md:text-base flex items-center gap-2">
          <span>
            Designed By:{" "}
            <a
              href="https://www.burakdemir.blog"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#5A9690] focus:text-[#432323] focus:outline-none"
            >
              Hakan Burak Demir
            </a>
          </span>
          <Globe />
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/hburakdemir"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#5A9690] focus:text-[#432323] focus:outline-none"
          >
            <Github size={28} />
          </a>
          <a
            href="mailto:burakd279@gmail.com"
            className="hover:text-[#5A9690] focus:text-[#432323] focus:outline-none"
          >
            <Mail size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/hburakdmr/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#5A9690] focus:text-[#432323] focus:outline-none"
          >
            <Linkedin size={28} />
          </a>
          <div className="flex items-center gap-1">
            <PhoneCall size={28} />
            <span className="text-sm">+90 507 016 14 22</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
