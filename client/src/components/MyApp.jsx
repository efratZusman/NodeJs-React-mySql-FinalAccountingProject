import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import PageNotFound from './PageNotFound';
import Updates from './Updates';

function MyApp() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login  />} />
      <Route path="/register" element={<Register />} />
         <Route path="/updates" element={<Updates />} />
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
