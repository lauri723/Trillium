const mongoose = require('mongoose')
const slugify = require('slugify')

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  medium: {
    type: String
  },
  price: {
    type: Number
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Album'
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
})

photoSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }
  next()
})

photoSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Photo', photoSchema)