function connectUser(username, password) {
    return $.ajax("http://api.memoria.cf/signin", {
     method: 'POST',
     data: JSON.stringify({pseudo:username, pwd:password}),
     contentType:"application/json; charset=utf-8",
     crossDomain: true,
     xhrFields: { withCredentials: true }
  })
  .fail((msg) => console.log("error occured " + msg))
  .then((msg) => {
      console.log(msg);
      logout()
    });
   
}

function logout() {
    return $.ajax("http://api.memoria.cf/logout", {
     method: 'GET',
     xhrFields: { withCredentials: true },
     crossDomain: true
  })
  .then((msg) => console.log(msg))
  .fail((msg) => console.log("error occured " + msg));;
   
}

connectUser("moi", "1234")

