/*Global Variables*/

var email_pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
var server_url = "http://192.168.0.41/projects/dubstep_server/";


// The Mobile Safari Forms Assistant pushes the page up if it needs to scroll, but jQuery Mobile
// doesn't scroll the page back down. This code corrects that.
//
// I decided this should not be incorporated into jquery.mobile.iscrollview.js itself, since it
// really isn't related to iScroll - it is an issue that occurs when using pages that are sized
// to match full-height on mobile device.
//
// There is still code in jquery.mobile.iscrollview.js that deal with a similar issue with
// the address bar, and I think it really doesn't belong there.
//
// IDEA: Create a new plug-in to deal with such concerns: e.g. jquery.mobile.fullheight.
(function mobileSafariFormsAssistantHack($) {
  "use strict";
  $(document).bind("pageinit",
    function installDelegation(pageEvent) {
      var $page = $(pageEvent.target);
      $page.delegate("input,textarea,select", "blur",
        function onBlur(inputEvent) {
          setTimeout(function onAllBlurred() {  // Need this timeout for .ui-focus to clear
            // Are all of the input elements on the page blurred (not focused)?
            if ($page.find("input.ui-focus,textarea.ui-focus,select.ui-focus").length === 0) {
              $.mobile.silentScroll(0);        // If so, scroll to top
              }
            },
          0);
        });
    });
  }(jQuery));

$(document).bind("mobileinit", function() {
  $.mobile.defaultPageTransition = "slide";
  });

// Simple fast-click implementation
// This serves two purposes:
// - Eliminates 400mSec click latency on iOS
// - using $.mobile.changePage prevents the iOS address bar from coming down
// We use data-href instead of href, and data-ajax="false" on links to prevent
// default browser and JQM Ajax action on all JQM versions. since we use $.mobile.changePage,
// it uses Ajax page changes.
$(document).delegate(".fastclick", "vclick click", function(event) {
  var
    $btn = $(this),
    href = $btn.jqmData("href"),
    $transition = $btn.jqmData("transition");
    
  event.preventDefault();
  if ( event === "click" ) { return; }
  //alert($transition);
  if (!$transition){
      $transition = "slide";
  }
  $.mobile.changePage(href, {transition:$transition, changeHash: true});
});

/*$( document ).on( "pagecreate", ".pagewithpanel", function() {
    $( document ).on( "swipeleft swiperight", ".pagewithpanel", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" && $(document).width()<768) {
            if ( e.type === "swipeleft" ) {
                //$( "#right-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" && $(e.target).parent().attr("class")!="swiper-container" && $(e.target).parent().parent().attr("class")!="swiper-container" && $(e.target).parent().parent().parent().attr("class")!="swiper-container" && $(e.target).parent().parent().parent().parent().attr("class")!="swiper-container" ) {
                $( "#menu_panel" ).panel( "open" );
            }
        }
    });
});*/

$(document).on("pageinit", function(event) {
    //alert("pageinit");

    //if (navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)) {
        $("body").addClass("ios7");
        $('body').append('<div id="ios7statusbar"/>');
    //}
});


function popup_alert(msg){
    alert(msg);
}

function logout(){
    setStorage("UserUID", "");
    $.mobile.changePage("index.html", {transition: "slidedown", changeHash: true});
}

/*========local storage functions for Cookie===========*/
function getStorage(ckey){
    return window.localStorage.getItem(ckey);
}

function setStorage(ckey, cvalue){
    window.localStorage.setItem(ckey, cvalue);
}

document.addEventListener("deviceready", onDeviceReady, false);

/*$(document).ready(function(){
    onDeviceReady()
});*/


function onDeviceReady(){

    /* //intial Camear plugin
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;*/

    //setStorage("UserUID", "");

    /*if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        console.log(results[1]);
                        setStorage("CurrentCityName", results[1].address_components[2].long_name);
                        console.log("Your City is "+getStorage("CurrentCityName"));
                    } else {
                        console.log('Can\'t get City Name');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            });
        }, function() {
            console.log('Error: The Geolocation service failed.');
        });
    } else {
        // Browser doesn't support Geolocation
        console.log('Error: Your browser doesn\'t support geolocation.');
    }*/
}

$(document).on("pagebeforeshow", "#login_page", function(){

    document.getElementById("login_page").addEventListener("touchmove", function(e){ e.preventDefault() }, false);
});



$(document).on("click", "#btn_login", function(){


    //$.mobile.changePage("home.html", {transition: "slide", changeHash: true});

/**/
    var $username = $("#login_username").val(),
        $password = $("#login_password").val();
    
    if($username=="" ||  $password==""){
        popup_alert("All fields are required!");
        $("#login_username").focus();
        return false;
    }
    else {
        $.mobile.loading('show');
        $.ajax({
              url: server_url + "login.php",
              type: "POST",
              data: {login_user:$username,login_pass:$password}
              //dataType: "json"
        }).done(function(result){
            //alert(result);
            $.mobile.loading('hide');
            result_array = jQuery.parseJSON(result);
            
            if (result_array['success']=="success"){
                setStorage("UserUID", result_array['uid']);
                $("#login_username").val("");
                $("#login_password").val("");
                popup_alert(result_array['uid']);
                $.mobile.changePage("home.html", {transition: "slide", changeHash: true});
            }
            else {
                popup_alert(result_array['message']);
            }
            
        });
    }
/**/
});

$(document).on("click", "#btn_register", function(){
    
    /*var $username = $("#reg_username").val(),
        $emailaddr = $("#reg_emailaddr").val(),
        $password = $("#reg_password").val();
            
    if($username=="" || $emailaddr=="" || $password==""){
        popup_alert("All fields are required!");
        $("#reg_name").focus();
        return false;
    }    
    else if(!email_pattern.test($emailaddr)){
        popup_alert("Please enter valid Email Address!");
        $("#reg_emailaddr").focus();
        $("#reg_emailaddr").val("");
        return false;
    }
    else {
        $.mobile.loading('show');
        $.ajax({
              url: server_url + "register.php",
              type: "POST",
              data: {reg_username:$username,reg_email:$emailaddr,reg_password:$password,reg_provider:'mobile'}
        }).done(function(result){
            if (result=="1"){
                $.mobile.loading('hide');
                popup_alert("Register Successfully!");
                $.mobile.changePage("index.html",{transition:"slide",reverse:true});
                $("#reg_username").val("");
                $("#reg_emailaddr").val("");
                $("#reg_password").val("");
            }
            else {
                $.mobile.loading('hide');
                popup_alert(result);
                return false;
            }
        });
    }*/
    
    
});



