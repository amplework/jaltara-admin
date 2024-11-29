import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      // path: '',
      children: [
        { element: <Navigate to={'login'} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <Register />
        //     </GuestGuard>
        //   ),
        // },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      // path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'sevek',
          children: [
            { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
            { path: 'list', element: <SevekList /> },
            { path: 'sevek-create', element: <SevekCreate /> },
            { path: 'sevek-edit/:id', element: <SevekEdit /> },
            { path: 'details/:id', element: <SevekDetails /> },
          ],
        },
        {
          path: 'farmers',
          children: [
            { path: 'list', element: <FarmersList /> },
            { path: 'create', element: <FarmerCreate /> },
            { path: 'edit/:id', element: <FarmerCreate /> },
            { path: 'details/:id', element: <FarmersDetails /> },
          ],
        },
        {
          path: 'pits',
          children: [
            { path: 'list', element: <PitList /> },
            { path: 'details/:id', element: <PitsDetails /> },
          ],
        },

        {
          path: 'wells',
          children: [
            { path: 'list', element: <WellList /> },
            { path: 'details/:id', element: <WellsDetails /> },
          ],
        },
        {
          path: 'equipment',
          children: [
            {
              path: 'list',
              element: <EquipmentList />,
            },
            {
              path: 'create',
              element: <EquipmentCreate />,
            },
            {
              path: 'edit/:id',
              element: <EquipmentCreate />,
            },
          ],
        },
        {
          path: 'location',
          children: [
            {
              path: 'list',
              element: <LocationList />,
            },
          ],
        },
        // {
        //   path: 'masterdata',
        //   children: [
        //     {
        //       path: 'croplist',
        //       element: <CropList />,
        //       children: [
        //         {
        //           path: 'create',
        //           element: <CropCreate />,
        //         },
        //         {
        //           path: 'edit',
        //           element: <LocationList />,
        //         },
        //       ],
        //     },
        //     {
        //       path: 'challanges',
        //       element: <CropList />,
        //     },
        //   ],
        // },
        {
          path: 'masterdata',
          children: [
            {
              path: 'croplist',
              element: <CropList />,
            },
            {
              path: 'create',
              element: <CropCreate />,
            },
            {
              path: 'edit/:id',
              element: <CropCreate />,
            },
            {
              path: 'challanges',
              element: <CropList />,
            },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        // { path: 'pricing', element: <Pricing /> },
        // { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    // {
    //   path: '/',
    //   element: <MainLayout />,
    //   children: [
    //     { element: <HomePage />, index: true },
    //     { path: 'about-us', element: <About /> },
    //     { path: 'contact-us', element: <Contact /> },
    //     { path: 'faqs', element: <Faqs /> },
    //   ],
    // },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// Sevek
const SevekProfile = Loadable(lazy(() => import('../pages/sevek/SevekProfile')));
const SevekList = Loadable(lazy(() => import('../pages/sevek/SevekList')));
const SevekCreate = Loadable(lazy(() => import('../pages/sevek/SevekCreate')));
const SevekEdit = Loadable(lazy(() => import('../pages/sevek/SevekCreate')));
const SevekDetails = Loadable(lazy(() => import('../pages/sevek/SevekDetails')));

//pits
const PitList = Loadable(lazy(() => import('../pages/pits/PitList')));
const PitsDetails = Loadable(lazy(() => import('../pages/pits/PitsDetails')));
// master data
const CropList = Loadable(lazy(() => import('../pages/crops/CropList')));
const CropCreate = Loadable(lazy(() => import('../pages/crops/CropCreate')));

// farmer
const FarmersList = Loadable(lazy(() => import('../pages/farmers/FarmersList')));
const FarmerCreate = Loadable(lazy(() => import('../pages/farmers/FarmerCreate')));
const FarmersDetails = Loadable(lazy(() => import('../pages/farmers/FarmerDetails')));

// wells create
const WellList = Loadable(lazy(() => import('../pages/wells/WellList')));
const WellsDetails = Loadable(lazy(() => import('../pages/wells/WellsDetails')));
// location
const LocationList = Loadable(lazy(() => import('../pages/location/LocationList')));
// equipent
const EquipmentList = Loadable(lazy(() => import('../pages/equipments/EquipmentList')));
const EquipmentCreate = Loadable(lazy(() => import('../pages/equipments/EquipmentCreate')));

const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
