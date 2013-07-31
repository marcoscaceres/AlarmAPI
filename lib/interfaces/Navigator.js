/*
partial interface Navigator {
  readonly attribute TaskScheduler taskScheduler;
}
*/

define(function(require) {
	var TaskScheduler = require("interfaces/TaskScheduler"),
		taskMng = new TaskScheduler();

	Object.defineProperty(window, "tasks", {
		get: function() {
			return taskMng;
		}
	});
});