var text;
const typeSpeed = 60;

var matSelected = 1;
var timerId, typeTarget = $("#typer"),
    tWrapper = $("#toast-wrapper"),
    ti = 0,
    currentStep = 0,
    contrast = 0,
    brightness = 0,
    vac = 0,
    av = 0,
    on = false,
    dropped = false,
    imgs = [],
    mode = 1,
    removeButtonclicked=false,
    inp=0;

let isImageYDropped = false; // Flag to track if image-y has been dropped

// typing function
function type(txt, cur = 0) {
    if (cur == txt.length) {
        timerId = -1;
        return;
    }
    if (cur == 0) {
        typeTarget.html("");
        clearTimeout(timerId);
    }
    typeTarget.append(txt.charAt(cur));
    timerId = setTimeout(type, typeSpeed, txt, cur + 1);
}

// text to speech function

let english = true;
function toggleVoice(btn) {
  english = !english;
  if (english) btn.innerHTML = "ENG";
  else btn.innerHTML = "HIN";
}

function textToSpeech(text, lang) {
  // Check if the SpeechSynthesis API is available in the browser
  if ("speechSynthesis" in window) {
    // Create a new SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance();

    // Set the text to be spoken
    utterance.text = text;

    // Set the language
    if (lang) {
      utterance.lang = lang;
    }

    // Start the speech synthesis
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech synthesis is not supported in this browser.");
  }
}
// text to speech fxn end

// switch on
function toggleSwitch(toggleElement) {
    if (toggleElement.checked) {
        // Switch is ON, trigger strt()
        strt();
    } else {
        // Switch is OFF, reload the page
        location.reload();
    }
}

function removeHolder() {
    $(".move").on("dragstart", function (e) {
        var selected = e.target;
        $(".placeSampleHolder").on("dragover", function (e) {
        e.preventDefault();
        });
        $(".placeSampleHolder").on("drop", function (e) {
        $(".placeSampleHolder").append(selected);
       
        insertSample();
        return;
        });
    });
}

function insertHolder() {
    $(".placeSampleHolder").on("dragstart", function (e) {
        var selected = e.target;
        $(".placed").on("dragover", function (e) {
        e.preventDefault();
        });
        $(".placed").on("drop", function (e) {
        $(".placed").append(selected);

        if (english) {
            type("Now set the vacuum.");
            textToSpeech("Now set the vacuum.");
          } else {
            type("अब वैक्यूम सेट करें|");
            textToSpeech("अब वैक्यूम सेट करें", "hi-IN");
          }

        if(isImageYDropped==true){
            showToast("Set vaccum");
            setTimeout(function(){
                $("#part11").css('visibility','visible');
            },1500);
            $("#vslider").slider("option", "disabled", false);
            $("#setvac").prop("disabled", false);
        }
        else{
            showToast("Please drag and drop sample before proceeding.",1);
            insertHolder();
        }

        return;
        });
    });
}

function strt() {
    // $('#removeButton').prop("disabled", false);
    removeHolder();

    showToast("Remove the sample holder");
    if (english) {
      type(
        "Now remove the holder, drag and drop the sample on it and insert the sample holder back into the machine."
      );
      textToSpeech(
        "Now remove the holder, drag and drop the sample on it and insert the sample holder back into the machine."
      );
    } else {
      type(
        "अब होल्डर को बाहर निकालें, उस पर सैंपल रखें और सैंपल होल्डर को वापस मशीन में डालें।"
      );
      textToSpeech(
        "अब होल्डर को बाहर निकालें, उस पर सैंपल रखें और सैंपल होल्डर को वापस मशीन में डालें।",
        "hi-IN"
      );
    }
}

// toast message function
function showToast(msg, type = 0) {
    tWrapper.append(`<div id="t${ti++}" class="toast${type == 1 ? ' danger' : (type == 2 ? ' success' : '')}" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
        <svg class="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect width="100%" height="100%" fill="${type == 1 ? '#ff0000' : (type == 2 ? '#31a66a' : '#007aff')}" /></svg>
        <strong class="mr-auto">Notification</strong>
    </div>
    <div class="toast-body">
        ${msg}
</div>
</div>`);
    $(`#t${ti - 1}`).toast({
        delay: 5500
    });
    $(`#t${ti - 1}`).toast('show');
}
// end of toast msg function

