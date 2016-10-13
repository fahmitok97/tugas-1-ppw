
function refresh() {
	console.log(sessionStorage.loggedIn);	
	if(typeof(Storage) === "undefined"){
		$("#landing-div").hide();
		$("#game-div").hide();
		$("#bad-browser").show();	
	} else 
	if(sessionStorage.loggedIn === "false" || sessionStorage.loggedIn === undefined){
		sessionStorage.loggedIn = "false";
		$("#landing-div").show();
		$("#game-div").hide();
		$("#bad-browser").hide();
	} else {
		$("#landing-div").hide();
		$("#game-div").show();
		$("#bad-browser").hide();
	}
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


$("document").ready(function () {

	var unmatchedPair;
	var openedCard;
	var start;
	var gameStarted = false;

	$.ajaxSetup({beforeSend: function(xhr){
	  if (xhr.overrideMimeType)
	  {
	    xhr.overrideMimeType("application/json");
	  }
	}});

	refresh();

	$("input").keypress(function(event) {
		console.log(event.which === 13);
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

		gameStarted = true;
		unmatchedPair = 8;
		openedCard = 0;

		var arr = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);

		$(".back").each(function (key, value) {
			$(value).append("<img src=\"src/img/" + arr[key]  + ".png\">");
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


		}, 200);
	});

	$(".comb-card").click(function(){
		if($("#start-button").hasClass("disabled")){
			if($(this).hasClass("flipped")){
				//do nothing
			} else {
				$(this).addClass("flipped")
				openedCard++;
			}

			if(openedCard === 1){
					//do nothing
			} else 
			if(openedCard === 2){
				$.each($(".flipped"), function (key, value) {
					console.log($(value).children());
				});
			}
		}
    });
});