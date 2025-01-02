const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  

const app = express();
const port = 5000;

// Define the fixed path to your uploads folder
const uploadPath = 'D:/Java script/Evol task/notcie_application/uploads';

// Ensure the 'uploads' directory exists, create it if necessary
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Set the upload directory to the fixed path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp for unique filenames
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;  // Allowed image formats
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  } else {
    return cb(new Error('Only image files are allowed'), false); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware to handle JSON bodies
app.use(express.json());

// API route to handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).send('No image uploaded');
    }

    // Save data to a database or perform additional logic here (optional)
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Image:', image);

    res.status(200).send('Notice uploaded successfully!');
  } catch (error) {
    console.error('Error uploading notice:', error);
    res.status(500).send('Error uploading notice');
  }
});


app.use((err, req, res, next) => {
  if (err.message === 'Only image files are allowed') {
    return res.status(400).send('Only image files are allowed');
  }
  next(err);
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