$(function () {
    
    if (english) {
        type("Welcome, Get started by switching on the machine.");
        textToSpeech("Welcome, Get started by switching on the machine.");
      } else {
        type("मशीन को स्टार्ट बटन द्वारा चालू करके प्रारंभ करें|");
        textToSpeech("मशीन को स्टार्ट बटन द्वारा चालू करके प्रारंभ करें", "hi-IN");
      }

    var vhandle = $("#vslider").find(".custom-handle");
    var avhandle = $("#avslider").find(".custom-handle");
    var mhandle = $("#mslider").find(".custom-handle");

    // vaccum slider
    $("#vslider").slider({
        min: 0,
        max: 2,
        disabled: true,
        create: function () {
            vhandle.text("Off");
        },
        slide: function (event, ui) {
            var txt = "Off";
            switch (ui.value) {
                case 0:
                    txt = "Off";
                    break;
                case 1:
                    txt = "LV";
                    break;
                case 2:
                    txt = "HV";
                    break;
            }
            vhandle.text(txt);
        }
    });

    //  acc voltage slider
    $("#avslider").slider({
        min: 100,
        max: 102,
        value: 100,
        animate: "slow",
        orientation: "horizontal",
        disabled: true,
        create: function () {
            avhandle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            if (ui.value == 100) {
                avhandle.text("100");
                ac = '100'
            }
            if (ui.value == 101) {
                avhandle.text("120");
                ac = '120'
            }
            if (ui.value == 102) {
                avhandle.text("200");
                ac = '200'
            }
        }
    });

    // magnification slider
    $("#mslider").slider({
        min: 0,
        max: 3,
        disabled: true,
        create: function () {
            mhandle.text("0");
        },
        slide: function (event, ui) {
            var txt = "0";
            switch (ui.value) {
                case 0:
                    txt = "0";
                    mag = '0'
                    break;
                case 1:
                    txt = "L";
                    mag = 'L'
                    break;
                case 2:
                    txt = "H";
                    mag = 'H'
                    break;
                case 3:
                    txt = "VH";
                    mag = 'VH';
                    break;
            }
            mhandle.text(txt);
        }
    });

    // beam on
    $("#on").one("click", function () {
        $('#on').css('backgroundColor', '#21e76e');
        // beam comes here
        clearInterval(beamTimer);
        clearInterval(beamTimer2);
        beamy = 0;
        ctx.clearRect(0, 0, beamCanvas.width, beamCanvas.height);
        ctx2.clearRect(0, 0, beam2W, beam2H);
        beamTimer = beamTimer2 = -1;
        beamTimer = setInterval(drawBeam, 10);
        // beam ends
    });

    // vaccum
    $("#setvac").click(function () {
        if (english) {
            type("Now set accelerating voltage.");
            textToSpeech("Now set the accelerating voltage.");
          } else {
            type("अब त्वरित वोल्टेज सेट करें|");
            textToSpeech("अब त्वरित वोल्टेज सेट करें", "hi-IN");
          }

        $("#setav").prop("disabled", false);
        $("#avslider").slider("option", "disabled", false);

        showToast("Vaccum set");
        $("#vacImg").animate({
            fontSize: 220
        }, {
            step: function (now, fx) {
                $(this).css('clip', `rect(${Math.round(now)}px, 17rem, 300px, 0)`);
            },
            duration: 2500,
            easing: 'linear'
        });
    });

    // acc voltage
    $("#setav").click(function () {

        av = $("#avslider").slider("option", "value");
        showToast("Switch on the beam");
        if (english) {
          type("Now switch on the beam.");
          textToSpeech("Try to switch on the beam now.");
        } else {
          type("बीम को चालू करने का प्रयास करें|");
          textToSpeech("बीम को चालू करने का प्रयास करें", "hi-IN");
        }

        $("#on").prop("disabled", false);
        $("#setvac").prop("disabled", true);
        $("#vslider").slider("option", "disabled", true);

        showToast("Switch on the beam");
    });

    // magnification
    $("#setmag").click(function () {
        showToast("Magnification set");
        type("Now you can see the output image.");
        
        mode = $(".imgMode option:selected").text();
        // inp = $("#position :selected").val();

        url = "../images/outputs/" + av + mag + item + mode + ".jpg";
                         
            $("#outImage2").attr("src",url);
            $("#outImage2").attr("alt", url);

            $("#outImage1").attr("src",url);
            $("#outImage1").attr("alt", url);

            $("#outImage3").attr("src",url);
            $("#outImage3").attr("alt", url);
    });

});

