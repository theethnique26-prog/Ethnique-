function OrderDetailsModal({
  order,
  onClose,
}) {
  if (!order) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        z-50
        flex
        justify-center
        items-center
        p-6
      "
      onClick={onClose}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          p-8
        "
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Order Details
            </h2>

            <p className="text-gray-500">
              #{order._id.slice(-8)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              text-2xl
              hover:text-red-600
            "
          >
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <h3 className="font-bold text-lg mb-4">
              Customer
            </h3>

            <div className="space-y-2">

              <p>
                <strong>Name:</strong>{" "}
                {order.customer?.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.customer?.email}
              </p>

            </div>

          </div>

          <div>

            <h3 className="font-bold text-lg mb-4">
              Shipping Address
            </h3>

            {order.shippingAddress ? (
              <div className="space-y-1">

                <p>
                  {
                    order.shippingAddress
                      .fullName
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .phone
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .addressLine1
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .addressLine2
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .state
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .country
                  }
                </p>

              </div>
            ) : (
              <p>No address available.</p>
            )}

          </div>

        </div>

        <div className="mt-10">

          <h3 className="font-bold text-xl mb-5">
            Ordered Products
          </h3>

          <div className="space-y-4">

            {order.items?.map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-4
                    border
                    rounded-xl
                    p-4
                  "
                >
                  <img
                    src={
                      item.image ||
                      item.product?.images?.[0]
                    }
                    alt={item.name}
                    className="
                      w-20
                      h-20
                      object-cover
                      rounded-lg
                    "
                  />

                  <div className="flex-1">

                    <h4 className="font-semibold">
                      {item.name}
                    </h4>

                    <p className="text-gray-500">
                      Qty :{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <div className="font-bold">
                    ₹{item.price}
                  </div>

                </div>
              )
            )}

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div>

            <h3 className="font-bold text-lg mb-3">
              Payment
            </h3>

            <p>
              Method :{" "}
              {order.paymentMethod}
            </p>

            <p>
              Status :{" "}
              {order.paymentStatus}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-lg mb-3">
              Total
            </h3>

            <p>
              Subtotal :
              ₹{order.subtotal}
            </p>

            <p>
              Shipping :
              ₹
              {order.shippingCharge}
            </p>

            <p>
              Discount :
              ₹{order.discount}
            </p>

            <h2 className="text-2xl font-bold mt-4">
              ₹
              {order.totalAmount}
            </h2>

          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderDetailsModal;