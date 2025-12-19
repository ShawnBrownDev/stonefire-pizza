/**
 * Contact page with restaurant information
 * Simple, clean contact information display
 */
export default function Contact() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-neutral-700">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Location
            </h2>
            <p className="text-neutral-700 mb-2">
              123 Main Street
            </p>
            <p className="text-neutral-700 mb-2">
              Your City, ST 12345
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Hours
            </h2>
            <p className="text-neutral-700 mb-2">
              Monday - Thursday: 11am - 10pm
            </p>
            <p className="text-neutral-700 mb-2">
              Friday - Saturday: 11am - 11pm
            </p>
            <p className="text-neutral-700">
              Sunday: 12pm - 9pm
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Get in Touch
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
              <a
                href="tel:+1234567890"
                className="text-red-600 hover:text-red-700"
              >
                (123) 456-7890
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
              <a
                href="mailto:info@stonefirepizza.com"
                className="text-red-600 hover:text-red-700"
              >
                info@stonefirepizza.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Catering</h3>
              <a
                href="/catering"
                className="text-red-600 hover:text-red-700"
              >
                Request catering online →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

