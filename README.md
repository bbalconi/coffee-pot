# ☕ Coffee Pot Pi ☕

If you've ever wanted to know how many sleepy coworkers in your office crave coffee, the Coffee Pot Pi is the answer! Set up the digital readout next to your coffee pot and watch the coffee requests "flow" in. 

## Development Information

### Prior to running

- `npm install` inside root
- `npm install` inside client  
- add `.env` file inside root directory (this should never be committed to github) 

```
ELEPHANT_DB_USER=YOURUSER
ELEPHANT_DB_PASSWORD=YOURPASSWORD
```

### Running in local environment

- `npm start` inside root
- `npm start` inside client 

## Deploying to Heroku

- Will be set up to automatically deploy to Heroku when master branch updated
- Make sure `npm start` is using `node` and not `nodemon`
