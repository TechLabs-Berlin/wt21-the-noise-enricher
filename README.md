## The Noise Enricher

### It's the opposite of noise cancellation!

#

## HEROKU deployment

Full description of the deployment process can be found [here](https://devcenter.heroku.com/articles/git).

Pushing `develop` branch to Heroku `main` brand:

```bash
git push heroku develop:main
```

[package.json](package.json) file is required to change the location where heroku starts npm server.
