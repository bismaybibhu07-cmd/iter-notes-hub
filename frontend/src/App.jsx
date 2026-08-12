import Admin from './pages/Admin'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Semester from './pages/Semester'
import Subjects from './pages/Subjects'
import Notes from './pages/Notes'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/semester/:branch"
        element={<Semester />}
      />

      <Route
        path="/subjects/:branch/:semester"
        element={<Subjects />}
      />

      <Route
        path="/notes/:branch/:semester/:subjectId"
        element={<Notes />}
      />

      <Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>

    </Routes>
  )
}

export default App