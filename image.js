// const returnClarifaiRequestOptions = (imageUrl) => {
//     const PAT = '7abaa6958cad4b36bfe00ae8068ecf78';
//     // Specify the correct user_id/app_id pairings
//     // Since you're making inferences outside your app's scope
//     const USER_ID = 'foomin';
//     const APP_ID = 'my-application-1';
//     const MODEL_ID = "face-detection";
//     // Change these to whatever model and image URL you want to use    
//     const IMAGE_URL = imageUrl;

//     const raw = JSON.stringify({
//         "user_app_id": {
//             "user_id": USER_ID,
//             "app_id": APP_ID
//         },
//         "inputs": [
//             {
//                 "data": {
//                     "image": {
//                         "url": IMAGE_URL
//                     }
//                 }
//             }
//         ]
//     });

//     const requestOptions = {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Authorization': 'Key ' + PAT
//             },
//             body: raw
//     };

//     return {requestOptions : requestOptions,
//             MODEL_ID: MODEL_ID
//             };
// };


// const handleAPICall = async (req, res) => {
//     try {    
//         const { imageUrl } = req.body;
//         console.log('imageUrl', imageUrl);
//         const { requestOptions, MODEL_ID } = returnClarifaiRequestOptions(imageUrl);
//         console.log('reqestOptions', requestOptions, 'MODEL_ID', MODEL_ID);
//         const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions);
//         if (!response.ok) {
//             console.log('not', response) // Handle error responses HTTP 4XX, 5XX
//             res.status(400).json('error');
//         } else {
//             console.log('ok', response);
//             res.json(response); // Return success response HTTP 2XX, 3XX
//         }
//     } catch (err) {
//         res.status(400).json('eraaaaaaa');
//     }
// };

// const handleAPICall = (req, res) => {
//     const { imageUrl } = req.body;
//     console.log('server', imageUrl);
//     const { requestOptions, MODEL_ID } = returnClarifaiRequestOptions(imageUrl);
//     console.log(requestOptions, MODEL_ID);
//     // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
//     // this will default to the latest version_id
//     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
//     .then(response => {
//         console.log('res', response);
//         res.json(response);
//     //   console.log('ok1',response.json());
//     //   if (!response.ok) {
//     //     return Promise.reject(response) // Handle error responses HTTP 4XX, 5XX
//     //   } else {
//     //     console.log('ok2',response.json());
//     //     res.json(response); // Return success response HTTP 2XX, 3XX
//     //   }
//     })//上の処理がなかったらfetchエラーでも実行されてしまう
//     // .then(response => {
//     //     res.json(response);
//     // })
//     .catch(err => res.status(400).json('eraaaaaaa'));
// };

const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai. 
const app = new Clarifai.App({
 apiKey: '337471627e324a96bf235513c5cf8a8b' 
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