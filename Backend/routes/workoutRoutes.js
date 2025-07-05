const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/workouts
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/workouts
router.post('/', auth, async (req, res) => {
  const { date, exercise, sets, reps, weight, notes } = req.body;
  try {
    const newWorkout = await Workout.create({
      userId: req.user.id,
      date,
      exercise,
      sets,
      reps,
      weight,
      notes
    });
    res.json(newWorkout);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/workouts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/workouts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
