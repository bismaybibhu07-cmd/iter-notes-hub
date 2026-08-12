import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

function Signup() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  const handleSignup = async (e) => {

    e.preventDefault()

    setError('')

    try {

      const res = await fetch(
        'http://127.0.0.1:8000/signup',
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
        setError(data.detail || 'Signup failed')
        return
      }

      alert('Account created successfully')

      navigate('/login')

    } catch (err) {
      setError('Server error')
    }
  }

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>Signup</h1>

        <form onSubmit={handleSignup}>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

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

          <button type="submit">Create Account</button>

        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  )
}

export default Signup