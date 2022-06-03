var modal = document.getElementById("formModal");
var span = document.getElementsByClassName("close")[0];

function addRecord(){
    console.log("this happend");
    modal.style.display = "block";
}
function closeModal() {
     modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function deleteRecord(id){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost/record/delete", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(
        {id: id}));
    location.reload();
}
span.onclick = closeModal; 
