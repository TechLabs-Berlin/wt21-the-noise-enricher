const btn = document.getElementById('btn');

let formControl = document.getElementsByClassName("form-control");

let button = document.getElementsByClassName("btn");

let fileInput = document.getElementById("generateTrack");

function showAlert() {
    if (formControl.audio.value == ""){
        alert("you have to select an audio first!");
        button[0].type = "button";

    } else {
        fileInput.submit();
    };
}