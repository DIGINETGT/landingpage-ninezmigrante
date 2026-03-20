// REACT
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// PAGES
const HomePage = lazy(() => import('../../pages/home'));
const TransitPage = lazy(() => import('../../pages/transit'));
const BordersPage = lazy(() => import('../../pages/borders'));
const CountryPage = lazy(() => import('../../pages/country'));
const ComparePage = lazy(() => import('../../pages/compare'));
const ContactPage = lazy(() => import('../../pages/contact'));
const ObservatoryPage = lazy(() => import('../../pages/observatory'));
const CustomizePage = lazy(() => import('../../pages/customize'));
const OrganizationsPage = lazy(() => import('../../pages/organizations'));
const DocumentationPage = lazy(() => import('../../pages/documentation'));
const BordersDataByCountry = lazy(() => import('../../pages/bordersDataByCountry'));
const CustomizeDataByCountry = lazy(() => import('../../pages/customizeDataByCountry'));
const DocumentationByCountry = lazy(() => import('../../pages/documentationByCountry'));
const TransitDataByCountry = lazy(() => import('../../pages/transitDataByCountry'));

const RouterProvider = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/observatory" element={<ObservatoryPage />} />
    <Route path="/compare" element={<ComparePage />} />
    <Route path="/country/:countryID" element={<CountryPage />} />
    <Route path="/customize" element={<CustomizePage />} />
    <Route path="/customize/:countryID" element={<CustomizeDataByCountry />} />
    <Route path="/borders/" element={<BordersPage />} />
    <Route path="/transit/" element={<TransitPage />} />
    <Route path="/transit/:countryID" element={<TransitDataByCountry />} />
    <Route path="/borders/:countryID" element={<BordersDataByCountry />} />
    <Route path="/organizations" element={<OrganizationsPage />} />
    <Route path="/documentation" element={<DocumentationPage />} />
    <Route
      path="/documentation/:countryID"
      element={<DocumentationByCountry />}
    />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
);

export default RouterProvider;
