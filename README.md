# List-project

You can learn how this was made at:
* https://github.com/joeyklee/fullstack-user-auth

## Setup

**Update the `.env` file with your credentials**:
```
# your mongodb uri: in production, you'll switch this out to the URL provided by your service
MONGODB_URI=mongodb://localhost:27017/list-project
# generate a JWT_KEY: https://www.grc.com/passwords.htm
JWT_KEY=hu0SnUlQBnp2C76jOUpldZfYudYjzBmRAtPLF452Iv0H8n3LaCnYUYXEHYxSKKF
# your email and password for your mailing service, highly recommend using another email to protect your accounts!
MAILER_EMAIL=your.email@gmail.com 
MAILER_PASSWORD=yourEmailPassword
MAILER_SERVICE=Gmail
MAILER_ADDRESS="Bobo Texino <your.email@gmail.com>
```

**Run mongodb:**
```
mongod
```

**install dependencies and serve**
```
npm install
npm run serve
```