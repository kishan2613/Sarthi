// Import necessary libraries
const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer'); // Import multer to handle multipart/form-data

// --- AWS Configuration ---
// It is recommended to configure AWS credentials via environment variables for security.
// e.g., export AWS_ACCESS_KEY_ID=YOUR_KEY and export AWS_SECRET_ACCESS_KEY=YOUR_SECRET
// and export AWS_REGION=YOUR_REGION
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

// Define the S3 bucket and folder
const bucketName = 'mahakumbh-camera-images';
const cameraFolderKey = 'Camera/';

// --- Multer Configuration for handling file uploads ---
// Using memory storage so the file is stored in a buffer in req.file.
// This is efficient because we only need the buffer to pass to Rekognition,
// and we don't need to save the file to the server's disk first.
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Optional: Set a file size limit (e.g., 10MB)
}); 

// The `upload.single('imageData')` middleware is now used on the route.
// It will parse the incoming 'multipart/form-data' and make the file available on `req.file`.
router.post('/compare-faces', upload.single('imageData'), async (req, res) => {
  console.log('API call received for face comparison.');

  // Check if a file was uploaded by multer.
  // The field name 'imageData' must match the one used in the frontend's FormData object.
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ status: 'error', message: 'No image file was uploaded or the file is corrupt.' });
  }

  // The image data is now available directly as a buffer from the uploaded file.
  const imageBuffer = req.file.buffer;

  try {
    // List all objects in the camera folder
    const s3Objects = await s3.listObjectsV2({
      Bucket: bucketName,
      Prefix: cameraFolderKey
    }).promise();

    if (!s3Objects.Contents || s3Objects.Contents.length === 0) {
      return res.status(404).json({ status: 'error', message: `No images found in the folder: ${cameraFolderKey}` });
    }

    let foundMatch = false;
    let matchResult = null;

    // Iterate through each image in the S3 folder
    for (const s3Object of s3Objects.Contents) {
      const currentImageKey = s3Object.Key;

      // Skip the folder itself and any non-image files
      if (currentImageKey === cameraFolderKey || !currentImageKey.toLowerCase().match(/\.(png|jpe?g)$/)) {
        continue;
      }

      console.log(`- Comparing against: ${currentImageKey}`);

      const params = {
        SourceImage: { Bytes: imageBuffer }, // The uploaded image from the request body
        TargetImage: {
          S3Object: {
            Bucket: bucketName,
            Name: currentImageKey // An image from the S3 folder
          }
        },
        SimilarityThreshold: 90
      };

      try {
        const response = await rekognition.compareFaces(params).promise();
        if (response.FaceMatches && response.FaceMatches.length > 0) {
          const data = response.FaceMatches[0];
          const similarity = data.Similarity;
          console.log(`- MATCH FOUND! -> ${currentImageKey} (Similarity: ${similarity.toFixed(2)}%)`);
          foundMatch = true;
          matchResult = {
            matchedImage: `https://${bucketName}.s3.${AWS.config.region}.amazonaws.com/${currentImageKey}`,
            similarity: similarity.toFixed(2) + '%'
          };
          // Break the loop after the first match is found
          break;
        }
      } catch (err) {
        console.error(`- ERROR with ${currentImageKey}: ${err.code} - ${err.message}`);
        // Continue to the next image on error
        continue;
      }
    }

    // Send the final response
    if (foundMatch) {
      res.json({
        status: 'success',
        message: 'Match found.',
        match: true,
        result: matchResult
      });
    } else {
      res.json({
        status: 'success',
        message: 'No matches found in the specified folder.',
        match: false,
        result: null
      });
    }

  } catch (err) {
    console.error('An error occurred during the process:', err);
    res.status(500).json({
      status: 'error',
      message: 'An internal server error occurred.',
      details: err.message
    });
  }
});

module.exports = router;
