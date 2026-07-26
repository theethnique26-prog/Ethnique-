import { User, Mail, MapPin, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/apiConfig.js";

const Profile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] =
  useState([]);

const [showAddressModal,
  setShowAddressModal] =
  useState(false);

const [addressForm,
  setAddressForm] =
  useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

const addAddress = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `${API_BASE}/address`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: token,
        },

        body: JSON.stringify(
  addressForm
),
      }
    );

    const data = await res.json();

console.log(
  "ADDRESS SAVE RESPONSE:",
  data
);

if (!res.ok) {
  throw new Error(
    data.message ||
      "Failed to save address"
  );
}

await fetchAddresses();

alert(
  "Address Added Successfully"
);

setShowAddressModal(false);

setAddressForm({
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
});

  } catch (err) {
    console.log(err);
  }
};

  
  const [editing, setEditing] =
     useState(false);

  const [newName, setNewName] =
    useState(user?.name || "");  

    const updateProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const res = await fetch(
      `${API_BASE}/profile/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: newName,
        }),
      }
    );

    const data = await res.json();

    console.log("RESPONSE:", data);

    if (!res.ok) {
      throw new Error(
        data.message || "Update failed"
      );
    }

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    window.location.reload();

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    alert(err.message);
  }
};

useEffect(() => {
  fetchAddresses();
}, []);


const fetchAddresses =
  async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          `${API_BASE}/address`,
          {
            headers: {
              Authorization:
                token,
            },
          }
        );

      const data =
        await res.json();

      console.log(
        "FETCHED ADDRESSES:",
        data
      );

      setAddresses(data.addresses || []);

      return data;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen bg-[#F8F5F2] py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-[#ECE6DE]">

          <div className="flex items-center gap-6">

            <div
              className="
                w-24
                h-24
                rounded-full
                bg-[#6D1830]
                text-white
                flex
                items-center
                justify-center
                text-3xl
                font-semibold
              "
            >
              {user?.name?.charAt(0)}
            </div>

            <div>

              <h1 className="text-3xl font-serif text-[#6D1830]">
                {user?.name}
              </h1>

              <p className="text-gray-500 mt-1">
                {user?.email}
              </p>

              <button
                onClick={() =>
                setEditing(true)
                }
                className="
                  mt-4
                  px-5
                  py-2
                  rounded-xl
                  bg-[#6D1830]
                  text-white
                  hover:bg-[#571225]
                  transition
                "
              >
                Edit Profile
              </button>



            </div>

          </div>

        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <Gift
              size={28}
              className="text-[#6D1830]"
            />

            <h3 className="font-semibold mt-3">
              Loyalty Points
            </h3>

            <p className="text-3xl mt-2 text-[#6D1830]">
              0
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <MapPin
              size={28}
              className="text-[#6D1830]"
            />

            <p className="text-3xl mt-2 text-[#6D1830]">
  {addresses.length}
</p>

<p className="text-gray-500 mt-2">
  Saved Addresses
</p>

            <button
  onClick={() =>
    setShowAddressModal(true)
  }
  className="
    mt-3
    bg-[#6D1830]
    text-white
    px-4
    py-2
    rounded-xl
  "
>
  Add Address
</button>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <User
              size={28}
              className="text-[#6D1830]"
            />

            <h3 className="font-semibold mt-3">
              Orders
            </h3>

            <p className="text-gray-500 mt-2">
              No orders yet
            </p>

          </div>

        </div>

        {/* Order History */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mt-8">

          <h2 className="text-2xl font-serif text-[#6D1830] mb-4">
            Order History
          </h2>

          <p className="text-gray-500">
            You haven't placed any orders yet.
          </p>

          

        </div>

        <div
  className="
  bg-white
  rounded-3xl
  shadow-sm
  p-8
  mt-8
"
>
  <h2
    className="
    text-2xl
    font-serif
    text-[#6D1830]
    mb-6
  "
  >
    My Addresses
  </h2>

  {addresses.length === 0 ? (
    <p>No addresses saved.</p>
  ) : (
    addresses.map((addr, index) => (
      <div
        key={index}
        className="
        border
        rounded-xl
        p-4
        mb-4
      "
      >
        <p>{addr.fullName}</p>

        <p>{addr.phone}</p>

        <p>
          {addr.addressLine1}
        </p>

        <p>
          {addr.city},
          {addr.state}
        </p>

        <p>{addr.pincode}</p>
      </div>
    ))
  )}
</div>

          </div>

      {/* EDIT PROFILE MODAL */}
      {editing && (
        <div
          className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
        "
        >
          <div
            className="
            bg-white
            p-6
            rounded-2xl
            w-96
          "
          >
            <h2 className="text-xl mb-4">
              Edit Profile
            </h2>

            <input
              value={newName}
              onChange={(e) =>
                setNewName(
                  e.target.value
                )
              }
              className="
                w-full
                border
                p-3
                rounded-xl
              "
            />

            <div className="flex gap-3 mt-4">

              <button
                onClick={() =>
                  setEditing(false)
                }
              >
                Cancel
              </button>

              <button
                onClick={updateProfile}
                className="
                  bg-[#6D1830]
                  text-white
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

      {showAddressModal && (
  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      className="
        bg-white
        p-6
        rounded-2xl
        w-[500px]
      "
    >
      <h2 className="text-xl mb-4">
        Add Address
      </h2>

      <input
        placeholder="Full Name"
        value={addressForm.fullName}
        onChange={(e) =>
          setAddressForm({
            ...addressForm,
            fullName: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        placeholder="Phone"
        value={addressForm.phone}
        onChange={(e) =>
          setAddressForm({
            ...addressForm,
            phone: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        placeholder="Address Line"
        value={addressForm.addressLine1}
        onChange={(e) =>
          setAddressForm({
            ...addressForm,
            addressLine1: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        placeholder="City"
        value={addressForm.city}
        onChange={(e) =>
          setAddressForm({
            ...addressForm,
            city: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        placeholder="State"
        value={addressForm.state}
        onChange={(e) =>
          setAddressForm({
            ...addressForm,
            state: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        placeholder="Pincode"
        value={addressForm.pincode}
        onChange={(e) =>
          setAddressForm({
            ...addressForm,
            pincode: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <div className="flex gap-3">
        <button
          onClick={() =>
            setShowAddressModal(false)
          }
          className="border px-4 py-2 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={addAddress}
          className="
            bg-[#6D1830]
            text-white
            px-4
            py-2
            rounded-xl
          "
        >
          Save Address
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Profile;