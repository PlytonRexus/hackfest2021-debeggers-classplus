const path = require('path')

var express = require('express');
var router = express.Router();
var multer = require('multer');
const { detectFaces, recogniseFace, matchFaceAgainst } = require('../helpers/shell');

const fileFilter = function fileFilter(req, file, callback) {
  if ((/image\//).test(file.mimetype)) {
      callback(null, true);
  } else {
      callback(null, false);
      console.log('Only octet stream is allowed');
  }
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dest = path.join(__dirname, "..", "temp")
    cb(null, dest)
  },
  filename: function(req, file, cb) {
    const uniqueSuffix =
      Date.now()
      + '-'
      + Math.round(Math.random() * 1E9);

    let currentFilename = file.fieldname
      + '-'
      + uniqueSuffix
      + '.'
      + file.originalname.split('.').pop();

    req.currentFilename = path
      .join(__dirname, "..", "temp", currentFilename);
    cb(null, currentFilename);
  }
})

const upload = multer({
  limits: { fileSize: 524288000 },
  fileFilter,
  storage
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/check', upload.single("image"), async function(req, res) {
  // console.log(req.currentFilename)
  let body = req.body
  if (req.currentFilename && typeof req.currentFilename == "string") {
    let result
    try {
      result = await detectFaces(req.currentFilename)
    } catch (error) {
      res.status(500).json({
        error: 'Error in detecting faces' + error
      })
      return
    }
    if (result.length < 1)
      console.log("Empty result")
    else {
      if (result[0] == 1) {
        let recResult = await matchFaceAgainst(
          req.currentFilename,
          path.join(__dirname, '../temp/faces', body.admissionNumber + '.jpg'),
          body.admissionNumber)
        res.json({
          faceMatched: recResult[0] === 1
        })
      } else {
        res.status(400).json({
          error: 'Too many or no faces'
        })
      }
    }
  } else {
    res.status(400).json({
      error: "File missing"
    })
  }
})

module.exports = router;
