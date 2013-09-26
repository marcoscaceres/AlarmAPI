/******************************************************************************
 * 	What need to be done by anyone using this prototype:
 *
 * 	1. When page is loaded (system is started) you need to raise all tasks,
 * 		use raise_all_tasks( DATE)
 * 	2. When page is beeng closed/reloaded (system is goint to shut down)
 * 		you need to cancell all tasks, use close_all_tasks( DATE)
 ******************************************************************************/
/*
 * Function that adds Warning in page body if there are no required function
 * 	raise_specific_task(TASK, KEY, DATA)
 *
 */

function addWarning(warning) {
    var p = document.createElement('h1');
    p.setAttribute("style", "color: red");
    p.appendChild(document.createTextNode(warning));

    var body = document.body;
    body.insertBefore(p, body.firstChild);
}



/*
 * 	Check if there is any implementation for system function to raise a task
 *
 * 	REQUIRED:
 * 	- raise_specific_task(TASK, KEY, DATA)
 * 		function that raise one specific task
 *
 *
 * 	OPTIONAL:
 * 	- raise_all_tasks( DATE)
 * 		function raises all pending tasks, for example:
 *			after phone reboot or page loaded firts time in case of pure JS prototype
 * 		function MAY use " TaskScheduler.getPendingTasks()" function to clean up system messages,
 * 			old tasks will be removed
 * 	- close_all_tasks(DATE)
 * 		function that cancell all pending tasks, for example:
 *			before phone reboot or page reload/close in case of pure JS prototype
 * 	- close_specific_task (TASK, KEY, DATA))
 * 		function that cancell only one task, for example:
 * 			user want to delete this task
 *
 * 	If above funstions does not exist, there will be warning added to page which loaded this script
 *
 */

function check_connected_functions() {
    if (typeof (raise_specific_task) === 'undefined') {
        addWarning("ERROR: raise_specific_task function is not available. This PROTOTYPE won't work properly without that. Please add proper file or your dummy implementation");
    } else {
        console.log("All required functions available");
    }
}

check_connected_functions();


/*****************************************************************************
 *****************************************************************************
 
 * 
 * 			TASKSCHEDULER PROTOTYPE
 * 
 * 
 * 
 * 			
 * 	I've decided to use localStorage to create fake TASKS container
 * 
 **************************************************************************** 
 * **************************************************************************/


/*
 *  SPEC:
 *
 * 	enum TimezoneDirective { "respectTimezone", "ignoreTimezone" };
 *
 * interface TaskScheduler {
 *   Promise getPendingTasks();
 *   Promise add(Date date, TimezoneDirective timezoneDirective, optional any data);
 *   Promise remove(DOMString taskId);
 * };
 */


var TimezoneDirective = {
    respectTimezone: "respectTimezone",
    ignoreTimezone: "ignoreTimezone"
};

