"use strict";
(function() {

	/*
	Everything commented out were attempts to write the data to a file
	which isn't quite working. But in the requestByCity and requestByState 
	functions the json variable is the json object of the data that we 
	can parse through and turn it into an HTML table on the web page.
	I will also upload my homework 10 javascript files where we did this 
	exact thing. the function getMovies in mymdb.js is where I made the table.
	Let me know if you have any questions!
	Nate
	
	*/

	let state = "";
	let city = "";
	let json = "";

	window.onload = function() {
		document.getElementById("submit").onclick = requestBreweries;
		document.getElementById("home").addEventListener("click", reload);
	};

	function reload() {
		location.reload();
	}

	function requestBreweries() {

		state = document.getElementById("state").value;
		city = document.getElementById("city").value;


		if (city == "") {
			let url = ("https://api.openbrewerydb.org/breweries?by_state=" + 
			state.toLowerCase().split(" ").join("_"));

			requestData(url);
		}
		else {
			let url = ("https://api.openbrewerydb.org/breweries?by_state=" + 
			state.toLowerCase().split(" ").join("_") + "&by_city=" + 
			city.toLowerCase().split(" ").join("_"));

			requestData(url);
		}
	}

	function requestData(url) {
		let body = document.getElementById("under");
		body.style.margin = "20px";
		body.innerHTML = "";

		let h2 = document.createElement("h2");
		if(city) {
			h2.innerHTML = "Results for " + city + ", " + state + ":"
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
				for (var i=0; i < json.length; i++) {
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
	                let upper = brew.charAt(0).toUpperCase() + brew.slice(1,);
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

	function brewClick() {
		console.log(this.id);
		let brewId = this.id;
		let url = ("https://api.openbrewerydb.org/breweries/" + brewId);
		let body = document.getElementById("under");
		body.style.margin = "20px";
		body.innerHTML = "";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				json = JSON.parse(responseText);
				console.log(json);
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
					phone.innerHTML = "(" + json["phone"].slice(0,3) + ")" + " " +
					 				json["phone"].slice(3, 6) + " - " + json["phone"].slice(6,);
					phone.style.fontSize = "18px";
					phone.style.margin = "2px";
					phone.style.marginLeft = "0px";
					body.appendChild(phone);
				}

				if (json["website_url"] != "") {
					let web = document.createElement("a");
					let site = json["website_url"];
					web.addEventListener("click", clickSite);
					web.setAttribute("href", site);
					web.innerHTML = site;
					web.style.margin = "2px"
					web.style.marginLeft = "0px";
					web.style.marginBottom = "5px";
					web.style.fontSize = "18px";


					// Maybe allow user to click on website if available
					body.appendChild(web);
				}

				let commentHeader = document.createElement("h4");
				commentHeader.innerHTML = "Send us your review!";
				body.appendChild(commentHeader);
				let name = document.createElement("input");
				name.setAttribute("id", "name");
				name.setAttribute("placeholder", "Name");
				let comment = document.createElement("input");
				comment.setAttribute("id", "comment");
				comment.setAttribute("placeholder", "Comment");
				body.appendChild(name);
				body.appendChild(comment);

				let submit = document.createElement("button");
				submit.setAttribute("id" , "submitComment");
				submit.addEventListener("click", submitComment);
				submit.innerHTML = "Submit";
				body.appendChild(submit);

				let commentsArea = document.createElement("div");
				commentsArea.setAttribute("id", "commentsArea");
            	let reviews = document.createElement("h3");
            	reviews.innerHTML = "Reviews";
            	body.appendChild(reviews);
				body.appendChild(commentsArea);
				setInterval(displayComments, 5000);
			})
		
	}

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

	function displayComments() {

		let id = document.getElementById("breweryID").innerHTML;
		let commentsArea = document.getElementById("commentsArea");
		commentsArea.innerHTML = "";
		
        let url = "https://csc337-breweries-database.herokuapp.com/?mode=comments&id=" + id;

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                console.log(json);
                for (let i=0; i < json.comments.length; i++) {
                    let comment = json.comments[i];
                    let div = document.createElement("div");
                    let h3 = document.createElement("h3");
                    let p = document.createElement("p");
                    h3.innerHTML = comment.name;
                    p.innerHTML = comment.comment;
                    div.appendChild(h3);
                    div.appendChild(p);
                    div.style.border = "thin solid white";
                    div.style.marginTop = "5px";
                    div.style.marginBottom = "5px";
                    commentsArea.appendChild(div);
                }            
            })
            .catch(function(error) {
                console.log("No Reviews.");
            });
	}


	function clickSite() {
	 	let direct = this.innerHTML;
	 	document.location = direct;
	}



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
