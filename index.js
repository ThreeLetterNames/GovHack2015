



var LatLon = function(la, lo) {
  this.lat = la;
  this.lon = lo;
  this.show = function() {
    return "["+this.lat+","+this.lon+"]";
  }
};

var LocationData = function(t,d,la,lo,s) {
  this.title = t;
  this.details = d;
  this.img = "";
  this.src = s;
  this.latlon = new LatLon(la, lo);
};



var lonlat;
var allData = new Array();
var dataCount = 0;

window.onload = function() {
  console.log("loading");

  ////////////////////////////////////////////////////////////////////////
  // read in data files //////////////////////////////////////////////////
  function load(file) {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', ""+file, false);
    request.send();
    switch(file) {
      case "dat/photo_stories.csv":
        parse_photo_stories(request.responseText);
        break;
      case "dat/indigenous_heritage.csv":
        parse_heritage(request.responseText);
        break;
      case "dat/memorials_and_sculptures.csv":
        parse_sculptures(request.responseText);
        break;
      case "dat/indiginous_organizations.csv":
        parse_organizations(request.responseText);
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
//Title	URL	Date	Primary image	Primary image caption	Primary image rights information	Subjects	Station	State	Place	Keywords	Latitude	Longitude	MediaRSS URL
    var lines = data.split("\n");
    console.log("photo_stories: ..."+data.substr(10,50)+"... ("+lines.length+" lines)");
    for(var line = 0; line < lines.length; line++) {
      var fields = lines[line].split(",");
      if(line !== 0 && fields[11] !== "" && fields[12] !== "") { //&& fields.length === 14 && fields[11] !== ""
        var t = fields[0];
        var d = fields[4]+" ("+fields[9]+", "+fields[8]+": "+fields[10]+" - "+fields[6]+")" ;
        var la = fields[11];
        var lo = fields[12];
        if(t.toLowerCase().contains("indigenous")
            || t.toLowerCase().contains("aboriginal")
            || t.toLowerCase().contains("australian")
            || d.toLowerCase().contains("indigenous")
            || d.toLowerCase().contains("aboriginal")
            || d.toLowerCase().contains("australian")) { 
          allData[dataCount] = new LocationData(t,d,la,lo,"ABC");
          allData[dataCount].img = fields[3];
          dataCount++;
        }
      }
    }
  }

  function parse_heritage(data){
//MCCID_INT	Feature_name	Feature_long_description	Feature_short_description	Location_description	Suburb	Feature_type	Event_Activity	Date_from	Date_to	Purpose	Epoch	Language_group	Clan (people)	Nation (group common name)	Source	Source_type	URL	Source_person	Aboriginal_individual	Aboriginal_individual_Gender	Non_Aboriginal_indiv	Non_Aboriginal_indiv_Gender	Non_Aboriginal_organisation    Past and present 	Non_Aboriginal_role	Melway	Aboriginal_words	Aboriginal_words_meaning	European_site_names	Physical_evidence	Address   -> adding lat long the hard way
    var lines = data.split("\n");
    console.log("heritage: ..."+data.substr(10,50)+"... ("+lines.length+"lines)");
    for(var line = 0; line < lines.length; line++) {
      var fields = lines[line].split(",");
      if(false) {
      //comoplex address data.
      }
    }
  }

  function parse_sculptures(data){
  //Description	Title	Co-ordinates
    var lines = data.split("\n");
    console.log("sculptures: ..."+data.substr(10,50)+"... ("+lines.length+"lines)");
    for(var line = 0; line < lines.length; line++) {
      var fields = lines[line].split(",");
      if(fields[3] && ( fields[0].toLowerCase().contains("indigenous")
                     || fields[0].toLowerCase().contains("aboriginal")
                     || fields[0].toLowerCase().contains("australian")
                     || fields[1].toLowerCase().contains("indigenous")
                     || fields[1].toLowerCase().contains("aboriginal")
                     || fields[1].toLowerCase().contains("australian"))) {
        var t = fields[1];
        var d = fields[0];
        var la = fields[2].substr(2,fields[3].length);
        var lo = fields[3].substr(1,fields[3].length-3);
        allData[dataCount] = new LocationData(t,d,la,lo,"MAS");
        dataCount++;
      }
    }
  }

  function parse_organizations(data){
//Organisation	Street	Suburb/Town	Postcode	Website    
    var lines = data.split("\n");
    console.log("organizations: ..."+data.substr(10,50)+"... ("+lines.length+"lines)");
    for(var line = 0; line < lines.length; line++) {
      var fields = lines[line].split(",");
      if(line > 0 && fields[4]) {
        var t = fields[0];
        var d = fields[4]+" - "+fields[1]+", "+fields[2];
        allData[dataCount] = new LocationData(t,d,0,0,"ORG");
        dataCount++;
      }
    }
  }

  function parse(data){
    console.log("DATA: ..."+data.substr(10,50)+"...");
  }

//  load("dat/photo_stories.csv");
  load("dat/indigenous_heritage.csv");
//  load("dat/memorials_and_sculptures.csv");
//  load("dat/indiginous_organizations.csv");

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
    lonlat = "["+position.coords.longitude+","+position.coords.latitude+"]";
    console.log("GL: "+lonlat);
    //geolocation = lonlat;
    return;
  }

  getLocation();


  ////////////////////////////////////////////////////////////////////////
  // search data an sort by distance (with areas priooritized first) /////
  
  ////////////////////////////////////////////////////////////////////////
  // combine data into picture / text streams ////////////////////////////


//get date and display weather info too:
//http://www.bom.gov.au/iwk/climate_culture/Indig_seasons.shtml


  ////////////////////////////////////////////////////////////////////////
  // Block till everythings done... spinner? /////////////////////////////
  //while (lonlat === undefined) {}
//  while (lonlat === undefined)
//    setTimeout(function () { alert('hello');  }, 3000 * 10);
//  console.log("Crazy");

  var old_count = 0;
  var delay = function() {
    if(lonlat === undefined || allData.length !== old_count) {//we want it to match
        old_count = allData.length;
        console.log("undef:"+allData.length); //not ready untill user interacts
        setTimeout(delay, 250);//wait 50 millisecnds then recheck
        return;
    } else {
      console.log("lonlat: "+lonlat); //not ready untill user interacts

      ////////////////////////////////////////////////////////////////////
      // Display list ////////////////////////////////////////////////////
      var output_div = document.getElementById("output");
      console.log(output_div);
      output_div.innerHTML += "<h4>Region:</h4>";
      output_div.innerHTML += "<h5>Regional InformationStats</h5>";
      output_div.innerHTML += "<h4>Places of Interest:</h4>";
      output_div.innerHTML += "<h5> - location 1</h5>";
      output_div.innerHTML += "<h5> - location 2</h5>";
      
      for(var i = 0; i < allData.length && i < 100; i++) {
//        if(allData[i].img === "") {
//          output_div.innerHTML += "<h5>"+allData[i].title+"["+allData[i].latlon.show()+"]</h5>";
//        } else {
//          output_div.innerHTML += "<h5>"+allData[i].title+" ## "+allData[i].details+"["+allData[i].latlon.show()+"]</h5><img src="+allData[i].img+"></img>";
//        }
        
        
        switch(allData[i].src) {
          case "ABC":
            console.log("ABC");
            output_div.innerHTML += "<div class=\"abc\"><h5>"+allData[i].title+" ## "
                                 +allData[i].details+"["+allData[i].latlon.show()
                                 +"]</h5><img src="+allData[i].img+"></img></div>";
            break;
          case "MAS":
            console.log("MAS");
            output_div.innerHTML += "<div class=\"mas\"><h5>"+allData[i].title+"["
                                 +allData[i].latlon.show()+"]</h5></div>";
            break;
          case "ORG":
            console.log("ORG");
            output_div.innerHTML += "<div class=\"org\"><h5>"+allData[i].title+"["
                                 +allData[i].latlon.show()+"]</h5></div>";
            break;
          default:
            console.log("Unknown data source");
            break;
         }
      }
      return;
    }
  }
  delay();


  

}//onload


