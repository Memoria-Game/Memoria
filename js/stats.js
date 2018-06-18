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

function getCountries(){
    return getFromAPI('statistics/countries')
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

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("friends_table");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = parseInt(rows[i].getElementsByTagName("td")[2].innerHTML);
      y = parseInt(rows[i + 1].getElementsByTagName("td")[2].innerHTML);
      console.log(x);
      console.log(y);
      // Check if the two rows should switch place:
      if (x < y) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  alert("test"); 
}

function friends_data(){
    getFriendScores().then((data) =>{
        let rows = $("#friends_table").find("tbody")
        rows.empty()
        console.log(data[0].userName)
        console.log(data)
        let id = 1
        for(i in data){
            d = data[i]
            elem = //"<tr><th scope=\"row\">" + id +
                "</th><td>" + d.userName + 
                "</td><td>" + d.bestScore + 
                "</td><td>" + d.maxLevel + "</td></tr>"
            rows.append(elem)
            id += 1
        }
        sortTable();
    } )
}

friends_data();

function add_friend_data(){
    let name = $('#friend_name').val()

    addFriend(name)
        .then(() => window.location.href = "statistics.html")
        .fail(() => alert("No '" + name + "' user exists"));
}