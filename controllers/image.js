import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '70757f15741f4f649d9e609783cf5d1b'
});

// Handle API call to Clarifai for face detection
const handleApiCall = (req, res) => {
  // Use Clarifai model for face detection
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ error: 'Unable to work with API' });
    });
};

// Handle image entry and update user entries in the database
const handleImage = (req, res, db) => {
  const { id } = req.body;

  // Update user entries in the database
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json({ error: 'Unable to get entries' }));
};

export default {
  handleImage,
  handleApiCall,
};