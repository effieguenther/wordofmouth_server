## Features

- login with Google
- sending emails/texts to users

## Schemas

Service (services)
- title
- array of sub-services

User (users)
- authentication_method
- is_admin
- status
- first_name
- last_name

- username (passport-local-mongoose)
- password (passport-local-mongoose)

- timestamps

Profile (profiles)
- user_id
- first_name
- last_name
- is_worker
- is_verified
- address (embedded schema)
    - address_line_1
    - address_line_2
    - address_line_3
    - city
    - country_code
    - latitude
    - longitude
- services (array of ids)
- contacts (array of ids)
- images (array of strings)
- profile picture
- rating
- email
- phone number
- gender
- status

- timestamps

Review (reviews)
- author_id
- reviewed_user_id
- rating
- review_title
- review_text
- timestamps

Request (requests)
- to_id
- from_id
- status
- timestamps

## Endpoints

ALL RETURNS ARE IN JSON FORMAT

### /users
- GET
    - auth: none
    - body: { is_admin || status }
    - if present in body, users are filtered by is_admin or status
    - returns an array of users 
- POST
    - auth: none
    - body: { user }
    - returns a newly created user 

#### /users/:userId
- GET
    - auth: none
    - body: {}
    - returns the user

#### /users/signup
- POST
    - auth: none
    - body: { username: String, password: String, firstname: Srting, lastname: String }
    - password is encrypted with passport-local-mongoose plugin
    - user is created and saved
    - profile is created from the new user and saved
    - returns { success: true, user: user, profile: profile }

#### /users/login
- POST
    - auth: user exists
    - body: {}
    - returns: { success: true, token: token, status: 'You are successfully logged in!' }

### /profiles
- GET
    - auth: none
    - body: {}
    - returns { success: true, profiles: [{profile}, {profile}, ...] }
- POST
    - auth: none
    - body: {profile}
    - returns { succes: true, profile: {profile} }

#### /profiles/:userId
- GET
    - auth: none
    - body: {}
    - returns { succes: true, profile: {profile} }
- PUT
    - auth: current user id must === profile.user
    - body: { info to update }
    - returns { success: true, profile: {profile} }

### /workers
- GET
    - auth: none
    - body: none
    - returns { success: true, profiles: profiles }

#### /workers/search/:keyword
- GET
    - auth: none
    - body: { [ serviceId, serviceId, ... ] }
    - GET /services/search/:keyword first to retrieve ids
    - searches for profiles which match any of the services ids, or the keyword matches first/last name
    - returns { success: true, profiles: profiles }

#### /workers/:serviceId
- GET
    - auth: none
    - body: {}
    - returns { success: true, profiles: [{profile}, {profile}, ...] }

### /reviews
- GET
    - auth: none
    - body: { filter_author_id || filter_reviewed_user_id }
    - returns an array of reviews
- POST
    - auth: current user must exist
    - body: { review }
    - reviewed_user_id must exist in contacts of current user
    - returns the created review

#### /reviews/:reviewId
- GET
    - auth: none
    - body: {}
    - returns the Review
- PUT 
    - auth: author_id must = current user
    - body: { rating: Number || review_title: String || review_text: String }
    - returns updated Review
- DELETE 
    - auth: author_id must = current user
    - body: {}
    - returns status

### /requests
- GET
    - auth: current user must exist
    - body: { filter_to || filter_from }
    - returns array of Requests
- POST
    - auth: current user must exist
    - body: { request }
    - the the to_id must not already exist in the current user's contacts
    - returns the created request

#### /requests/:requestId
- GET
    - auth: none
    - body: {}
    - returns the request
- PUT 
    - auth: current user must = to_id
    - body: { status: 'Approved' or 'Declined' }
    - if approved, to_id is added to from_id's contacts and vice versa
    - returns { success: true, request: {request} to_profile: {profile}, from_profile: {profile} }
    - if declined, returns { success: true, request: {request} }

### /services
- GET
    - auth: none
    - body: { filter_featured }
    - returns an array of services with its subservices

#### /services/search/:keyword
- GET
    - auth: none
    - body: {}
    - returns { success: true, serviceIds: [serviceId, serviceId, ...] }

#### /services/:serviceId
- GET
    - returns a service with its subservices for the given service Id

#### /services/:serviceId/subservice
- GET
    - returns the sub services for the given service Id