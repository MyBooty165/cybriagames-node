const simpleGit = require('simple-git');
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const git = simpleGit();

// Replace this with your GitHub repository URL
const repoURL = 'https://github.com/CybriaTech/CybriaGames.git';
const repoFolder = 'CybriaGames'; // The folder where the repository will be cloned

// Function to clone and update the repository
const cloneAndPull = async () => {
  // Clone the repository
  await git.clone(repoURL);

  // Periodically pull (update) the repository
  setInterval(async () => {
    try {
      await git.pull();
      console.log('Repository updated successfully.');

      // Trigger a server restart when the repository is updated
      restartServer();
    } catch (error) {
      console.error('Error updating repository:', error);
    }
  }, 60000); // Update every 1 minute (adjust the interval as needed)
};

// Function to restart the server
const restartServer = () => {
  console.log('Restarting server...');

  // Stop the current server process
  exec('pkill -f "node server.js"', (error, stdout, stderr) => {
    if (error) {
      console.error('Error stopping the server:', error);
      return;
    }

    // Start a new server process
    startServer();
  });
};

// Function to start the server
const startServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.static(repoFolder));

  app.listen(port, () => {
    console.log(`CybriaGames is running on port ${port}`);
  });
};

// Call the cloneAndPull function to start the process
cloneAndPull();
