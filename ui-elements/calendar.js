class calendar 
{
    current_day = "";
    current_month = "";
    current_year = "";

    hide_type = 1;

    /**
     * 
     * @param {element} ele element getting calendar popup
     * @param {string} hide element getting calendar popup
     */
    constructor(ele, hide = "hide") 
    {
        this.date = new Date();
        this.current_day = this.date.getDate();
        this.current_month = this.date.getMonth();
        this.current_year = this.date.getFullYear();

        if(hide == "hide")
        {
            this.hide_type = 1;
        }
        else if(hide == "remove")
        {
            this.hide_type = 2;
        }
        else
        {
            throw new Error('Invalid "hide" option, must pass either "hide" or "remove".');
        }

        //addEvent(ele,"onclick", "");
    }

    /**
     * 
     * @param {*} ele 
     * @param {*} event 
     * @param {*} funct 
     * @returns 
     */
    addEvent(ele, event, funct)
    {
        if (ele.attachEvent){
            return ele.attachEvent('on'+event, funct);
        }
        else
        {
            return ele.addEventListener(event, funct, false);
        }
    }

    /**
     * 
     * @param {int} year 
     * @param {int} month 
     * @returns {int} last day of the month
     */
    calcMonth(year, month)
    {
        return new Date(year, month+1, 0).getDate();
    }

    /**
     * 
     * @param {int} month 
     * @returns {string} fullname of month
     */
    getMonthName(year, month)
    {
        const date = new Date(year, month, 1); 
        return date.toLocaleString('default', { month: 'long' });
    }

    /**
     * Get next or previous month
     * @param {int} interval (pass negative value to get previous months)
     * @returns {int}
     */
    getNextMonth(interval = 1)
    {
        return new Date(this.current_year, this.current_month+interval, this.current_day).getMonth();
    }

    /**
     * Get next or previous year
     * @param {int} interval (pass negative value to get previous years)
     * @returns {int}
     */
    getNextYear(interval = 1)
    {
        return new Date(this.current_year+interval, this.current_month, this.current_day).getFullYear();
    }

    /**
     * Get numeric day of week 1-7 (1 is Monday, 7 is Sunday)
     * @param {int} year 
     * @param {int} month 
     * @param {int} day 
     * @returns {int}
     */
    getDayOfWeek(year, month, day)
    {
        return new Date(year, month, day).getDay();
    }

    /**
     * Setter for date properties
     * @param {int} year 
     * @param {int} month 
     * @param {int} day 
     */
    setDate(year, month, day)
    {
        const date = new Date(year, month, day); 
        this.date = date;
        this.current_day = this.date.getDate();
        this.current_month = this.date.getMonth();
        this.current_year = this.date.getFullYear();
    }

    /**
     * Create calendar div to display under elements
     * @returns {element}
     */
    createCalender()
    {
        
        console.log(document.getElementById("test"));
        let monthName = this.getMonthName(this.current_year, this.current_month);
        let daysInMonth = this.calcMonth(this.current_year, this.current_month);
        let firstWeekDayOfMonth = this.getDayOfWeek(this.current_year, this.current_month, 1);
        
        let weekGroups = [];
        weekGroups[0] = [];

        let div_container = document.createElement("div");
        div_container.classList.add("calendar_container");
        div_container.id = "calendar_container";

        let year = document.createElement("div");
        year.classList.add("calendar_year_dd");
        year.appendChild(document.createTextNode(this.current_year));

        let nextyear= document.createElement("div");
        nextyear.classList.add("calendar_nextyear");
        nextyear.appendChild(document.createTextNode(">>"));

        let prevyear = document.createElement("div");
        prevyear.classList.add("calendar_prevyear");
        prevyear.appendChild(document.createTextNode("<<"));

        let nextmonth = document.createElement("div");
        nextmonth.classList.add("calendar_nextmonth");
        nextmonth.appendChild(document.createTextNode(">>"));

        let prevmonth = document.createElement("div");
        prevmonth.classList.add("calendar_prevmonth");
        prevmonth.appendChild(document.createTextNode("<<"));

        let month = document.createElement("div");
        month.classList.add("calendar_month_dd");
        month.appendChild(document.createTextNode(monthName));
        

        let div_body = document.createElement("div");
        div_body.classList.add("calendar_body");

        let table = document.createElement("table");
        table.classList.add("calendar_table");

        let theader = table.createTHead();
        theader.classList.add("calendar_header");
        let tr = theader.insertRow();
        tr.classList.add("calendar_header_row");
        
        //set year
        let td = tr.insertCell();
        td.appendChild(prevyear);
        td = tr.insertCell();
        td.colSpan = "5";
        td.appendChild(year);
        td = tr.insertCell();
        td.appendChild(nextyear);

        //new row
        tr = theader.insertRow();
        tr.classList.add("calendar_header_row");

        //set month
        td = tr.insertCell();
        td.appendChild(prevmonth);
        td = tr.insertCell();
        td.colSpan = "5";
        td.appendChild(month);
        td = tr.insertCell();
        td.appendChild(nextmonth);

        //new row for calendar days
        let tbody = table.createTBody();
        tbody.classList.add("calendar_tbody");

        tr = tbody.insertRow();
        tr.classList.add("calendar_row");
        td = tr.insertCell();
        td.colSpan = "3";
        td.innerHTML = "<div class='today'>Today</div>";

        td = tr.insertCell();
        
        tr.classList.add("calendar_row");
        td = tr.insertCell();
        td.colSpan = "3";
        td.innerHTML = "<div class='clear_date'>Clear</div>";

        tr = tbody.insertRow();
        tr.classList.add("calendar_row");
        
        console.log(monthName);
        //create array of weeks that contain each numeric day aligned with the week day
        for(let i=0, day=1; day <= daysInMonth; i++)
        {
            //check if i has reached the numeric day of week for the 1st of the month
            if(i >= firstWeekDayOfMonth)
            {
                //if remainder is zero, we've reached saturday
                if(i % 7 == 0 && i != 0)
                {
                    tr = tbody.insertRow();
                    tr.classList.add("calendar_row");
                }

                td = tr.insertCell();
                let div_num = document.createElement("div");
                div_num.classList.add("calendar_day");
                div_num.innerHTML = day
                td.appendChild(div_num);
                day++;
            }
            else
            {
                td = tr.insertCell();
                td.appendChild(document.createTextNode(""));
            }
        }

        console.log(table);

        table.appendChild(theader);
        table.appendChild(tbody);
        div_body.appendChild(table);
        div_container.appendChild(div_body);

        return div_container;

    }

    /**
     * Selecting day/month/year element from the calendar
     * @param {element} element 
     * @param {string} type 
     */
    selectingDate(element, type)
    {
        const types = {'day':0, 'month':1, 'year':2};
        let day = this.current_day;
        let month = this.current_month;
        let year = this.current_year;

        switch(types.type)
        {
            case 0:
                day = element.innerHTML;
                break;
            case 1:
                if(element.innerHTML == ">>")
                {
                    month = this.getNextMonth();
                }
                else
                {
                    month = this.getNextMonth(-1);
                }
                break;
            case 2:
                if(element.innerHTML == ">>")
                {
                    year = this.getNextYear();
                }
                else
                {
                    year = this.getNextYear(-1);
                }
                break;
        }

        //set new date
        setDate(day, month, year);
        
    }

    showCalendar(ele)
    {
        let body = document.body;
        let calendar = this.createCalender();
        
        var offsets = ele.getBoundingClientRect();
        
        calendar.style.top = (offsets.top + offsets.height) + "px";
        calendar.style.left = (offsets.left)-5 + "px";

        calendar.display = "block";
        body.appendChild(calendar);
    }

    hideCalendar()
    {
        if(this.hide_type == 1)
        {
            document.getElementById("calendar_container").style.display = "none";
        }
        else
        {
            document.getElementById("calendar_container").remove();
        }
    }

    /**
     * Returns multidimensional array formatted similar to the table in createCalender 
     * @returns {array}
     */
    getArrayOfDays()
    {
        let daysInMonth = this.calcMonth(this.current_year, this.current_month);
        let firstWeekDayOfMonth = this.getDayOfWeek(this.current_year, this.current_month, 1);
        let weekGroups = [];
        weekGroups[0] = [];

        for(let i=0, x=0,day=1; day <= daysInMonth; i++)
        {
            //check if i has reached the numeric day of week for the 1st of the month
            if(i >= firstWeekDayOfMonth)
            {
                //if remainder is zero, we've reached saturday
                if(i % 7 == 0 && i != 0)
                {
                    x++;
                    weekGroups[x] = [];
                }
                weekGroups[x][i%7] = day;
                day++;
            }
            else
            {
                weekGroups[x][i] = "";
            }
        }
        return weekGroups;
    }


}