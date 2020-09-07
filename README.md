kind-rest
=====

Rest interface for the kind language. Useful for an online demo.

API
---

The api currently serves a single end-point `/run` which accepts a json body of the following format:

```
{
    "body": <kind source code> (String),
    "args": <Argument list> (List of Strings)
}
```

The api is also currently really prone to falling over without good error messages.


Build and run
-----

Set env variable `PORT` to port. Default is 2938.

```
rebar3 run
```

Run test command
----------------

```
curl -d '{"body":"def main -> True", "args":[]}' -H "Content-Type: application/json" -X POST localhost:2938/run
> {"response":"'Boolean/True'"}
```

Dokku setup
-----------

To set up the `kind_rest` application on dokku, I did the following:

```
dokku apps:create kind
dokku domains:add kind <some domain>
dokku git:initialize kind
```

The last command isn't neccesary according to the dokku documentation, but without it I would get the following error when trying to push changes:

```
fatal: 'kind' does not appear to be a git repository
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

I saw this solution mentioned on a discussion here: https://github.com/dokku/dokku/issues/1813#issuecomment-617186489

Buildpack troubles
------------------

I'm still having troubles with the buildpack. I can't find an erlang buildpack that includes a recent Erlang OTP. The [most recently updated buildpack](https://github.com/madcat78/heroku-buildpack-erlang) does have the erlang version I'm looking for, but only when the heroku stack version used by dokku is `heroku-18`. For `heroku-16` which is the version I've got running on my system, it only offers an older version which can't compile one of my dependencies.

Possible solutions:
* Create my own erlang build-pack and add a more recent version of Erlang OTP
* Find a way to set the `$STACK` to `heroku-18` for this particular buildpack and see if that works
* Downgrade my dependency so it's compatible with an earlier version of Erlang OTP
