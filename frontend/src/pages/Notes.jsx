import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../App.css'

function Notes() {
  const { branch, semester, subjectId } = useParams()
  const navigate = useNavigate()

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/notes?subject_id=${subjectId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [subjectId])

  if (loading) return <p>Loading notes...</p>

  return (
    <div className="notes-section">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2>Notes</h2>

      <p className="section-description">
        {branch} • Semester {semester}
      </p>

      <div className="cards">

        {notes.length > 0 ? (
          notes.map((note) => (
            <div className="card" key={note.id}>

              <h3>{note.title}</h3>

              <p>{note.content}</p>

              {note.pdf_file && ( <div style={{ marginTop: '10px' }}> <a href={`http://127.0.0.1:8000${note.pdf_file}`} target="_blank" rel="noreferrer" className="download-btn" > 📖 Open PDF </a> <a href={`http://127.0.0.1:8000${note.pdf_file}`} download className="download-btn" style={{ marginLeft: '10px' }} > ⬇ Download </a> </div> )}

            </div>
          ))
        ) : (
          <p>No notes found for this subject.</p>
        )}

      </div>

    </div>
  )
}

export default Notes