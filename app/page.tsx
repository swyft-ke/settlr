import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold text-xl" href="#">
          Settlr.
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Partner Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-settlr-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Real Estate Logistics, Not Just Listings.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  We verify the units, drive you to them, and handle the negotiations.
                  Experience the premium way to hunt for homes in Nairobi.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/quiz">
                  <Button className="bg-settlr-green text-black hover:bg-settlr-green/90 h-12 px-8 text-lg">
                    Find a Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-4">
                <div className="h-12 w-12 rounded-full bg-settlr-green flex items-center justify-center mb-4 font-bold text-xl">1</div>
                <h3 className="text-xl font-bold">Tell Us What You Need</h3>
                <p className="text-gray-500">Take our quick swipe-based quiz to set your preferences.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="h-12 w-12 rounded-full bg-settlr-green flex items-center justify-center mb-4 font-bold text-xl">2</div>
                <h3 className="text-xl font-bold">Unlock Viewings</h3>
                <p className="text-gray-500">Pay a small fee to unlock verified listings and schedule a tour.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="h-12 w-12 rounded-full bg-settlr-green flex items-center justify-center mb-4 font-bold text-xl">3</div>
                <h3 className="text-xl font-bold">We Drive You</h3>
                <p className="text-gray-500">A vetted Scout picks you up and shows you 5 verified homes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Settlr Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
