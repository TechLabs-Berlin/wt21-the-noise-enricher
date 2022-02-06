const btn = document.getElementById('btn');

let formControl = document.getElementById("file-name");

let button = document.getElementsByClassName("btn");

let fileInput = document.getElementById("generateTrack");

function noFileChoosen() {
    if (formControl.textContent == "No file choosen") {
        alert("you have to select an audio first!");
        button[0].type = "button";

    } else {
        fileInput.submit();
    };
}

let inputFile = document.getElementById("uploadFile");
let fileNameField = document.getElementById("file-name");
inputFile.addEventListener("change", function (event) {
    let uploadedFileName = event.target.files[0].name;
    fileNameField.textContent = uploadedFileName;
})

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

