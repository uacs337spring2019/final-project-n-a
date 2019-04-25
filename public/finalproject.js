/**
Aleah Crawford & Nate Peter
CSC 337 Final Project
Spring 2019


**/

(function() {
    "use strict";

    let state = "";
    let city = "";
    let json = "";
    let url = "";

    window.onload = function() {
        document.getElementById("submit").onclick = requestBreweries;
        document.getElementById("home").addEventListener("click", reload);
        document.getElementById("back").addEventListener("click", clickBack);
    };

    /**
    If home is clicked the page reloads
    **/
    function reload() {
        location.reload();
    }

    /** 
    If back is clicked and a state has already been entered than requestData is called
    **/
    function clickBack() {
        if (state != "") {
            requestData(url);
        }
    }

    /**
    This function is called when the submit button is clicked. It gets the values of 
    the state and the city and creates urls based on those values. requestData
    is then called using this url
    **/
    function requestBreweries() {
        state = document.getElementById("state").value;
        city = document.getElementById("city").value;


        if (city == "") {
            url = ("https://api.openbrewerydb.org/breweries?by_state=" + 
            state.toLowerCase().split(" ").join("_"));

            requestData(url);
        }
        else {
            url = ("https://api.openbrewerydb.org/breweries?by_state=" + 
            state.toLowerCase().split(" ").join("_") + "&by_city=" + 
            city.toLowerCase().split(" ").join("_"));

            requestData(url);
        }

    }

    /**
    requestData takes the url as a param and then displays a table of all the breweries
    from the database in that state and/or city.
    @param {string} url from stats and or city
    **/
    function requestData(url) {
        let body = document.getElementById("under");
        body.style.margin = "20px";
        body.innerHTML = "";

        let h2 = document.createElement("h2");
        if(city) {
            h2.innerHTML = "Results for " + city + ", " + state + ":";
        }

        else {
            h2.innerHTML = "Top Results for " + state + ":";
        }

        h2.style.fontSize = "22px";
        body.appendChild(h2);

        let table = document.createElement("table");
        let tr = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.innerHTML = "#";     
        tr.appendChild(th1);
        let th2 = document.createElement("th");
        th2.innerHTML = "Name";   
        tr.appendChild(th2);

        let th3 = document.createElement("th");
        th3.innerHTML = "Brew Type"; 
        tr.appendChild(th3);

        tr.style.backgroundColor = "grey";
        table.appendChild(tr);      

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                json = JSON.parse(responseText);
                console.log(json);
                for (let i=0; i < json.length; i++) {
                    let tr = document.createElement("tr");
                    let th1 = document.createElement("th");
                    tr.setAttribute("id", json[i]["id"]);
                    tr.addEventListener("click", brewClick); 
                    th1.innerHTML = i;   
                    tr.appendChild(th1);

                    let th2 = document.createElement("th");
                    th2.innerHTML = json[i]["name"]; 
                    tr.appendChild(th2);

                    let th3 = document.createElement("th");
                    let brew = json[i]["brewery_type"];
                    let upper = brew.charAt(0).toUpperCase() + brew.slice(1);
                    th3.innerHTML = upper;
                    tr.appendChild(th3); 
                    table.appendChild(tr);

                    if (i % 2 != 0) {
                        tr.style.backgroundColor = "grey";
                    }
                    else {
                        tr.style.backgroundColor = "black";
                    }

                }
                body.appendChild(table);

            })
        
            .catch(function(error) {
                console.log(error);
            });
    }

    /**
    If a brewery from the table created by requestData is clicked then the specific
    information about this brewery is displayed. This inforation includes
    the name of the brewery, the address, its contact information (including a clickable
    site), and a way to leave comments.
    **/
    function brewClick() {
        let brewId = this.id;
        let urlBrew = ("https://api.openbrewerydb.org/breweries/" + brewId);
        let body = document.getElementById("under");
        body.style.margin = "20px";
        body.innerHTML = "";
        fetch(urlBrew)
            .then(checkStatus)
            .then(function(responseText) {
                json = JSON.parse(responseText);
                let h3 = document.createElement("h3");
                h3.style.marginBottom = "4px";
                h3.style.textDecoration = "underline";
                h3.innerHTML = json["name"];
                body.appendChild(h3);

                let id = document.createElement("p");
                id.setAttribute("id", "breweryID");
                id.innerHTML = brewId;
                body.appendChild(id);
                id.hidden = true;

                let address = document.createElement("p");
                address.innerHTML = json["street"];
                address.style.margin = "2px";
                address.style.marginLeft = "0px";
                address.style.fontSize = "18px";
                body.appendChild(address);

                let location = document.createElement("p");
                location.innerHTML = json["city"] + ", " + json["state"];
                location.style.margin = "0px";
                location.style.fontSize = "12px";
                body.appendChild(location);

                let contact = document.createElement("h4");
                contact.innerHTML = "Contact Us:";
                contact.style.margin = "5px";
                contact.style.textDecoration = "underline";
                contact.style.marginLeft = "0px";
                body.appendChild(contact);

                if (json["phone"] != "") {
                    let phone = document.createElement("p");
                    phone.innerHTML = "Phone: (" + json["phone"].slice(0,3) + ")" + " " +
                                    json["phone"].slice(3, 6) + " - " + json["phone"].slice(6);
                    phone.style.fontSize = "18px";
                    phone.style.margin = "2px";
                    phone.style.marginLeft = "0px";
                    body.appendChild(phone);
                }

                if (json["website_url"] != "") {
                    let web = document.createElement("a");
                    let site = json["website_url"];
                    web.setAttribute("href", site);
                    web.innerHTML = site;
                    web.style.margin = "2px";
                    web.style.marginLeft = "0px";
                    web.style.fontSize = "18px";
                    body.appendChild(web);
                }

                let intro = document.createElement("h5");
                intro.innerHTML = "Leave a Comment: ";
                intro.style.margin = "5px";
                intro.style.fontSize = "25px";
                intro.style.textDecoration = "underline";
                intro.style.marginLeft = "0px";
                intro.style.marginTop = "10px";
                body.appendChild(intro);

                let name = document.createElement("input");
                name.setAttribute("id", "name");
                let comment = document.createElement("textarea");
                comment.setAttribute("id", "comment");
                body.appendChild(name);
                body.appendChild(comment);
                let yourName = document.getElementById("name");
                yourName.placeholder = "Your Name Here";
                yourName.style.marginBottom = "2px";
                yourName.style.marginLeft = "0px";
                yourName.style.width = "150px";
                let yourComment = document.getElementById("comment");
                yourComment.placeholder = "Your Comment Here";
                yourComment.style.marginBottom = "2px";
                yourComment.style.marginLeft = "0px";
                yourComment.style.width = "300px";
                yourComment.style.height = "150px";
                yourComment.style.position = "abosolute";

                let submit = document.createElement("button");
                submit.setAttribute("id" , "submitComment");
                submit.addEventListener("click", submitComment);
                body.appendChild(submit);
                let subComment = document.getElementById("submitComment");
                subComment.innerHTML = "Submit";
                subComment.style.width = "100px";
                subComment.style.marginLeft = "205px";
                subComment.style.marginBottom = "10px";

                let commentsArea = document.createElement("div");
                commentsArea.setAttribute("id", "commentsArea");
                body.appendChild(commentsArea);
                setInterval(displayComments, 10000);
            });
    }

    /**
    This function is called when the submit button is clicked. Sends in input to
    the service
    **/
    function submitComment() {
        let name = document.getElementById("name").value;
        let comment = document.getElementById("comment").value;
        let id = document.getElementById("breweryID").innerHTML;

        if ((name != "") && (comment != "")) {
            const message = {name: name,
                             comment: comment,
                             id: id};
            const fetchOptions = {
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(message)
            };
            let url = "http://localhost:3000";
            fetch(url, fetchOptions)
                .then(checkStatus)
                .then(function(responseText) {
                    console.log(responseText);
                })
                .catch(function(error) {
                    console.log(error);
                }); 
        }
        document.getElementById("name").value = "";
        document.getElementById("comment").value = "";  
    }

    /**
    Fetches and displays user comment from service with the users name followed by 
    their comment in its own div box.
    **/
    function displayComments() {
        let id = document.getElementById("breweryID").innerHTML;
        let commentsArea = document.getElementById("commentsArea");
        commentsArea.innerHTML = "";

        let url = "http://localhost:3000/?mode=comments&id=" + id;

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                console.log(json);
                for (let i=0; i < json.comments.length; i++) {
                    let comment = json.comments[i];
                    let div = document.createElement("div");
                    let h6 = document.createElement("h6");
                    let p = document.createElement("p");
                    h6.innerHTML = comment.name;
                    p.innerHTML = comment.comment;
                    div.appendChild(h6);
                    div.appendChild(p);
                    div.style.border = "2px solid white";
                    div.style.overflow = "auto";
                    div.style.margin = "7px";
                    h6.style.fontSize = "18px";
                    p.style.fontSize = "18px";
                    h6.style.margin = "4px";
                    p.style.margin = "4px";
                    commentsArea.appendChild(div);
                }            
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    /**
    Checks for errors
    @param {string} response text
    @return {string} error
    **/
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } else if (response.status == 404) {
            return Promise.reject(new Error("Sorry, we couldn't find that page")); 
        } else {
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        }
    }

})();