function signin(username, password) {
    return $.ajax("http://api.memoria.cf/signin", {
     method: 'POST',
     data: JSON.stringify({pseudo:username, pwd:password}),
     contentType:"application/json; charset=utf-8",
     crossDomain: true,
     xhrFields: { withCredentials: true }
  })
  .fail((msg) => console.log("error occured " + msg.responseText))
  .then((msg) => console.log(msg));
   
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

function signup(username, password, mail, country){
    return $.ajax("http://api.memoria.cf/signin", {
     method: 'POST',
     data: JSON.stringify({pseudo:username, email:mail, pwd:password, country:country}),
     contentType:"application/json; charset=utf-8",
     crossDomain: true,
     xhrFields: { withCredentials: true }
  })
  .fail((msg) => console.log("error occured " + msg.responseText))
  .then((msg) => console.log(msg));
}

function get_form_input(form){
    let data = $(form).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    return data
}

function form_login(f) {
    data = get_form_input(f)

    username = data['pseudo']
    password = data['password']

    signin(username, password)
        .then(() => window.location.href = "game.html")
        .fail(() => alert("Mauvais nom d'utilisateur ou mot de passe"))

    //console.log(username);
    return false
}

function form_register(f) {
    data = get_form_input(f)

    username = data['pseudo']
    password = data['password']
    password = data['email']
    password = data['password']
}
