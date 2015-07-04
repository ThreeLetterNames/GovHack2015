

window.onload = function() {
  console.log("loading");

  ////////////////////////////////////////////////////////////////////////
  // read in data files //////////////////////////////////////////////////
  function load(file) {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send();
    //console.log("Got: "+file);
    switch(file) {
      case "dat/photo_stories.csv":
        parse_photo_stories(request.responseText);
        //console.log("dat/photo_stories.csv:");
        break;
      case "dat/indigenous_heritage.csv":
        parse_heritage(request.responseText);
        //console.log("dat/indigenous_heritage.csv:");
        break;
      case "dat/memorials_and_sculptures.csv":
        parse_sculptures(request.responseText);
        //console.log("dat/memorials_and_sculptures.csv:");
        break;
      case "dat/indiginous_organizations.csv":
        parse_organizations(request.responseText);
        //console.log("dat/indiginous_organizations.csv:");
        break;
      case "dat/atsic_regions.mid":
        //parse(request.responseText);
        console.log("dat/atsic_regions.mid:");
        break;
      case "dat/atsic_regions.mif":
        //parse(request.responseText);
        console.log("dat/atsic_regions.mif:");
        break;
      case "dat/atsic_wards.mid":
        //parse(request.responseText);
        console.log("dat/atsic_wards.mid");
        break;
      case "dat/atsic_wards.mif":
        //parse(request.responseText);
        console.log("dat/atsic_wards.mif:");
        break;
      default:
        console.log("Unknown data... what happened?");
    }
  }


  function parse_photo_stories(data){
    console.log("photo_stories: ..."+data.substr(10,50)+"..."); //50 chars
//Title	URL	Date	Primary image	Primary image caption	Primary image rights information	Subjects	Station	State	Place	Keywords	Latitude	Longitude	MediaRSS URL
  }

  function parse_heritage(data){
    console.log("heritage: ..."+data.substr(10,50)+"...");
//MCCID_INT	Feature_name	Feature_long_description	Feature_short_description	Location_description	Suburb	Feature_type	Event_Activity	Date_from	Date_to	Purpose	Epoch	Language_group	Clan (people)	Nation (group common name)	Source	Source_type	URL	Source_person	Aboriginal_individual	Aboriginal_individual_Gender	Non_Aboriginal_indiv	Non_Aboriginal_indiv_Gender	Non_Aboriginal_organisation    Past and present 	Non_Aboriginal_role	Melway	Aboriginal_words	Aboriginal_words_meaning	European_site_names	Physical_evidence	Address
  }

  function parse_sculptures(data){
    console.log("sculptures: ..."+data.substr(10,50)+"...");
//Description	Title	Co-ordinates
  }

  function parse_organizations(data){
    console.log("organizations: ..."+data.substr(10,50)+"...");
  }

  function parse(data){
    console.log("DATA: ..."+data.substr(10,50)+"...");
//Organisation	Street	Suburb/Town	Postcode	Website
  }

  load("dat/photo_stories.csv");
  load("dat/indigenous_heritage.csv");
  load("dat/memorials_and_sculptures.csv");
  load("dat/indiginous_organizations.csv");

//  load("dat/atsic_regions.mid");
//  load("dat/atsic_regions.mif");
//  load("dat/atsic_wards.mid");
//  load("dat/atsic_wards.mif");
//Ok this ones a bit more complex...
// .mid contains "names" (hopefully in order?!?)
//    - one per line, pairs of strings
//    - "<place>","<region-or-none>"
// .mif ... regions seem mixed up... and there are hundreds
//    - starts with a whole load of junk including "  Region Char(30)"
//    - boundry definitions start with "Region  1"
//    - end with the block:
  //    Pen (1,2,65280) 
  //    Brush (1,0,16777215)
  //    Center 143.078165 -31.893465
//    - some lines have only a single digit (esp after region)... bad data or hard lesson??
//    - - Then each row is a lat long pair seperated by space


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
    console.log("GL: "+lonlat);
    geolocation = lonlat;
    return lonlat;
  }

  lonlat = getLocation();
//  console.log(lonlat); //not ready untill user interacts


  ////////////////////////////////////////////////////////////////////////
  // search data an sort by distance (with areas priooritized first) /////
  
  ////////////////////////////////////////////////////////////////////////
  // combine data into picture / text streams ////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  // Block till everythings done... spinner? /////////////////////////////

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


