export interface FounderData {
  id: number;
  name: string;
  title: string;
  tagline: string;
  seeking: string;
  industry: string;
  stage: string;
  members: number;
  image: string;
}

export const FOUNDERS: FounderData[] = [
  {
    id: 1,
    name: "Femi Aluko",
    title: "CEO @ Chowdeck",
    tagline: "Hyper-local quick-commerce delivery infrastructure empowering African restaurants and instant urban logistics.",
    seeking: "$2.5M Seed",
    industry: "Logistics & Q-Commerce",
    stage: "Seed",
    members: 28,
    image: "linear-gradient(135deg, #0C9E56 0%, #056835 100%)"
  },
  {
    id: 2,
    name: "Olugbenga Agboola",
    title: "CEO @ Flutterwave",
    tagline: "Pan-African payments engine uniting global businesses with localized checkout and multi-currency payouts.",
    seeking: "$30M Series C",
    industry: "Fintech & Payments",
    stage: "Growth",
    members: 120,
    image: "linear-gradient(135deg, #FF5A00 0%, #D94800 100%)"
  },
  {
    id: 3,
    name: "Shola Akinlade",
    title: "Co-Founder @ Paystack",
    tagline: "Developer-first payment gateway making online payment processing seamless across emerging markets.",
    seeking: "$8M Series A",
    industry: "Financial Infrastructure",
    stage: "Series A",
    members: 85,
    image: "linear-gradient(135deg, #00C3F7 0%, #0081A7 100%)"
  },
  {
    id: 4,
    name: "Tosin Eniolorunda",
    title: "CEO @ Moniepoint",
    tagline: "All-in-one financial platform empowering micro & small business banking with POS and instant credit.",
    seeking: "$15M Series B",
    industry: "Neo-Banking",
    stage: "Series B",
    members: 95,
    image: "linear-gradient(135deg, #023047 0%, #001829 100%)"
  },
  {
    id: 5,
    name: "Nadayar Enegesi",
    title: "CEO @ Eden Life",
    tagline: "Tech-enabled room & home concierge services automating meals, laundry, and cleaning for busy professionals.",
    seeking: "$1.8M Pre-Seed",
    industry: "Consumer Tech",
    stage: "Pre-Seed",
    members: 18,
    image: "linear-gradient(135deg, #00C853 0%, #008937 100%)"
  }
];
