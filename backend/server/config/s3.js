require('dotenv').config();

// Check if credentials are loaded correctly
if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REGION || !process.env.AWS_REGION) {
  console.error("Missing AWS credentials in environment variables!");
}

const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,        
    secretAccessKey: process.env.AWS_SECRET_KEY,      
  },
});



module.exports = s3;
