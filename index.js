

window.onload = function() {
  console.log("loading");

  ////////////////////////////////////////////////////////////////////////
  // read in data files //////////////////////////////////////////////////
  function load(file) {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send();
    parse(request.responseText);
  }

  function parse(data){
    console.log("DATA: "+data);
  }

  load("dat/photo_stories.csv");
//Title	URL	Date	Primary image	Primary image caption	Primary image rights information	Subjects	Station	State	Place	Keywords	Latitude	Longitude	MediaRSS URL
  load("dat/indigenous_heritage.csv");
//MCCID_INT	Feature_name	Feature_long_description	Feature_short_description	Location_description	Suburb	Feature_type	Event_Activity	Date_from	Date_to	Purpose	Epoch	Language_group	Clan (people)	Nation (group common name)	Source	Source_type	URL	Source_person	Aboriginal_individual	Aboriginal_individual_Gender	Non_Aboriginal_indiv	Non_Aboriginal_indiv_Gender	Non_Aboriginal_organisation    Past and present 	Non_Aboriginal_role	Melway	Aboriginal_words	Aboriginal_words_meaning	European_site_names	Physical_evidence	Address
  load("dat/memorials_and_sculptures.csv");
//Description	Title	Co-ordinates
  load("dat/indiginous_organizations.csv");
//Organisation	Street	Suburb/Town	Postcode	Website
  load("dat/atsic_regions.mid");
  load("dat/atsic_regions.mif");
  load("dat/atsic_wards.mid");
  load("dat/atsic_wards.mif");



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

//  lonlat = getLocation();
//  console.log(lonlat); //not ready untill user interacts


  ////////////////////////////////////////////////////////////////////////
  // search data an sort by distance (with areas priooritized first) /////
  
  ////////////////////////////////////////////////////////////////////////
  // combine data into picture / text streams ////////////////////////////

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


