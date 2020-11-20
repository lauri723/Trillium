const mongoose = require('mongoose')
const slugify = require('slugify')

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  websiteImage: {
    type: Buffer,
    required: true
  },
  websiteImageType: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
})

studentSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }
  next()
})

studentSchema.virtual('websiteImagePath').get(function() {
  if (this.websiteImage != null && this.websiteImageType != null) {
    return `data:${this.websiteImageType};charset=utf-8;base64,${this.websiteImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Student', studentSchema)