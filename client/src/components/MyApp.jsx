import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import PageNotFound from './PageNotFound';
import { useNavigate } from "react-router-dom";

function MyApp() {
          const navigate = useNavigate(); // <-- initialize navigate

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login onSuccess={() => navigate('/home')}/>} />
      <Route path="/register" element={<Register onSuccess={() => navigate('/home')}/>} />
      {/* <Route path={`/user/:id/home`} element={<Home/>} />
          <Route path={`/user/${id}/todos`} element={<Todos />} />
          <Route path={`/user/${id}/posts`} element={<Posts />} />
          <Route path={`/user/${id}/albums`} element={<Albums />} />
          <Route path={`/user/${id}/post/:postId/comments`} element={<ViewComments />} />
          <Route path={`/user/${id}/album/:albumId/photos`} element={<ViewPhotos/>} /> */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default MyApp;
