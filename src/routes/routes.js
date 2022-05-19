import './styles.css';
import Main from '../pages/Main'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { getItem } from '../utils/storage'

function mainRoutes() {
  function ProtectedRoutes({ redirectTo }) {
    const isAuthenticated = getItem('token');

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
  }
  return (
    <Routes>
      <Route path='/' element={<SignUp />} />
      <Route element={<ProtectedRoutes redirectTo='/' />}>
        <Route path='/main' element={<Main />} />
      </Route>
      <Route path='/login' element={<SignIn />} />
    </Routes>

  );
}

export default mainRoutes;
