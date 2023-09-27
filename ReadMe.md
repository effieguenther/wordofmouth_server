**Features**

- login with Google
- sending emails/texts to users

**Schemas**

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

Address
- address
- latitude
- longitude

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

**Endpoints**

ALL RETURNS ARE IN JSON FORMAT

/reviews
    - GET
        - provide filter_author_id or filter_reviewed_user_id in body
        - returns an array of reviews
    - POST
        - auth: current user must exist
        - reviewed_user_id must exist in contacts of current user
        - returns the created review

/reviews/:reviewId
    - GET
        - returns the Review
    - PUT 
        - auth: author_id must = current user
        - returns updated Review
    - DELETE 
        - auth: author_id must = current user
        - returns status

/requests
    - GET
        - filter_to or filter_from in body
        - returns array of Requests
    - POST
        - auth: current user must exist
        - the the to_id must not already exist in the current user's contacts
        - returns the created request

/requests/:requestId
    - GET
        - returns the request
    - PUT 
        - only valid for 'status' property
        - auth: current user must = to_id
        - required in body: status ('approved' or 'declined')
        - if approved, to_id is added to from_id's contacts and vice versa
        - returns the to_id user, from_id user, and the updated request

