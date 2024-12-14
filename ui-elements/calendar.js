class calendar 
{
    current_day = "";
    current_month = "";
    current_year = "";

    hide_type = 1;

    /**
     * initialize class
     * @param {element|array|object} elements element getting calendar popup
     * @param {string} hide element getting calendar popup
     */
    constructor(elements, hide = "hide") 
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
        
        if(typeof elements == "object" || typeof elements == "array"){
            for(const ele of elements)
            {
                console.log(ele);
                ele.addEventListener('focus', this.showCalendar(ele));
            }
        }
        else
        {
            
        }
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
     * return last day of the current month
     * @param {int} year 
     * @param {int} month 
     * @returns {int} last day of the month
     */
    calcMonth(year, month)
    {
        return new Date(year, month+1, 0).getDate();
    }

    /**
     * get fullname of provided month
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
     * Create elements per parameters
     * @param {string} tag 
     * @param {string} id 
     * @param {array} classes 
     * @param {string|element} content 
     * @returns 
     */
    createElements(tag, id = "", classes = [], content = "")
    {
        let element = document.createElement(tag);
        element.id = id;
        
        for(const cl of classes)
        {
            element.classList.add(cl);
        }

        if(typeof content == 'string' || typeof content == 'number')
        {
            element.appendChild(document.createTextNode(content));
        }
        else
        {
            element.appendChild(content);
        }

        return element;
    }

    /**
     * Create calendar div to display under elements
     * @returns {element}
     */
    createCalender()
    {
        
        let monthName = this.getMonthName(this.current_year, this.current_month);
        let daysInMonth = this.calcMonth(this.current_year, this.current_month);
        let firstWeekDayOfMonth = this.getDayOfWeek(this.current_year, this.current_month, 1);
        
        let weekGroups = [];
        weekGroups[0] = [];

        //create elements to make up table
        let div_container = this.createElements("div", "calendar_container", ["calendar_container"] );
        let year = this.createElements("div", "", ["calendar_year_dd"], this.current_year );
        let nextyear = this.createElements("div", "", ["calendar_nextyear"], ">>" );
        let prevyear = this.createElements("div", "", ["calendar_prevyear"], "<<" );
        let nextmonth = this.createElements("div", "", ["calendar_nextmonth"], ">>" );
        let prevmonth = this.createElements("div", "", ["calendar_prevmonth"], "<<" );
        let month = this.createElements("div", "", ["calendar_month_dd"], monthName);
        let div_body = this.createElements("div", "", ["calendar_body"]);
        let table = this.createElements("table", "", ["calendar_table"]);
        let theader = this.createElements("thead", "", ["calendar_header"]);
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
        td.append(this.createElements("div", "", ["today"], "Today"));

        td = tr.insertCell();
        
        tr.classList.add("calendar_row");
        td = tr.insertCell();
        td.colSpan = "3";
        td.append(this.createElements("div", "", ["clear_date"], "Clear"));
        tr = tbody.insertRow();
        tr.classList.add("calendar_row");
        
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
                let div_num = this.createElements("div", "", ["calendar_day"], day);
                td.appendChild(div_num);
                day++;
            }
            else
            {
                td = tr.insertCell();
                td.appendChild(document.createTextNode(""));
            }
        }

        
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

    /**
     * show calendar under provided element
     * @param {element} ele 
     */
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

    /**
     * hide calendar when element is not active
     */
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