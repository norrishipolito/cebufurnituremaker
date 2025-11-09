import { Footer } from "@/common/layouts/footer";

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      {children}
      <Footer />
    </div>
  );
}

