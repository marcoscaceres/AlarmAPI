/*
interface AlarmManager : EventTarget {
  sequence<Date> getAll();
  void set(Date date, optional boolean respectTZ = true, optional boolean respectTZ = true);
  boolean clear(Date date);
  attribute EventHandler? onalarm;
};
*/
define(function(require) {
	'use strict';
	var WebIDL = require("WebIDL"),
		EventTarget = require("DOM/EventTarget"),
		IDLDate = require("WebIDL/types/Date"),
		IDLBoolean = require("WebIDL/types/Boolean"),
		alarms = [];

	function AlarmManager() {
		EventTarget.call(this);
	}

	AlarmManager.prototype = new EventTarget();

	AlarmManager.prototype.add = function(alarmTime, respectTZ) {
		var idlDate = new IDLDate(alarmTime),
			respectTZ = IDLBoolean(respectTZ),
			triggerTime = idlDate.value.getTime() - Date.now();

		if(triggerTime <= 0) {
			throw new TypeError("Invalid time");
		}

		alarm = {
			date: idlDate,
			respectTZ: (respectTZ === undefined) ? true : !! (respectTZ),
			timeout: setTimeout((function(alarm) {
				return function() {
					var ev = new CustomEvent("alarm");
					alarm.dispatchEvent(ev);
				};
			}(this)), triggerTime)
		};
		alarms.push(alarm);
	};

	AlarmManager.prototype.getPendingTasks = function() {
		return alarms.slice(0);
	};

	AlarmManager.prototype.remove = function(date) {
		var date = new IDLDate(date);
		for(var i = alarms.length - 1; i >= 0; i--) {
			if(alarms[i].date.getTime() === date.getTime()) {
				alarms.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	WebIDL.exportInterface(AlarmManager, "AlarmManager");

	return AlarmManager;
});