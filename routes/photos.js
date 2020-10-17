const express = require('express')
const router = express.Router()
const Photo = require('../models/photo')
const Album = require('../models/album')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif']

// All Photos Route
router.get('/', async (req, res) => {
  let photos
  try {
    photos = await Photo.find().sort({ createdAt: 'desc' })
  } catch {
    photos = []
  }
  res.render('photos/index', { photos: photos })
})

// New Photo Route
router.get('/new', isLoggedIn, async (req, res) => {
  renderNewPage(res, new Photo())
})

// Create Photo Route
router.post('/', isLoggedIn, async (req, res) => {
  const photo = new Photo({
    title: req.body.title,
    album: req.body.album,
    size: req.body.size,
    medium: req.body.medium,
    price: req.body.price
  })
  saveCover(photo, req.body.cover)

  try {
    const newPhoto = await photo.save()
    console.log(newPhoto)
    res.redirect(`photos/${newPhoto.slug}`)
  } catch (err) {
    console.log(err)
    renderNewPage(res, photo, true)
  }
})

// Show Photo Route
router.get('/:slug', async (req, res) => {
  try {
    const photo = await Photo.findOne({slug: req.params.slug })
                           .populate('album')
                           .exec()
    res.render('photos/show', { photo: photo })
  } catch {
    res.redirect('/')
  }
})

// Edit Photo Route
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
    renderEditPage(res, photo)
  } catch {
    res.redirect('/')
  }
})

// Update Photo Route
router.put('/:id', isLoggedIn, async (req, res) => {
  let photo

  try {
    photo = await Photo.findById(req.params.id)
    photo.title = req.body.title
    photo.album = req.body.album
    photo.size = req.body.size
    photo.medium = req.body.medium
    photo.price = req.body.price
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(photo, req.body.cover)
    }
    await photo.save()
    res.redirect(`/photos/${photo.slug}`)
  } catch {
    if (photo != null) {
      renderEditPage(res, photo, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Photo Page
router.delete('/:id', isLoggedIn, async (req, res) => {
  let photo
  try {
    photo = await Photo.findById(req.params.id)
    await photo.remove()
    res.redirect('/photos')
  } catch {
    if (photo != null) {
      res.render('photos/show', {
        photo: photo,
        errorMessage: 'Could not remove photo'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, photo, hasError = false) {
  renderFormPage(res, photo, 'new', hasError)
}

async function renderEditPage(res, photo, hasError = false) {
  renderFormPage(res, photo, 'edit', hasError)
}

async function renderFormPage(res, photo, form, hasError = false) {
  try {
    const albums = await Album.find({})
    const params = {
      albums: albums,
      photo: photo
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Photo'
      } else {
        params.errorMessage = 'Error Creating Photo'
      }
    }
    res.render(`photos/${form}`, params)
  } catch {
    res.redirect('/photos')
  }
}

function saveCover(photo, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    photo.coverImage = new Buffer.from(cover.data, 'base64')
    photo.coverImageType = cover.type
  }
}

module.exports = router