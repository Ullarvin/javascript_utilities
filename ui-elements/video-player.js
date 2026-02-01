class VideoPlayer 
{
    elements = []; //array of elements to append video container to
    urls = []; //array of video links
    current_url_key = 0; //tracks url index

    /**
     * initialize class
     */
    constructor(elements = [], urls = []) 
    {
        this.setElements(elements);
        this.setUrls(urls);
    }

    setElements(elements = []) 
    {
        //if object or array is not passed, add it to an array
        if(!(typeof elements == "object" || typeof elements == "array") || elements instanceof Element){
            elements = [elements];
        }

        this.elements = elements;
    }

    setUrls(urls = []) 
    {
        //if url is a string, append to an array instead
        if(typeof urls == "string"){
            urls = [urls];
        }

        this.urls = urls;
    }

    handleEvent(event) 
    {
        switch(event.target.id)
        {
            case "video_previous":
            case "previous_frame":
                switch (event.type) {
                    case 'click':
                        this.previousVideo();
                        break;
                }
                
                break;
            case "video_next":
            case "next_frame":
                switch (event.type) {
                    case 'click':
                        this.nextVideo();
                        break;
                }
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
     * Create display for video
     * @returns {element}
     */
    createVideoDisplay(ele)
    {
        let url = this.urls ? this.urls[this.current_url_key] : '';

        //create elements to make up table
        let container = this.createElements("table", "video_player_container", ["video_player_container"] );

        let video_player_frame = this.createElements("td", "video_player_frame", ["video_player_frame"] );
        let video_player = this.createElements("video", "video_player", ["video_player"]);
        let video_source = this.createElements("source", "video_source", ["video_source"]);

        let previous_frame = this.createElements("td", "previous_frame", ["previous_frame"] );
        let next_frame = this.createElements("td", "next_frame", ["next_frame"] );
        
        let video_previous = this.createElements("button", "video_previous", ["video_previous", "arrow", "left"], "" );
        let video_next = this.createElements("button", "video_next", ["video_next", "arrow", "right"], "");
        this.addEvent(video_previous, "click", this);
        this.addEvent(video_next, "click", this);
        this.addEvent(previous_frame, "click", this);
        this.addEvent(next_frame, "click", this);

        //insert buttons in frames
        if((this.current_url_key - 1) >= 0){
            previous_frame.append(video_previous);
        }

        if((this.current_url_key + 1) <= (this.urls.length - 1)){
            next_frame.append(video_next);
        }

        //insert video source and video player
        if(this.isUrl(url)) {
            //user iframe is url is passed
            video_player = this.createElements("iframe", "video_player", ["video_player"]);
            video_player.src = this.urls ? this.urls[this.current_url_key] : '';
        } else {
            //use video and source tag if local video path is passed
            let fileExt = url.split('.').pop();
            video_source.type = "video/"+fileExt;
            video_source.src = this.urls ? this.urls[this.current_url_key] : '';
            video_player.controls=true;
            video_player.append(video_source);
        }

        let tr = container.insertRow();
        
        video_player_frame.append(video_player);

        //append table cells to row
        tr.append(previous_frame);

        tr.append(video_player_frame);

        tr.append(next_frame);

        //append row to table
        container.append(tr);

        return container;
    }

    /**
     * show video player in element(s)
     */
    showPlayer()
    {
        //create video container
        let videoElement = this.createVideoDisplay();
        let self = this;
        

        //append video container to element(s)
        this.elements.forEach(function(e) { 
            //get parent element width
            let width = e.offsetWidth;

            //get each frame of container
            let video_player = videoElement.querySelector("#video_player");
            let previous_frame = videoElement.querySelector("#previous_frame");
            let next_frame = videoElement.querySelector("#next_frame");

            //get widths of each frame
            let left_width = self.calculateSize(width, .92);
            let middle_width = self.calculateSize(width, .20);
            let right_width = self.calculateSize(width, .92);

            //set widths of each frame
            self.setWidth(previous_frame, left_width);
            self.setWidth(video_player, middle_width);
            self.setWidth(next_frame, right_width);

            //append container to parent
            e.appendChild(videoElement);
        
        });
    }

    removePlayer()
    {
        if(document.getElementById("video_player_container") != null)
        {
            document.getElementById("video_player_container").remove();
        }
    }

    nextVideo() 
    {
        if((this.current_url_key + 1) <= (this.urls.length - 1)) {
            this.current_url_key++;
            this.removePlayer();
            this.showPlayer();
        }
    }

    previousVideo()
    {
        if((this.current_url_key - 1) >= 0){
            this.current_url_key--;
            this.removePlayer();
            this.showPlayer();
        }
    }

    /**
     * set width for frames
     * @param {element} element 
     * @param {int|float} width
     */
    setWidth(e, width){
        e.setAttribute("style","width:"+width+"px;");
        e.style.width = width+'px';
    }

    /**
     * set height for frames
     * @param {element} element 
     * @param {int|float} height
     */
    setHeight(e, height){
        e.setAttribute("style","height:"+height+"px;");
        e.style.height = height+'px';
    }

    /**
     * calculate length for frames
     * @param {int} length 
     * @param {float} percentage
     * @return {float}
     */
    calculateSize(length, percentage) 
    {
        let num = length;
        return num - (num * percentage);
    }

    
    isUrl(url)
    {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;  
        }
    }

}