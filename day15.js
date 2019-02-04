function paginate(pageControl){
    let prevPageNo = parseInt(sessionStorage.getItem('pageNum'));
    if (parseInt(pageControl.innerHtml == prevPageNo)){
        return;
    }
    
    else if (pageControl.id == 'prev' && prevPageNo > 1){
        sessionStorage.setItem('pageNum', prevPageNo - 1);
    }
    else if(pageControl.id == 'next' && prevPageNo < 10){
        sessionStorage.setItem('pageNum', prevPageNo + 1);
    }
    else if(pageControl.id == 'next' && prevPageNo == 10){
        return;
    }
    else if(pageControl.id == 'prev' && prevPageNo == 1){
        return;
    }
    else{
        sessionStorage.setItem('pageNum', parseInt(pageControl.innerHTML));
    }
    location.reload(true);
}

const fetchFromApi = async () => {
    let ghv;
    // sessionStorage.setItem('testy', 3);
    // console.log(typeof sessionStorage.getItem('testy'));
    // console.log(typeof sessionStorage.getItem('pageNum'));
    const responsev = await fetch('https://api.github.com/search/users?q=location%3Anigeria&per_page=100&page=' + sessionStorage.getItem('pageNum').toString());
    ghv = await responsev.json();
    console.log(ghv.items[0].login);
    sessionStorage.setItem('gitHubUsers', JSON.stringify(ghv));

    createTable(ghv);
}

function createTable(ghv){
    let pageNav = document.getElementById("pagination");
    let endColNo = 100 * parseInt(sessionStorage.getItem('pageNum'));
    let startColNo = endColNo - 100;
    for (var i = startColNo; i < endColNo; i++){
        var tr = document.createElement('tr');
        for (j = 0; j < 3; j++){
            let text;
            let td = document.createElement('td');
            if (j == 0){
                text = document.createTextNode(i + 1);
                td.appendChild(text);
            }
            else if(j == 1){
                text = document.createTextNode(ghv.items[i % 100].login);
                td.appendChild(text);
            }
            else{
                let newlink = document.createElement('a');
                newlink.setAttribute('href', 'user_details.html');
                newlink.setAttribute('id', i.toString());
                newlink.setAttribute('class', 'userDetail')
                newlink.setAttribute('onClick', 'clicko(this)');
                text = document.createTextNode('Check out user details');
                newlink.appendChild(text);
                td.appendChild(newlink);
            }
            tr.appendChild(td);
        }
        document.getElementById('gitHubUsers').appendChild(tr);
      }
    
      pageNav.children[sessionStorage.getItem('pageNum')].classList.toggle('active');
      document.getElementById("pagination").style.display = 'inline-block';
}

// When the user clicks on <span> (x), open the user details page
// document.getElementsByClassName('userDetail').addEventListener('click', function(evt){
//     evt.preventDefault;
//     document.getElementsById('clickMe').click();
// });

function clicko(me){
    sessionStorage.setItem('clickedId', me.id);
}

function filterUsers() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("filterUsers");
    filter = input.value.toUpperCase();
    table = document.getElementById("gitHubUsers");
    tr = table.getElementsByTagName("tr");
  
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}

function userDetails(){
    let user = JSON.parse(sessionStorage.getItem('gitHubUsers'));
    let userIndex = parseInt(sessionStorage.getItem('clickedId'));
    user = user.items[userIndex];
    console.log(user);
    let repoLink = createLink(user.html_url + '?tab=repositories');
    let githubLink = createLink(user.html_url);
    let profilePicsLink = createLink(user.avatar_url);
    let starsLink = createLink(user.html_url + '?tab=stars');
    let followersLink = createLink(user.html_url + '?tab=followers');
    let followingLink = createLink(user.html_url + '?tab=following');

    document.getElementById('udDiv').children[1].innerHTML = 'User Name: ' + user.login;
    document.getElementById('udDiv').children[2].innerHTML = 'Github Page: ';
    document.getElementById('udDiv').children[2].appendChild(githubLink);
    document.getElementById('udDiv').children[3].innerHTML = 'User Repos: ';
    document.getElementById('udDiv').children[3].appendChild(repoLink);
    document.getElementById('udDiv').children[8].innerHTML = 'User Id: ' + user.id;
    document.getElementById('udDiv').children[4].innerHTML = 'Profile Picture: ';
    document.getElementById('udDiv').children[4].appendChild(profilePicsLink);
    document.getElementById('udDiv').children[5].innerHTML = 'Stars: ';
    document.getElementById('udDiv').children[5].appendChild(starsLink);
    document.getElementById('udDiv').children[6].innerHTML = 'Followers: ';
    document.getElementById('udDiv').children[6].appendChild(followersLink);
    document.getElementById('udDiv').children[7].innerHTML = 'Following: ';
    document.getElementById('udDiv').children[7].appendChild(followingLink);
}

function createLink(param){
    let newLink =  document.createElement('a');
    newLink.setAttribute('href', param);
    newLink.setAttribute('target', '_blank');
    newLink.innerHTML = param;
    return newLink;
}

function checkCallingPage(){
    var path = window.location.pathname;
    path = path.split("/").pop();
    if (path == 'user_details.html'){
        userDetails();
    }
    else{
        if(sessionStorage.getItem('alreadyLoaded') != 'true'){            
            sessionStorage.setItem('alreadyLoaded', 'true');
            sessionStorage.setItem('pageNum', 1);
            fetchFromApi();
        }
        else{
            fetchFromApi();
        }
        
    }
}

window.onload = checkCallingPage();
