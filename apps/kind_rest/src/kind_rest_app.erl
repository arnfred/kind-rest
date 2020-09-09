-module(kind_rest_app).
-export([start/2]).

-define(PORT, list_to_integer(os:getenv("PORT", "2938"))).

start(_StartType, _StartArgs) ->
    {ok, Pid} = 'kind_rest_sup':start_link(),
    Routes = [ {
        '_',
        [
	    %{"/", kind_rest_root, []},
	    {"/", cowboy_static, {priv_file, kind_rest, "static/index.html"}},
	    {"/run", kind_rest_run, []},
	    {"/static/[...]", cowboy_static, {priv_dir, kind_rest, "static"}}
        ]
    } ],
    Dispatch = cowboy_router:compile(Routes),

    TransOpts = [ {ip, {0,0,0,0}}, {port, ?PORT} ],
    ProtoOpts = #{env => #{dispatch => Dispatch}},

    {ok, _} = cowboy:start_clear(kind_rest_test,
        TransOpts, ProtoOpts),

    {ok, Pid}.
