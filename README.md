# WoW Collections

This project is a World of Warcraft collections tracker that allows users to view their collected
mounts, achievements, and toys. The application fetches data from the Blizzard API and displays it
in a user-friendly interface.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/RobinBroberg/wow-collections
    ```

2. **Install backend dependencies:**
    ```sh
    cd server
    npm install
    npm install nodemon
    ```

3. **Install frontend dependencies:**
    ```sh
    cd ../wow-collections
    npm install
    ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory with the following content:
      ```
      BLIZZARD_CLIENT_ID=your_blizzard_client_id
      BLIZZARD_CLIENT_SECRET=your_blizzard_client_secret
      ```

## Usage

1. **Start the backend server:**
    ```sh
    cd server
    nodemon server.js
    ```

2. **Start the frontend server:**
    ```sh
    cd ../wow-collections
    npm start
    ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Mounts

- `GET /mounts`  
  Fetch all mount data.

- `GET /mounts/collected`  
  Fetch collected mounts for a specific character.

### Achievements

- `GET /achievements`  
  Fetch all achievement data.

- `GET /achievements/completed`  
  Fetch completed achievements for a specific character.

### Toys

- `GET /toys`  
  Fetch all toy data.

- `GET /toys/collected`  
  Fetch collected toys for a specific character.

## Technologies Used

### Frontend:

- React
- Material-UI
- Axios

### Backend:

- Node.js
- Express
- Axios


