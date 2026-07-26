// import { useEffect, useState } from "react";
// import homepageApi from "../../services/homepageApi";

// function Homepage() {
//   const [form, setForm] = useState({
//     title: "",
//     subtitle: "",
//     videoUrl: "",
//     buttonText: "",
//     buttonLink: "",
//     active: true,
//   });

//   useEffect(() => {
//     loadHomepage();
//   }, []);

//   const loadHomepage = async () => {
//     const data = await homepageApi.getHomepage();

//     if (data) {
//       setForm({
//         title: data.title || "",
//         subtitle: data.subtitle || "",
//         videoUrl: data.videoUrl || "",
//         buttonText: data.buttonText || "",
//         buttonLink: data.buttonLink || "",
//         active: data.active ?? true,
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const save = async () => {
//     await homepageApi.updateHomepage(form);

//     alert("Homepage updated successfully!");
//   };

//   return (
//     <div className="p-8 max-w-4xl">

//       <h1 className="text-3xl font-bold mb-8">
//         Homepage Hero Section
//       </h1>

//       <div className="bg-white shadow rounded-2xl p-8 space-y-6">

//         <div>
//           <label className="font-semibold block mb-2">
//             Title
//           </label>

//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className="border rounded-lg w-full p-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold block mb-2">
//             Subtitle
//           </label>

//           <textarea
//             rows={4}
//             name="subtitle"
//             value={form.subtitle}
//             onChange={handleChange}
//             className="border rounded-lg w-full p-3"
//           />
//         </div>

//         <div>
//           <label className="font-semibold block mb-2">
//             Video URL
//           </label>

//           <input
//             name="videoUrl"
//             value={form.videoUrl}
//             onChange={handleChange}
//             className="border rounded-lg w-full p-3"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-5">

//           <div>
//             <label className="font-semibold block mb-2">
//               Button Text
//             </label>

//             <input
//               name="buttonText"
//               value={form.buttonText}
//               onChange={handleChange}
//               className="border rounded-lg w-full p-3"
//             />
//           </div>

//           <div>
//             <label className="font-semibold block mb-2">
//               Button Link
//             </label>

//             <input
//               name="buttonLink"
//               value={form.buttonLink}
//               onChange={handleChange}
//               className="border rounded-lg w-full p-3"
//             />
//           </div>

//         </div>

//         <label className="flex items-center gap-3">

//           <input
//             type="checkbox"
//             name="active"
//             checked={form.active}
//             onChange={handleChange}
//           />

//           Active Homepage Section

//         </label>

//         <button
//           onClick={save}
//           className="bg-[#6D1830] text-white px-8 py-3 rounded-xl hover:bg-[#581426]"
//         >
//           Save Changes
//         </button>

//       </div>

//     </div>
//   );
// }

// export default Homepage; 

function Homepage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-600">
        Homepage is working
      </h1>

      <p className="mt-4">
        If you can see this, the routing is correct.
      </p>
    </div>
  );
}

export default Homepage;