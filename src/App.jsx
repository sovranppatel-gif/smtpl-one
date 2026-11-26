import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/Landingpage/CommunityConnectLanding.jsx";
import { AuthProvider } from "./context/auth.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import NavigationWrapper from "./components/NavigationWrapper.jsx";

const BuildingCreativityLanding = lazy(
  () => import("./components/community/BuildingCreativityLanding.jsx"),
);
const CommunityJoinFormPage = lazy(
  () => import("./components/community/CommunityJoinFormPage.jsx"),
);

// Master Admin Components (lazy-loaded so '/' stays fast)
const MasterAdmin = lazy(
  () => import("./components/master-admin/MasterAdmin.jsx"),
);
const MasterAdminLogin = lazy(
  () => import("./components/master-admin/pages/Login.jsx"),
);
const MasterAdminDashboard = lazy(
  () => import("./components/master-admin/MasterDashboard.jsx"),
);
const LandingPageManage = lazy(
  () => import("./components/master-admin/landing/ManageLandingPage.jsx"),
);

function withRouteFallback(node) {
  return <Suspense fallback={<LoadingScreen />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <NavigationWrapper />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/building-creativity",
        element: withRouteFallback(<BuildingCreativityLanding />),
      },
      // Google Forms–style standalone form link
      {
        path: "/CommunityJoinForm",
        element: withRouteFallback(<CommunityJoinFormPage />),
      },

      // Master Admin Routes
      {
        path: "/master-admin",
        element: withRouteFallback(<MasterAdmin />),
        children: [
          { index: true, element: withRouteFallback(<MasterAdminLogin />) },
          {
            path: "dashboard",
            element: withRouteFallback(<MasterAdminDashboard />),
          },
          {
            path: "landing-page",
            element: withRouteFallback(<LandingPageManage />),
          },
        ],
      },

      // optional: 404
      { path: "*", element: <div style={{ padding: 24 }}>Not Found</div> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-gray-800">
        <RouterProvider router={router} fallbackElement={<LoadingScreen />} />
      </div>
    </AuthProvider>
  );
}
