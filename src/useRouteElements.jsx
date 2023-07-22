import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import AuthLayout from './layouts/AuthLayout/AuthLayout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout/MainLayout'
import Profile from './pages/Profile/Profile'
import ManageUser from './pages/ManageUser/ManageUser'
import ManageBuilding from './pages/ManageBuilding/ManageBuilding'
import ManageRoom from './pages/ManageRoom/ManageRoom'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import ListBuilding from './pages/ListBuilding/ListBuilding'
import ListRoom from './pages/ListRoom/ListRoom'
import MyBooking from './pages/MyBooking/MyBooking'
import ManageBooking from './pages/ManageBooking/ManageBooking'
import Home from './pages/Home/Home'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '/login',
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        },
        {
          path: '/register',
          element: (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        },
        {
          path: '/forgot-password',
          element: (
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          )
        },
        {
          path: '/reset-password',
          element: (
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/profile',
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: '/manage-user',
          element: (
            <MainLayout>
              <ManageUser />
            </MainLayout>
          )
        },
        {
          path: '/manage-building',
          element: (
            <MainLayout>
              <ManageBuilding />
            </MainLayout>
          )
        },
        {
          path: '/manage-room/:buildingId',
          element: (
            <MainLayout>
              <ManageRoom />
            </MainLayout>
          )
        },
        {
          path: '/list-building',
          element: (
            <MainLayout>
              <ListBuilding />
            </MainLayout>
          )
        },
        {
          path: '/list-room/:buildingId',
          element: (
            <MainLayout>
              <ListRoom />
            </MainLayout>
          )
        },
        {
          path: '/my-booking',
          element: (
            <MainLayout>
              <MyBooking />
            </MainLayout>
          )
        },
        {
          path: '/manage-booking',
          element: (
            <MainLayout>
              <ManageBooking />
            </MainLayout>
          )
        },
        {
          path: '/dashboard',
          element: (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      index: true,
      element: <Home />
    }
  ])

  return routeElements
}
