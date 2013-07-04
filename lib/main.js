require.config({
	baseUrl: '/lib/',
	paths: {
		"deps": "/deps/",
		"DOM": "/deps/DOM/",
		"WebIDL": "/deps/webidl/lib/"
	}
});

console.warn("The Alarm API reference implementation is an unsupported component with an indefinite lifetime. This should be used for evaluation purposes only and should not be used for production level applications.")

require(["/lib/interfaces/Navigator.js"]);
