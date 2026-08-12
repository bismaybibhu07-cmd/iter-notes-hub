import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Home() {

  const [backendStatus, setBackendStatus] = useState('Checking backend...')
  const navigate = useNavigate()

  useEffect(() => {

    fetch('http://127.0.0.1:8000/')
      .then(response => response.json())
      .then(() => {
        setBackendStatus('Backend Connected')
      })
      .catch(() => {
        setBackendStatus('Backend Not Connected')
      })

  }, [])

  const openBranch = (branch) => {
    navigate(`/semester/${branch}`)
  }

  return (

    <div className="container">

      {/* Top Bar */}
      <div className="topbar">

        <h2 style={{ color: 'white' }}>📚 ITER NOTES HUB</h2>

        <button
          className="back-btn"
          onClick={() => navigate('/login')}
        >
          Admin Login
        </button>

      </div>

      {/* Hero Section */}
      <div className="hero">

        <h1>Study Smarter, Not Harder 🚀</h1>

        <p>
          Access organized notes, PDFs and study resources
          for all ITER branches in one beautiful platform.
        </p>

        <div style={{ marginTop: '20px' }}>

          <span className="credit-badge">
            ● {backendStatus}
          </span>

        </div>

      </div>

      {/* Branch Cards */}
      <div className="cards">

        <div className="card">

          <h2>💻 CSE</h2>
          <p>Computer Science & Engineering</p>

          <div style={{ marginTop: '20px' }}>
            <button onClick={() => openBranch('CSE')}>
              Browse Notes
            </button>
          </div>

        </div>

        <div className="card">

          <h2>📡 ECE</h2>
          <p>Electronics & Communication Engineering</p>

          <div style={{ marginTop: '20px' }}>
            <button onClick={() => openBranch('ECE')}>
              Browse Notes
            </button>
          </div>

        </div>

        <div className="card">

          <h2>⚡ EEE</h2>
          <p>Electrical & Electronics Engineering</p>

          <div style={{ marginTop: '20px' }}>
            <button onClick={() => openBranch('EEE')}>
              Browse Notes
            </button>
          </div>

        </div>

        <div className="card">

          <h2>🛠️ ME</h2>
          <p>Mechanical Engineering</p>

          <div style={{ marginTop: '20px' }}>
            <button onClick={() => openBranch('ME')}>
              Browse Notes
            </button>
          </div>

        </div>

      </div>

      {/* About */}
      <div className="card" style={{ marginTop: '40px' }}>

        <h2>About the Platform</h2>

        <p>
          ITER Notes Hub is a student-friendly platform where notes,
          assignments and PDFs are organized branch-wise and semester-wise.
          Admins can upload materials and students can instantly view
          or download them.
        </p>

      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', color: '#cbd5e1' }}>
        © 2026 ITER Notes Hub • Built with ❤️ 
      </div>

    </div>
  )
}

export default Home