import Link from "next/link";
import Image from "next/image";
import MapView from "./components/MapView";

/**
 * Home page redesigned to match the provided design
 * Features hero section, Our Oven, Menu Highlights, and more
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#f5f3f0] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <p className="text-[#8B0000] text-sm font-semibold uppercase tracking-wide mb-4">
                NEIGHBORHOOD WOOD-FIRED PIZZA
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2c2c2c] mb-6">
                Stonefire Pizza, Baked to the Bone
              </h1>
              <p className="text-lg text-[#2c2c2c]/80 mb-8 leading-relaxed">
                Experience the authentic taste of wood-fired pizza made with locally sourced ingredients and fresh, flavorful recipes. Every bite is crafted with passion and tradition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/order"
                  className="bg-[#8B0000] hover:bg-[#700000] text-white font-semibold py-3 px-8 rounded transition-colors"
                >
                  Order Now
                </Link>
                <Link
                  href="/menu"
                  className="bg-[#f5f3f0] border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white font-semibold py-3 px-8 rounded transition-colors"
                >
                  View Menu
                </Link>
              </div>
            </div>
            {/* Right: Pizza Oven Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
              <Image
                src="/Stonefire2.jpg"
                alt="STONEFIRE Wood-Fired Oven"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="eager"
                priority
              />
            </div>
          </div>
        </div>
        {/* Decorative Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent"></div>
      </section>

      {/* Our Oven Section */}
      <section className="bg-white py-20 sm:py-24 relative shadow-sm">
        {/* Top decorative element */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B0000]/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2c2c2c] mb-6">
                Our Oven, Your New Favorite
              </h2>
              <p className="text-lg text-[#2c2c2c]/80 mb-4 leading-relaxed">
                Our wood-fired oven reaches temperatures of 800 degrees, creating that signature char and smoky flavor that makes every pizza unforgettable. The intense heat cooks our pizzas in just minutes, locking in freshness and flavor.
              </p>
              <p className="text-lg text-[#2c2c2c]/80 mb-8 leading-relaxed">
                We make our dough fresh daily and use only the finest San Marzano tomatoes, ensuring every bite is a celebration of authentic Italian tradition.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#f5f3f0] border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white font-semibold py-3 px-8 rounded transition-colors"
              >
                Our Story
              </Link>
            </div>
            {/* Right: Oven Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/Stonefire1.jpg"
                alt="THE STONEFIRE Wood-Fired Oven"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B0000]/10 to-transparent"></div>
      </section>

      {/* Menu Highlights Section */}
      <section className="bg-[#f9f7f4] py-20 sm:py-24 relative">
        {/* Top wave divider */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,60 600,60 900,30 C1050,15 1125,15 1200,30 L1200,120 L0,120 Z" fill="#f9f7f4"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2c2c2c] mb-3">
              Menu Highlights
            </h2>
            <p className="text-lg text-[#2c2c2c]/70">
              Hand-picked favorites from our wood-fired oven
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Classic Pepperoni */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 relative overflow-hidden">
                <Image
                  src="/meatlovers.png"
                  alt="Meat Lovers Pizza"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-[#2c2c2c] mb-2">Meat Lovers</h3>
                <p className="text-sm text-[#2c2c2c]/70 mb-3">Pepperoni, sausage, bacon, and ham with mozzarella and tomato sauce</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B0000] font-bold">$20.00</span>
                </div>
              </div>
            </div>
            {/* Margherita */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 relative overflow-hidden">
                <Image
                  src="/margherita.png"
                  alt="Margherita Pizza"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-[#2c2c2c] mb-2">Margherita</h3>
                <p className="text-sm text-[#2c2c2c]/70 mb-3">Fresh basil, mozzarella, and tomato sauce</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B0000] font-bold">$18.99</span>
                </div>
              </div>
            </div>
            {/* Garden Veggie */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/suprem.png"
                  alt="Supreme Pizza"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-[#2c2c2c] mb-2">Supreme</h3>
                <p className="text-sm text-[#2c2c2c]/70 mb-3">Pepperoni, sausage, bacon, and ham with mozzarella and tomato sauce</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B0000] font-bold">$21.99</span>
                </div>
              </div>
            </div>
            {/* BBQ Chicken */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 relative overflow-hidden">
                <Image
                  src="/buffalo pizza.png"
                  alt="Buffalo Chicken Pizza"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-[#2c2c2c] mb-2">Buffalo Chicken</h3>
                <p className="text-sm text-[#2c2c2c]/70 mb-3">Grilled chicken, red onions, cilantro, and tomato sauce with mozzarella and buffalo sauce</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B0000] font-bold">$21.99</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/menu"
              className="inline-block bg-[#8B0000] hover:bg-[#700000] text-white font-semibold py-3 px-8 rounded transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        </div>
        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#8B0000]">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,120 C300,60 600,60 900,90 C1050,105 1125,105 1200,90 L1200,0 L0,0 Z" fill="#f9f7f4"></path>
          </svg>
        </div>
      </section>

      {/* Planning a Party Section */}
      <section className="bg-[#8B0000] py-20 sm:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Planning a Party?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bring the Stonefire experience to your next event. Our catering packages are perfect for any gathering, big or small.
          </p>
          <Link
            href="/catering"
            className="inline-block bg-[#f5f3f0] border-2 border-[#f5f3f0] text-[#8B0000] hover:bg-transparent hover:text-white font-semibold py-3 px-8 rounded transition-colors mb-4"
          >
            View Catering Options
          </Link>
          <p className="text-white/80 text-sm">
            Or call us at (012) 345-6789 to order
          </p>
        </div>
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </section>

      {/* Join the Stonefire Team Section */}
      <section className="bg-white py-20 sm:py-24 relative shadow-sm">
        {/* Top decorative divider */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2c2c2c] mb-6">
            Join the Stonefire Team
          </h2>
          <p className="text-lg text-[#2c2c2c]/80 mb-8">
            We&apos;re always looking for friendly faces and hard workers to join our kitchen and service teams. If you&apos;re passionate about great food and excellent service, we&apos;d love to hear from you.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-[#f5f3f0] border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white font-semibold py-3 px-8 rounded transition-colors"
          >
            View Open Positions
          </Link>
        </div>
        {/* Bottom decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent"></div>
      </section>

      {/* Visit Us Section */}
      <section className="bg-[#f5f3f0] py-20 sm:py-24 relative">
        {/* Top decorative element */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B0000]/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Map */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <MapView />
            </div>
            {/* Right: Address and Hours */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2c2c2c] mb-6">
                Visit Us
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-lg text-[#2c2c2c] font-medium mb-2">Address</p>
                  <p className="text-[#2c2c2c]/80">
                    1234 Market Street, San Francisco, CA 94103
                  </p>
                </div>
                <div>
                  <p className="text-lg text-[#2c2c2c] font-medium mb-2">Hours</p>
                  <p className="text-[#2c2c2c]/80 mb-1">Sun-Thu: 11:00 AM - 10:00 PM</p>
                  <p className="text-[#2c2c2c]/80">Fri-Sat: 11:00 AM - 11:00 PM</p>
                </div>
                <div>
                  <p className="text-lg text-[#2c2c2c] font-medium mb-2">Contact</p>
                  <p className="text-[#2c2c2c]/80 mb-1">(012) 345-6789</p>
                  <p className="text-[#2c2c2c]/80">Test@test.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
