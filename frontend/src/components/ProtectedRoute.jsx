import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {

  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {

    const payload = JSON.parse(
      atob(token.split('.')[1])
    )

    if (payload.role !== 'admin') {
      return <Navigate to="/" replace />
    }

  } catch (error) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute