import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

const UsersList = () => {
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL =process.env.REACT_APP_BACKEND_URL

  const fetch_users = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users`);
      setUser(response.data);
    } catch (error) {
      console.log("Error Fetching Users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch_users();
  }, []);

  const handle_delete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/users/delete_user/${id}`
      );
      setMessage(response.data.message);
      fetch_users();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center px-2 mt-16 lg:px-[300px] lg:mt-8">
      <h1 className="text-2xl font-bold mt-2 flex justify-center bg-yellow-400 text-black rounded-md">
        User List
      </h1>
      <div className="flex flex-col">
        <div className="flex justify-between border-2 border-yellow-400 px-2 my-1 font-bold rounded-md">
          <h1>S/No</h1>
          <h1 className="relative right-8 md:right-12">Name</h1>
          <h1>Email</h1>
          <h1>Image</h1>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : user.length === 0 ? (
          <div className="text-center my-2">
            No user found<br></br>Click below button to Upload
          </div>
        ) : (
          <div className="overflow-x-auto">
            {user.map((user, index) => (
              <div
                key={user._id}
                className="flex flex-col flex-wrap my-1 border border-yellow-400 rounded-md py-1 text-sm md:text-2xl lg:text-lg min-w-max"
              >
                <div className="flex justify-between w-full items-center px-2 h-6 space-x-1">
                  <div>{index + 1}</div>
                  <div className="relative lg:left-8 whitespace-nowrap">
                    {user.name}
                  </div>
                  <div>{user.email}</div>
                  <div className="w-10 md:w-14 mt-6">
                    <img src={user.images} alt="" />
                  </div>
                </div>
                <div className="flex justify-center items-center space-x-3 whitespace-nowrap">
                  <NavLink
                    to={`UpdateUser/${user._id}`}
                    className="bg-yellow-400 px-1 rounded-md"
                  >
                    Edit User
                  </NavLink>
                  <button
                    onClick={() => handle_delete(user._id)}
                    className="bg-red-500 px-1 rounded-md"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && <div className="text-center">{message}</div>}
      </div>

      <Link
        to={`/UploadUser`}
        className="bg-yellow-400 rounded-md text-center w-fit px-2 mx-auto"
      >
        Upload User
      </Link>
    </div>
  );
};

export default UsersList;
