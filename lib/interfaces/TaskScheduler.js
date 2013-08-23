/*
enum TimezoneDirective { "respectTimezone", "ignoreTimezone" };

interface TaskScheduler {
  Promise getPendingTasks();
  Promise add(Date date, TimezoneDirective timezoneDirective, optional any data);
  Promise remove(DOMString taskId);
};
*/


var TimezoneDirective = {respectTimezone: "respectTimezone", ignoreTimezone: "ignoreTimezone"};
//alert (TimezoneDirective['respectTimezone'] );

define(function(require) {
	'use strict';
	var 	WebIDL = require("WebIDL"),
		EventTarget = require("DOM/EventTarget"),
		IDLDate = require("WebIDL/types/Date"),
		IDLBoolean = require("WebIDL/types/Boolean");
		
	
	function TaskScheduler() {
		EventTarget.call(this);  
	}
	
	 

	TaskScheduler.prototype = new EventTarget();  
	 
	
	/*
	 *  When invoked, the add(date, timezoneDirective[, data]) method must run the following steps:
	 * 
	 * Make a request to the system to schedule a new task for the current application that will trigger at the given date. Depending on the timezoneDirective argument, 
	 * 	the system will honor the timezone information of that [ECMASCRIPT] Date object or not. The system must associate the JSON-serializable data with the task if provided.
	 * Let promise be a new Promise object and resolver its associated resolver.
	 * Return promise and run the remaining steps asynchronously.
	 * If an error occurs, run these substeps and then terminate these steps:
	 * 	Let error be a new DOMError object whose name is "InvalidStateError" if the date argument is in the past, 
	 * 		"QuotaExceededError" if the data argument exceeds an implementation-dependent size limit, and "UnknownError" otherwise.
	 * 	Run resolver's internal reject algorithm with error as value.
	 * When the operation completes successfully, run these substeps:
	 * 	Let task be a new ScheduledTask object.
	 * 	Set task's id attribute to the unique identifier returned by the system for the newly registered task.
	 * 	Set task's date attribute to the date argument.
	 * 	Set task's timezoneDirective attribute to the timezoneDirective argument.
	 * 	Set task's data attribute to the data argument, if provided.
	 * Run resolver's intenal fulfill algorithm with task as value.
	 * 
	 */
	/*
	 *  I've decided to use localStorage to create fake database
	 */ 
	
	/*
	 * Executing add function from console:
	 * 
	 *  window.tasks.add(new Date(), true).then(function(){ alert("OK")}, function(){ alert("FAIL")});   <-- with Promise
	 *  window.tasks.add(new Date(), true) <-- without Promise
	 * 
	 */
	
	TaskScheduler.prototype.add = function(taskTime, respectTZ, data) {
	    return new Promise(function(resolver) {

		    var idlDate = new IDLDate(taskTime), 
			respectTZ = IDLBoolean(respectTZ),
			triggerTime = idlDate.value.getTime() - Date.now();
		    
		    //Check if time for task is not in the past or now()
		    if(triggerTime <= 0) {
			throw new TypeError("Invalid time");
		    }
		    // task data object
		    var task_data = {
			date: idlDate.value,
			respectTZ: (respectTZ === undefined) ? true : !! (respectTZ),
			data: (data === undefined) ? null: (data),
			timeout: setTimeout((function(task_data) {
				return function() {
					var ev = new CustomEvent("task");
					task_data.dispatchEvent(ev);
				};
			}(this)), triggerTime)
		    };
			  
		    // prepare key to store task: it is date  + time + random number
		    var key = "Date:"+task_data['date'].getUTCDate()+"-"+task_data['date'].getUTCMonth()+"-"+task_data['date'].getUTCFullYear()
		    +" "+task_data['date'].getHours() + ":"+task_data['date'].getMinutes() +":"+task_data['date'].getSeconds() + " " + Math.round(Math.random()*100000);
		    
		    console.log("key: "+ key);
		    console.log("item added: "+JSON.stringify(task_data));
		    
		    //Adding item to localStorage
		    var status = false;
		    try{
			localStorage.setItem (key, JSON.stringify(task_data));
			status = true;
		    }
		    catch(err){
			console.log("ERROR!!! Item can NOT be added to localStorage. error:"+ err.message);
		    }
		    // Resolver:
		    resolver.fulfill(status);
		    
		    
		    /* 
		     * 
		     *	Check if data was properly stored this code can be removed after testing of this interface 
		     * 
		     */
		    
		    /*
		    //Get item from localStorage
		    try{
		      var stored_task = localStorage.getItem (key);
		    }
		    catch(err){
			console.log("ERROR!!! Item can NOT be get from localStorage. error:"+ err.message);
		    }
		    
		    //Convert data from localStorage to object
		    if (stored_task) {
		      	var task_data_get = JSON.parse(stored_task);
		    }
		    
		    // Check if task is stored correctly, if so we can return success 
		    if ( JSON.stringify(task_data['date']) === JSON.stringify(task_data_get['date']) 
			&& task_data['respectTZ'] === task_data_get['respectTZ'] 
			&& task_data['timeout'] === task_data_get['timeout']){
		      
			console.log ("EUREKA! Date in localStorage is correct.");
			resolver.fulfill(true);
		    }
		    else{
			console.log("BUUUUUUUUUUUU! something went terribly wrong. More details below:");
			
			console.log("date set:"+task_data['date'] + " got: "+  (new Date(task_data_get['date'])));
			console.log("respectTZ set: "+task_data['respectTZ'] + " got: "+  task_data_get['respectTZ']);
			console.log("timeout set:"+task_data['timeout'] + " got: "+  task_data_get['timeout']);
			
			resolver.fulfill(false);
		    }
		    */
	    });
	};
	
	
	/*
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
	 * 	Set removed to true if the task was removed, and to false if there was no task with the given identifier.
	 * Run resolver's intenal fulfill algorithm with removed as value.
	 * 
	 */
	
	TaskScheduler.prototype.remove = function(taskId) {
	    return new Promise(function(resolver) {
		console.log("Removing task id: "+taskId);
		try{
		    localStorage.removeItem(taskId);
		}
		catch(err){
		    console.log("ERROR!!! Item can NOT be removed from localStorage. error:"+ err.message);
		    resolver.fulfill(false);
		}
		resolver.fulfill(true);
	    });
	};

	/*
	 * When invoked, the getPendingTasks() method must run the following steps:
	 * 
	 * Make a request to the system to retrieve the tasks that were registered by the current application and whose scheduled time is in the future.
	 * Let promise be a new Promise object and resolver its associated resolver.
	 * Return promise and run the remaining steps asynchronously.
	 * If an error occurs, run these substeps and then terminate these steps:
	 * 	Let error be a new DOMError object whose name is "UnknownError".
	 * 	Run resolver's internal reject algorithm with error as value.
	 * 	When the operation completes successfully, run these substeps:
	 * Let tasks be a new array containing the ScheduledTask objects that were retrieved.
	 * Run resolver's intenal fulfill algorithm with tasks as value.
	 * 
	 */

	TaskScheduler.prototype.getPendingTasks = function() {
	     return new Promise(function(resolver) {
		
		var all_pending_tasks=[],
		    current_date=new Date(),
		    tmp_stored_item = null,
		    tmp_from_date=null,
		    tmp_date=null,
		    tmp_time=null;
		
		console.log( localStorage.length);
		// get all tasks from localStorage
		for (var i=1; i <= localStorage.length; i++)  {
		    console.log("item ("+i+ ") with key "+ localStorage.key(i)+": "+localStorage.getItem(i));
		    //check if item is in the future
		    tmp_stored_item = JSON.parse(localStorage.getItem(localStorage.key(i)));
		    
		    //display full item
		    console.log(tmp_stored_item['date']);
		    //date
		    tmp_date = tmp_stored_item['date'].substring(0, tmp_stored_item['date'].indexOf('T'));
		    console.log(tmp_date);
		    //time
		    tmp_time = tmp_stored_item['date'].substring(tmp_stored_item['date'].indexOf('T')+1, tmp_stored_item['date'].indexOf('.'));
		    console.log(tmp_time);
		    
		    
		    
		    //Check date and if fits add to pending tasks array, if date is old remove it
		    tmp_from_date = current_date.getUTCFullYear()+"-"+current_date.getUTCMonth()+"-"+current_date.getUTCDate();
		    if ((new Date(tmp_from_date)) - (new Date (tmp_date)) <= 0){
			//TODO compare time if it is the same date

			//add to pending tasks object
			all_pending_tasks.push({key: localStorage.key(i), data: tmp_stored_item});
		    }
		    else{
			//remove old task
			console.log ("Old task: TO BE REMOVED: " + tmp_date );
			TaskScheduler.prototype.remove(localStorage.key(i));
	
		    }
		    console.log("List of all PENDING TASKS from date:"+tmp_from_date);
		    console.log(all_pending_tasks);
		    
		    //nulling all variables - just in case
		    tmp_stored_item = null,
		    tmp_from_date=null,
		    tmp_date=null,
		    tmp_time=null;
		}
		resolver.fulfill(true);
	       
	     });
	};
	
	
	WebIDL.exportInterface(TaskScheduler, "TaskScheduler");

	return TaskScheduler;
});
