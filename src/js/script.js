
function refresh() {
	//console.log(sessionStorage.loggedIn);	
	if(typeof(Storage) === "undefined"){
		$("#landing-div").hide();
		$("#game-div").hide();
		$("#bad-browser").show();	
	} else 
	if(sessionStorage.loggedIn === "false" || sessionStorage.loggedIn === undefined){
		sessionStorage.loggedIn = "false";
		if(localStorage.rank === undefined) localStorage.rank = JSON.stringify({"rank" : []});
		$("#landing-div").show();
		$("#game-div").hide();
		$("#bad-browser").hide();
	} else {
		$("#landing-div").hide();
		$("#game-div").show();
		$("#user").text(sessionStorage.loggedUser);
		$("#bad-browser").hide();
	}
}

var unmatchedPair;
var openedCard;
var start;
var gameStarted = false;
var interval;
var firstCard;
var secondCard;


//for debugging purppse
function cheat(){
	$("#start-button").click();
	unmatchedPair = 0;
	$(".comb-card").click();
}

//Durstenfeld shuffle 
//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function sortByTE(a, b){
	return ((a.timeElapsed < b.timeElapsed) ? -1 : ((a.timeElapsed > b.timeElapsed) ? 1 : 0));
}


$("document").ready(function () {

	$.ajaxSetup({beforeSend: function(xhr){
	  if (xhr.overrideMimeType)
	  {
	    xhr.overrideMimeType("application/json");
	  }
	}});

	refresh();

	$("input").keypress(function(event) {
		//console.log(event.which === 13);
	    if (event.which === 13) {
	        event.preventDefault();
	        $("#login-button").click();
	    }
	});

	$("#login-button").click(function () {
		$.getJSON( "src/app-data/users.json", function( parsedInput ) {

			var userData = parsedInput.users;
			$.each( userData, function( key, value ) {
				if(value.username === $("#login-username").val() &&
		    		value.password === $("#login-password").val() ){
		  			sessionStorage.loggedIn = "true";
		    		sessionStorage.loggedUser = value.username;
		    		refresh();
		    	}
		 	});

		 	
		 	if(sessionStorage.loggedIn === "false"){
		 		alert("username atau password salah");
		 	}
		 
		  
		});
	});
	
	$("#start-button").click(function() {
		if($(this).hasClass("disabled")) return;
		$(this).addClass("disabled");

		$(".comb-card").each(function(key, value) {
			$(value).removeClass("flipped");
		});

		gameStarted = true;
		unmatchedPair = 8;
		openedCard = 0;

		var arr = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);

		$(".comb-card").each(function (key, value) {
			$(value).attr("category", arr[key]);
		});

		$(".back").each(function (key, value) {
			$(value).html("<img src=\"src/img/" + arr[key]  + ".png\">");
		});

		start = new Date;
		interval = setInterval(function () {
			
			var diff = new Date - start;
			var milisec = diff % 1000;
			diff = Math.floor(diff/1000);
			var sec = diff % 60;
			diff = Math.floor(diff/60);
			var min = diff % 60;

			var newDate = "time : ";
			newDate += ((min<10)? "0" : "") + min + ":";
			newDate += ((sec<10)? "0" : "") + sec + ":";
			newDate += ((milisec<10)? "00" : ((milisec<100)? "0" : "" )) + milisec;

			$("#timer").text(newDate);


		}, 1);
	});

	$(".comb-card").click($.throttle(1000, function(){
		var timeClicked = new Date;
		if($("#start-button").hasClass("disabled")){
			if($(this).hasClass("flipped")){
				return;	
			} else {
				$(this).addClass("flipped");
				openedCard++;
			}

			if(openedCard === 1){
				//do nothing
				firstCard = this;
			} else 
			if(openedCard === 2){
				secondCard = this;
				if($(firstCard).attr("category") === $(secondCard).attr("category")){
					//match
					unmatchedPair--;
				} else {
					//not match
					setTimeout(function () {
						$(firstCard).removeClass("flipped");
						$(secondCard).removeClass("flipped");
					}, 700);
				}
				openedCard = 0;
					
				
			}
			if(unmatchedPair === 0){
				var parsed = JSON.parse(localStorage.getItem("rank"));
				var rank = parsed.rank;
				rank.push({"name" : sessionStorage.loggedUser, "timeElapsed" : timeClicked - start});
				//console.log(rank);
				rank.sort(sortByTE);
				rank = rank.slice(0,5);

				localStorage.rank = JSON.stringify({"rank" : rank});	
				
				$("#start-button").removeClass("disabled");
				clearInterval(interval);
				renderRank();
			}
		}
    }));

	function renderRank() {
		var parsed = JSON.parse(localStorage.getItem("rank"));
		var rank = parsed.rank;

    	rank.sort(sortByTE);
    	var scoreboardData = "";
 		

    	$.each(rank, function (key, value) {
    		//console.log(value);
    		var diff = value.timeElapsed;
    		//console.log(value.timeElapsed);
    		var milisec = diff % 1000;
			diff = Math.floor(diff/1000);
			var sec = diff % 60;
			diff = Math.floor(diff/60);
			var min = diff % 60;
    		var timeElapsed = ((min<10)? "0" : "") + min + ":";
			timeElapsed += ((sec<10)? "0" : "") + sec + ":";
			timeElapsed += ((milisec<10)? "00" : ((milisec<100)? "0" : "" )) + milisec;
 			//console.log(scoreboardData);
    		scoreboardData += "<tr> <td>" + value.name + "</td> <td>" + timeElapsed + "</td></tr>"; 
    	});
    	//console.log(scoreboardData);
    	$("#hof-data").html(scoreboardData);
	}

    $(function () {
    	renderRank();	
    });

    $("#logout-button").click(function () {
    	sessionStorage.loggedIn = false;
    	refresh();
    	$("#start-button").removeClass("disabled");
		clearInterval(interval);	
		$("#timer").text("time : ");	
    });
});