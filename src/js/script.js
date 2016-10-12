
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


$("document").ready(function () {

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
	
	$('.combined-card').click(function(){
		if($(this).hasClass("flipped"))
			$(this).removeClass("flipped");
		else
			$(this).addClass("flipped");

    });
});