class calendar 
{
    elements = "";
    format = "m-d-y";
    elements_type = "";
    element = "";
    current_day = 0;
    current_month = 0;
    current_year = 0;
    current_hour = 0;
    current_minute = 0;
    current_seconds = 0;
    current_mseconds = 0;

    /**
     * initialize class
     */
    constructor(elements, format = "m-d-y") 
    {
        this.date = new Date();
        this.current_day = this.date.getDate();
        this.current_month = this.date.getMonth();
        this.current_year = this.date.getFullYear();
        this.current_hour = this.date.getHours();
        this.current_minute = this.date.getMinutes();
        this.current_seconds = this.date.getSeconds();
        this.current_mseconds = this.date.getMilliseconds();
        this.elements = elements;
        this.elements_type = typeof elements;
        this.format = format;
        
        //determine element(s) type and add event to elements for calendar popup
        if(this.elements_type == "object" || this.elements_type == "array"){
            
            for(const ele of elements)
            {
                this.addEvent(ele, "click", this);
                this.addEvent(ele, "dblclick", this);
            }
        }
        else
        {
            this.addEvent(elements, "click", this);
            this.addEvent(elements, "dblclick", this);
        }
    }

    handleEvent(event) {
        //events to affect element(s) passed to class
        if(this.isElement(event.target))
        {
            switch (event.type) {
                case "click":
                    //assign current element
                    this.element = event.target;
                    //create and show calendar
                    this.showCalendar(event.target);
                    break;
                case "dblclick":
                    event.target.focus();
                    break;
            }
        }
        else if (event.target.classList.contains("calendar_day"))
        {
            switch (event.type) {
                case "click":
                    this.selectingDate(event.target, this.element, "day");
                    break;
                case "dblclick":
                    break;
            }
        }
        else if (event.target.classList.contains("calendar_time_field"))
        {
            //if related target is null, then we are selecting the calendar time fields, if is not null then we are click the dropdown likely

            switch (event.target.id)
            {
                case 'calendar_hour':
                    this.selectingDate(event.target, this.element, "hour");
                    break;
                case 'calendar_min':
                    this.selectingDate(event.target, this.element, "minute");
                    break;
                case 'calendar_sec':
                    this.selectingDate(event.target, this.element, "seconds");
                    break;
                case 'calendar_msec':
                    this.selectingDate(event.target, this.element, "mseconds");
                    break;
            }
        }
        else
        {
            switch(event.target.id)
            {
                case "calendar_container":
                    
                    //prevent removal of calendar if selecting dropdown inside calendar container
                    if(event.relatedTarget !== null)
                    {
                        break;
                    }

                    switch (event.type) {
                        case 'blur':
                            //remove calendar on blur
                            this.removeCalendar();
                            break;
                    }
                    break;
                case "calendar_nextyear":
                case "calendar_prevyear":
                    switch (event.type) {
                        case "click":
                            //select previous or next year
                            this.selectingDate(event.target, this.element, "year");
                            break;
                    }
                    break;
                case "calendar_nextmonth":
                case "calendar_prevmonth":
                    switch (event.type) {
                        case "click":
                            //select previous or next month
                            this.selectingDate(event.target, this.element, "month");
                            break;
                    }
                    break;
                case "calendar_clear_date":
                    switch (event.type) {
                        case 'click':
                            //set element to empty
                            this.setValue(this.element, "");
                            break;
                    }
                    
                    break;
                case "calendar_today":
                    switch (event.type) {
                        case 'click':
                            //set element to todays date
                            this.setDateToday();
                            this.selectingDate(event.target, this.element, "today");
                            break;
                    }
                    break;
            }
        }
        

    }

    /**
     * Determine if passed element exists within elements passed to class
     * @param {element|object|array} element 
     * @returns {bool}
     */
    isElement(element)
    {
        let exists = false;

        if(this.elements_type == "object" || this.elements_type == "array"){
            
            for(const ele of this.elements)
            {
                if(ele == element)
                {
                    exists = true;
                }
            }
        }
        else
        {
            if(this.elements == element)
            {
                exists = true;
            }
        }

        return exists;
    }

    setValue(element,value)
    {
        switch(element.tagName.toLowerCase())
        {
            case 'input':
                element.value = value;
                break;
            default:
                element.innerText = value;
                break;
        }
    }

