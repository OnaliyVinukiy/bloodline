export function Map() {
  const bloodTypes = [
    {
      src: "src/assets/apositive.png",
      alt: "Blood Type A+",
      text: "When the stock is over 10 days, A+ is needed less. When the stock for A+ is below 8 days, A+ is especially important.",
    },
    {
      src: "src/assets/anegative.png",
      alt: "Blood Type A-",
      text: "When the stock is over 10 days, A- is needed less. When the stock for A- is below 8 days, A- is especially important.",
    },
    {
      src: "src/assets/bpositive.png",
      alt: "Blood Type B+",
      text: "When the stock is over 10 days, B+ is needed less. When the stock for B+ is below 8 days, B+ is especially important.",
    },
    {
      src: "src/assets/bnegative.png",
      alt: "Blood Type B-",
      text: "When the stock is over 10 days, B- is needed less. When the stock for B- is below 8 days, B- is especially important.",
    },
    {
      src: "src/assets/opositive.png",
      alt: "Blood Type O+",
      text: "When the stock is over 10 days, O+ is needed less. When the stock for O+ is below 8 days, O+ is especially important.",
    },
    {
      src: "src/assets/onegative.png",
      alt: "Blood Type O-",
      text: "When the stock is over 10 days, O- is needed less. When the stock for O- is below 8 days, O- is especially important.",
    },
    {
      src: "src/assets/abpositive.png",
      alt: "Blood Type AB+",
      text: "When the stock is over 10 days, AB+ is needed less. When the stock for AB+ is below 8 days, AB+ is especially needed.",
    },
    {
      src: "src/assets/abnegative.png",
      alt: "Blood Type AB-",
      text: "When the stock is over 10 days, O- is needed less. When the stock for O- is below 8 days, O- is especially important.",
    },
  ];

  return (
    <section
      className="bg-cover bg-no-repeat bg-center h-[700px] flex items-center mt-28 mb-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('src/assets/bloodinventory.jpg')`,
      }}
    >
      <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
          National Blood Inventory
        </h1>

        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
          The National Blood Transfusion Service manages the blood supply to all
          provinces of Sri Lanka.
          <br />
          Below is a summary of the current stock levels of all blood types.
        </p>

        <div className="flex justify-center gap-8 flex-wrap mt-8">
          {bloodTypes.map((blood, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center relative"
            >
              <img
                src={blood.src}
                alt={blood.alt}
                className="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute bottom-[-6rem] w-64 bg-black text-white text-xs sm:text-sm px-3 py-2 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {blood.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-red-800 rounded-lg shadow-md hover:bg-red-700 focus:ring-4 focus:ring-red-300"
          >
            Find a Donation Centre
          </a>
        </div>
      </div>
    </section>
  );
}
