import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, getToken } from '../auth/auth'
import '../App.css'

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find(
    (option) => String(option.value) === String(value)
  )

  return (
    <div className="custom-select" ref={dropdownRef}>

      <button
        type="button"
        className="custom-select-button"
        onClick={() => setOpen(!open)}
      >
        <span>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className={`custom-select-arrow ${open ? 'open' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="custom-select-menu">

          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${
                String(option.value) === String(value)
                  ? 'selected'
                  : ''
              }`}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}

        </div>
      )}

    </div>
  )
}

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

            <CustomSelect
  value={subjectForm.branch}
  onChange={(value) =>
    setSubjectForm({
      ...subjectForm,
      branch: value
    })
  }
  options={[
    { value: 'CSE', label: 'CSE' },
    { value: 'ECE', label: 'ECE' },
    { value: 'EEE', label: 'EEE' },
    { value: 'ME', label: 'ME' }
  ]}
  placeholder="Select Branch"
/>

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

            <CustomSelect
  value={noteForm.subject_id}
  onChange={(value) =>
    setNoteForm({
      ...noteForm,
      subject_id: value
    })
  }
  options={subjects.map((s) => ({
    value: s.id,
    label: `${s.branch} Sem ${s.semester} - ${s.name}`
  }))}
  placeholder="Select Subject"
/>
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

        
      </div>

    </div>
  )
}

export default Admin