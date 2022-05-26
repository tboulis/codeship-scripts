# Script that calculates average build times for the past X months for a Codeship Project

## Instructions:
 - install dependencies `npm i` (axios, moment, dotenv)
 - Create a .env file based on the template: `cp .env-template .env`
 - Add your Codeship username/password in the .env file.
 - Add the orgName in kebab case & lowercase format. Ex: Lorem Ipsum Dolor Sit` -> `lorem-ipsum-dolor-sit`
 - Add the Project ID (you'll find it in the url of the project page) eg: `https://app.codeship.com/projects/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX` -> `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX`
 - Add the duration in months for which to fetch builds. eg `6`
 - Run the script and wait for the output: `npm run start`

---
#### Note:
Feel free to use it and suggest improvements
