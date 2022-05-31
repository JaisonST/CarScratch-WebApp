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

span.onclick = closeModal; 
