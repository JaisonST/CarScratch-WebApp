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

function formSubmit(){
    closeModal();

    loadingModal = document.getElementById("loadingModal");
    loadingModal.style.display = "block";

    move();
}

function move() {
    var i = 0;
    if (i == 0) {
      i = 1;
      var elem = document.getElementById("myBar");
      var width = 0;
      var id = setInterval(frame, 1500);
      function frame() {
        if (width >= 95) {
          clearInterval(id);
          i = 0;
        } else {
          width+=5;
          elem.style.width = width + "%";
          elem.innerHTML = width  + "%";
        }
      }
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
