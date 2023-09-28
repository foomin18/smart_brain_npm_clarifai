const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai. 
const app = new Clarifai.App({
 apiKey: 'yourKey' 
});

const handleAPICall = (req, res) => {
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. 

    app.models.predict('face-detection', req.body.imageUrl)
    .then(data => {
    res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
};

const handleImage = (req, res, db) => {
    const { id, boxnum } = req.body;
    db('users').where({
        id: id
    })
    .increment('entries', boxnum)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('error.'));
};

module.exports = {
    handleImage: handleImage,
    handleAPICall: handleAPICall
};
