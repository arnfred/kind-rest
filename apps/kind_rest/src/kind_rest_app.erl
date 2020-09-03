-module(kind_rest_app).
-export([start/2]).

start(_StartType, _StartArgs) ->
    {ok, Pid} = 'kind_rest_sup':start_link(),
    Routes = [ {
        '_',
        [
            {"/", kind_rest_root, []},
	    {"/run", kind_rest_run, []}
        ]
    } ],
    Dispatch = cowboy_router:compile(Routes),

    TransOpts = [ {ip, {0,0,0,0}}, {port, 2938} ],
    ProtoOpts = #{env => #{dispatch => Dispatch}},

    {ok, _} = cowboy:start_clear(kind_rest_test,
        TransOpts, ProtoOpts),

    {ok, Pid}.
