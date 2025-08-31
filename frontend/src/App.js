import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UsersList from "./components/UsersList";
import UploadUser from "./components/UploadUser";
import UpdateUser from "./components/UpdateUser";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/UploadUser" element={<UploadUser />} />
        <Route path="/UpdateUser/:id" element={<UpdateUser />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
