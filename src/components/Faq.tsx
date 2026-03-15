'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "Question text goes here",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
    },
    {
      question: "Question text goes here",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
    },
    {
      question: "Question text goes here",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
    },
    {
      question: "Question text goes here",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
    },
    {
      question: "Question text goes here",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
    },
    {
      question: "Question text goes here",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white font-sans">
      <section id="faqs" className="max-w-7xl mx-auto px-6 py-20 md:py-32 scroll-mt-24">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[#006732] text-4xl font-display font-bold">
            FAQs
          </h2>
          <p className="text-[#645D5D] max-w-4xl mx-auto text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
          </p>
        </div>

        {/* Accordion Section */}
        <div className="space-y-0 border-t border-gray-200">
          {faqData.map((item, index: number) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors group"
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-[#006732]' : 'text-[#1B1818]'}`}>
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-[#006732]" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400 group-hover:text-gray-600" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[#645D5D] leading-relaxed text-sm">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-24 space-y-6">
          <h3 className="text-[#1B1818] text-3xl font-display font-bold">
            Still have a questions?
          </h3>
          <p className="text-[#645D5D] text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <Link href="/login" className="inline-flex rounded-lg bg-[#006732] px-20 py-3.5 font-medium text-white shadow-lg transition-all hover:bg-[#005228] active:scale-95">
            Contact Us
          </Link>
        </div>
      </section>

      {/* CTA Section - Full Width Background #006732 */}
      <div className="w-full bg-[#006732] relative overflow-hidden">
        {/* Subtle Texture Overlay to match login card */}
        <div className="absolute inset-0 opacity-80 pointer-events-none bg-[url('/images/black-orchid.png')] mix-blend-overlay"></div>
        
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center relative z-10">
          <h2 className="text-white text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
            Ready to Transform Primary <br className="hidden md:block" /> Health Care?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-5xl mx-auto mb-12 font-inter font-light">
            Join health facilities across Nigeria in adopting a standardized, efficient electronic health record system.
          </p>
          <Link href="/login" className="inline-flex rounded-lg bg-[#D1FAE5] px-12 py-3.5 text-lg font-medium text-[#006732] shadow-xl transition-all hover:scale-105 hover:bg-white active:scale-95 md:px-40">
            Join Now
          </Link>
        </section>
      </div>

    </div>
  );
}