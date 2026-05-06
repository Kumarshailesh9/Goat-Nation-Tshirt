"use client";

export default function AboutSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-20">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to <span className="text-black">Goat Nation</span>
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed">
          Where premium style meets the grit of the streets.
          We don’t follow trends — we create impact.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* LEFT */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">
            Our Philosophy
          </h3>

          <p className="text-gray-600 leading-relaxed">
            They say, “The first impression is always the last impression.”
            At Goat Nation, we take that personally.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Every time you wear our fabric, it’s a first impression.
            Every stitch, every seam, every delivery — executed
            with the same intensity as day one.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Whether it’s your first purchase or your tenth fit,
            we deliver that same premium experience every time.
          </p>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">
            High Quality. No Compromises.
          </h3>

          <ul className="space-y-4 text-gray-600">

            <li className="flex gap-3">
              <span className="text-black font-bold">•</span>
              Premium Fabrics — heavy-duty, durable, and comfortable
            </li>
            <li className="flex gap-3">
              <span className="text-black font-bold">•</span>
              Minimalist Edge — clean, urban luxe designs
            </li>
            <li className="flex gap-3">
              <span className="text-black font-bold">•</span>
              Accessible Luxury — no unnecessary markups
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}