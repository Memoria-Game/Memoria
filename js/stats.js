function getFromAPI(endpoint){
    return $.ajax("http://api.memoria.cf/" + endpoint, {
        method: 'GET',
        crossDomain: true,
        xhrFields: { withCredentials: true }
     })
}

function getPersonnalStat() {
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

function friends_data(){
    getFriendScores().then((data) =>{
        let rows = $("#friends_table").find("tbody")
        console.log(data[0].userName)
        console.log(data)
        let id = 1
        for(d in data){
            elem = "<tr><th scope=\"row\">" + id +
                "</th><td>" + d.userName + 
                "</td><td>" + d.bestScore + 
                "</td><td>" + d.maxLevel + "</td></tr>"
            rows.append(elem)
            id += 1
        }

    } )
}

friends_data()