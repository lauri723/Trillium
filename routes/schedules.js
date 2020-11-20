const express = require('express')
const router = express.Router()
const Schedule = require('../models/schedule')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif']

// All Schedules Route
router.get('/', async (req, res) => {
  let schedules
  try {
    schedules = await Schedule.find().sort({ createdAt: 'desc' })
  } catch {
    schedules = []
  }
  res.render('schedules/index', { schedules: schedules })
})

// New Schedule Route
router.get('/new', isLoggedIn, async (req, res) => {
  renderNewPage(res, new Schedule())
})

// Create Schedule Route
router.post('/', isLoggedIn, async (req, res) => {
  const schedule = new Schedule({
    name: req.body.name,
  })
  saveListing(schedule, req.body.listing)

  try {
    const newSchedule = await schedule.save()
    console.log(newSchedule)
    res.redirect(`schedules/${newSchedule.slug}`)
  } catch (err) {
    console.log(err)
    renderNewPage(res, schedule, true)
  }
})

// Show Schedule Route
router.get('/:slug', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({slug: req.params.slug })
    res.render('schedules/show', { schedule: schedule })
  } catch {
    res.redirect('/')
  }
})

// Edit Schedule Route
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
    renderEditPage(res, schedule)
  } catch {
    res.redirect('/')
  }
})

// Update Schedule Route
router.put('/:id', isLoggedIn, async (req, res) => {
  let schedule

  try {
    schedule = await Schedule.findById(req.params.id)
    schedule.name = req.body.name
    if (req.body.listing != null && req.body.listing !== '') {
      saveListing(schedule, req.body.listing)
    }
    await schedule.save()
    res.redirect(`/schedules/${schedule.slug}`)
  } catch {
    if (schedule != null) {
      renderEditPage(res, schedule, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Schedule Page
router.delete('/:id', isLoggedIn, async (req, res) => {
  let schedule
  try {
    schedule = await Schedule.findById(req.params.id)
    await schedule.remove()
    res.redirect('/schedules')
  } catch {
    if (schedule != null) {
      res.render('schedules/show', {
        schedule: schedule,
        errorMessage: 'Could not remove schedule'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, schedule, hasError = false) {
  renderFormPage(res, schedule, 'new', hasError)
}

async function renderEditPage(res, schedule, hasError = false) {
  renderFormPage(res, schedule, 'edit', hasError)
}

async function renderFormPage(res, schedule, form, hasError = false) {
  try {
    const params = {
      schedule: schedule
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Schedule'
      } else {
        params.errorMessage = 'Error Creating Schedule'
      }
    }
    res.render(`schedules/${form}`, params)
  } catch {
    res.redirect('/schedules')
  }
}

function saveListing(schedule, listingEncoded) {
  if (listingEncoded == null) return
  const listing = JSON.parse(listingEncoded)
  if (listing != null && imageMimeTypes.includes(listing.type)) {
    schedule.listingImage = new Buffer.from(listing.data, 'base64')
    schedule.listingImageType = listing.type
  }
}

module.exports = router