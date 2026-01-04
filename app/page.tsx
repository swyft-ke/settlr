import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <Link href="/" className="font-bold text-2xl">
          Settlr.
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium hover:text-settlr-green transition-colors"
        >
          Partner Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-16 md:py-24 bg-settlr-black text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-settlr-green to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-6 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Real Estate Logistics,<br />Not Just Listings.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              We verify the units, drive you to them, and handle the negotiations.
              Experience the premium way to hunt for homes in Nairobi.
            </p>
            <div className="pt-4">
              <Link href="/quiz">
                <Button className="bg-settlr-green text-white hover:bg-settlr-green/90 h-14 px-10 text-lg font-bold rounded-full">
                  Find a Home
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Tell Us What You Need",
                  desc: "Take our quick interactive quiz to set your preferences.",
                },
                {
                  step: "2",
                  title: "Select Your Units",
                  desc: "Choose how many verified homes you want to view.",
                },
                {
                  step: "3",
                  title: "We Drive You",
                  desc: "A vetted Scout picks you up and shows you your selected homes.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-settlr-green flex items-center justify-center mb-4 text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Pay per unit you want to view
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <span className="text-settlr-green text-5xl">KES 300</span>
              <span className="text-gray-600">/ unit</span>
            </div>
            <p className="text-gray-500 mt-4">
              Example: 5 units = KES 1,500
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Settlr Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-settlr-green transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-settlr-green transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
