"use client";

import { useState, FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";


type SizeStock = {
  size: string;
  qty: number;
};

export default function AddProductPage() {

  // basic
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [description, setDescription] = useState("");

  // size stock
  const [sizeStock, setSizeStock] = useState<SizeStock[]>([
    { size: "", qty: 0 },
  ]);

  // highlights
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [fabric, setFabric] = useState("");
  const [fit, setFit] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [neck, setNeck] = useState("");

  // multiple images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  // ✅ ADD images (append)
  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);

    if (imageFiles.length + newFiles.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }

    const updatedFiles = [...imageFiles, ...newFiles];
    setImageFiles(updatedFiles);

    const newPreviews = newFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // ❌ remove image
  const removeImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setImageFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  // 🚀 upload images (parallel)
  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    const uploads = imageFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tshirt_store");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbu2lrq13/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    });

    return await Promise.all(uploads);
  };

  // size handlers
  const handleSizeChange = (
    index: number,
    field: keyof SizeStock,
    value: string
  ) => {
    const updated = [...sizeStock];
    if (field === "qty") {
      updated[index].qty = Number(value);
    } else {
      updated[index].size = value;
    }
    setSizeStock(updated);
  };

  const addSizeRow = () => {
    setSizeStock([...sizeStock, { size: "", qty: 0 }]);
  };

  const removeSizeRow = (index: number) => {
    const updated = sizeStock.filter((_, i) => i !== index);
    setSizeStock(updated);
  };

  // submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      await addDoc(collection(db, "products"), {
        name,
        price,
        mrp,
        description,
        images: imageUrls,

        sizeStock: sizeStock.filter(
          (item) => item.size && item.qty > 0
        ),

        highlights: {
          Color: color,
          Pattern: pattern,
          Fabric: fabric,
          Fit: fit,
          Sleeve: sleeve,
          Neck: neck,
        },

        createdAt: new Date(),
      });

      toast.success("Product added");

      // reset
      setName("");
      setPrice("");
      setMrp("");
      setDescription("");
      setSizeStock([{ size: "", qty: 0 }]);
      setColor("");
      setPattern("");
      setFabric("");
      setFit("");
      setSleeve("");
      setNeck("");
      setImageFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      toast.error("❌ Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-xl space-y-4"
      >
        {/* BASIC */}
        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Price"
          className="w-full border p-3 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="MRP"
          className="w-full border p-3 rounded"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
        />

        {/* SIZE */}
        <h2 className="font-semibold text-lg">Sizes & Quantity</h2>

        {sizeStock.map((item, index) => (
          <div key={index} className="flex gap-2">
            <select
              className="border p-3 rounded w-1/2"
              value={item.size}
              onChange={(e) =>
                handleSizeChange(index, "size", e.target.value)
              }
            >
              <option value="">Size</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>

            <input
              type="text"
              placeholder="Qty"
              className="border p-3 rounded w-1/2"
              value={item.qty}
              onChange={(e) =>
                handleSizeChange(index, "qty", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => removeSizeRow(index)}
              className="bg-red-500 text-white px-3 rounded"
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSizeRow}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          + Add Size
        </button>

        {/* HIGHLIGHTS */}
        <h2 className="font-semibold text-lg">Key Highlights</h2>

        <select className="w-full border p-3 rounded" value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">Color</option>
          <option>Yellow</option>
          <option>Black</option>
          <option>White</option>
        </select>

        <select className="w-full border p-3 rounded" value={pattern} onChange={(e) => setPattern(e.target.value)}>
          <option value="">Pattern</option>
          <option>Solid</option>
          <option>Printed</option>
        </select>

        <select className="w-full border p-3 rounded" value={fabric} onChange={(e) => setFabric(e.target.value)}>
          <option value="">Fabric</option>
          <option>Pure Cotton</option>
          <option>Polyester</option>
        </select>

        <select className="w-full border p-3 rounded" value={fit} onChange={(e) => setFit(e.target.value)}>
          <option value="">Fit</option>
          <option>Slim Fit</option>
          <option>Regular Fit</option>
        </select>

        <select className="w-full border p-3 rounded" value={sleeve} onChange={(e) => setSleeve(e.target.value)}>
          <option value="">Sleeve</option>
          <option>Half Sleeve</option>
          <option>Full Sleeve</option>
        </select>

        <select className="w-full border p-3 rounded" value={neck} onChange={(e) => setNeck(e.target.value)}>
          <option value="">Neck</option>
          <option>Polo Neck</option>
          <option>Round Neck</option>
        </select>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* IMAGES */}
        <div>
          <label className="font-medium">Upload Images (Max 5)</label>

          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full border p-3 rounded mt-2"
            onChange={(e) => handleImageChange(e.target.files)}
          />

          <div className="flex gap-3 mt-4 flex-wrap">
            {previews.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}