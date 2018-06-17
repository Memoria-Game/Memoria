function getFromAPI(endpoint){
    return $.ajax("http://api.memoria.cf/" + endpoint, {
        method: 'GET',
        crossDomain: true,
        xhrFields: { withCredentials: true }
     })
}

function getPesonnalStat() {
   return getFromAPI('statistics/personnal')   
}

function getPersonnalScore(){
    return getFromAPI('statistics/personnalScore')
}

function getFriendScores(){
    return getFromAPI('statistics/friends')
}

function getHomeScore(){
    return getFromAPI('statistics/countries/home')
}

function addFriend(username){
    return $.ajax("http://api.memoria.cf/statistics/add_friend ", {
     method: 'POST',
     data: JSON.stringify({pseudo:username}),
     contentType:"application/json; charset=utf-8",
     crossDomain: true,
     xhrFields: { withCredentials: true }
  })
}
