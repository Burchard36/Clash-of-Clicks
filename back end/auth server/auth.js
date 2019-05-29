io.on('connection', function (socket) {

    socket.on("loadGamePage", function (data) {
        console.log("its sending here");
    });

    socket.on('registerUser', function (data) {
        let address = socket.handshake.address;
        let username = data.Username;
        let password = data.Password;
        let email = data.Email;
        if (sanitizeUsername(username) && checkUsernameLength(username)) {
            // If the username is valid, do stuff here
            if (sanitizePassword(password) && checkPasswordLength(password)) {
                // If the password is valid, do stuff here
                if (emailIsValid(email)) {
                    username = encrypt(username);
                    password = encrypt(password);
                    // If the email is valid, check if Username, or email is already in use
                    con.query("SELECT * FROM `Users` WHERE `Username` = ?", [username], function (err, fields) {
                        if (fields[0] === undefined) {
                            // If the username is not taken, do some stuff here
                            con.query("SELECT * FROM `Users` WHERE `Email` = ?", [email], function (err, fields) {
                                if (fields[0] === undefined) {
                                    // If the email is not taken, generate a varification code, and send an email
                                    let code = encrypt(Math.floor(Math.random() * 999999).toString()); 
                                    var mailOptions = {
                                        from: 'simhacknoreply@gmail.com',
                                        to: email,
                                        subject: 'Welcome to Sim Hack!',
                                        html: '<h2 style="text-align: center;">Welcome to SimHack!</h2><p style="text-align: center;">Your registration code is ' +
                                            data.URL + "?validate=" + code + '.</p><p style="align-right;">You have 10 minutes to activate your account or it gets deleted!</p>',
                                    };
                                    // Send a varification email
                                    transporter.sendMail(mailOptions, function (err, info) {
                                        if (err) {
                                            // If there is an error in sending the email, just quit
                                            return;
                                        } else {
                                            // Tells the server the email was send
                                            console.log(prefix + " Email sent to " + email);
                                            // Send the code from the email to MySQL
                                            con.query("INSERT INTO Validate SET ? ", { Username: username, Code: code }, function (err) {
                                                if (err) throw err;
                                            });
                                            // Sets the user's data into the Users database
                                            con.query('INSERT INTO Users SET ? ', { Username: username, Password: password, Email: data.Email }, function (err) {
                                                if (err) throw err;
                                                console.log(prefix + " Username:" + data.Username + " succesfully registered!");
                                                socket.emit("registerSuccess", data);
                                            });
                                            // Timer to validate the email
                                            const timer = setInterval(function () {
                                                con.query("SELECT * FROM `Validate` WHERE `Code` = ?", [code], function (err, fields) {
                                                    if (fields[0] === undefined) {
                                                        // If the code was used, tell the server the user registered
                                                        console.log(prefix + " successfully validated theyre account");
                                                        clearInterval(timer);
                                                        return;
                                                    } else {
                                                        // If the user does not use the code, tell the server the code was not used
                                                        console.log(prefix + " Deleting user " + data.Username + " because they did not validate theyre email!");
                                                        clearInterval(timer);
                                                        // Completly delete the user data
                                                        con.query("DELETE FROM `Validate` WHERE `Code` = ?", [code], function (err) {
                                                            if (err) throw err;
                                                            con.query("DELETE FROM `Users` WHERE `Username` = ?", [username], function (err) {
                                                                if (err) throw err;
                                                                return;
                                                            });
                                                        });
                                                    }
                                                });
                                            }, 600000)
                                        }
                                    });
                                } else {
                                    // If the email is taken, do stuff here
                                    socket.emit("emailTaken", data);
                                    return;
                                }
                            });
                        } else {
                            // If the username is taken, do some stuff here
                            socket.emit("usernameTaken", data);
                            return;
                        }
                    });
                } else {
                    // If the email is invalid, do stuff here
                    socket.emit("invalidEmail", data);
                    return;
                }
            } else {
                // If the password is invalid, do stuff here
                console.log(prefix + " " + address + " entered this value as a password: " + username + " LOGGED AS POTENTIAL SQL INJECTION");
                socket.emit("sqlInjection", data);
                return;
            }
        } else {
            // If the username is invalid, throw err here
            console.log(prefix + " " + address + " entered this value as a username: " + username + " LOGGED AS POTENTIAL SQL INJECTION");
            socket.emit("sqlInjection", data);
            return;
        }
    });

    socket.on("requestLogin", function (data) {
        let username = data.Username;
        let password = data.Password;
        let address = socket.handshake.address;
        // Checks if the username is valid
        if (sanitizeUsername(username) && checkUsernameLength(username)) {
            // If the username is good, do stuff here
            if (sanitizePassword(password) && checkPasswordLength(password)) {
                userString = username;
                username = encrypt(username);
                password = encrypt(password);
                // If the password is good, do stuff here
                con.query("SELECT * FROM `Validate` WHERE `Username` = ? ", [username], function(err, fields) {
                    if (fields[0] === undefined) {
                        // If the users account is validated, do stuff here
                        con.query("SELECT * FROM `Users` WHERE `Username` = ? ", [username], function (err, fields) {
                            if (fields[0] === undefined) {
                                // If the account doesnt exist, do stuff here
                                socket.emit("noAccountHere", data);
                                return;
                            } else {
                                // If the account exists, do stuff here
                                let dataPass = fields[0].Password;
                                if (password === dataPass) {
                                    console.log("its right");
                                    // If the passwords match, log the user in
                                    data = { UsernameString: userString, Username: username, Password: password }
                                    socket.emit("successLogin", data);
                                    return;
                                } else {
                                    // if the passwords dont match, do stuff here
                                    socket.emit("incorrectPassword", data);
                                    return;
                                }
                            }
                        });
                    } else {
                        // If the users account is not validated, do stuff here
                        socket.emit("notValid", data);
                        return;
                    }
                });
            } else {
                // If the password is bad, do stuff here
                console.log(prefix + " " + address + " entered this value as a password: " + username + " LOGGED AS POTENTIAL SQL INJECTION");
                socket.emit("sqlInjection", data);
                return;
            }
        } else {
            // If the username is bad, do stuff here
            console.log(prefix + " " + address + " entered this value as a username: " + username + " LOGGED AS POTENTIAL SQL INJECTION");
            socket.emit("sqlInjection", data);
            return;
        }
    });

    socket.on("pageLogin", function (data) {
        let username = data.Username;
        let password = data.Password;
        console.log(password);
        let address = socket.handshake.address;
        // Checks if the username is valid
        if (sanitizeUsername(username)) {
            // If the username is good, do stuff here
            if (sanitizePassword(password)) {
                userString = username;
                // If the password is good, do stuff here
                con.query("SELECT * FROM `Validate` WHERE `Username` = ? ", [username], function (err, fields) {
                    if (fields[0] === undefined) {
                        // If the users account is validated, do stuff here
                        con.query("SELECT * FROM `Users` WHERE `Username` = ? ", [username], function (err, fields) {
                            if (fields[0] === undefined) {
                                // If the account doesnt exist, do stuff here
                                socket.emit("noAccountHere", data);
                                return;
                            } else {
                                // If the account exists, do stuff here
                                let dataPass = fields[0].Password;
                                console.log(dataPass);
                                if (password.toString() === dataPass) {
                                    // If the passwords match, log the user in
                                    data = { UsernameString: decrypt(username.toString()), Username: username, Password: password }
                                    socket.emit("successLogin", data);
                                    return;
                                } else {
                                    // if the passwords dont match, do stuff here
                                    socket.emit("incorrectPassword", data);
                                    return;
                                }
                            }
                        });
                    } else {
                        // If the users account is not validated, do stuff here
                        socket.emit("notValid", data);
                        return;
                    }
                });
            } else {
                // If the password is bad, do stuff here
                console.log(prefix + " " + address + " entered this value as a password: " + username + " LOGGED AS POTENTIAL SQL INJECTION");
                socket.emit("sqlInjection", data);
                return;
            }
        } else {
            // If the username is bad, do stuff here
            console.log(prefix + " " + address + " entered this value as a username: " + username + " LOGGED AS POTENTIAL SQL INJECTION");
            socket.emit("sqlInjection", data);
            return;
        }
    });

    socket.on("confirmEmail", function (data) {
        let address = socket.handshake.address;
        let code = data.Code;
        if (sanitizeCode(code)) {
            // If the code is invalid, do stuff here
            con.query("SELECT * FROM `Validate` WHERE `code` = ?", [code], function (err, fields) {
                if (fields[0] === undefined) {
                    // If the code is invalid, do stuff here
                    socket.emit("noRegisterCode", data);
                    return;
                } else {
                    // If the code is valid, do stuff here
                    let dataCode = fields[0].Code;
                    if (dataCode == code) {
                        // Clear the code from registry server
                        con.query("DELETE FROM `Validate` WHERE `Code` = ?", [code], function (err) {
                            if (err) throw err;
                        });
                        socket.emit("success", data);
                        console.log(prefix + " Validation code " + code + " was used!");
                        return;
                    } else {
                        // if the code is invalid do stuff here
                        socket.emit("invalidCode", data);
                        return;
                    }
                }
            });
        } else {
            console.log(prefix + " " + address + " entered this value as a email confirmation code: " + code + " LOGGED AS POTENTIAL SQL INJECTION");
            socket.emit("sqlInjection", data);
            return;
        }
    });
});
