export default function ReturnRefundPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Return, Refund & Exchange Policy
      </h1>

      <div className="space-y-10 text-gray-700 leading-8">

        {/* Return & Refund */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Return & Refund Policy
          </h2>

          <p className="mb-4">
            Thank you for shopping with <span className="font-semibold">Goat Nation</span>.
            We strive to deliver premium quality streetwear, but we understand
            that sometimes things don’t go as planned.
          </p>

          <div className="space-y-6">

            <div>
              <h3 className="text-xl font-semibold mb-2">
                1. Eligibility Window
              </h3>
              <p>
                You have <span className="font-semibold">7 calendar days</span> from the
                date of delivery to initiate a return or refund request.
                After this 7-day window, requests cannot be accepted.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                2. Mandatory Unboxing Video
              </h3>

              <p className="mb-2">
                To maintain transparency and quality assurance,
                an unboxing video is mandatory.
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>The video must be continuous without cuts or edits.</li>
                <li>
                  It should clearly show the package being opened for the first time.
                </li>
                <li>
                  The condition of the product inside must be visible.
                </li>
                <li>
                  Requests without a valid unboxing video will not be processed.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                3. Conditions for Return
              </h3>

              <p className="mb-2">
                To qualify for a return, the product must be:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Unworn and unwashed.</li>
                <li>In original condition.</li>
                <li>
                  Returned with original packaging, tags, and labels intact.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                4. How to Initiate a Request
              </h3>

              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Contact our support team via email, WhatsApp, or website portal.
                </li>
                <li>
                  Share your order number and upload the unboxing video.
                </li>
                <li>
                  Our team will inspect and verify your request.
                </li>
                <li>
                  If approved, return shipping instructions will be shared.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                5. Refunds
              </h3>

              <p className="mb-3">
                Once your returned product is received and inspected,
                we will notify you regarding approval or rejection.
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Approved refunds will be issued to your original payment method
                  or as store credit based on your preference.
                </li>
                <li>
                  Refunds generally reflect within 5–7 business days.
                </li>
                <li>
                  Return shipping costs are the responsibility of the customer
                  unless the product was damaged or defective.
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Exchange Policy */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Exchange Policy
          </h2>

          <p className="mb-4">
            At <span className="font-semibold">Goat Nation</span>,
            we want you to get the perfect fit and style.
          </p>

          <div className="space-y-6">

            <div>
              <h3 className="text-xl font-semibold mb-2">
                1. Exchange Period
              </h3>

              <p>
                Exchange requests can be made within
                <span className="font-semibold"> 7 calendar days </span>
                from delivery.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                2. Mandatory Unboxing Video
              </h3>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A clear unedited unboxing video is mandatory.
                </li>
                <li>
                  The video must show the sealed package being opened.
                </li>
                <li>
                  It helps verify the original condition of the item.
                </li>
                <li>
                  Requests without valid proof cannot be processed.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                3. Exchange Criteria
              </h3>

              <p className="mb-2">
                The item must:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Be unused, unworn, and unwashed.</li>
                <li>Include original tags and packaging.</li>
                <li>
                  Be exchanged only for a different size or color
                  of the same style, subject to availability.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                4. How to Request an Exchange
              </h3>

              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Contact support with your order ID and preferred size/color.
                </li>
                <li>
                  Upload your unboxing video.
                </li>
                <li>
                  Once verified, our team will provide the return address.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                5. Processing Your Exchange
              </h3>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Returned items go through a quality inspection.
                </li>
                <li>
                  Approved exchanges are dispatched within 3–5 business days.
                </li>
                <li>
                  If the requested size or color is unavailable,
                  store credit or alternative exchange options will be provided.
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-xl p-5">
              <h3 className="text-lg font-bold mb-2">
                Please Note
              </h3>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A nominal shipping fee may apply for exchanged items.
                </li>
                <li>
                  No shipping fee is charged if the wrong product was sent by us.
                </li>
                <li>
                  Each order is eligible for one-time exchange only.
                </li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}