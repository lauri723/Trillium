const mongoose = require('mongoose')
const slugify = require('slugify')

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  listingImage: {
    type: Buffer,
    required: true
  },
  listingImageType: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
})

scheduleSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }
  next()
})

scheduleSchema.virtual('listingImagePath').get(function() {
  if (this.listingImage != null && this.listingImageType != null) {
    return `data:${this.listingImageType};charset=utf-8;base64,${this.listingImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Schedule', scheduleSchema)