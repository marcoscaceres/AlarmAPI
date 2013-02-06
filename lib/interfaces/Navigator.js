/*
partial interface Navigator {
  readonly attribute AlarmManager alarms;
}
*/

define(function(require) {
	var AlarmManager = require("interfaces/AlarmManager"),
		alarmMng = new AlarmManager();

	Object.defineProperty(window, "alarms", {
		get: function() {
			return alarmMng;
		}
	});
});