export function Map() {
  return (
    <section
      className="bg-cover bg-no-repeat bg-center h-[700px] flex items-center mt-32 mb-12"
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
        {/* Image row */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
          <img
            src="src/assets/apositive.png"
            alt="Blood Type A"
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
