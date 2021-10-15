let atelierSchema = new Schema({
  // TODO: your schema here!

  id: Number,
  productId: Number,
  rating: Number,
  recommend: Boolean,
  summary: String,
  body: String,
  reviewerName: String,
  email: String,
  photos: [String],
  helpfulness: Number,
  reviewDate: Date,
  response: String,
  characteristic: {
    reviewSize: Number,
    reviewWidth: Number,
    reviewComfort: Number,
    reviewQuality: Number,
    reviewLength: Number,
    reviewFit: Number,
  },
});

