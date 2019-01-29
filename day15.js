let ghv;
let row = 100;
let col = 3;
let tabili = document.getElementById('gitHubUsers');

const fetchFromApi = async () => {
    const responsev = await fetch('https://api.github.com/search/users?q=location%3Anigeria&per_page=100');
    ghv = await responsev.json();
    createTable();
}

function createTable(){
    for (var i = 0; i < row; i++){
        var tr = document.createElement('tr');
        for (j = 0; j < col; j++){
            let text;
            let td = document.createElement('td');
            if (j == 0){
                text = document.createTextNode(i + 1);
                td.appendChild(text);
            }
            else if(j == 1){
                text = document.createTextNode(ghv.items[i].login);
                td.appendChild(text);
            }
            else{
                let newlink = document.createElement('a');
                newlink.setAttribute('href', ghv.items[i].html_url);
                text = document.createTextNode('Check out user on GitHub');
                newlink.appendChild(text);
                td.appendChild(newlink);
            }
            tr.appendChild(td);
        }
        tabili.appendChild(tr);
      }
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

fetchFromApi();
