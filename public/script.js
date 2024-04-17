
function onSignIn(googleUser) {
   // console.log("got here!1");
    var id_token = googleUser.credential;
    //console.log(id_token)
      // Send the ID token to server-side script called index.js for verification and
      // to create a session.

    fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade'},
        body: JSON.stringify({ id_token:id_token})
        })
        .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }
    return response.json();
    })
    .then(data => {
    //console.log("success", data);
    const allInfo = data.allInfo;
    
    // check if email ends in stuy.edu and contains the number 4
    if ((allInfo.email.endsWith("stuy.edu") && allInfo.email.includes("4") ) || allInfo.email===("zkarim7676@gmail.com") ) {
        window.username = allInfo.name;
        window.email = allInfo.email;
        document.getElementById("googleButton").className = "googleHide";
        document.getElementById("signInSuccess").className = "signInShow"
        document.getElementById("signInSuccess").innerHTML = "Successfully signed in as " + window.username;
        document.getElementById("signin_text").className = "hide_signin";

        // display the user's target
        fetch('/target', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade'},
            body: JSON.stringify({ email:window.email})
            })
            .then(response => {
            if(!response.ok) {
                throw new Error(response.statusText);
            }
        return response.json();
        })
        .then(data => {
        console.log("success", data);
        const targets = data.targets;
        const target = targets.target;
        

        // length of target
        

        if (target.length <= 1) {
            document.getElementById("target").innerHTML = "You are eliminated or not playing";
        }
        else {
            //document.getElementById("target").innerHTML = "Your initial target is " + target;




            document.getElementById("remaining_players").className = "leaderboardShow";


        }

        document.getElementById("leaderboard").className = "leaderboardShow";


        })



    }
    else {
        alert("You are not a Stuyvesant student. Please use a Stuyvesant email address.");
    }

    })
    .catch(error => {
    console.log("error", error);
    // Handle the error, for example, by displaying an error message to the user.
    });
}