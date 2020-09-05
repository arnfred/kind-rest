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

