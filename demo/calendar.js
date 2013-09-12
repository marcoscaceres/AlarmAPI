var calendar_date=new Date ();
calendar_date.setSeconds(0);

function calendar(date)
{
        var day = date.getDate(),
	    month = date.getMonth(),
	    year = date.getUTCFullYear(),
	    months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December'),
	    days_in_month = new Array(31,28,31,30,31,30,31,31,30,31,30,31),
	    days_in_week = new Array ('Sun','Mon','Tue','Wed','Thu','Fri','Sat'),
	    month_days_number = null,
	    first_day_of_month = date,
	    week_number = 0,
	    first_week = null,
	    last_week_indicator = false;
	
	var today = day + ' ' + months[month] + ' ' + year;

	/*
	 * handle leap-year
	 */
	if(year%4 === 0 && year != 1900)
        {
                days_in_month[1] = 29;
        }
        month_days_number = days_in_month[month];

	/*
	 * Get the day name when month starts
	 */
	first_day_of_month.setDate(1); 
	first_day_of_month = first_day_of_month.getDay();
	
	/*
	 * add calendar days accordingly
	 */
	var tmp_table_elem_1 = null,
	    tmp_table_elem_2 = null,
	    table= null,
	    table_body = null;
	    body = document.getElementsByTagName('body')[0],
	    tmp_elem_handler = null;

	var i = 0,
	    j = 0;
	// create table element
	table = document.createElement('table');
	table.setAttribute( "class", "calendar");
	
	//create tbody element
	table_body = document.createElement("tbody");
	table_body.setAttribute( "id", "table_body");

	/*
	 * create first row of the table - TODAY date
	 */
	tmp_table_elem_1 = document.createElement('tr');
	tmp_table_elem_1.setAttribute('id','current_date');
	  tmp_table_elem_2 = document.createElement('th');
	  tmp_table_elem_2.setAttribute( "colspan", "7");
	  tmp_table_elem_2.appendChild(document.createTextNode(today));
	tmp_table_elem_1.appendChild( tmp_table_elem_2);
	//add first row with current date
	table_body.appendChild(tmp_table_elem_1);
	tmp_table_elem_1 = null;
	tmp_table_elem_2 = null;
	
	/*
	 * create second row of the table - week days name
	 */
	tmp_table_elem_1 = document.createElement('tr');
	tmp_table_elem_1.setAttribute('id','week_days');
	  for (i=0; i< 7; i++){
	    tmp_table_elem_2 = document.createElement('th');
	    tmp_table_elem_2.appendChild(document.createTextNode(days_in_week[i]));
	    tmp_table_elem_1.appendChild( tmp_table_elem_2);
	  }
	//add first row with week days
	table_body.appendChild(tmp_table_elem_1);
	//add extra empty row - just to make it look better
	tmp_table_elem_1 = document.createElement('tr');
	table_body.appendChild(tmp_table_elem_1);
	tmp_table_elem_1 = null;
	tmp_table_elem_2 = null;
	
	/*
	 * Add proper calerndar days
	 */
	week_number = 0; 
	//first week can contain days from previous month
	first_week = document.createElement('tr');
	for(i = 1; i <= first_day_of_month; i++)
        {
		tmp_table_elem_2 = document.createElement('td');
		tmp_table_elem_2.setAttribute('class','days_from_other_month');
		tmp_table_elem_2.appendChild(document.createTextNode((days_in_month[month-1]-first_day_of_month + i)));
		//add first row with week days
		first_week.appendChild( tmp_table_elem_2);
		tmp_table_elem_2 = null;
        }
	
	var week_end_day = 7 - first_day_of_month;
	
	tmp_table_elem_1 = document.createElement('tr');
 
	for(i = 1; week_number < (Math.round(month_days_number + first_day_of_month)/7) ; i++) 
        {
                if(week_number === 0){
			// filling up first week
			tmp_table_elem_2 = document.createElement('td');
			if (day === i){
			    tmp_table_elem_2.setAttribute('class','today');
			}
			tmp_table_elem_2.setAttribute("onclick","set_calendar_date("+i+","+month+","+year+")");
			tmp_table_elem_2.appendChild(document.createTextNode( i - month_days_number + month_days_number ));
			first_week.appendChild( tmp_table_elem_2);
			tmp_table_elem_2 = null;
                }
                else{
			tmp_table_elem_2 = document.createElement('td');
			if (day === i){
			    tmp_table_elem_2.setAttribute('class','today');
			}
			if(last_week_indicator){
  			    tmp_table_elem_2.setAttribute('class','days_from_other_month');
			}
			else{
			    tmp_table_elem_2.setAttribute("onclick","set_calendar_date("+i+","+month+","+year+")");
			}
			tmp_table_elem_2.appendChild(document.createTextNode((i <= month_days_number) ? i: (i - month_days_number) ));
			tmp_table_elem_1.appendChild( tmp_table_elem_2);
			tmp_table_elem_2 = null;
		}
                if(week_end_day === i) // add row when it is ready - at the end of the week
                {
		      if (week_number === 0){
			table_body.appendChild(first_week);
			first_week = null;
		      }
		      else{
			table_body.appendChild(tmp_table_elem_1);
			tmp_table_elem_1 = null;
		      }
		      week_end_day += 7;
		      week_number++;
		      tmp_table_elem_1 = document.createElement('tr');
                }
                if (i === month_days_number){
		    last_week_indicator = 1;
		}
                tmp_table_elem_2 = null;
        }
	tmp_table_elem_2 = null;
	tmp_table_elem_1 = null; 

        table.appendChild(table_body);
	body.appendChild(table); 
	
        return true;
}

function set_calendar_date(day, month, year)
{
    calendar_date.setDate(day);
    calendar_date.setMonth(month);
    calendar_date.setYear(year);
    
    var task_details = document.getElementById('task_details');
    var foo = null;
    if( document.getElementById('dater') )
    {
	foo = document.getElementById('task_details');
	foo.removeChild(document.getElementById('dater'));
    }
    
    foo = document.getElementById('task_details');
    var dater=document.createElement("p");
    dater.id = "dater";
    dater.innerHTML = calendar_date.getDate() + "-" + calendar_date.getMonth()
	+ "-" +calendar_date.getUTCFullYear() ;
    foo.appendChild(dater);
}

function add_task_details_field()
{
    var p = document.createElement('p');
    p.setAttribute( "id", 'task_details');
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(p);
}

