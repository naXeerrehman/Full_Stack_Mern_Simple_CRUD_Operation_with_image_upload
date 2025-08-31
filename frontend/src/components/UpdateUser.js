import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

const BACKEND_URL=process.env.BACKEND_URL

  const fetch_user_by_id = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/users/get_user/${id}`
      );
      setName(response.data.name);
      setEmail(response.data.email);
      setImages(response.data.images);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error");
    }
  };

  useEffect(() => {
    fetch_user_by_id();
  }, []);

  const handle_file_change = (e) => {
    setImages((prev) => [...prev, ...e.target.files]);
  };

  const handle_remove_image = (index) => {
    const newImage = images.filter((_, i) => i !== index);
    setImages(newImage);
  };

  const handle_update = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }
      const response = await axios.put(
        `${BACKEND_URL}/api/users/update_user/${id}`,
        formData
      );
      console.log(response.data.user);
      setMessage(response.data.message);

      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
      setLoading(false);
    } catch (error) {
      console.log(error.data);
    }
  };

  return (
    <form
      onSubmit={handle_update}
      className="flex flex-col justify-self-center mt-8 space-y-4 px-12 md:text-xl"
    >
      <h1 className="bg-yellow-400 text-center rounded-md">Update User</h1>
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
      <button className="bg-yellow-400 text-center w-fit mx-auto px-2 rounded-md">
        {" "}
        {loading ? "Uploading..." : "Click To Update"}
      </button>
      {message && <div className="text-center">{message}</div>}
    </form>
  );
};

export default UpdateUser;
