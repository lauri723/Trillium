const mongoose = require('mongoose')
const Photo = require('./photo')

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
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