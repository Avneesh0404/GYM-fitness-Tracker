import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // <-- Add this import
import '../styles/Dashboard.css'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Utility to normalize exercise names
const normalize = str => str.trim().toLowerCase()

function Dashboard() {
  const navigate = useNavigate() // <-- Add this line

  // Protect route: redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: '', exercise: '', reps: '', sets: '', weight: '', notes: '' })
  const [editId, setEditId] = useState(null)
  const [progress, setProgress] = useState({ weekly: 0, monthly: 0, yearly: 0, totalWeight: 0 })

  // Fetch workouts
  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      if (!response.ok) throw new Error('Failed to fetch workouts')
      const data = await response.json()
      setWorkouts(data)
      calculateProgress(data)
    } catch (err) {
      setError('Could not load workouts')
    } finally {
      setLoading(false)
    }
  }

  // Calculate progress reports
  const calculateProgress = (data) => {
    const now = new Date()
    let weekly = 0, monthly = 0, yearly = 0, totalWeight = 0
    data.forEach(w => {
      const workoutDate = new Date(w.date)
      const diffDays = (now - workoutDate) / (1000 * 60 * 60 * 24)
      if (diffDays <= 7) weekly++
      if (diffDays <= 30) monthly++
      if (diffDays <= 365) yearly++
      totalWeight += Number(w.weight) * Number(w.reps) * Number(w.sets)
    })
    setProgress({ weekly, monthly, yearly, totalWeight })
  }

  // Get unique normalized exercises
  const uniqueExercises = [
    ...new Set(workouts.map(w => normalize(w.exercise)))
  ];

  // Map normalized name to display name (first occurrence)
  const exerciseDisplayNames = {}
  workouts.forEach(w => {
    const norm = normalize(w.exercise)
    if (!exerciseDisplayNames[norm]) {
      exerciseDisplayNames[norm] = w.exercise.trim()
    }
  })

  // Prepare chart data for each normalized exercise
  const getChartData = (exerciseNorm) => {
    const filtered = workouts
      .filter(w => normalize(w.exercise) === exerciseNorm)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    return {
      labels: filtered.map(w => new Date(w.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (kg)',
          data: filtered.map(w => w.weight),
          borderColor: '#3182ce',
          backgroundColor: 'rgba(49,130,206,0.2)',
          yAxisID: 'y1',
        },
        {
          label: 'Reps',
          data: filtered.map(w => w.reps),
          borderColor: '#e53e3e',
          backgroundColor: 'rgba(229,62,62,0.2)',
          yAxisID: 'y2',
        }
      ]
    }
  }

  // Download report as CSV
  const downloadReport = () => {
    if (!workouts.length) return
    const header = ['Date', 'Exercise', 'Reps', 'Sets', 'Weight', 'Notes']
    const rows = workouts.map(w =>
      [
        new Date(w.date).toLocaleDateString(),
        w.exercise,
        w.reps,
        w.sets,
        w.weight,
        w.notes ? `"${w.notes.replace(/"/g, '""')}"` : ''
      ].join(',')
    )
    const csvContent = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workout_report.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Add or update workout
  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      let response
      const token = localStorage.getItem('token')
      if (editId) {
        response = await fetch(`http://localhost:5000/api/workouts/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(form),
        })
      } else {
        response = await fetch('http://localhost:5000/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(form),
        })
      }
      if (!response.ok) throw new Error('Failed to save workout')
      setForm({ date: '', exercise: '', reps: '', sets: '', weight: '', notes: '' })
      setEditId(null)
      fetchWorkouts()
    } catch (err) {
      setError('Could not save workout')
    }
  }

  // Delete workout
  const handleDelete = async id => {
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      if (!response.ok) throw new Error('Failed to delete workout')
      fetchWorkouts()
    } catch (err) {
      setError('Could not delete workout')
    }
  }

  // Edit workout
  const handleEdit = workout => {
    setForm({
      date: workout.date,
      exercise: workout.exercise,
      reps: workout.reps,
      sets: workout.sets,
      weight: workout.weight,
      notes: workout.notes || ''
    })
    setEditId(workout._id || workout.id)
  }

  // Cancel edit
  const handleCancel = () => {
    setForm({ date: '', exercise: '', reps: '', sets: '', weight: '', notes: '' })
    setEditId(null)
  }

  // --- SUGGESTION LOGIC START ---
  // Helper to get average weight*reps*sets for a period
  const getAvgVolume = (arr) => {
    if (!arr.length) return 0
    return arr.reduce((sum, w) => sum + (Number(w.weight) * Number(w.reps) * Number(w.sets)), 0) / arr.length
  }

  // Calculate suggestions for each exercise
  const getSuggestions = () => {
    const now = new Date()
    const suggestions = []

    uniqueExercises.forEach(exerciseNorm => {
      // Filter workouts for this exercise
      const filtered = workouts.filter(w => normalize(w.exercise) === exerciseNorm)
      // Last month: 0-30 days ago, Previous month: 31-60 days ago
      const lastMonth = filtered.filter(w => {
        const diff = (now - new Date(w.date)) / (1000 * 60 * 60 * 24)
        return diff <= 30
      })
      const prevMonth = filtered.filter(w => {
        const diff = (now - new Date(w.date)) / (1000 * 60 * 60 * 24)
        return diff > 30 && diff <= 60
      })

      const lastAvg = getAvgVolume(lastMonth)
      const prevAvg = getAvgVolume(prevMonth)

      // Only suggest if both months have data
      if (lastMonth.length && prevMonth.length) {
        const change = lastAvg - prevAvg
        const percent = prevAvg ? ((change / prevAvg) * 100).toFixed(1) : 0
        if (percent < -5) {
          suggestions.push(
            `Your ${exerciseDisplayNames[exerciseNorm]} performance decreased by ${Math.abs(percent)}% in the last month. Try to focus more on this exercise!`
          )
        } else if (percent < 5) {
          suggestions.push(
            `Your ${exerciseDisplayNames[exerciseNorm]} progress is stagnant this month. Consider increasing intensity or volume.`
          )
        }
      }
    })
    return suggestions
  }
  // --- SUGGESTION LOGIC END ---

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Workouts</h2>

      {/* Suggestions */}
      <div>
        {getSuggestions().length > 0 && (
          <div className="suggestion-card">
            <h4>Suggestions for You</h4>
            <ul>
              {getSuggestions().map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Download Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button className="download-btn" onClick={downloadReport}>
          Download Report (CSV)
        </button>
      </div>

      {/* Progress Reports */}
      <div className="progress-reports">
        <div className="progress-card">
          <h4>This Week</h4>
          <p>{progress.weekly} <span className="progress-label">workouts</span></p>
        </div>
        <div className="progress-card">
          <h4>This Month</h4>
          <p>{progress.monthly} <span className="progress-label">workouts</span></p>
        </div>
        <div className="progress-card">
          <h4>This Year</h4>
          <p>{progress.yearly} <span className="progress-label">workouts</span></p>
        </div>
        <div className="progress-card">
          <h4>Total Weight Lifted</h4>
          <p>{progress.totalWeight} <span className="progress-label">kg × reps × sets</span></p>
        </div>
      </div>

      {/* Graphs for each exercise */}
      <div className="workout-graphs">
        {uniqueExercises.map(exerciseNorm => (
          <div className="workout-graph-card" key={exerciseNorm}>
            <h3>{exerciseDisplayNames[exerciseNorm]} Progress</h3>
            <Line
              data={getChartData(exerciseNorm)}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                },
                scales: {
                  y1: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Weight (kg)' },
                  },
                  y2: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Reps' },
                    grid: { drawOnChartArea: false },
                  }
                }
              }}
            />
          </div>
        ))}
      </div>

      <form className="workout-form" onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="workout-input"
        />
        <input
          type="text"
          name="exercise"
          placeholder="Exercise"
          value={form.exercise}
          onChange={handleChange}
          required
          className="workout-input"
        />
        <input
          type="number"
          name="reps"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
          required
          className="workout-input"
        />
        <input
          type="number"
          name="sets"
          placeholder="Sets"
          value={form.sets}
          onChange={handleChange}
          required
          className="workout-input"
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={form.weight}
          onChange={handleChange}
          required
          className="workout-input"
        />
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={form.notes || ''}
          onChange={handleChange}
          className="workout-input"
        />
        <button type="submit" className="workout-btn">
          {editId ? 'Update' : 'Add'}
        </button>
        {editId && (
          <button type="button" className="workout-btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>
      {loading && <p className="dashboard-loading">Loading workouts...</p>}
      {error && <p className="dashboard-error">{error}</p>}
      {!loading && !error && (
        <table className="workouts-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Exercise</th>
              <th>Reps</th>
              <th>Sets</th>
              <th>Weight</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan="7">No workouts found.</td>
              </tr>
            ) : (
              workouts.map((workout, idx) => (
                <tr key={workout._id || workout.id || idx}>
                  <td>{workout.date}</td>
                  <td>{workout.exercise}</td>
                  <td>{workout.reps}</td>
                  <td>{workout.sets}</td>
                  <td>{workout.weight}</td>
                  <td>{workout.notes}</td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(workout)}>
                      Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(workout._id || workout.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Dashboard