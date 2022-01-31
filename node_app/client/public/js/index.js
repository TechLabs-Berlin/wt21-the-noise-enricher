const btn = document.getElementById('btn');

let formControl = document.getElementsByClassName("form-control");

let button = document.getElementsByClassName("btn");

let fileInput = document.getElementById("generateTrack");

function grayButton() {
    if (formControl.audio.value == ""){
        alert("you have to select an audio first!");
        button[0].type = "button";

    } else {
        fileInput.submit();
    };
}

//---
//---function grayButton() {

    //---if (formControl.audio.value == "") {
        //---button[0].type = "button";
        //---button[0].disabled = "true";

    //---} else {
       //--- button[0].type = "submit";
       //--- button[0].disabled = "false";
   //--- }
//---}

