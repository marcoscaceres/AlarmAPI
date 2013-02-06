require.config({
	baseUrl: '/lib/',
	paths: {
		"deps": "/deps/",
		"DOM": "/deps/DOM/",
		"WebIDL": "/deps/WebIDL/"
	}
});

require(["/lib/interfaces/Navigator.js"]);