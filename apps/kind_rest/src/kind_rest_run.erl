-module(kind_rest_run).

-export([init/2]).

init(Req, Opts) ->
    {ok, ReqBody, Req2} = cowboy_req:read_body(Req),
    RequestJson = jiffy:decode(ReqBody, [return_maps]),
    Body = binary_to_list(maps:get(<<"body">>, RequestJson)),
    Args = [binary_to_list(Arg) || Arg <- maps:get(<<"args">>, RequestJson)],
    Response = ejson(kind:run(Body, Args)),
    ResponseJson = jiffy:encode(Response),
    Req2 = cowboy_req:reply(200,
                            #{<<"content-type">> => <<"application/json">>},
                            ResponseJson,
                            Req),
    {ok, Req2, Opts}.

ejson({error, Errs}) ->
    ErrJsons = [{[{problem, tuple_to_list(Problem)},
                  {location, tuple_to_list(Location)}]} || {Problem, Location} <- Errs],
    {[{error, ErrJsons}]};
ejson({ok, Res}) -> {[{response, list_to_binary(io_lib:format("~p", [Res]))}]}.


