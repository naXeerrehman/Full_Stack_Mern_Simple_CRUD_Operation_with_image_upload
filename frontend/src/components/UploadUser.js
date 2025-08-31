import React, { useState } from "react";
import axios from "axios";

const UploadUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const handle_remove_image = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handle_file_change = (e) => {
    setImages([...e.target.files]);
  };

  const hanle_upload_user = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await axios.post(
        `http://localhost:5000/api/users/create_user`,
        formData
      );

      console.log(response.data);
      setMessage(response.data.message);

      setTimeout(() => {
        setMessage("");
      }, 2000);
      setLoading(false);
    } catch (error) {
      console.error(error?.data?.message);
    }
  };

  return (
    <form
      onSubmit={hanle_upload_user}
      className="flex flex-col justify-center px-2 mt-16 md:px-32 md:text-xl lg:px-[420px] lg:mt-8"
    >
      <h1 className="bg-yellow-400 text-center rounded-md">Upload User</h1>
      <div className="flex flex-col">
        <label>Name:</label>
        <input
          className="border-2 border-yellow-400 rounded-md px-1 outline-yellow-400"
          placeholder="Name"
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
          required
          multiple
          onChange={handle_file_change}
          alt=""
        />
        <div>
          {images.length > 0 && (
            <div className="mt-1">
              {images.map((image, index) => (
                <div className="relative w-20">
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt=""
                    className="w-20 rounded-md"
                  />
                  <button
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
      <button className="bg-yellow-400 text-center w-fit mx-auto px-2 rounded-md mt-2">
        {loading ? "Uploading..." : "Click To Upload"}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default UploadUser;
