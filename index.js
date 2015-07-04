

window.onload = function() {
  console.log("loading");

  ////////////////////////////////////////////////////////////////////////
  // read in data files //////////////////////////////////////////////////
function load(file) {
    var request;
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari
        request = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // load
    request.open('GET', file, false);
    request.send();
    parse(request.responseText);
}

function parse(data){
    console.log(data);
}

load("index.html");




  ////////////////////////////////////////////////////////////////////////
  // aquire geo location /////////////////////////////////////////////////
  function getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(geoCallback);
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function geoCallback(position)
  {
    var lonlat="["+position.coords.longitude+","+position.coords.latitude+"]";
//      alert("GL."+lonlat);
    geolocation = lonlat;
    console.log(lonlat);
    return lonlat;
  }

  lonlat = getLocation();
  console.log(lonlat); //not ready untill user interacts


  ////////////////////////////////////////////////////////////////////////
  // search data an sort by distance (with areas priooritized first) /////
  
  ////////////////////////////////////////////////////////////////////////
  // combine data into single stream /////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  // Display list ////////////////////////////////////////////////////////
  var output_div = document.getElementById("output");
  console.log(output_div);
  output_div.innerHTML += "<h4>Region:</h4>"
  output_div.innerHTML += "<h5>Regional InformationStats</h5>"
  output_div.innerHTML += "<h4>Places of Interest:</h4>"
  output_div.innerHTML += "<h5> - location 1</h5>"
  output_div.innerHTML += "<h5> - location 2</h5>"
  

}//onload


