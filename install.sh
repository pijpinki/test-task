#!bin/bash
echo "Installing packages"
npm i
echo "Make database migrations"
npm run migration
echo "installation complite, you can run server by npm run start"
echo "All API documentation you can find at http://localhost:8199/docs/"
