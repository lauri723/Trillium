const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif']


// All Students Route
router.get('/', async (req, res) => {
  let query = Student.find().sort({ createdAt: 'desc' })
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  try {
    const students = await query.exec()
    res.render('students/index', {
      students: students,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Student Route
router.get('/new', isLoggedIn, async (req, res) => {
  renderNewPage(res, new Student())
})

// Create Student Route
router.post('/', isLoggedIn, async (req, res) => {
  const student = new Student({
    name: req.body.name,
    url: req.body.url
  })
  saveCover(student, req.body.cover)

  try {
    const newStudent = await student.save()
    res.redirect(`students/${newStudent.slug}`)
  } catch (err) {
    console.log (err)
    renderNewPage(res, student, true)
  }
})

// Show Student Route
router.get('/:slug', async (req, res) => {
  try {
    const student = await Student.findOne({ slug: req.params.slug })
    res.render('students/show', { student: student })
  } catch {
    res.redirect('/')
  }
})

// Edit Student Route
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    renderEditPage(res, student)
  } catch {
    res.redirect('/')
  }
})

// Update Student Route
router.put('/:id', isLoggedIn, async (req, res) => {
  let student

  try {
    student = await student.findById(req.params.id)
    student.name = req.body.name
    student.url = req.body.url
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(student, req.body.cover)
    }
    await student.save()
    res.redirect(`/students/${student.slug}`)
  } catch {
    if (student != null) {
      renderEditPage(res, student, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Student Page
router.delete('/:id', isLoggedIn, async (req, res) => {
  let student
  try {
    student = await Student.findById(req.params.id)
    await student.remove()
    res.redirect('/students')
  } catch {
    if (student != null) {
      res.render('students/show', {
        student: student,
        errorMessage: 'Could not remove student'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, student, hasError = false) {
  renderFormPage(res, student, 'new', hasError)
}

async function renderEditPage(res, student, hasError = false) {
  renderFormPage(res, student, 'edit', hasError)
}

async function renderFormPage(res, student, form, hasError = false) {
  try {
    const params = {
      student: student
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Student'
      } else {
        params.errorMessage = 'Error Creating Student'
      }
    }
    res.render(`students/${form}`, params)
  } catch {
    res.redirect('/students')
  }
}

function saveCover(student, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    student.coverImage = new Buffer.from(cover.data, 'base64')
    student.coverImageType = cover.type
  }
}

module.exports = router