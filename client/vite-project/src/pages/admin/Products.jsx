import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";
import { API_BASE } from "../../services/apiConfig.js";
function Products() {
  const [products, setProducts] = useState([]);

const [editingId, setEditingId] = useState(null);
const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    highlight: "",
    fabric: "",
    color: "",
    sareeLength: "",
    blouse: "",
    collection: "",
    priceINR: "",
    stock: "",
    image: "",
    video: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
     

const data = await adminApi.get("/products");

setProducts(data.products || []);

      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const saveProduct = async () => {
    try {
      let url =
        `${API_BASE}/admin/products`;

      let method = "POST";

      if (editingId) {
        url = `${API_BASE}/admin/products/${editingId}`;
        method = "PUT";
      }

      let data;

if (editingId) {
  data = await adminApi.put(`/products/${editingId}`, {
    ...formData,
    images: [formData.image],
    video: formData.video,
  });
} else {
  data = await adminApi.post("/products", {
    ...formData,
    images: [formData.image],
    video: formData.video,
  });
}

      if (data.success) {
        
        alert(
          editingId
            ? "Product Updated Successfully"
            : "Product Added Successfully"
        );

        setEditingId(null);
        setShowForm(false);

        setFormData({
          name: "",
          sku: "",
          description: "",
          highlight: "",
          fabric: "",
          color: "",
          sareeLength: "",
          blouse: "",
          collection: "",
          priceINR: "",
          stock: "",
          image: "",
          video: "",
        });

        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await adminApi.delete(`/products/${id}`);

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

const editProduct = (product) => {
  setShowForm(true);

  setEditingId(product._id);

  setFormData({
    name: product.name || "",
    sku: product.sku || "",
    description: product.description || "",
    highlight: product.highlight || "",
    fabric: product.fabric || "",
    color: product.color || "",
    sareeLength: product.sareeLength || "",
    blouse: product.blouse || "",
    collection: product.collection || "",
    priceINR: product.priceINR || "",
    stock: product.stock || "",
    image: product.images?.[0] || "",
    video: product.video || "",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <div style={{ padding: "30px" }}>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  }}
>
  <div>
    <h1
      style={{
        fontSize: "32px",
        marginBottom: "5px",
      }}
    >
      Products
    </h1>

    <p
      style={{
        color: "#777",
      }}
    >
      Manage your saree collection
    </p>
  </div>

  <button
    onClick={() => {
      setEditingId(null);

      setFormData({
        name: "",
        sku: "",
        description: "",
        highlight: "",
        fabric: "",
        color: "",
        sareeLength: "",
        blouse: "",
        collection: "",
        priceINR: "",
        stock: "",
        image: "",
        video: "",
      });

      setShowForm(true);
    }}
    style={{
      background: "#5b1123",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    + Add Product
  </button>
</div>

      {showForm && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        background: "#fff",
        width: "900px",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "20px",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>
          {editingId
            ? "Update Product"
            : "Add Product"}
        </h2>

        <button
          onClick={() =>
            setShowForm(false)
          }
          style={{
            border: "none",
            background: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "15px",
        }}
      >
        <input
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="SKU"
          value={formData.sku}
          onChange={(e) =>
            setFormData({
              ...formData,
              sku: e.target.value,
            })
          }
        />

        <input
          placeholder="Price INR"
          value={formData.priceINR}
          onChange={(e) =>
            setFormData({
              ...formData,
              priceINR:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock: e.target.value,
            })
          }
        />

        <input
          placeholder="Collection"
          value={
            formData.collection
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              collection:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Fabric"
          value={formData.fabric}
          onChange={(e) =>
            setFormData({
              ...formData,
              fabric: e.target.value,
            })
          }
        />

        <input
          placeholder="Color"
          value={formData.color}
          onChange={(e) =>
            setFormData({
              ...formData,
              color: e.target.value,
            })
          }
        />

        <input
          placeholder="Blouse"
          value={formData.blouse}
          onChange={(e) =>
            setFormData({
              ...formData,
              blouse: e.target.value,
            })
          }
        />

        <input
          placeholder="Saree Length"
          value={
            formData.sareeLength
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              sareeLength:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Highlight"
          value={
            formData.highlight
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              highlight:
                e.target.value,
            })
          }
        />
      </div>

      <textarea
        placeholder="Description"
        value={
          formData.description
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            description:
              e.target.value,
          })
        }
        style={{
          width: "100%",
          marginTop: "15px",
          minHeight: "120px",
        }}
      />

      <input
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) =>
          setFormData({
            ...formData,
            image: e.target.value,
          })
        }
        style={{
          width: "100%",
          marginTop: "15px",
        }}
      />

      {formData.image && (
        <img
          src={formData.image}
          alt="preview"
          style={{
            width: "150px",
            marginTop: "15px",
            borderRadius: "10px",
          }}
        />
      )}

      <input
        placeholder="Video URL"
        value={formData.video}
        onChange={(e) =>
          setFormData({
            ...formData,
            video: e.target.value,
          })
        }
        style={{
          width: "100%",
          marginTop: "15px",
        }}
      />

      {formData.video && (
        <video
          src={formData.video}
          controls
          width="250"
          style={{
            marginTop: "15px",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() =>
            setShowForm(false)
          }
        >
          Cancel
        </button>

        <button
          onClick={saveProduct}
          style={{
            background: "#5b1123",
            color: "#fff",
            border: "none",
            padding:
              "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {editingId
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </div>
  </div>
)}

      <h3>
        Total Products: {products.length}
      </h3>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={
                    product.images?.[0]
                  }
                  alt={product.name}
                  width="60"
                />
              </td>

              <td>{product.name}</td>

              <td>{product.sku}</td>

              <td>
                ₹{product.priceINR}
              </td>

              <td>{product.stock}</td>

              <td>
                <button
                  onClick={() =>
                    editProduct(
                      product
                    )
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      product._id
                    )
                  }
                  style={{
                    marginLeft:
                      "10px",
                    color: "red",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;