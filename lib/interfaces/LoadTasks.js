/****************************************************************************************
 * 
 * This is a file containing functions that simulates "system" messages 
 * 	it contains functions to raise/close (setTimeout dispatchEvent) tasks from localstorage
 * 
 * 
 * Functions:
 * 	Required by TaskScheduler prototype:
 * 	- raise_specific_task(TASK, KEY, DATA) 
 * 		function that raise one specific task
 * 
 * 
 * 	optional to TaskScheduler prototype:
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
 * 
 ****************************************************************************************/

/*
 * Function that will raise all tasks with 'raised' status set to false
 *	only tasks from date will be raised
 */
function raise_all_tasks(date)
{
      var all_not_raised_tasks=[],
      tmp_stored_item = null;
      /* 
       * Get all tasks from localStorage and check its "raised" status
       * 	false - task need to be raised, why:
       *			- page was closed and all setTimeout's has been cancelled
       * 			- new task just added
       * 	true - task raised and waiting, an event "task" will be raised
       */
      for (var i = 1; i <= localStorage.length; i++){	
	      if ( localStorage.key(i) != null){
		tmp_stored_item = JSON.parse(localStorage.getItem(localStorage.key(i)));
		/*
		 * check localstorage item 'raised' status:
		 *	false - task need to be raised
		 *	true - task already raised - do nothing
		 */
		if ( tmp_stored_item['raised'] === false ){
			raise_specific_task (tmp_stored_item, localStorage.key(i), date);
			all_not_raised_tasks.push({key: localStorage.key(i), data: tmp_stored_item});
		}
		tmp_stored_item = null;
	      }
      }
      if( all_not_raised_tasks.length < 0 ){
	  console.log("List of all PENDING TASKS from date: " + new Date(date));
	  console.log(all_not_raised_tasks);
      }
      else
      {
	  console.log("There are no tasks to be raised");
      }
}


/*
 * Function that will raise specyfic tasks with:
 *	- 'raised' status set to false 
 *	and
 *	- date in the future
 * 
 * Input params:
 * 	@task 	- localStorage item
 * 	@key 	- localStorage item key
 * 	@date 	- Date from which task can be raised 
 * 
 * Return:
 * 	nothing
 */

function raise_specific_task(task, key, date)
{
    var triggerTime = new Date(task['date']) - date;
    if (triggerTime >= 0)
    {
	  setTimeout((function(task) {
			    return function() {
				    var ev = new CustomEvent("task",{detail:{
								      data: task['data'],
								      date: task['date'] 
								      }
				    });
				    console.log ("SCHEDULED TASK RAISED! Task data: "+ task['data'] +"; task date:"+task['date']);
				    document.dispatchEvent(ev); 
			    };
		    })(task), triggerTime);
	  console.log("Raised task scheduled for:"+ task['date']+ "  with data: "+ task['data']);
	  /*
	   * 	task 'raised' value is set to true now
	   *	taks with new valued is save to localStorage
	   */
	  task['raised'] = true; 
	  localStorage.setItem (key, JSON.stringify(task));
    }
}


/*
 * Invoke functiona that will raise all tasks when page is loaded and script is loaded
 */

raise_all_tasks(new Date());


/*
 * Function that will close all pending tasks with 'raised' status set to true
 *	only tasks from date will be closed, the rest will be removed from localStorage
 */
function close_all_tasks(date)
{
      /*
       * Cleaning up localStorage
       */
      window.TaskScheduler.getPendingTasks().then(function(){ console.log("localStorage task clean up SUCESS")}, function(){ console.log("localStorage task clean up FAILED")});
      
      /*
       * Closign pending tasks
       */
      console.log( "CLOSING ALL TASKS! ");
      var all_not_closed_tasks=[],
      tmp_stored_item = null;

      /* 
       * Get all tasks from localStorage and check its "raised" status
       * 	true - task need to be closed, why:
       *		- page is going to be closed and all setTimeout's has been cancelled
       * 		therefore data in localStorage need to be change
       * 	false - task closed nothing to do
       */
      for (var i = 1; i <= localStorage.length; i++){	
	      if ( localStorage.key(i) != null){
		//check if item is in the future
		tmp_stored_item = JSON.parse(localStorage.getItem(localStorage.key(i)));
		
		//display full items
		console.log("stored item raise status: "+ tmp_stored_item['raised']);
	
		//raise task if not raised yet
		if ( tmp_stored_item['raised'] === true ){
			close_specific_task (tmp_stored_item, localStorage.key(i), date);
			all_not_closed_tasks.push({key: localStorage.key(i), data: tmp_stored_item});
		}
	      }
      }
      if( all_not_raised_tasks.length < 0 ){
	  console.log("List of all CLOSED TASKS from date: " + new Date(date));
	  console.log(all_not_closed_tasks);
      }
}

/*
 * Function that will close specyfic tasks with:
 * 	- 'raised' status set to true 
 * 
 * Input params:
 * 	@task 	- localStorage item
 * 	@key 	- localStorage item key
 * 	@date 	- Date from which task can be raised 
 * 
 * Return:
 * 	nothing
 */
function close_specific_task(task, key, date)
{
    var triggerTime = new Date(task['date']) - date;
    if (triggerTime >=0)
    {
	  if( task['raised'] === true)
	  {
	      task['raised'] = false; 
	      localStorage.setItem (key, JSON.stringify(task));
	  }
    }
}


