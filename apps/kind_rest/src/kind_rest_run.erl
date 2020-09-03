-module(kind_rest_run).

-export([init/2]).

init(Req, Opts) ->
    Response = ejson(kind:run("def main -> False", [])),
    io:format("Response: ~p~n", [Response]),
    Json = jiffy:encode(Response),
    Req2 = cowboy_req:reply(200,
                            #{<<"content-type">> => <<"application/json">>},
                            Json,
                            Req),
    {ok, Req2, Opts}.

ejson({error, Errs}) ->
    ErrJsons = [{[{problem, tuple_to_list(Problem)},
                  {location, tuple_to_list(Location)}]} || {Problem, Location} <- Errs],
    {[{error, ErrJsons}]};
ejson({ok, Res}) -> {[{response, list_to_binary(io_lib:format("~p", [Res]))}]}.


