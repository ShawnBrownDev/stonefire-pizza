/**
 * Menu page displaying pizza offerings
 * Static menu with warm, appetizing descriptions
 */
export default function Menu() {
  const pizzas = [
    {
      name: "Margherita",
      description: "Classic combination of fresh mozzarella, basil, and our house-made tomato sauce",
      price: "$16",
    },
    {
      name: "Pepperoni",
      description: "Traditional pepperoni with mozzarella and our signature tomato sauce",
      price: "$18",
    },
    {
      name: "The Stonefire",
      description: "Our signature pizza with pepperoni, sausage, mushrooms, peppers, and onions",
      price: "$22",
    },
    {
      name: "White Pizza",
      description: "Creamy ricotta, mozzarella, garlic, and fresh herbs - no tomato sauce",
      price: "$19",
    },
    {
      name: "Veggie Delight",
      description: "Roasted vegetables, artichokes, olives, and mozzarella on our house sauce",
      price: "$20",
    },
    {
      name: "Meat Lovers",
      description: "Pepperoni, sausage, bacon, and ham with mozzarella and tomato sauce",
      price: "$24",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-neutral-700">
            All pizzas are 12&quot; and made fresh in our wood-fired oven
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pizzas.map((pizza) => (
            <div
              key={pizza.name}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-semibold text-neutral-900">
                  {pizza.name}
                </h3>
                <span className="text-xl font-bold text-red-600">
                  {pizza.price}
                </span>
              </div>
              <p className="text-neutral-700">{pizza.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-neutral-700 mb-4">
            All pizzas available for pickup or delivery
          </p>
          <a
            href="/order"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg inline-block"
          >
            Order Now
          </a>
        </div>
      </div>
    </div>
  );
}

