import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Shield, FileText, Truck, Phone, ShoppingCart, Eye, Lock, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Banner */}
      <div className="bg-primary text-primary-foreground text-center text-xs font-medium py-2 px-4">
        Now accepting bookings for Eid al-Adha 1447 AH — Limited shares available
      </div>

      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <Link className="flex items-center gap-2.5" href="/">
          <Image src="/logo.jpeg" alt="99 Cattle Farm" width={36} height={36} className="rounded-md" />
          <span className="font-bold text-lg text-primary">99 Cattle Farm</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#faq">
            FAQ
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                  <Shield className="h-3.5 w-3.5" /> Halal Certified &amp; Shariah Compliant
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                  Your Qurbani.<br />Handled with Care.
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Book your share of premium cattle for Eid al-Adha. Full transparency from farm to fulfillment — KYC verified, digitally receipted, professionally delivered.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="font-semibold">
                    <Link href="/login">Book Your Share</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#how-it-works">How It Works</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-5 pt-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" /> KYC Verified
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Digital Receipt
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" /> Home Delivery Available
                  </div>
                </div>
              </div>

              {/* Mock booking card */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-2xl" />
                  <div className="relative bg-white rounded-xl border shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Booking Slip</span>
                      <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2 py-1 rounded">CF-2025-0047</span>
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Package</span>
                        <span className="font-semibold">Premium Share</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shares</span>
                        <span className="font-semibold">2 of 7</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Add-ons</span>
                        <span className="font-semibold">Cutting + Delivery</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary text-lg">Rs. 136,000</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-semibold text-primary">Booking Confirmed</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Slaughter slot: Day 1 · Priority Queue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-3 mb-14">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">From signup to confirmed booking in under 10 minutes.</p>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-border" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {([
                  { icon: Phone, step: "1", title: "Create Account", desc: "Enter your phone number and verify with a one-time OTP." },
                  { icon: ShoppingCart, step: "2", title: "Select Package", desc: "Choose Normal or Premium shares and optional add-ons." },
                  { icon: FileText, step: "3", title: "KYC Verification", desc: "Upload your ID documents for identity verification." },
                  { icon: CheckCircle2, step: "4", title: "Confirmed", desc: "Submit payment proof and receive your official booking slip." },
                ] as const).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex flex-col items-center text-center gap-3">
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm z-10">
                        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{item.step}</span>
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Transparent Pricing</h2>
              <p className="text-muted-foreground">Choose between our Normal and Premium packages. Up to 7 shares per cow.</p>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2 items-start">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">Normal Share</CardTitle>
                  <CardDescription>Perfect for standard Qurbani requirements.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold mb-5">Rs. 45,000<span className="text-base text-muted-foreground font-normal"> / share</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Healthy, standard weight cattle</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Shariah compliant</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Digital receipt &amp; QR booking slip</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Video documentation available</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Assigned batch number</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/login">Select Normal</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col border-primary shadow-lg relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Premium Share</CardTitle>
                  <CardDescription>Premium heavy-weight cattle with priority processing.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-4xl font-bold mb-5">Rs. 65,000<span className="text-base text-muted-foreground font-normal"> / share</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Premium heavy-weight cattle (&gt;400kg)</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Priority Day 1 slaughter slot</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Exclusive status updates</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Digital receipt &amp; QR booking slip</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Video documentation available</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/login">Select Premium</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-8 text-center max-w-md mx-auto border rounded-xl p-5 bg-background shadow-sm">
              <h3 className="font-semibold mb-3">Optional Add-ons</h3>
              <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm">
                <div className="flex justify-between w-full sm:border-r sm:pr-4">
                  <span className="text-muted-foreground">Cutting Service</span>
                  <span className="font-semibold">+ Rs. 2,500</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-muted-foreground">Home Delivery</span>
                  <span className="font-semibold">+ Rs. 3,500</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Why Families Trust Us</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {([
                { icon: Shield, title: "Shariah Compliant", desc: "All animals meet halal requirements. The entire process is supervised by qualified scholars to ensure full compliance." },
                { icon: Eye, title: "Full Transparency", desc: "Track your booking through every stage with real-time status updates. Your digital slip includes a QR code for gate verification." },
                { icon: Lock, title: "Secure & Digital", desc: "KYC verification protects all parties. Your booking is fully digitized — no paperwork, no uncertainty." },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-xl border bg-card shadow-sm space-y-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="mx-auto max-w-2xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the booking process work?</AccordionTrigger>
                  <AccordionContent>
                    Log in with your phone number, select your package and shares, upload your KYC documents, and once approved, upload your payment proof. You&apos;ll receive a digital booking slip with a QR code immediately upon confirmation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is my payment secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Payment is only submitted after identity verification is complete. You receive a digital receipt for every transaction, and you can resubmit proof if the first submission is rejected for any reason.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>When will slaughter happen?</AccordionTrigger>
                  <AccordionContent>
                    Slaughter occurs on Eid al-Adha. Premium shares receive priority Day 1 slots. You will receive notification and can download your final receipt immediately after.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What happens if my KYC or payment is rejected?</AccordionTrigger>
                  <AccordionContent>
                    You&apos;ll be notified with the specific rejection reason and given the option to resubmit directly from your customer portal — no need to start over.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Will I get a receipt?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Once confirmed, you can download a printable booking slip with your booking reference, itemized summary, and a unique QR code for gate verification on the day of slaughter.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">99 Cattle Farm</p>
            <p className="text-xs text-muted-foreground mt-0.5">Karachi, Pakistan · contact@99cattle.farm</p>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} 99 Cattle Farm. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">Terms of Service</Link>
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
