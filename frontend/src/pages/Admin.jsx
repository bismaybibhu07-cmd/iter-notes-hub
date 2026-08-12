import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, getToken } from '../auth/auth'
import '../App.css'

function Admin() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [notes, setNotes] = useState([])

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    branch: 'CSE',
    semester: 1
  })

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    subject_id: ''
  })

  const [pdf, setPdf] = useState(null)

  // Load subjects
  const loadSubjects = async () => {
    const res = await fetch('https://iter-notes-backend.onrender.com/subjects')
    const data = await res.json()
    setSubjects(data)
  }

  const loadNotes = async () => {
    const res = await fetch('https://iter-notes-backend.onrender.com/notes')
    const data = await res.json()
    setNotes(data)
  }

  // Load current user
  const loadUser = async () => {
    const res = await fetch('https://iter-notes-backend.onrender.com/me', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })

    if (res.ok) {
      const data = await res.json()
      setUser(data)
    }
  }

  useEffect(() => {
    loadSubjects()
    loadNotes()
    loadUser()
  }, [])

  // Add subject
  const addSubject = async (e) => {
    e.preventDefault()

    await fetch('https://iter-notes-backend.onrender.com/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subjectForm)
    })

    setSubjectForm({
      name: '',
      branch: 'CSE',
      semester: 1
    })

    loadSubjects()
  }

  // Upload note
  const addNote = async (e) => {
    e.preventDefault()

    if (!noteForm.title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!noteForm.subject_id) {
      alert('Please select a subject')
      return
    }

    const formData = new FormData()

    formData.append('title', noteForm.title)
    formData.append('content', noteForm.content)
    formData.append('subject_id', String(noteForm.subject_id))

    if (pdf) {
      formData.append('pdf', pdf)
    }

    const res = await fetch('https://iter-notes-backend.onrender.com/notes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    })

    if (!res.ok) {
      const err = await res.text()
      console.log(err)
      alert('Upload failed')
      return
    }

    setNoteForm({
      title: '',
      content: '',
      subject_id: ''
    })

    setPdf(null)

    alert('Note uploaded successfully')

    // Refresh credits
    loadUser()
    loadNotes()
  }

  // Delete subject
  const deleteSubject = async (id) => {
    await fetch(`https://iter-notes-backend.onrender.com/subjects/${id}`, {
      method: 'DELETE'
    })

    loadSubjects()
  }

  const deleteNote = async (id) => {
  await fetch(`https://iter-notes-backend.onrender.com/notes/${id}`, {
    method: 'DELETE'
  })

  loadNotes()
}

  return (
    <div className="notes-section">

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >

        {user && (
          <p>
            Welcome, <b>{user.name}</b> 👋
          </p>
        )}

        {user && ( <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', padding: '8px 14px', borderRadius: '20px', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)' }} > 💰 {user.credits} Credits </div> )}

        <button
          className="back-btn"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Logout
        </button>

      </div>

      <h1 className="admin-title">Admin Panel</h1>

      <div className="cards">

        {/* Add Subject */}
        <div className="card">

          <h2>Add Subject</h2>

          <form onSubmit={addSubject}>

            <input
              placeholder="Subject name"
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  name: e.target.value
                })
              }
            />

            <select
              value={subjectForm.branch}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  branch: e.target.value
                })
              }
            >
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>ME</option>
            </select>

            <input
              type="number"
              min="1"
              max="8"
              value={subjectForm.semester}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  semester: Number(e.target.value)
                })
              }
            />

            <button type="submit">Add Subject</button>

          </form>

        </div>

        {/* Add Note */}
        <div className="card">

          <h2>Add Note</h2>

          <form onSubmit={addNote}>

            <input
              placeholder="Note title"
              value={noteForm.title}
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  title: e.target.value
                })
              }
            />

            <textarea
              placeholder="Description (optional)"
              value={noteForm.content}
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  content: e.target.value
                })
              }
            />

            <select
              value={noteForm.subject_id}
              onChange={(e) =>
                setNoteForm({
                  ...noteForm,
                  subject_id: e.target.value
                })
              }
            >

              <option value="">
                Select Subject
              </option>

              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.branch} Sem {s.semester} - {s.name}
                </option>
              ))}

            </select>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
            />

            <button type="submit">Upload Note</button>

          </form>

        </div>

      </div>

      {/* Manage Subjects */}
      <div className="card" style={{ marginTop: '30px' }}>

        <h2>Manage Subjects</h2>

        {subjects.map((s) => (
          <div
            key={s.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <span>
              {s.branch} Sem {s.semester} - {s.name}
            </span>

            <button
              onClick={() => deleteSubject(s.id)}
              style={{ background: '#dc2626' }}
            >
              Delete
            </button>
          </div>
        ))}

        {notes .filter((n) => n.subject_id === s.id) .map((n) => ( <div key={n.id} style={{ marginLeft: '20px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }} > <span> 📄 {n.title} </span> <button onClick={() => deleteNote(n.id)} style={{ background: '#ef4444' }} > Delete Note </button> </div> ))}

      </div>

    </div>
  )
}

export default Admin