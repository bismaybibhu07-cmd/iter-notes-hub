import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../App.css'

function Subjects() {
  const { branch, semester } = useParams()
  const navigate = useNavigate()

  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://iter-notes-backend.onrender.com/subjects?branch=${branch}&semester=${semester}`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [branch, semester])

  const openNotes = (subject) => {
    navigate(`/notes/${branch}/${semester}/${subject.id}`)
  }

  if (loading) return <p>Loading subjects...</p>

  return (
    <div className="notes-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>{branch} - Semester {semester}</h2>

      <div className="cards">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div className="card" key={subject.id}>
              <h3>{subject.name}</h3>
              <button onClick={() => openNotes(subject)}>
                View Notes
              </button>
            </div>
          ))
        ) : (
          <p>No subjects found in database.</p>
        )}
      </div>
    </div>
  )
}

export default Subjects