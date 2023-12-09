const Clarifai = require ('clarifai');

const app = new Clarifai.App({
 apiKey: '70757f15741f4f649d9e609783cf5d1b'
});

const handleApiCall = (req, res) => {
    app.models.predict('face-detection', req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res,db) => {
    const {id} = req.body;
    db('usersname').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
  	 res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}