/*property
    PI, atan2, contains, coords, cos, details, distance, geolocation,
    getCurrentPosition, getElementById, img, innerHTML, lat, latitude, latlon,
    length, link, links, log, lon, longitude, onload, open, push, responseText,
    send, show, sin, sort, split, sqrt, src, substr, text, title, toLowerCase, geoCallback, forEach, slice, delay
*/
/*global console, window, XMLHttpRequest, navigator, alert, document, geoCallback, setTimeout, delay */
"use strict";

var LinkData = function (l, t) {
    var ld = {};
    ld.link = l;
    ld.text = t;
    return ld;
};

var LatLon = function (la, lo) {
    var ll = {};
    ll.lat = la;
    ll.lon = lo;
    ll.show = function () {
        return "[" + ll.lat + "," + ll.lon + "]";
    };
    return ll;
};

var LocationData = function (t, d, la, lo, s) {
    var loc = {};
    loc.title = t;
    loc.details = d;
    loc.img = "";
    loc.src = s;
    loc.links = [];
    loc.distance = 666666666666;
    loc.latlon = new LatLon(la, lo);
    return loc;
};


var distance_calc = function (l1, l2) {
    if (l1 !== undefined && l2 !== undefined) {
        var lat1 = l1.lat;
        var lat2 = l2.lat;
        var lon1 = l1.lon;
        var lon2 = l1.lon;
        console.log("ll:" + l1 + l2);
        var R = 6371000; // metres
        var radians1 = lat1 * Math.PI / 180;
        var radians2 = lat2 * Math.PI / 180;
        var delta = (lat2 - lat1) * Math.PI / 180;
        var inv_delta = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(delta / 2) * Math.sin(delta / 2) +
                Math.cos(radians1) * Math.cos(radians2) *
                Math.sin(inv_delta / 2) * Math.sin(inv_delta / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    } else {
        return 666666666666;
    }
};

//Month        European
//Seasons        Miriwoong calendar        Nyoongar calendar        D'harawal calendar
//DEC        Summer        Nyinggiyi-mageny (wet weather time)        Birak, (dry and hot)        Parra'dowee, (warm and wet)
//JAN        Burran, (hot and dry)
//FEB        Bunuru, (hottest)
//MAR        Autumn
//APR        Warnka-mageny (cold weather time)        Bjeran, (cool begins)        Marrai'gang, (wet becoming cooler)
//MAY
//JUN        Winter        Makuru, (coldest, wettest)        Burrugin, (cold, short days)
//JUL
//AUG        Djilba, (wet days and cool nights)        Wiritjiribin, (cold and windy)
//SEP        Spring        Barndenyirriny (hot weather time)        Ngoonungi, (cool, getting warmer)
//OCT        Kambarang, (long dry periods)
//NOV        Parra'dowee, (warm and wet)

var CreateWeather = function () {
    var t = "Tome of Year: Makuru / Burrugin";
    var d = "The weather at this time of the year is also known as Makuru, (coldest, wettest) in the Nyoongar calendar and as Burrugin, (cold, short days) in the D'harawal calendar.";
    var la = 0;
    var lo = 0;
    var ld = new LocationData(t, d, la, lo, "BOM");
    ld.img = "img/bom.jpg";
    ld.links.push(new LinkData("http://www.bom.gov.au/iwk/climate_culture/prec-heritage.shtml", "BOM"));
    return ld;
};


var lonlat;
var allData = [];
var dataCount = 0;

window.onload = function () {
    console.log("loading");

    function parse_photo_stories(data) {
//Title     URL     Date     Primary image     Primary image caption
//Primary image rights information     Subjects     Station     State     Place
//Keywords     Latitude     Longitude     MediaRSS URL     -14 fields
        var lines = data.split("\n");
        var fields, t, d, la, lo;
//        console.log("photo_stories: ..."+data.substr(10,50)+"... ("+lines.length+" lines)");
//        for(var line = 0; line < lines.length; line++) {

//        for (line = 0; line < lines.length; line += 1) {
        lines.forEach(function (line, index) {
            fields = line.split(",");
            if (index !== 0 && fields[11] !== "" && fields[12] !== "") { //&& fields.length === 14 && fields[11] !== ""
                t = fields[0];
                d = fields[4] + " (" + fields[9] + ", " + fields[8] + ": " + fields[10] + " - " + fields[6] + ")";
                la = fields[fields.length - 3];
                lo = fields[fields.length - 2];
                if (t.toLowerCase().contains("indigenous")
                        || t.toLowerCase().contains("aboriginal")
                        || t.toLowerCase().contains("australian")
                        || d.toLowerCase().contains("indigenous")
                        || d.toLowerCase().contains("aboriginal")
                        || d.toLowerCase().contains("australian")) {
                    allData[dataCount] = new LocationData(t, d, la, lo, "ABC");
                    allData[dataCount].img = fields[3];
                    allData[dataCount].links.push(new LinkData("https://www.google.com.au/maps/@" + la + "," + lo + ",17z", "Geo"));
                    allData[dataCount].links.push(new LinkData(fields[1], "URL"));
                    allData[dataCount].links.push(new LinkData(fields[3], "IMG SRC"));
                    allData[dataCount].links.push(new LinkData(fields[13], "RSS URL"));
                    dataCount += 1;
                }
            }
        });

//        }//for
    }

    function parse_heritage(data) {
//MCCID_INT     Feature_name     Feature_long_description     Feature_short_description     Location_description     4
//Suburb     Feature_type     Event_Activity     Date_from     Date_to     9
//Purpose     Epoch     Language_group     Clan (people)     Nation (group common name)     14
//Source     Source_type     URL     Source_person     Aboriginal_individual     19
//Aboriginal_individual_Gender     Non_Aboriginal_indiv     Non_Aboriginal_indiv_Gender     Non_Aboriginal_organisation        Past and present        Non_Aboriginal_role 24
//     Melway     Aboriginal_words     Aboriginal_words_meaning     European_site_names     Physical_evidence     29
//Address     -> lat    -> long - (33 fields)
        var lines = data.split("\n");
        var fields, t, d, la, lo;
//        console.log("heritage: ..."+data.substr(10,50)+"... ("+lines.length+"lines)");
//        for (line = 0; line < lines.length; line += 1) {
        lines.forEach(function (line, index) {
            fields = line.split(",");
            if (index !== 0 && fields.length > 5) {
                t = fields[1];
                d = fields[2] + " (" + fields[5] + ", " + fields[4] + ": " + fields[6] + " - "
                        + fields[7] + " - " + fields[17] + " - " + fields[18] + " - " + fields[19]
                        + " - " + fields[26] + " - " + fields[27] + ")";
                la = fields[fields.length - 2].substr(4, 20);
                lo = fields[fields.length - 1];
                if (la !== "" && lo !== "") {
                    allData[dataCount] = new LocationData(t, d, la, lo, "HER");
                    allData[dataCount].links.push(new LinkData("https://www.google.com.au/maps/@" + la + "," + lo + ",17z", "Geo"));
//                    allData[dataCount].links.push(fields[17]);
                    dataCount += 1;
                }
            }
        });
    }

    function parse_sculptures(data) {
    //Description     Title     Co-ordinates
        var lines = data.split("\n");
        var fields, t, d, la, lo;
//        console.log("sculptures: ..."+data.substr(10,50)+"... ("+lines.length+"lines)");
//        for (line = 0; line < lines.length; line += 1) {
        lines.forEach(function (line) {
            fields = line.split(",");
            if (fields[3] && (fields[0].toLowerCase().contains("indigenous")
                    || fields[0].toLowerCase().contains("aboriginal")
                    || fields[0].toLowerCase().contains("australian")
                    || fields[1].toLowerCase().contains("indigenous")
                    || fields[1].toLowerCase().contains("aboriginal")
                    || fields[1].toLowerCase().contains("australian"))) {
                t = fields[1];
                d = fields[0];
                la = fields[2].substr(2, fields[3].length);
                lo = fields[3].substr(1, fields[3].length - 3);
                allData[dataCount] = new LocationData(t, d, la, lo, "MAS");
                allData[dataCount].links.push(new LinkData("https://www.google.com.au/maps/@" + la + "," + lo + ",17z", "Geo"));
                dataCount += 1;
            }
        });
    }

    function parse_organizations(data) {
//Organisation     Street     Suburb/Town     Postcode     Website        -> lat -> lon
        var lines = data.split("\n");
        var fields, t, d, la, lo;
//        console.log("organizations: ..."+data.substr(10,50)+"... ("+lines.length+"lines)");
//        for (line = 0; line < lines.length; line += 1) {
        lines.forEach(function (line, index) {
            fields = line.split(",");
            if (index > 0 && fields[4]) {
                t = fields[0];
                d = fields[4] + " - " + fields[1] + ", " + fields[2];
                la = fields[fields.length - 2].substr(4, 20);
                lo = fields[fields.length - 1];
                allData[dataCount] = new LocationData(t, d, la, lo, "ORG");
                allData[dataCount].links.push(new LinkData("https://www.google.com.au/maps/@" + la + "," + lo + ",17z", "Geo"));
//                allData[dataCount].links.push(fields[fields.length-3]);
                dataCount += 1;
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////
    // read in data files //////////////////////////////////////////////////
    function load(file) {
        var request;
        request = new XMLHttpRequest();
        request.open('GET', "" + file, false);
        request.send();
        switch (file) {
        case "dat/photo_stories.csv":
            parse_photo_stories(request.responseText);
            break;
        case "dat/indigenous_heritage_working.csv":
            parse_heritage(request.responseText);
            break;
        case "dat/memorials_and_sculptures.csv":
            parse_sculptures(request.responseText);
            break;
        case "dat/indiginous_organizations_working.csv":
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




//    function parse(data){
//        console.log("DATA: ..." + data.substr(10, 50) + "...");
//    }

    load("dat/indigenous_heritage_working.csv");
    load("dat/memorials_and_sculptures.csv");
    load("dat/indiginous_organizations_working.csv");
    load("dat/photo_stories.csv");

//    load("dat/atsic_regions.mid");
//    load("dat/atsic_regions.mif");
//    load("dat/atsic_wards.mid");
//    load("dat/atsic_wards.mif");
//Ok this ones a bit more complex...
// .mid contains "names" (hopefully in order?!?)
//        - one per line, pairs of strings
//        - "<place>","<region-or-none>"
// .mif ... regions seem mixed up... and there are hundreds
//        - starts with a whole load of junk including "    Region Char(30)"
//        - boundry definitions start with "Region    1"
//        - end with the block:
    //        Pen (1,2,65280)
    //        Brush (1,0,16777215)
    //        Center 143.078165 -31.893465
//        - some lines have only a single digit (esp after region)... bad data or hard lesson??
//        - - Then each row is a lat long pair seperated by space


    ////////////////////////////////////////////////////////////////////////
    // aquire geo location /////////////////////////////////////////////////
    var geoCallback = function (position) {
        //lonlat = "["+position.coords.longitude+","+position.coords.latitude+"]";
        lonlat = new LatLon(position.coords.latitude, position.coords.longitude);
        console.log("GL: " + lonlat);
        //geolocation = lonlat;
        return;
    };

    var getLocation = function () {
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(geoCallback);
        }
        alert("Geolocation is not supported by this browser.");
    };

    getLocation();




//get date and display weather info too:
//http://www.bom.gov.au/iwk/climate_culture/Indig_seasons.shtml


    ////////////////////////////////////////////////////////////////////////
    // Block till everythings done... spinner? /////////////////////////////
    var old_count = 0;
    var delay = function () {
        if (lonlat === undefined || allData.length !== old_count) {//we want it to match
            old_count = allData.length;
//            console.log("undef:"+allData.length); //not ready untill user interacts
            setTimeout(delay, 250);//wait 50 millisecnds then recheck
            return;
        } else {
            console.log("lonlat: " + lonlat); //not ready untill user interacts

    ////////////////////////////////////////////////////////////////////////
    // combine data into picture / text streams ////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    // search data an sort by distance (with areas priooritized first) /////
//            for (x = 0; x < allData.length; x += 1) {
            allData.forEach(function (dat) {
                dat.distance = distance_calc(lonlat, dat.latlon);
            });
            var localData = allData.sort(function (x, y) {
                return x.distance - y.distance;
            });
            allData.push(new CreateWeather());

            ////////////////////////////////////////////////////////////////////
            // Display list ////////////////////////////////////////////////////
            var output_div = document.getElementById("output");
            var image_div = document.getElementById("images");
            var link_text;

//            for (i = 0; i < localData.length && i < 100; i += 1) {
            localData = localData.slice(0, 50);
            localData.forEach(function (dat) {
//                console.log("Dist:"+distance_calc(lonlat, localData[i].latlon));

                link_text = "";
//                for (link_count = 0; link_count < dat.links.length; link_count += 1) {
                dat.links.forEach(function (link_dat) {
                    link_text += "<p><a class='link' href='" + link_dat.link + "'>"
                            + link_dat.text + "</a></p>";
                });

                switch (dat.src) {
                case "ABC":
                    image_div.innerHTML += "<div class='abc'><p>" + dat.title + "</p><p>"
                            + dat.details + "</p><img src='" + dat.img + "' width='30%'></img>"
                            + link_text + "<p class='attrib'>Source: ABC Online Photo Stories</p></div>";
                    break;

                case "MAS":
                    output_div.innerHTML += "<div class=\"mas\"><h5>" + dat.title + "</h5><p>["
                            + dat.details + "</p>"
                            + link_text + "<p class=attrib>Source: Melbourne Government Memorials</p></div>";
                    break;

                case "ORG":
                    output_div.innerHTML += "<div class=\"org\"><h5>" + dat.title + "</h5><p>"
                            + dat.title + "</p><p>" + dat.details
                            + "</p>" + link_text + "<p class=attrib>Source: Melbourne Government Organisations</p></div>";
                    break;

                case "HER":
                    output_div.innerHTML += "<div class=\"her\"><h5>" + dat.title + "</h5><p>"
                            + dat.title + "</p><p>" + dat.details
                            + "</p>" + link_text + "<p class=attrib>Source: Indigenous Heritage Database</p></div>";
                    break;

                case "BOM":
                    output_div.innerHTML += "<div class=\"bom\"><h5>" + dat.title + "</h5><p>["
                            + "]</p><p class=attrib>Source: Bureau of Meteorology</p>";
                    break;
                default:
                    console.log("Unknown data source");
                    break;
                }//switch
            });// 100 records
            return;
        }
    };
    delay();

};//onload


