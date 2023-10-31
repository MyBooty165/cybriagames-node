const simpleGit = require('simple-git');
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const git = simpleGit();

// Replace this with your GitHub repository URL
const repoURL = 'https://github.com/CybriaTech/CybriaGames.git';
const repoFolder = 'static'; // The folder where the repository will be cloned

// Function to clone and update the repository
const cloneAndPull = async () => {
  // Clone the repository or update it if it already exists
  const exists = fs.existsSync(repoFolder);
  if (exists) {
    await git.cwd(repoFolder).pull();
    console.log('Repository already exists and was updated successfully.');
  } else {
    await git.clone(repoURL, repoFolder);
    console.log('Repository cloned successfully.');
  }

  // Periodically pull (update) the repository
  setInterval(async () => {
    try {
      await git.cwd(repoFolder).pull();
      console.log('Repository updated successfully.');

      // No need to restart the server; it will serve the updated contents automatically
    } catch (error) {
      console.error('Error updating repository:', error);
    }
  }, 60000); // Update every 1 minute (adjust the interval as needed)
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
startServer();