    /**
     * add event to elements
     * @param {element} ele 
     * @param {string} event 
     * @param {funct} funct 
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

    getFormattedDate()
    {
        let format = this.format;
        let dateFormatted = "";

        //for date input types since they require ISO format 
        if(this.element.type.toLowerCase() == "date")
        {
            format = "y-m-d";
        }

        switch(this.element.type.toLowerCase())
        {
            case "date":
                format = "y-m-d";
                break;
            case "datetime-local":
                format = "y-m-dTh:i:s";
                break;
            case "time":
                format = "h:i:s";
                break;
        }
        
        for (const c of format) {
            switch(c)
            {
                case "y":
                    dateFormatted += this.current_year;
                    break;
                case "m":
                    dateFormatted += ("0" + (parseInt(this.current_month) + 1)).slice(-2);
                    break;
                case "d":
                    dateFormatted += ("0" + this.current_day).slice(-2);
                    break;
                case "h":
                    dateFormatted += ("0" + this.current_hour).slice(-2);
                    break;
                case "i":
                    dateFormatted += ("0" + this.current_minute ).slice(-2);
                    break;
                case "s":
                    dateFormatted += ("0" + this.current_seconds).slice(-2);
                    break;
                case "u":
                    dateFormatted += ("0" + this.current_mseconds).slice(-2);
                    break;
                default:
                    dateFormatted += c;
                    break;
            }   
        }
        return dateFormatted;
    }

    /**
     * Setter for date properties
     * @param {int} year 
     * @param {int} month 
     * @param {int} day 
     * @param {int} hour 
     * @param {int} minute 
     * @param {int} second 
     * @param {int} msecond 
     */
    setDate(year, month, day, hour = 0, minute = 0, second = 0, msecond = 0)
    {
        const date = new Date(year, month, day, hour, minute, second, msecond); 
        this.date = date;
        this.current_day = this.date.getDate();
        this.current_month = this.date.getMonth();
        this.current_year = this.date.getFullYear();

        this.current_hour = this.date.getHours();
        this.current_minute = this.date.getMinutes();
        this.current_seconds = this.date.getSeconds();
        this.current_mseconds = this.date.getMilliseconds();
    }

    setDateToday()
    {
        const date = new Date(); 
        this.date = date;
        this.current_day = this.date.getDate();
        this.current_month = this.date.getMonth();
        this.current_year = this.date.getFullYear();
        this.current_hour = this.date.getHours();
        this.current_minute = this.date.getMinutes();
        this.current_seconds = this.date.getSeconds();
        this.current_mseconds = this.date.getMilliseconds();
        this.showCalendar(this.element);
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
    createCalender(ele)
    {
        
        let monthName = this.getMonthName(this.current_year, this.current_month);
        let daysInMonth = this.calcMonth(this.current_year, this.current_month);
        let firstWeekDayOfMonth = this.getDayOfWeek(this.current_year, this.current_month, 1);
        let daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        
        let weekGroups = [];
        weekGroups[0] = [];

        //create elements to make up table
        let div_container = this.createElements("div", "calendar_container", ["calendar_container"] );
        //set on blur affect to remove calendar  
        this.addEvent(div_container, "blur", this);
        let year = this.createElements("div", "calendar_year_dd", ["calendar_year_dd"], this.current_year );
        let nextyear = this.createElements("div", "calendar_nextyear", ["calendar_nextyear", "arrow", "right"], "" );
        this.addEvent(nextyear, "click", this);
        let prevyear = this.createElements("div", "calendar_prevyear", ["calendar_prevyear", "arrow", "left"], "" );
        this.addEvent(prevyear, "click", this);
        let nextmonth = this.createElements("div", "calendar_nextmonth", ["calendar_nextmonth", "arrow", "right"], "" );
        this.addEvent(nextmonth, "click", this);
        let prevmonth = this.createElements("div", "calendar_prevmonth", ["calendar_prevmonth", "arrow", "left"], "" );
        this.addEvent(prevmonth, "click", this);
        let month = this.createElements("div", "calendar_month_dd", ["calendar_month_dd"], monthName);
        let div_body = this.createElements("div", "calendar_body", ["calendar_body"]);
        let table = this.createElements("table", "calendar_table", ["calendar_table"]);
        let theader = this.createElements("thead", "calendar_header", ["calendar_header"]);
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
        tr.classList.add("calendar_other_row");
        td = tr.insertCell();
        td.colSpan = "3";
        let div_today_day = this.createElements("div", "calendar_today", ["calendar_today"], "Today");
        this.addEvent(div_today_day, "click", this);
        td.append(div_today_day);

        td = tr.insertCell();
        
        tr.classList.add("calendar_row");
        td = tr.insertCell();
        td.colSpan = "3";
        let div_clear_day = this.createElements("div", "calendar_clear_date", ["calendar_clear_date"], "Clear");
        this.addEvent(div_clear_day, "click", this);
        td.append(div_clear_day);

        tr = tbody.insertRow();
        tr.classList.add("calendar_week_row");
        for(const weekday of daysOfWeek)
        {
            td = tr.insertCell();
            let weekday_div = this.createElements("div", "", ["calendar_weekday"], weekday);
            //this.addEvent(weekday_div, "click", this);
            td.appendChild(weekday_div);
        }

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
                this.addEvent(div_num, "click", this);
                td.appendChild(div_num);
                day++;
            }
            else
            {
                td = tr.insertCell();
                td.appendChild(document.createTextNode(""));
            }
        }

