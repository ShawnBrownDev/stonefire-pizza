import Link from "next/link";

/**
 * Jobs landing page
 * Lists available positions and links to application form
 */
export default function Jobs() {
  const positions = [
    {
      title: "Pizza Chef",
      description: "Join our kitchen team and learn the art of wood-fired pizza making.",
    },
    {
      title: "Server",
      description: "Provide excellent customer service in a fast-paced environment.",
    },
    {
      title: "Delivery Driver",
      description: "Deliver delicious pizzas to our customers. Must have valid driver's license.",
    },
    {
      title: "Kitchen Assistant",
      description: "Support our kitchen operations with prep work and maintaining cleanliness.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-neutral-700">
            We&apos;re always looking for passionate people to join the Stonefire Pizza family
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {positions.map((position) => (
            <div
              key={position.title}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                {position.title}
              </h3>
              <p className="text-neutral-700 mb-4">{position.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-red-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-red-100 mb-6">
            Fill out our application form and we&apos;ll get back to you soon.
          </p>
          <Link
            href="/jobs/apply"
            className="bg-white text-red-600 hover:bg-neutral-100 font-semibold py-3 px-8 rounded-lg transition-colors text-lg inline-block"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

