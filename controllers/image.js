// clarifaiIntegration.mjs

import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '70757f15741f4f649d9e609783cf5d1b'
});

// Handle API call to Clarifai for face detection
const handleApiCall = (req, res) => {
  // Use Clarifai model for face detection
  app.models
    .predict('face-detection', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'));
};

// Handle image entry and update user entries in the database
const handleImage = (req, res, db) => {
  const { id } = req.body;

  // Update user entries in the database
  db('usersname')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
};

export default {
  handleImage,
  handleApiCall,
};
