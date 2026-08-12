import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { saveToken } from '../auth/auth'
import '../App.css'

function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  const handleLogin = async (e) => {

    e.preventDefault()

    setError('')

    try {

      const res = await fetch(
        'https://iter-notes-backend.onrender.com/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Login failed')
        return
      }

      saveToken(data.access_token)

      navigate('/admin')

    } catch (err) {
      setError('Server error')
    }
  }

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>Login</h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          {error && (
            <p className="error-text">{error}</p>
          )}

          <button type="submit">Login</button>

        </form>

        <p>
          Don't have an account? <Link to="/signup" className="signup-link">Signup</Link>
        </p>

      </div>

    </div>
  )
}

export default Login