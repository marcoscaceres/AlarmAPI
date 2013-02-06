require.config({
	baseUrl: '/lib/',
	paths: {
		"deps": "/deps/",
		"DOM": "/deps/DOM/",
		"WebIDL": "/deps/webidl/lib/"
	}
});

require(["/lib/interfaces/Navigator.js"]);