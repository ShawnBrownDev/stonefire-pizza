"use client";

/**
 * Order page with external links to Toast ordering system
 * Two buttons: Order Pickup and Order Delivery
 * Opens external URLs in new tabs
 */
export default function Order() {
  // TODO: Replace these placeholder URLs with actual Toast ordering URLs
  const PICKUP_URL = "https://order.toasttab.com/online/locations/1cbcd884-f8e3-4dae-8444-eeebc58ac1ae/78b41ce8-0bda-4a15-8735-f1c4f8a5606d";
  const DELIVERY_URL = "https://order.toasttab.com/stonefire-pizza/delivery";

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Order Online
          </h1>
          <p className="text-xl text-neutral-700">
            Choose pickup or delivery to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Pickup Button */}
          <a
            href={PICKUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-center group"
          >
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Order Pickup
            </h2>
            <p className="text-neutral-700 mb-6">
              Order ahead and pick up at our location
            </p>
            <div className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg group-hover:bg-red-700 transition-colors">
              Order Now →
            </div>
          </a>

          {/* Delivery Button */}
          <a
            href={DELIVERY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-center group"
          >
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Order Delivery
            </h2>
            <p className="text-neutral-700 mb-6">
              Get your pizza delivered to your door
            </p>
            <div className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg group-hover:bg-red-700 transition-colors">
              Order Now →
            </div>
          </a>
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-700">
            Orders are processed through our secure ordering partner
          </p>
        </div>
      </div>
    </div>
  );
}

