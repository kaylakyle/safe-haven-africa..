## Client Setup (React + Vite + TypeScript)
## Navigate to the Client Folder

cd client

## Install Dependencies

npm install

npm install axios
 
## Configure Environment Variables

## create .env file

.env

then add 

VITE_API_URL=http://localhost:4000
VITE_EMAIL_SERVER_URL=http://localhost:4000

## Start the Development Server

npm run dev

## If successful, Vite will show something like:

Local:   http://localhost:8080/
Network: http://192.168.x.x:8080/

## open url in your browser 

##  API Communication

The app communicates with the backend using:

src/services/api.ts → Handles axios API calls

src/lib/email.ts → Sends OTP requests

src/lib/auth.tsx → Login, Signup logic

## Ensure your server is running on the same URL as defined in .env
