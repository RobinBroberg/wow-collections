# WoW Collections

This project is a World of Warcraft collections tracker that allows users to view their collected
mounts, achievements, and toys. The application fetches data from the Blizzard API and displays it
in a user-friendly interface.

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/RobinBroberg/wow-collections.git
   cd wow-collections

2. **Install backend dependencies:**
3. ```sh
cd server
npm install

Install frontend dependencies:
cd ../wow-collections
npm install

Set up environment variables:

Create a .env file in the root directory with the following content:

REACT_APP_CLIENT_ID=your_blizzard_client_id
REACT_APP_CLIENT_SECRET=your_blizzard_client_secret

Usage

Start the backend server:

cd server
npm start

Start the frontend server:

cd.. /wow-collections
npm start

Access the application:
Open your browser and navigate to http://localhost:3000

API Endpoints
Mounts

GET /mounts
Fetch all mount data.

GET /mounts/collected
Fetch collected mounts for a specific character.

Achievements

GET /achievements
Fetch all achievement data.

GET /achievements/completed
Fetch completed achievements for a specific character.

Toys

GET /toys
Fetch all toy data.

GET /toys/collected
Fetch collected toys for a specific character.

Technologies Used

Frontend:

React
Material-UI
Axios

Backend:

Node.js
Express
Axios