define(function (require) {
    'use strict';
    var WebIDL = require("WebIDL"),
        IDLDate = require("WebIDL/types/Date"),
        IDLBoolean = require("WebIDL/types/Boolean");


    function TaskScheduler() {
        return (this);
    }

    /*********************************************************************
	 * 		add
	 * *******************************************************************

	 /*
	 *  SPEC:
	 * 
	 *  When invoked, the add(date, timezoneDirective[, data]) method must run the following steps:
	 * 
	 * Make a request to the system to schedule a new task for the current application that will trigger 
	 *	at the given date. Depending on the timezoneDirective argument, 
	 * 	the system will honor the timezone information of that [ECMASCRIPT] Date object or not. 
	 *	The system must associate the JSON-serializable data with the task if provided.
	 * Let promise be a new Promise object and resolver its associated resolver.
	 * Return promise and run the remaining steps asynchronously.
	 * If an error occurs, run these substeps and then terminate these steps:
	 * 	Let error be a new DOMError object whose name is "InvalidStateError" if the date argument 
	 *		is in the past, "QuotaExceededError" if the data argument exceeds an implementation-dependent 
	 *		size limit, and "UnknownError" otherwise.
	 * 	Run resolver's internal reject algorithm with error as value.
	 * When the operation completes successfully, run these substeps:
	 * 	Let task be a new ScheduledTask object.
	 * 	Set task's id attribute to the unique identifier returned by the system for the newly 
	 *		registered task.
	 * 	Set task's date attribute to the date argument.
	 * 	Set task's timezoneDirective attribute to the timezoneDirective argument.
	 * 	Set task's data attribute to the data argument, if provided.
	 * Run resolver's intenal fulfill algorithm with task as value.
	 * 
	 */

    /*
     * Executing add function from console:
     *
     *  window.taskSchedule.add(new Date(), true).then(function(){ console.log("OK")}, function(){ console.log("FAIL")});
     */

    TaskScheduler.prototype.add = function (taskTime, respectTZ, data) {
        return new Promise(function (resolver) {
            var idlDate = new IDLDate(taskTime),
                respectTZ = IDLBoolean(respectTZ),
                current_date = Date.now(),
                triggerTime = idlDate.value.getTime() - current_date;

            // Check if time for task is not in the past or now()
            if (triggerTime <= 0) {
                console.log("Task time is in the past, sorry task can not be added");
                resolver.reject("error invalid time"); //issue is rejected
            }
            // task data object
            var task_data = {
                date: idlDate.value,
                respectTZ: (respectTZ === undefined) ? true : !! (respectTZ),
                data: (data === undefined) ? null : (data),
                raised: false
            };

            /*
             * prepare key to store task: it is date  + time + random number
             */
            var key = "Date:" + task_data['date'].getDate() + "-" + (task_data['date'].getMonth() + 1) 
	    + "-" + task_data['date'].getFullYear() + " " + task_data['date'].getHours() 
	    + ":" + task_data['date'].getMinutes() + ":" + task_data['date'].getSeconds() 
	    + " " + Math.round(Math.random() * 100000);

            /* 
             * Add new item to localStorage
             */
            try {
                localStorage.setItem(key, JSON.stringify(task_data));
            } catch (err) {
                console.log("ERROR!!! Item can NOT be added to localStorage. error:" + err.message);
                resolver.reject(err.message);
            }
            /*
             * Raise this task
             */
            raise_specific_task(task_data, key, current_date);

            resolver.fulfill(true);
        });
    };

    /*********************************************************************
	 * 		remove
	 * *******************************************************************

	/*
	 *  SPEC:
	 * 
	 *  When invoked, the remove(taskId) method must run the following steps:
	 * 
	 * Make a request to the system to unregister the task with the given unique taskId identifier.
	 * Let promise be a new Promise object and resolver its associated resolver.
	 * Return promise and run the remaining steps asynchronously.
	 * If an error occurs, run these substeps and then terminate these steps:
	 * 	Let error be a new DOMError object whose name is "UnknownError".
	 * 	Run resolver's internal reject algorithm with error as value.
	 * When the operation completes successfully, run these substeps:
	 * 	Let removed be a boolean value.
	 * 	Set removed to true if the task was removed, and to false if there was no task with the given 
	 		identifier.
	 * Run resolver's intenal fulfill algorithm with removed as value.
	 * 
	 */

    TaskScheduler.prototype.remove = function (taskId) {
        return new Promise(function (resolver) {
            console.log("Removing task id: " + taskId);
            try {
                localStorage.removeItem(taskId);
            } catch (err) {
                console.log("ERROR!!! Item can NOT be removed from localStorage. error:" + err.message);
                resolver.reject(err.message);
            }
            resolver.fulfill(true);
        });
    };

    /*********************************************************************
	 * 		getPendingTasks
	 * *******************************************************************


	/*
	 *  SPEC:
	 * 
	 * When invoked, the getPendingTasks() method must run the following steps:
	 * 
	 * Make a request to the system to retrieve the tasks that were registered 
	 * 	by the current application and whose scheduled time is in the future.
	 * Let promise be a new Promise object and resolver its associated resolver.
	 * Return promise and run the remaining steps asynchronously.
	 * If an error occurs, run these substeps and then terminate these steps:
	 * 	Let error be a new DOMError object whose name is "UnknownError".
	 * 	Run resolver's internal reject algorithm with error as value.
	 * 	When the operation completes successfully, run these substeps:
	 * Let tasks be a new array containing the ScheduledTask objects that were retrieved.
	 * Run resolver's intenal fulfill algorithm with tasks as value.
	 * 
	 * 
	 * EXTRA:
	 * 	getPendingTasks:
	 *		function will remove all older than now() tasks from localStorage
	 * 
	 */

    /*
     * Executing getPendingTasks function from console:
     *
     * window.taskScheduler.getPendingTasks().then(function(){ alert("OK")}, function(){ alert("FAIL")});
     *
     */

    TaskScheduler.prototype.getPendingTasks = function () {
        return new Promise(function (resolver) {

            var all_pending_tasks = [],
                current_date = new Date(),
                tmp_stored_item = null,
                old_tasks = [];

            if (localStorage.length === 0) {
                console.log("Thera are no tasks in localStorage");
                resolver.reject("localStorage is EMPTY!");
                return;
            }


            console.log(" localStorage length = " + localStorage.length);
            /* 
             * get all tasks from localStorage
             */

            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i) != null) {
                    console.log("item (" + i + "); key: " + localStorage.key(i));

                    //check if item is in the future
                    tmp_stored_item = JSON.parse(localStorage.getItem(localStorage.key(i)));

                    //compare if date is in the future
                    if (current_date - (new Date(tmp_stored_item['date'])) < 0) {
                        //add to array of pending tasks object
                        all_pending_tasks.push({
                            key: localStorage.key(i),
                            data: tmp_stored_item
                        });
                    } else {
                        old_tasks.push({
                            key: localStorage.key(i)
                        });
                    }
                } else {
                    TaskScheduler.prototype.remove(localStorage.key(i));
                }
            }

            /*
             * Remove old tasks
             */
            for (var i = 0; i < old_tasks.length; i++) {
                console.log("This OLD task will be REMOVED, task date: " 
		+ localStorage.getItem(old_tasks[i].key)['date']);
                localStorage.removeItem(old_tasks[i].key);
            }

            if (all_pending_tasks.length > 0) {
                console.log("List of all PENDING TASKS from date: " + current_date);
                console.log(all_pending_tasks);
                resolver.fulfill(all_pending_tasks);
            } else {
                console.log("No pending tasks");
                resolver.fulfill(null);
            }
        });
    };

    WebIDL.exportInterface(TaskScheduler, "TaskScheduler");

    return TaskScheduler;
});

