
import { Button } from '@/components/ui/button';
import { Header } from '@/components/shared/header';
import Link from 'next/link';
import { ArrowRight, BarChart, Users, Star, Bot, Zap, ShieldCheck, Target, HeartHandshake } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const features = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: 'Lead Generation CRM',
    description: 'Capture, track, and convert leads with our intuitive and powerful customer relationship management tools.',
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: 'Review Management',
    description: 'Automate review requests, manage feedback, and route happy customers to Google to boost your online reputation.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Customer Management',
    description: 'Maintain a centralized database of your customers, track interactions, and build lasting relationships.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Analytics',
    description: 'Gain actionable insights from your customer data and reviews with intelligent analytics and reporting.',
  },
    {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Automation Workflows',
    description: 'Save time and scale your efforts with automated email campaigns, follow-ups, and internal alerts.',
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: 'Unified Platform',
    description: 'Manage all your core business growth activities from a single, easy-to-use dashboard. No more switching tools.',
  },
];

const testimonials = [
  {
    name: 'Sarah L, Boutique Owner',
    quote: 'Grow Lead Spot has revolutionized how we handle customer feedback. Our Google rating has improved by a full star in just three months!',
  },
  {
    name: 'Mike P, Service Pro',
    quote: 'The lead management CRM is a game-changer. We\'re converting more quotes into jobs, and nothing slips through the cracks anymore.',
  },
  {
    name: 'Jessica, Marketing Manager',
    quote: 'We switched from three different tools to Grow Lead Spot. It\'s saved us hundreds per month and countless hours of work. The AI insights are a huge bonus.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 sm:py-24 md:py-32">
          <div className="absolute top-0 left-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(247,147,26,0.1),rgba(255,255,255,0))]"></div>
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-6">
              <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto">
                The All-In-One Platform to Grow Your Local Business
              </h1>
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                Stop juggling multiple tools. Grow Lead Spot unifies your lead generation, customer management, and review marketing into one powerful, easy-to-use platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started For Free <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-24 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        Core Features
                    </div>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Everything You Need to Grow</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                        From first contact to five-star review, Grow Lead Spot provides the tools to scale your business efficiently.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                            {feature.icon}
                            <h3 className="text-xl font-bold font-headline mt-4 mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Testimonials Section */}
         <section className="w-full py-20 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                     <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        Testimonials
                    </div>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Loved by Businesses Like Yours</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6">
                            <CardContent className="p-0">
                                <p className="mb-4 text-muted-foreground">"{testimonial.quote}"</p>
                                <p className="font-semibold">{testimonial.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-20 md:py-24 bg-muted/40">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Ready to Grow Your Business?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Join hundreds of businesses streamlining their growth with Grow Lead Spot. Your first 14 days are on us.
                </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <Button size="lg" asChild className="w-full">
                        <Link href="/signup">
                            Start Your Free Trial
                        </Link>
                     </Button>
                     <p className="text-xs text-muted-foreground">No credit card required.</p>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex flex-col sm:flex-row items-center gap-4">
             <Logo />
             <p className="text-sm text-muted-foreground">© 2024 Grow Lead Spot. All rights reserved.</p>
           </div>
            <div className="flex items-center gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
