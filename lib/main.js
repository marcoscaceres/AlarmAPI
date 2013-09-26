require.config({
	baseUrl: '/lib/',
	paths: {
		"deps": "/deps/",
		"DOM": "/deps/DOM/",
		"WebIDL": "/deps/webidl/lib/WebIDL"
	}
});

define('Promise', ['deps/DOM/Promises'],
    function() {
        return window.Promise;
    }
);

console.warn("The Task Schedule API reference implementation is an unsupported component with an indefinite lifetime. This should be used for evaluation purposes only and should not be used for production level applications.");
require(['Promise', '/lib/interfaces/Navigator.js']);