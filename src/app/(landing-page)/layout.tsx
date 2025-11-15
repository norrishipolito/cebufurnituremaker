import { Footer } from "@/common/layouts/footer";
import { Navigation } from "./_components/navigation";

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}

