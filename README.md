# 319-BCCH
Developed a Web app for BC Children's Hospital for use in their research about children's behavior pattern / sleeping disorders. A web application developed for BC Children's Hospital to support research on children's behavior patterns and sleep disorders.

## Features
Search and Query: Efficiently search and retrieve questionnaires and individual questions. Query search the questionnaire(s)/ questions, generating new questionnaires, upload Videos in  Mp4, Mp3 format, upload pictures/ forms. 

Questionnaire Management: Create and manage new questionnaires with ease.

Media Uploads: Upload multimedia content, including MP4 and MP3 videos, as well as images and forms, to enhance data collection.

## Technologies Used
Frontend: React, TypeScript

Backend: Node.js, Express

Database: MongoDB

Authentication: JWT (JSON Web Tokens)

File Storage: AWS S3
urlquery.net

## Setup Instructions
### Prerequisites
Ensure you have the following installed:

Node.js (v14 or higher)

npm (v6 or higher)

MongoDB (or access to a MongoDB instance)

### Installation
1) Clone the repository:

  git clone https://github.com/kmr-source/319-BCCH.git
  cd 319-BCCH
  
2) Install dependencies:
 
  npm install

3) Configure environment variables:

Create a .env file in the root directory and add the following variables:
    MONGO_URI=your_mongo_connection_string\
    JWT_SECRET=your_jwt_secret\
    AWS_ACCESS_KEY_ID=your_aws_access_key\
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key\
    AWS_BUCKET_NAME=your_s3_bucket_name

4) Run application
   npm run dev
   

###**Usage
Admin Panel: Access the admin panel to manage questionnaires, questions, and uploaded media.

Search Functionality: Utilize the search feature to find specific questionnaires or questions based on keywords.

Media Uploads: Admins can upload videos and images associated with questionnaires for comprehensive data collection.



