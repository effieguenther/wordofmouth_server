# Word of Mouth Server

This is the backend code for Word of Mouth! It is a Node/Express app which connects to a MongoDB Atlas database. 

[Frontend code](https://github.com/sruthiravindra/wordofmouth)  
[Live demo](https://wordofmouth-alpha.web.app/)

Mongoose ODM is utilized to enfore schemas on the documents.  
Passport is used to authenticate users with Local and JWT strategies.

## Schema/Models

#### Service 
- title
- image
- description
- featured
- sort_order
- timestamps
- sub_service (embedded schema)
    - title
    - image
    - description
    - sort_order
    - timestamps

#### User
- authentication_method
- is_admin
- status
- username (passport-local-mongoose)
- salt (passport-local-mongoose)
- hash (passport-local-mongoose)
- timestamps

#### Profile
- user
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
- services (array of service ids)
- contacts (array of profile ids)
- images (array of strings)
- profile_pic (download URL string)
- email
- phone
- rating
- gender
- status
- timestamps

#### Review
- author_id
- reviewed_user_id
- rating
- review_title
- review_text
- timestamps

#### Request
- to_id
- from_id
- status
- timestamps

# Endpoints

## users

#### users/
- GET
    - auth: none
    - body: { is_admin || status }
    - if present in body, users are filtered by is_admin or status
    - returns an array of users  

#### users/:userId
- GET
    - auth: none
    - body: {}
    - returns an object with the user data
- DELETE
    - auth: verify user, verify admin
    - finds the user and updates status to "Inactive"
    - returns { response }

#### users/signup
- POST
    - auth: none
    - body: { 
        - username: String, 
        - password: String, 
        - first_name: Srting, 
        - last_name: String }
    - password is encrypted with passport-local-mongoose plugin
    - user is created and saved
    - profile is created from the new user and saved
    - returns { success: true, user: {user}, profile: {profile} }

#### users/login
- POST
    - auth: passport authenticate local
    - body: { username, password }
    - returns: { 
        - success: true, 
        - token: token, 
        - id: _id,
        - status: 'You are successfully logged in!',
        - profile: {profile} }

#### users/logout
- GET
    - auth: verify user
    - body: {}
    - destroys the JWT token
    - returns { success: true, status: 'You have successfully logged out!' }

#### users/checkJWTtoken
- GET
    - auth: passport authenticate JWT
    - checks if the JWT token in req is valid
    - returns { status: 'JWT valid!', success: true, user: {user} }


## profiles
#### profiles/
- GET
    - auth: none
    - body: {}
    - returns { success: true, profiles: [{profile}, {profile}, ...] }
- POST
    - auth: none
    - body: { profile }
    - returns { succes: true, profile: {profile} }

#### /profiles/:profileId
- GET
    - auth: none
    - body: {}
    - returns { succes: true, profile: {profile} }
- PUT
    - auth: current user id must === profile.user
    - body: { info to update }
    - returns { success: true, profile: {profile} }

## workers
#### workers/
- GET
    - auth: none
    - body: none
    - returns { success: true, profiles: profiles }

#### workers/search/:keyword
- GET
    - auth: none
    - body: { [ serviceId, serviceId, ... ] }
    - GET /services/search/:keyword first to retrieve ids
    - searches for profiles which match any of the services ids, or the keyword matches first/last name
    - returns { success: true, profiles: profiles }

#### workers/:serviceId
- GET
    - auth: none
    - body: {}
    - finds worker profiles which contain the serviceId in services
    - returns { success: true, profiles: [{profile}, {profile}, ...] }


## reviews
#### reviews/
- POST
    - auth: verify user
    - body: { review }
    - returns { review }

#### reviews/fetchReviews
- POST
    - auth: none
    - body: { filter_author_id || filter_reviewed_user_id }
    - filters reviews based on author_id or reviewed_user_id
    - returns { [{review}, {review}, ...] }

#### reviews/:reviewId
- GET
    - auth: none
    - body: {}
    - returns: { review }
- PUT 
    - auth: author_id must = current user
    - body: { rating: Number || review_title: String || review_text: String }
    - updates the review
    - returns: { review }
- DELETE 
    - auth: author_id must = current user
    - body: {}
    - returns { response }


## requests
#### requests/
- GET
    - auth: verify user
    - body: {}
    - uses the userId from JWT token to filter reviews
    - will find all requests where userId matches to_id or from_id 
    - only finds requests where status is "Pending"
    - populates to_id into to_users array
    - populates from_id into from_users array
    - returns: { [{request}, {request}, ...] }
- POST
    - auth: verify user
    - body: { request }
    - the the to_id must not already exist in the current user's contacts
    - returns: { request }

#### requests/:requestId
- GET
    - auth: none
    - body: {}
    - returns: { request }
- PUT 
    - auth: verify user, req.user._id === to_id
    - body: { status: 'Approved' || 'Declined' }
    - if approved, to_id is added to from_id's contacts and vice versa
    - if approved, returns: { success: true, request: {request} to_profile: {profile}, from_profile: {profile} }
    - if declined, returns { success: true, request: {request} }

## services
#### services/
- GET
    - auth: none
    - body: { filter_featured }
    - returns: { [{service}, {service}, ...] }

#### services/search/:keyword
- GET
    - auth: none
    - body: {}
    - queries service and sub_service titles for matches to :keyword
    - returns { success: true, serviceIds: [serviceId, serviceId, ...] }

#### services/:serviceId
- GET
    - auth: none
    - body: {}
    - returns: { service }

#### services/:serviceId/subservice
- GET
    - auth: none
    - body: {}
    - returns: { [{sub_service}, {sub_service}, ...] }