// imaging mode selection
function change(){
    showToast("Set Magnificaton");
    $("#setmag").prop("disabled", false);
    $("#mslider").slider("option", "disabled", false);
}
// imaging mode selection code end

// beam code start 
var beamCanvas = document.getElementById("beam");
var ctx = beamCanvas.getContext('2d');
var beamy = 0,
    beamx = parseInt(beamCanvas.width / 2),
    beamWidth, beamTimer = -1;
var beamCanvas2 = document.getElementById("beam2");
var ctx2 = beamCanvas2.getContext('2d');
var beam2H = beamCanvas2.height,
    beam2W = beamCanvas2.width,
    beamx2 = parseInt(beamCanvas2.width / 2),
    beamTimer2 = -1;

function randEx(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBeam() {
    ctx.beginPath();

    beamWidth = Math.sin(beamy * 3.14 / 160) * 7;
    ctx.shadowBlur = 1;
    ctx.shadowColor = 'red';
    ctx.strokeStyle = "green";
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = beamWidth;
    ctx.moveTo(beamx, beamy);
    ctx.lineTo(beamx + 1, beamy);
    ctx.stroke();


    ctx.shadowOffsetX = -beamWidth / 2;
    ctx.moveTo(beamx, beamy);
    ctx.lineTo(beamx + 1, beamy);
    ctx.stroke();

    ctx.shadowOffsetX = beamWidth / 2;
    ctx.moveTo(beamx, beamy);
    ctx.lineTo(beamx + 1, beamy);
    ctx.stroke();

    ctx.shadowOffsetX = -beamWidth;
    ctx.moveTo(beamx, beamy);
    beamy += 1;
    ctx.lineTo(beamx, beamy);
    ctx.stroke();
    if (beamy >= beamCanvas.height) {
        clearInterval(beamTimer);
        beamTimer = -1;
        beamTimer2 = setInterval(drawBeam2, 100);

        if (english) {
            type(
              "The output image is displaying on the right side, you can also change the magnification."
            );
            textToSpeech(
              "The output image is displaying on the right side, you can also change the magnification."
            );
          } else {
            type(
              "आउटपुट छवि दाईं ओर प्रदर्शित हो रही है, आप आवर्धन भी बदल सकते हैं|"
            );
            textToSpeech(
              "आउटपुट छवि दाईं ओर प्रदर्शित हो रही है, आप आवर्धन भी बदल सकते हैं|",
              "hi-IN"
            );
          }
        
          showToast("Set imaging mode");
        $('#position').prop("disabled", false);
        $('#downloadButton').show();
        // $("#outImage4").hide();

        if (item == "zebrafish") {
          $('#outImage2').hide();
          $('#outImage3').hide();
          $('#outImage1').show(500, function() {

          });
          showToast("Image 1 Generated successfully", 2);
        }
        else if (item == "metal") {
          $('#outImage1').hide();
          $('#outImage3').hide();
          $('#outImage2').show(500, function() {

          });
          showToast("Image 2 Generated successfully", 2);
        }
        else if (item == "ceramic") {
          $('#outImage1').hide();
          $('#outImage2').hide();
          $('#outImage3').show(500, function() {

          });
          showToast("Image 3 Generated successfully", 2);
        }
      
    }
}

function drawBeam2() {
    ctx2.beginPath();
    ctx2.clearRect(0, 0, beam2W, beam2H);
    ctx2.strokeStyle = "#FFFFFFBB";
    ctx2.moveTo(beamx2, 23);
    ctx2.lineTo(beamx2 + 60 + randEx(-5, 5), randEx(-10, 5));
    ctx2.moveTo(beamx2 - 6, 23);
    ctx2.lineTo(beamx2 + 60 + randEx(-5, 5), randEx(-10, 5));
    ctx2.stroke();
}
// beam code end

// sample and holder move
function insertSample() {
  
    $("#image-y").on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("text/plain", "dragging-y"); // Allow image Y to be draggable
    });
  
    $("#image-a").on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("text/plain", "dragging-a"); // Allow image A to be draggable
    });
  
    $("#image-b").on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("text/plain", "dragging-b"); // Allow image B to be draggable
    });
  
    $("#image-x").on("dragover", function (e) {
      e.preventDefault();
    });
  
    $("#image-x").on("drop", function (e) {
      e.preventDefault();
      const draggedItem = e.originalEvent.dataTransfer.getData("text/plain");
  
      if (draggedItem === "dragging-y" && !isImageYDropped) {
        $("#image-y").css("visibility", "hidden");
        isImageYDropped = true; // Set the flag when image-_ is dropped
        $("#image-x").attr("src", "../images/parts/sh1.png"); // Replace image X with image Z when any image is dropped onto it
        insertHolder();
        item = "zebrafish";
      } else if (draggedItem === "dragging-a" && !isImageYDropped) {
        $("#image-a").css("visibility", "hidden");
        isImageYDropped = true; // Set the flag when image-_ is dropped
        $("#image-x").attr("src", "../images/parts/sh2.png"); // Replace image X with image Z when any image is dropped onto it
        insertHolder();
        item = "metal";
      } else if (draggedItem === "dragging-b" && !isImageYDropped) {
        $("#image-b").css("visibility", "hidden");
        isImageYDropped = true; // Set the flag when image-_ is dropped
        $("#image-x").attr("src", "../images/parts/sh3.png"); // Replace image X with image Z when any image is dropped onto it
        insertHolder();
        item = "ceramic";
      }
      else{
        showToast("Put the holder in the machine",1);
        type("To change the sample, switch off and again select back desired sample");
      }
      return;
    });
  }

