import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute"

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

import './style.scss'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="home" element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>}>
      </Route>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
