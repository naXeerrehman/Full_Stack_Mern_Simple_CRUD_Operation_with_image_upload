import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle_file_change = (e) => {
    setImages((prev) => [...prev, ...e.target.files]);
  };

  const handle_remove_image = (index) => {
    const newImage = images.filter((_, i) => i !== index);
    setImages(newImage);
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsError(false);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      if (images && images.length > 0) {
        images.forEach((img) => formData.append("images", img));
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/create_user",
        formData
      );

      setMessage(response.data.message);
      setIsError(false);

      console.log(response.data.message);

      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Something went wrong!";
      setMessage(errorMsg);
      setIsError(true);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handle_submit}
      className="flex flex-col justify-self-center mt-8 space-y-4 px-12 md:text-xl"
    >
      <h1 className="bg-yellow-400 text-center rounded-md">Upload User</h1>

      <div className="flex flex-col">
        <label>Name:</label>
        <input
          className="border-2 border-yellow-400 rounded-md px-1 outline-yellow-400"
          placeholder="Name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex flex-col">
        <label>Email:</label>
        <input
          className="border-2 border-yellow-400 rounded-md px-1 outline-yellow-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <div className="flex flex-col">
        <label>Image:</label>
        <input
          type="file"
          className="border-2 border-yellow-400 rounded-md px-1 outline-yellow-400 p-0.5"
          multiple
          onChange={handle_file_change}
        />
        <div>
          {images.length > 0 && (
            <div className="mt-1 flex gap-2 flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative w-20">
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    onClick={() => handle_remove_image(index)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="bg-yellow-400 text-center w-fit mx-auto px-2 rounded-md">
        {loading ? "Uploading..." : "Click To Upload"}
      </button>

      {/* ✅ Message Display */}
      {message && (
        <div
          className={`text-center mt-2 ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default UploadUser;
