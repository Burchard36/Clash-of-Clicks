
function goToCastlePage() {
	let id = parseURLParams(window.location.href)
    if (id === undefined || id === "") {
		modalText.innerHTML = "You must be logged in for this action!";
		modal.style.display = "block";
		return;
	} else if (id.username === "" || id.username === "" || id.username === null) {
		modalText.innerHTML = "You must be logged in for this action!";
		modal.style.display = "block";
		return;
	} else if (id.password === "" || id.password === "" || id.password === null) {
		modalText.innerHTML = "You must be logged in for this action!";
		modal.style.display = "block";
		return;
	} else {
		let data = { Username: id.username, Password: id.password };
		socket.emit("pageLogin", data);
		socket.on("notValid", function() {
			modalText.innerHTML = "This account is not activated! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("sqlInjection", function() {
		    modalText.innerHTML = "Username/password may only be alphanumeric! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("noAccountHere", function() {
			modalText.innerHTML = "This account does not exist! Usernames are case sensitive! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("successLogin", function(data) {
		    window.location.replace("myCastle.html");
		});
		socket.on("incorrectPassword", function() {
			modalText.innerHTML = "Incorrect password/username! Redirecting...";
		    modal.style.display = "block";
		setTimeout(function(){
            window.location.href = "index.html";
        }, 3800);
		    return;
		});
	    return;
	}
}
function switchToRegister() {
	document.getElementById("registerPanel").style.display = 'block';
	document.getElementById("loginPanel").style.display = 'none';
	return;
}
function switchToLogin() {
	document.getElementById("registerPanel").style.display = 'none';
	document.getElementById("loginPanel").style.display = 'block';
	return;
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

let id = parseURLParams(window.location.href)

function tryEmail() {
	let id = parseURLParams(window.location.href)
	if (id === undefined || id === "") {
		return;
	} else if (id.validate === undefined || id.validate === "" || id.validate === null) {
        return;
	} else if (id.validate !== undefined || id.validate !== "" || id.validate !== null) {
		let data = { Code: id.validate };
		socket.emit("confirmEmail", data);
		socket.on("sqlInjection", function() {
			modalText.innerHTML = "Your validation code contained illegal characters!";
		    modal.style.display = "block";
		    return;
		});
		socket.on("noRegisterCode", function() {
			modalText.innerHTML = "This code is invalid! (Register again)";
		    modal.style.display = "block";
		    return;
		});
        socket.on("invalidCode", function() {
			modalText.innerHTML = "This code is invalid! (Register again)";
		    modal.style.display = "block";
		    return;
		});
		socket.on("success", function() {
			modalText.style.color = "green";
			modalText.innerHTML = "Email is validated! You may now login! You will be automatically redirected in a few seconds..";
		    modal.style.display = "block";
			setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
	}
}
$(document).ready( function () {
  tryEmail();
});

function tryLogin() {
	let id = parseURLParams(window.location.href)
	if (id === undefined || id === "") {
		return;
	} else if (id.username === "" || id.username === "" || id.username === null) {
		modalText.innerHTML = "Invalid URL Parameters, you will be redirected!";
		modal.style.display = "block";
		setTimeout(function(){
            window.location.href = "index.html";
        }, 3800);
		return;
	} else if (id.password === "" || id.password === "" || id.password === null) {
		modalText.innerHTML = "Invalid URL Parameters, you will be redirected!";
		modal.style.display = "block";
		setTimeout(function(){
            window.location.href = "index.html";
        }, 3800);
		return;
	} else {
		let data = { Username: id.username, Password: id.password };
		socket.emit("pageLogin", data);
		socket.on("notValid", function() {
			modalText.innerHTML = "This account is not activated! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("sqlInjection", function() {
		    modalText.innerHTML = "Username/password may only be alphanumeric! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("noAccountHere", function() {
			modalText.innerHTML = "This account does not exist! Usernames are case sensitive! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("successLogin", function(data) {
		    document.getElementById("loggedInAs").style.display = "block";
	        document.getElementById("loginPanel").style.display = "none";
			document.getElementById("loggedInDataName").innerHTML = data.UsernameString;
		});
		socket.on("incorrectPassword", function() {
			modalText.innerHTML = "Incorrect password/username! Redirecting...";
		    modal.style.display = "block";
		setTimeout(function(){
            window.location.href = "index.html";
        }, 3800);
		    return;
		});
	}
}

$(document).ready( function () {
  tryLogin();
});

var modal = document.getElementById("myModal");
var modalText = document.getElementById("modalText");
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var socket = io('Removed for security reasons');

function registerPlayer() {
	
	let username;
	let password;
	let email;
	
	username = document.getElementById("registerUsername").value;
	password = document.getElementById("registerPassword").value;
	email = document.getElementById("registerEmail").value;
	
	if (username === undefined || username === "") {
		modalText.innerHTML = "You did not specify a username!";
		modal.style.display = "block";
		return;
    } else if (password === undefined || password === "") {
		modalText.innerHTML = "You did not specify a password!";
		modal.style.display = "block";
		return;
	} else if (email === undefined || email === "") {
		modalText.innerHTML = "You did not specify a email!";
		modal.style.display = "block";
		return;
	}else {
		
        var s = socket.connect('removed for security reasons', {
        reconnection: true
        });
		
		let data = { Username: username, Password: password, Email: email, URL: window.location.href };
		
		s.emit('registerUser', data);
		socket.on("emailTaken", function() {
    		modalText.innerHTML = "This email is taken!";
		    modal.style.display = "block";
		    return;
		});
		socket.on("invalidEmail", function() {
    		modalText.innerHTML = "Your email contains invalid character(s).";
		    modal.style.display = "block";
		    return;
		});
		socket.on('sqlInjection', function() {
		    modalText.innerHTML = "Usernames and passwords may only be alphanumeric!";
		    modal.style.display = "block";
		    return;
		});
		socket.on("usernameTaken", function() {
    		modalText.innerHTML = "This username is taken!";
		    modal.style.display = "block";
		    return;
		});
		socket.on("registerSuccess", function() {
			modalText.style.color = "green";
			modalText.innerHTML = "Register success! Check your email! You will be redirected to the home page...";
		    modal.style.display = "block";
			setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		
		return;
	}

}

function playerLogin() {
	let username;
	let password;
	
	username = document.getElementById("loginUsername").value;
	password = document.getElementById("loginPassword").value;
	
	if (username === undefined || username === "") {
    	modalText.innerHTML = "No username was specified!";
		modal.style.display = "block";
		return;
	} else if (password === undefined || password === "") {
	    modalText.innerHTML = "No password was specified!";
		modal.style.display = "block";
		return;
	} else {
		let data = { Username: username, Password: password };
		socket.emit("requestLogin", data);
		socket.on("successLogin", function(data) {
			modalText.style.color = "green";
		    modalText.innerHTML = "Logging you in... This message will automatically close in a few seconds...";
		    modal.style.display = "block";
			sessionStorage.username = data.UsernameString;
			sessionStorage.usernameData = data.Username;
			sessionStorage.password = data.Password;
			setTimeout(function(){
                window.location.href = "index.html?username=" + sessionStorage.usernameData + "&password=" + sessionStorage.password;
            }, 3800);
			//sessionStorage.clear();
		    return;
		});
		socket.on("incorrectPassword", function() {
			modalText.innerHTML = "Incorrect password/username! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("noAccountHere", function() {
			modalText.innerHTML = "This account does not exist! Usernames are case sensitive! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("notValid", function() {
			modalText.innerHTML = "This account is not activated! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
		socket.on("sqlInjection", function() {
		    modalText.innerHTML = "Username/password may only be alphanumeric! Redirecting...";
		    modal.style.display = "block";
		    setTimeout(function(){
                window.location.href = "index.html";
            }, 3800);
		    return;
		});
	}
}
