import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Badge } from "../../components/ui/badge";
import { features } from "./homeUtilities";
import { howWeWorkSteps, faqItems, testimonials } from "./homeUtilities";
import "flowbite";
import { Input } from "@/components/ui/input";
import { useInView } from "../../hooks/useInView";

export default function Home() {
  const MotionLink = motion(Link);
  const buttonVariants = { tap: { scale: 0.95 }, hover: { scale: 1.05 } };

  const [openIndex, setOpenIndex] = useState(null);
  const [current, setCurrent] = useState(0);

  const [headerRef, headerInView] = useInView();
  const [previewRef, previewInView] = useInView();
  const [whoWeAreRef, whoWeAreInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [featuresCardsRef, featuresCardsInView] = useInView();
  const [stepsRef, stepsInView] = useInView();
  const [stepsCardsRef, stepsCardsInView] = useInView();
  const [missionRef, missionInView] = useInView();
  const [visionRef, visionInView] = useInView();
  const [faqRef, faqInView] = useInView();
  const [testimonialRef, testimonialInView] = useInView();
  const [newsletterRef, newsletterInView] = useInView();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval); // تنظيف الانترفال عند إلغاء المكون
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const { text, name, role, img } = testimonials[current];

  return (
    <div className="min-h-screen font-sans">
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Hero Section */}
        <header
          className="relative h-screen min-h-[500px] flex items-center justify-center text-white text-center px-4 overflow-hidden"
          style={{
            backgroundImage: `url(/imgs/drug-store.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60 z-10" />
          <div className="relative z-20 max-w-5xl mx-auto p-4 md:p-8">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-lg">
              Optimize Your Pharmacy Inventory
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto opacity-90 font-light drop-shadow-md">
              Connect with companies to exchange or bid on near-expiry
              medications efficiently and compliantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <MotionLink
                to="/join-pharmacy"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="flex items-center gap-2 text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 w-auto"
              >
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.403 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.403a3.01 3.01 0 0 1-1.743-1.612l-3.025 3.025A3 3 0 1 1 9.99 9.768l3.025-3.025A3.01 3.01 0 0 1 11.403 5Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M13.232 4a1 1 0 0 1 1-1H20a1 1 0 0 1 1 1v5.768a1 1 0 1 1-2 0V6.414l-6.182 6.182a1 1 0 0 1-1.414-1.414L17.586 5h-3.354a1 1 0 0 1-1-1Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Join as Pharmacy</span>
              </MotionLink>

              {/* <MotionLink to="/join-company" whileTap="tap" whileHover="hover" variants={buttonVariants} className="text-gray-900 bg-[#d0d2f8] hover:bg-gray-100 hover:text-primary focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-6 py-2 w-auto">
                Join as Company
              </MotionLink> */}
            </div>
          </div>
        </header>
      </motion.header>

      <main>
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, y: 80 }}
          animate={previewInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Preview Section */}
          <section className="pt-16 md:pt-16 px-14 text-center text-[color:var(--card-foreground)] transition-colors duration-300">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 px-5 leading-tight text-[var(--foreground)]">
                Bridging the Gap for Pharmaceutical Inventory
              </h2>
              <p className="text-lg md:text-xl text-[color:var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
                MediExchange is a secure online platform connecting pharmacies
                and companies for the ethical and efficient handling of
                near-expiry and surplus medications through a transparent
                exchange and bidding system. Reduce waste, recover value, and
                access needed stock.
              </p>
            </div>
          </section>
        </motion.div>

        <motion.div
          ref={whoWeAreRef}
          initial={{ opacity: 0, y: 80 }}
          animate={whoWeAreInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Who We Are */}
          <section className="py-12 px-6 sm:px-10 md:px-14 text-[color:var(--card-foreground)] transition-colors duration-300">
            <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
              {/* Text Content */}
              <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left">
                <Badge
                  variant="outline"
                  className="mb-4 bg-[#dadcf8] text-[color:var(--secondary-foreground)] px-5 py-2 text-sm font-medium rounded-full mx-auto lg:mx-0"
                >
                  Who We Are
                </Badge>

                <h3 className="text-3xl md:text-4xl font-bold text-[color:var(--primary)] mb-6 leading-tight order-1">
                  Bridging Sustainability with Pharmacy
                </h3>

                {/* Image between title and paragraphs in small screens */}
                <div className="w-full flex justify-center my-6 order-2 lg:hidden shadow-none">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 shadow-none  overflow-hidden">
                    <img
                      src="/imgs/whoWeAre.png"
                      alt="About MediExchange"
                      className="object-cover w-full h-full shadow-none"
                    />
                  </div>
                </div>

                {/* Paragraphs */}
                <p className="text-base md:text-lg leading-relaxed text-[color:var(--muted-foreground)] mb-4 order-3">
                  Founded on the principles of sustainability and resource
                  optimization within the pharmaceutical supply chain,
                  MediExchange provides a trusted marketplace designed to extend
                  the lifecycle of valuable medications and reduce the
                  environmental and economic burden of disposal.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[color:var(--muted-foreground)] order-4">
                  Our mission is to create a more resilient and efficient system
                  for all stakeholders.
                </p>
              </div>

              {/* Image on right for large screens */}
              <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
                <div className="w-[400px] h-[400px] xl:w-[500px] xl:h-[500px]  overflow-hidden ">
                  <img
                    src="/imgs/whoWeAre.png"
                    alt="About MediExchange"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0, y: 80 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Services / Features */}

          <section className="py-24 px-4  text-[color:var(--card-foreground)]">
            <div className="max-w-7xl mx-auto text-center">
              <Badge
                variant="outline"
                className="self-center mb-4 lg:self-start  bg-[#dadcf8] text-[color:var(--secondary-foreground)] px-5 py-2 text-sm font-medium rounded-full"
              >
                Our Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Discover Our Platform Features
              </h2>
              <p className="text-lg text-[color:var(--muted-foreground)] max-w-2xl mx-auto mb-16">
                Explore a range of powerful tools designed to simplify,
                optimize, and scale your pharmaceutical operations.
              </p>

              <motion.div
                ref={featuresCardsRef}
                initial={{ opacity: 0, y: 80 }}
                animate={featuresCardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="group bg-white dark:bg-[color:var(--card)] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-200 dark:border-[color:var(--border)] relative overflow-hidden"
                    >
                      {/* Circle Icon with hover transition */}
                      <div className="bg-[#dadcf8] text-[color:var(--primary)] w-14 h-14 flex items-center justify-center rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-3 group-hover:text-[color:var(--primary)] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Bottom gradient hover line */}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[3px] bg-[color:var(--primary)] transition-all duration-300 group-hover:w-2/3 rounded-full" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </motion.div>

        <motion.div
          ref={stepsRef}
          initial={{ opacity: 0, y: 80 }}
          animate={stepsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* steps */}
          <div className="min-h-screen bg-gray-50">
            <section className="py-10 px-2 bg-white font-sans text-center relative">
              <div className="mb-16 text-center">
                <Badge
                  variant="outline"
                  className="mx-auto mb-4 bg-[#dadcf8] text-[color:var(--secondary-foreground)] px-5 py-2 text-sm font-medium rounded-full"
                >
                  Our Working Process
                </Badge>

                <h2 className="text-4xl text-[#2b2b64] font-bold mb-4">
                  How We Work
                </h2>

                <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  At MediExchange, our process is built for clarity and
                  collaboration. From identifying your needs to delivering
                  impactful results, we ensure every step is efficient,
                  transparent, and aligned with your goals.
                </p>
              </div>

              <motion.div
                ref={stepsCardsRef}
                initial={{ opacity: 0, y: 80 }}
                animate={stepsCardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Steps Cards */}
                <div className="flex flex-wrap justify-center gap-10 relative pt-5 z-10">
                  {howWeWorkSteps.map((step, index) => (
                    <div
                      className="w-full sm:w-[calc(50%-20px)] lg:w-[280px] text-center relative mb-10 z-10"
                      key={index}
                    >
                      <div className="w-[200px] h-[200px] rounded-[50%] mx-auto mb-6 relative border-4 border-[#f0f0f0] shadow-lg bg-white z-0">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="w-full h-full object-cover rounded-[50%]"
                        />

                        {/* Step Number Circle at top-left of image */}
                        <div className="absolute top-2 left-2 w-9 h-9 rounded-full bg-[color:var(--primary)] flex items-center justify-center text-[color:var(--primary-foreground)] shadow-md text-sm font-bold z-20">
                          {index + 1}
                        </div>
                      </div>

                      <h3 className="text-2xl text-[#2b2b64] font-bold mb-2.5 flex items-center justify-center gap-2">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-6 h-6 text-[#636ae8]"
                          viewBox="0 0 24 24"
                        >
                          {step.icon}
                        </svg>
                        {step.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}

                  {/* SVG Curved Dotted Line */}
                  <div className="hidden lg:block absolute top-[120px] left-0 right-0 w-full z-0">
                    <svg
                      viewBox="0 0 1000 150"
                      preserveAspectRatio="none"
                      className="w-full h-12"
                    >
                      <path
                        d="M 20 75
               Q 120 0, 250 75
               T 480 75
               T 710 75
               T 940 75"
                        fill="none"
                        stroke="#a8a5a5"
                        strokeWidth="2"
                        strokeDasharray="6,6"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </motion.div>

        <motion.div
          ref={missionRef}
          initial={{ opacity: 0, y: 80 }}
          animate={missionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* mission & vision */}
          <section className="bg-white py-20 px-6 font-sans">
            <div className="max-w-8xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 md:gap-6 gap-0 items-center relative">
              {/* Left Box - Mission */}
              <div className="bg-[#eff0fc]/90 md:pr-30 sm:pr-8  text-white p-8 py-16 rounded-lg shadow-lg col-span-12 lg:col-span-7">
                <div className="flex justify-center md:justify-start">
                  <Badge
                    variant="outline"
                    className="mb-4 bg-[#dadcf8] text-[color:var(--secondary-foreground)] px-5 py-2 text-sm font-medium rounded-full"
                  >
                    Our Mission
                  </Badge>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-[color:var(--foreground)] mb-6 leading-tight text-center md:text-left">
                  Advancing Pharmacy Through Circular Innovation
                </h3>

                <p className="text-base lg:text-lg leading-relaxed text-[color:var(--muted-foreground)] break-words text-center md:text-left">
                  At MediExchange, we are reimagining the pharmaceutical supply
                  chain...
                </p>
              </div>

              {/* Right Box - Vision */}
              <div className="bg-background text-left p-6 lg:p-8 rounded-md shadow-2xl col-span-12 lg:col-span-5 md:mt-6 mt-6 lg:mt-0 lg:ml-[-100px] z-10">
                <div className="flex justify-center md:justify-start">
                  <Badge
                    variant="outline"
                    className="mb-4 bg-[#dadcf8] text-[color:var(--secondary-foreground)] px-5 py-2 text-sm font-medium rounded-full"
                  >
                    Our Vision
                  </Badge>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-[color:var(--primary)] mb-6 leading-tight text-center md:text-left">
                  Shaping a Sustainable Future for Pharma
                </h3>

                <p className="text-base lg:text-lg leading-relaxed text-[color:var(--muted-foreground)] break-words text-center md:text-left">
                  We envision a future where pharmacies collaborate...
                </p>
              </div>
            </div>
          </section>
        </motion.div>

        <motion.div
          ref={faqRef}
          initial={{ opacity: 0, y: 80 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* frequently questions */}
          <section className="relative font-sans  py-24 px-6 md:px-14 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/imgs/faqs.webp"
                  alt="Opening and Visiting Hours"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Right Content */}
              <div className="relative bg-[#f4f6ff] backdrop-blur-lg border border-[#dadcf8] shadow-xl rounded-3xl p-8 md:p-12 z-10">
                <div className="flex justify-start mb-4">
                  <span className="bg-[#dadcf8] text-[#2b2b64] px-4 py-1 text-sm font-semibold rounded-full uppercase tracking-wide shadow-sm">
                    Faqs
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2b2b64] mb-4">
                  Frequently Asked Questions
                </h2>

                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  We provide the best service nationwide. Here’s why patients
                  choose our hospital:
                </p>

                {/* Accordion */}
                <div className="space-y-4">
                  {faqItems.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <div
                        key={index}
                        className="border border-gray-300 rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleAccordion(index)}
                          className="w-full flex justify-between items-center text-left px-5 py-4 bg-white hover:bg-[#eff1fb] transition-colors font-medium text-gray-900"
                        >
                          <span>{item.question}</span>
                          <span className="text-2xl font-bold text-[#2b2b64]">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>

                        <div
                          className={`px-5 overflow-hidden transition-all duration-500 ease-in-out ${
                            isOpen
                              ? "max-h-40 py-4 opacity-100"
                              : "max-h-0 opacity-0"
                          } text-sm text-gray-600 bg-white`}
                        >
                          {item.answer}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        <motion.div
          ref={testimonialRef}
          initial={{ opacity: 0, y: 80 }}
          animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* testimonials */}
          <section className="max-w-screen-md mb-14  mx-auto text-center relative overflow-hidden p-6">
            <figure>
              <svg
                className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 14"
              >
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
              </svg>
              <blockquote>
                <p className="text-2xl italic font-medium text-gray-900 dark:text-white">
                  {text}
                </p>
              </blockquote>
              <figcaption className="flex items-center justify-center mt-6 space-x-3 rtl:space-x-reverse">
                <img
                  className="w-6 h-6 rounded-full"
                  src={img}
                  alt={`${name} profile picture`}
                />
                <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-500 dark:divide-gray-700">
                  <cite className="pe-3 font-medium text-gray-900 dark:text-white">
                    {name}
                  </cite>
                  <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
                    {role}
                  </cite>
                </div>
              </figcaption>
            </figure>
          </section>
        </motion.div>

        <motion.div
          ref={newsletterRef}
          initial={{ opacity: 0, y: 80 }}
          animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* newaletter */}
          <section
            className="bg-cover bg-center py-20 text-white"
            style={
              {
                backgroundImage: "url('/imgs/newsletter.webp')",
                backgroundColor: "rgba(175, 180, 240, 0.5)",
                backgroundBlendMode: "multiply",
              } // غيّري المسار حسب مكان الصورة
            }
          >
            <div className="max-w-xl mx-auto text-center space-y-6 px-4">
              <Input
                type="email"
                placeholder="Enter your Email Address"
                className="bg-transparent border-b border-white rounded-none text-white placeholder-white text-center focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <MotionLink
                to="/join-pharmacy"
                whileTap="tap"
                whileHover="hover"
                variants={buttonVariants}
                className="text-white bg-primary hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Subscribe Now{" "}
              </MotionLink>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
