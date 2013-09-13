/*
 * Function that adds input field where user can add DATA for new task
 */
function add_data_field()
{
	/* adding button to add data for new task */
	var add_data = document.createElement("input");
	add_data.setAttribute("type", "text");
	add_data.setAttribute("value", "");
	add_data.setAttribute("name", "add_task_data");
	add_data.id = "task_data";

	var foo = document.getElementsByTagName('body')[0];
	foo.appendChild(add_data);
}


/*
 * Function that adds button to add new task
 */

function add_task_button()
{
	/* adding button to add new task */
	var add_task = document.createElement("input");
	add_task.setAttribute("type", "button");
	add_task.setAttribute("value", "Add new task");
	add_task.setAttribute("name", "add_task");
	add_task.setAttribute("onclick","add_task()");

	var foo = document.getElementsByTagName('body')[0];
	foo.appendChild(add_task);
}


/*
 * Function that adds new task to TaskScheduler
 */
function add_task()
{
      window.taskScheduler.add(calendar_date, true, document.getElementById('task_data').value ).then(function(){ console.log('task creation SUCCESS')}, function(){  console.log('task creation FAILED')});
}



function get_pending_tasks()
{
    window.taskScheduler.getPendingTasks().then(function(){ console.log('task creation SUCCESS')}, function(){console.log('task creation FAILED')});
}


function add_pendingTasks_button( )
{
	var foo = document.getElementsByTagName('body')[0];
	var tmp = document.createElement("br");
	foo.appendChild(tmp);
	tmp = document.createElement("br");
	foo.appendChild(tmp);
  	/* adding button to get all pendung tasks */
	var add_task = document.createElement("input");
	add_task.setAttribute("type", "button");
	add_task.setAttribute("value", "get pending tasks");
	add_task.setAttribute("name", "get_pending_tasks");
	add_task.setAttribute("onclick","get_pending_tasks()");
	foo.appendChild(add_task);
}






