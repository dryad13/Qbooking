import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <Image src="/logo.jpeg" alt="QC Logo" width={48} height={48} className="mr-2" />
          <span className="font-bold text-xl text-primary">99 Cattle Farm</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#faq">
            FAQ
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-foreground">
                  Fulfill Your Qurbani with Confidence
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Book your share for Eid al-Adha. We offer premium cattle, full transparency, and a seamless digital booking process from farm to fulfillment.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/login">Book Your Share</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#pricing">View Packages</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Choose between our Normal and Premium packages. 7 shares per cow.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">Normal Share</CardTitle>
                  <CardDescription>Perfect for standard Qurbani requirements.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold mb-4">Rs. 45,000<span className="text-lg text-muted-foreground font-normal"> / share</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Healthy, standard weight cattle</li>
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Shariah compliant</li>
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Digital receipt & tracking</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/login">Select Normal</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col border-primary shadow-lg scale-105">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Premium Share</CardTitle>
                  <CardDescription>Premium heavy-weight cattle with priority processing.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold mb-4">Rs. 65,000<span className="text-lg text-muted-foreground font-normal"> / share</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Premium heavy-weight cattle</li>
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority slaughter slot</li>
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Exclusive updates</li>
                    <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Digital receipt & tracking</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/login">Select Premium</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-8 text-center max-w-2xl mx-auto border rounded-lg p-6 bg-muted/50">
              <h3 className="font-semibold text-lg mb-2">Optional Add-ons</h3>
              <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
                <div className="flex justify-between w-full border-b pb-2 sm:border-b-0 sm:pb-0">
                  <span>Cutting Service</span>
                  <span className="font-medium">+ Rs. 2,500</span>
                </div>
                <div className="flex justify-between w-full">
                  <span>Home Delivery</span>
                  <span className="font-medium">+ Rs. 3,500</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
            </div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the booking process work?</AccordionTrigger>
                  <AccordionContent>
                    Simply log in with your phone number, select your desired shares and package, upload your KYC documents (ID card), and once approved, upload your payment proof. We handle the rest!
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What happens if my payment is rejected?</AccordionTrigger>
                  <AccordionContent>
                    If our admins find an issue with your payment proof, you will be notified via SMS/WhatsApp and given the option to re-upload a clear proof from your customer portal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Will I get a receipt?</AccordionTrigger>
                  <AccordionContent>
                    Yes, once your booking is confirmed, you can download a digital invoice and a unique Booking Slip equipped with a QR code right from your portal.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">
          &copy; 2026 99 Cattle Farm. All rights reserved.
        </p>
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
