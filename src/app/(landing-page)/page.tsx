import { Hero } from "./_components/hero";
import { About } from "./_components/about";
import { Contact } from "./_components/contact";
import { Projects } from "./_components/projects";
import { Testimonials } from "./_components/testimonials";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Testimonials />
      <Contact />
    </>
  );
}