        //add time selects
        let select_hour = this.createElements("select", "calendar_hour", ["calendar_hour","calendar_time_field"], this.current_hour);
        let select_min = this.createElements("select", "calendar_min", ["calendar_min","calendar_time_field"], this.current_minute);
        let select_sec = this.createElements("select", "calendar_sec", ["calendar_sec","calendar_time_field"], this.current_seconds);
        let select_msec = this.createElements("select", "calendar_msec", ["calendar_msec","calendar_time_field"], this.current_mseconds);

        this.addEvent(select_hour, "change", this);
        this.addEvent(select_min, "change", this);
        this.addEvent(select_sec, "change", this);
        this.addEvent(select_msec, "change", this);

        for(let i=0; i<1000; i++)
        {
            let option = this.createElements("option", "", [], i);
            this.setValue(option, i);

            if(i < 24)
            {
                select_hour.append(option.cloneNode(true));
            }

            if(i < 60)
            {
                select_min.append(option.cloneNode(true));
                select_sec.append(option.cloneNode(true));
            }

            select_msec.append(option.cloneNode(true));
        }

        select_hour.selectedIndex = this.current_hour;
        select_min.selectedIndex = this.current_minute;
        select_sec.selectedIndex = this.current_seconds;
        select_msec.selectedIndex = this.current_mseconds;

        tr = tbody.insertRow();
        tr.classList.add("calendar_time_row");
        td = tr.insertCell();
        td.classList.add("calendar_time_cell");
        td.colSpan = "7";
        td.append(select_hour);
        td.append(select_min);
        td.append(select_sec);
        td.append(select_msec);


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
    selectingDate(parent, element, type)
    {
        let day = this.current_day;
        let month = this.current_month;
        let year = this.current_year;

        let hour = this.current_hour;
        let minute = this.current_minute;
        let seconds = this.current_seconds;
        let mseconds = this.current_mseconds;

        switch(type)
        {
            case "day":
                day = Number(parent.innerHTML);
                break;
            case "month":
                if(parent.id == "calendar_nextmonth")
                {
                    month = this.getNextMonth();
                    if(month == 0)
                    {
                        //go to next year
                        year += 1;
                    }
                }
                else
                {
                    month = this.getNextMonth(-1);
                    if(month == 11)
                    {
                        ////go to prevous year
                        year -= 1;
                    }
                }
                break;
            case "year":
                if(parent.id == "calendar_nextyear")
                {
                    year = this.getNextYear();
                }
                else
                {
                    year = this.getNextYear(-1);
                }
                break;
            case "hour":
                hour = Number(parent.value);
                break;
            case "minute":
                minute = Number(parent.value);
                break;
            case "seconds":
                seconds = Number(parent.value);
                break;
            case "mseconds":
                mseconds = Number(parent.value);
                break;
        }

        //set new date
        this.setDate(year, month, day, hour, minute, seconds, mseconds);

        //we only set the element date when a "day" is clicked, other wise it's just navigation
        if(type == "day" || type == "today")
        {
            this.setValue(element, this.getFormattedDate());
        }
        else
        {
            switch(type)
            {
                case "hour":
                case "minute":
                case "seconds":
                case "mseconds":
                    this.setValue(element, this.getFormattedDate());
                break;
            }
            this.showCalendar(this.element);
        }
        
    }

    /**
     * show calendar under provided element
     * @param {element} ele 
     */
    showCalendar(ele)
    {
        this.removeCalendar();
        //get body and calendar
        let body = document.body;
        let calendar = this.createCalender(ele);
        //set tabIndex since calendar is a div and require it for focus
        calendar.tabIndex = -1;
        //get offsets to align calendar to element
        var offsets = ele.getBoundingClientRect();
        //adjust calendar position to display under element
        calendar.style.top = (offsets.top + offsets.height) + "px";
        calendar.style.left = (offsets.left) + "px";
        calendar.display = "block";
        //append calendar to page body
        body.appendChild(calendar);
        //set calendar as focus
        calendar.focus(); 
        //scroll to calendar if it is out of view (for smaller devices);
        calendar.scrollIntoView(); 
    }

    removeCalendar()
    {
        if(document.getElementById("calendar_container") != null)
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