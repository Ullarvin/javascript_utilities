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
    constructor(ele, hide="hide") 
    {
        this.date = new Date();
        this.current_day = this.date.getDate();
        this.current_month = this.date.getMonth();
        this.current_year = this.date.getFullYear();

        if("hide")
        {
            this.hide_type = 1;
        }
        else if("remove")
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

    createCalender()
    {
        let body = document.getElementById("test");
        console.log(document.getElementById("test"));
        let monthName = this.getMonthName(this.current_year, this.current_month);
        let daysInMonth = this.calcMonth(this.current_year, this.current_month);
        let firstWeekDayOfMonth = this.getDayOfWeek(this.current_year, this.current_month, 1);
        let weekGroups = [];
        weekGroups[0] = [];

        let div_container = document.createElement("div");
        div_container.classList.add("calendar_container");

        let div_header = document.createElement("div");
        div_header.classList.add("calendar_header");
        div_header.appendChild(document.createTextNode(monthName));

        let div_body = document.createElement("div");
        div_body.classList.add("calendar_body");

        let table = document.createElement("table");
        table.classList.add("calendar_table");

        let tr = table.insertRow();
        
        console.log(monthName);
        //create array of weeks that contain each numeric day aligned with the week day
        for(let i=0, x=0,day=1; day <= daysInMonth; i++)
        {
            //check if i has reached the numeric day of week for the 1st of the month
            if(i >= firstWeekDayOfMonth)
            {
                //if remainder is zero, we've reached saturday
                if(i % 7 == 0 && i != 0)
                {
                    tr = table.insertRow();
                }
                let td = tr.insertCell();
                td.appendChild(document.createTextNode(day));
                day++;
            }
            else
            {
                let td = tr.insertCell();
                td.appendChild(document.createTextNode(""));
            }
        }

        console.log(table);
        div_body.appendChild(table);
        div_container.appendChild(div_header);
        div_container.appendChild(div_body);
        document.getElementById("test").appendChild(div_container);

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