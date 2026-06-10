import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ExtensionShowcase } from "@/components/landing/ExtensionShowcase";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudySync — Your Second Brain For Learning" },
      {
        name: "description",
        content:
          "Highlight content on any website, generate AI summaries, organize knowledge into topics, and build your personal knowledge base.",
      },
      { property: "og:title", content: "StudySync — Your Second Brain For Learning" },
      {
        property: "og:description",
        content:
          "Turn anything you read into organized knowledge. AI summaries, smart highlights, and a knowledge dashboard for serious learners.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background bg-gradient-hero">
      <Navbar />
      <div className="pt-6 sm:pt-8">
        <ProductShowcase />
      </div>
      <Hero />
      <Features />
      <ExtensionShowcase />
      <CTA />
    </main>
  );
}
