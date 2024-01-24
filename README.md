# Personal Portfolio Website
This personal portfolio website has been crafted using Node.js and Express.js, showcasing my skills and experiences.

## Overview
The website consists of several key sections:

Home Page: A concise introduction that provides insights into my background, ongoing projects, and details about the website itself.
Skills:in progress.
Projects: Personal undertakings and academic endeavors
Contact: Here, you'll find my personal contact information along with relevant links.


## Functionality
From the main directory, the server is started-up by running `node app.js`. This will require the user to have Node.js, as well as the necessary modules. The server will listen to connections on `process.env.PORT`, which is used by Adaptable. The server may also run on `localhost:3000`. In the server app, GET requests may be made to certain webpages. When a GET request is received, the server will compile the associated markdown content into a pug template file. The pug file will then be converted to HTML. The resutlting HTML is sent to the client.
