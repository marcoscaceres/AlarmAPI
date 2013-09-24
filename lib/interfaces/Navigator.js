/*
partial interface Navigator {
  readonly attribute TaskScheduler taskScheduler;
}
*/

define(function(require) {
	var TaskScheduler = require("interfaces/TaskScheduler"),
	    taskMng = new TaskScheduler();

	Object.defineProperty(window, "taskScheduler", {
		get: function() {
			return taskMng;
		}
	});
});
