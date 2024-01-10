# Biz-cards Nodejs Project

A rest API project made with node, mongodb, express and mongoose.\
Features two routers that receive requests one for users and one for cards.\
Some routes require the correct authorization to be used, like being logged in, being a business account or being an admin.\
The available requests can be viewed in the /src/routes/requests.rest file.\
The database populates itself with 3 users (regular user, business user and admin user) and 3 cards upon initialization.
