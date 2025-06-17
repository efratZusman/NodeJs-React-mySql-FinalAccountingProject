import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import PageNotFound from './PageNotFound';
import Updates from './Updates';
import Clients from './Clients';
import Newsletters from './Newsletters';
import Contact from './Contact';
import InformationList from './InformationList';
import About from './About';

function MyApp() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/newsletters" element={<Newsletters />} />
      <Route path="/articles" element={<InformationList />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default MyApp;
