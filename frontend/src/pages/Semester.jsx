import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'

function Semester() {

  const { branch } = useParams()
  const navigate = useNavigate()

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="notes-section">

      <h2>{branch} Notes</h2>

      <p className="section-description">
        Select your semester
      </p>

      <div className="cards">

        {semesters.map((semester) => (

          <div className="card" key={semester}>

            <h3>Semester {semester}</h3>

            <p>
              View subjects and study materials
            </p>

            <button
              onClick={() =>
                navigate(`/subjects/${branch}/${semester}`)
              }
            >
              View Subjects
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Semester