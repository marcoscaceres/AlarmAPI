function add_clock()
{
	// adding main time setter input field - to be set by user
  	var timer_elem = document.createElement("input");
	timer_elem.setAttribute("type", "time");
	timer_elem.setAttribute("value", "12:00");
	timer_elem.setAttribute("name", "set_time");
	timer_elem.id = "task_time";

	// adding button to set time when abover timer is set 
	var foo = document.getElementsByTagName('body')[0];;
	foo.appendChild(timer_elem);
	var add_task_time = document.createElement("input");
	add_task_time.setAttribute("type", "button");
	add_task_time.setAttribute("value", "time set");
	add_task_time.setAttribute("name", "add_task");
	add_task_time.setAttribute("onclick", "set_time('task_time')");
	foo.appendChild(add_task_time);
	
	var add_time_now = document.createElement("input");
	add_time_now.setAttribute("type", "button");
	add_time_now.setAttribute("value", "use current time + 1 min");
	add_time_now.setAttribute("name", "add_now");
	add_time_now.setAttribute("onclick", "set_time_now()");
	foo.appendChild(add_time_now);
	
	
	
}


function set_time(task_time)//pass element name
{
	var time = document.getElementById(task_time).value;
	var foo = null;
	if( document.getElementById('timer') )
	{
	    foo = document.getElementById('task_details');
	    foo.removeChild(document.getElementById('timer'));
	    console.log("Removed old time");
	}
	console.log("New time set: "+ time);
	
	foo = document.getElementById('task_details');
	var timer=document.createElement("p");
	timer.id = "timer";
	timer.innerHTML = time;
	foo.appendChild(timer);
	
	calendar_date.setHours(time.substr(0,time.indexOf(":")));
	calendar_date.setMinutes(time.substr(time.indexOf(":")+1,time.length));
	console.log("New calendar date: "+calendar_date);
}

function set_time_now()
{
	var time = new Date();
	time.setMinutes( time.getMinutes() + 1 ); //adding extra 1 min
	var foo = null;
	if( document.getElementById('timer') )
	{
	    foo = document.getElementById('task_details');
	    foo.removeChild(document.getElementById('timer'));
	    console.log("Removed old time");
	}
	console.log("New time set: "+ time);
	
	foo = document.getElementById('task_details');
	var timer=document.createElement("p");
	timer.id = "timer";
	timer.innerHTML = time;
	foo.appendChild(timer);
	
	calendar_date.setHours(time.getHours());
	calendar_date.setMinutes(time.getMinutes());
	console.log("New calendar date: "+calendar_date);
}

