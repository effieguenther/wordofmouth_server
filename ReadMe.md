Features
- login with Google
- sending emails/texts to users

API endpoints
- GET/POST/UPDATE/DELETE user
- GET/POST/UPDATE/DELETE profile
- GET/POST/UPDATE/DELETE review
- GET/POST/DELETE request


**Schemas**

// Sruthi

Service (services)
- title
- array of sub-services

User (users)
- first name
- last name
- authentication method
- email
- password
- is_admin
- is_worker
- status
- timestamps

Profile (profiles)
- user_id
- services array
- contacts array (user ids)
- address *** schema
- images
- profile picture
- phone number
- timestamps

// Effie

Address
- address
- latitude
- longitude

Review (reviews)
- author_id
- user_id
- rating
- title
- text
- timestamps

Request (requests)
- to
- from
- status
- timestamps

