const mongoose = require('mongoose')
const Photo = require('./photo')
const slugify = require('slugify')

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },
})

albumSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }

  next()
})  

albumSchema.pre('remove', function(next) {
  Photo.find({ album: this.id }, (err, photos) => {
    if (err) {
      next(err)
    } else if (photos.length > 0) {
      next(new Error('This album has photos still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Album', albumSchema)