// sample and holder move end

// Get references to the button, modal, and close button
const toggleButton_tem = document.getElementById('toggleButton_tem');
const imageModal = document.getElementById('imageModal');
const closeButton_tem = document.getElementById('closeButton_tem');
const image_tem = document.querySelector('#imageModal img');

// Flag to track the state of the modal
let modalVisible = false;

// Function to toggle the modal and button text
function toggleModal() {
    if (modalVisible) {
        // Hide the modal
        imageModal.style.display = 'none';
        toggleButton_tem.textContent = 'See TEM';
    } else {
        // Show the modal
        imageModal.style.display = 'block';
        toggleButton_tem.textContent = 'Hide TEM';
    }
    modalVisible = !modalVisible;
}

// Add a click event listener to the button
toggleButton_tem.addEventListener('click', toggleModal);

// Add a click event listener to the close button
closeButton_tem.addEventListener('click', toggleModal);

// Make the modal draggable
let isDragging = false;
let offsetX, offsetY;

imageModal.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - imageModal.getBoundingClientRect().left;
    offsetY = e.clientY - imageModal.getBoundingClientRect().top;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        imageModal.style.left = newX + 'px';
        imageModal.style.top = newY + 'px';
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// button, modal, and close button end

// Function to download the image
function downloadImage() {
  const image_op = document.getElementById("image_op");
  const imageUrl = image_op.src;
  const a = document.createElement("a");
  a.href = imageUrl;
  a.download = "downloaded-image.png"; // Set the desired filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Add a click event listener to the download button
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadImage);
// end of Function to download the image 