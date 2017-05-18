//Victim Advocates JavaScript///


       dojo.require("dijit.dijit"); // optimize: load dijit layer
      dojo.require("dijit.layout.BorderContainer");
      dojo.require("dijit.layout.ContentPane");
      dojo.require("dijit.layout.AccordionPane");
      dojo.require("dijit.layout.AccordionContainer");
      dojo.require("dijit.layout.TabContainer");
      dojo.require("esri.map");
      dojo.require("esri.dijit.Legend");
      dojo.require("esri.dijit.Scalebar");
      dojo.require("esri.layers.FeatureLayer");
      dojo.require("esri.dijit.InfoWindow");
      dojo.require("esri.tasks.locator");
       dojo.require("esri.tasks.query");
      dojo.require("dojo.number");
      dojo.require("dojo.parser");
      dojo.require("dijit.form.Button");
      dojo.require("dijit.form.Textarea");
      dojo.require("dijit.Menu");
      dojo.require("dijit.form.DropDownButton");
      dojo.require("dijit.PopupMenuItem");
      dojo.require("dijit.MenuSeparator");
       dojo.require("dijit.MenuItem");
       dojo.require("esri.dijit.Popup");




      var map, locator, identifyTask, identifyParams;

     var lods = [{"level" : 7, "resolution" : 1222.99245256249, "scale" : 4622324.434309}, 
      {"level" : 8, "resolution" : 611.49622628138, "scale" : 2311162.217155}, 
      {"level" : 9, "resolution" : 305.748113140558, "scale" : 1155581.108577}, 
      {"level" : 10, "resolution" : 152.874056570411, "scale" : 577790.554289}, 
      {"level" : 11, "resolution" : 76.4370282850732, "scale" : 288895.277144}, 
      {"level" : 12, "resolution" : 38.2185141425366, "scale" : 144447.638572}, 
      {"level" : 13, "resolution" : 19.1092570712683, "scale" : 72223.819286}, 
      {"level" : 14, "resolution" : 9.55462853563415, "scale" : 36111.909643}, 
      {"level" : 15, "resolution" : 4.77731426794937, "scale" : 18055.954822}, 
      {"level" : 16, "resolution" : 2.38865713397468, "scale" : 9027.977411}, 
      {"level" : 17, "resolution" : 1.19432856685505, "scale" : 4513.988705}, 
      {"level" : 18, "resolution" : 0.597164283559817, "scale" : 2256.994353}, 
      {"level" : 19, "resolution" : 0.298582141647617, "scale" : 1128.497176}]; 

            

      
      function init() {
        //setup the popup window 
        var popup = new esri.dijit.Popup({
          fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25]))
        }, dojo.create("div"));

      var startExtent = new esri.geometry.Extent({
          "xmin":-12550000,
          "ymin":3921100,
          "xmax":-12403000,
          "ymax":4013000,
          "spatialReference":{"wkid":102100}});
      
        map = new esri.Map("map", {
          extent: startExtent, 
          infoWindow: popup,
          logo:false, 
          fadeOnZoom:true, 
          lods: lods
        });


         //create and add basemap layer
        var layer = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer");
        map.addLayer(layer);
      
        //var layerStreets = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer");
       // map.addLayer(layerStreets);

        //add police layer
        var policeUrl = "http://geo.azmag.gov/GISMAG/rest/services/maps/VictimServices/MapServer";
        var policeLayer = new esri.layers.ArcGISDynamicMapServiceLayer(policeUrl,{opacity:1.0});

        //add county layer
        var countyUrl = "http://geo.azmag.gov/GISMAG/rest/services/maps/MaricopaCountyBoundary/MapServer";
        var countyLayer = new esri.layers.ArcGISDynamicMapServiceLayer(countyUrl,{opacity:1.0});

         map.addLayers([countyLayer, policeLayer]);

          dojo.connect(map,'onLayersAddResult',function(results){

         //add the legend 
          var legend = new esri.dijit.Legend({
            map:map,
            layerInfos:[{layer:policeLayer,title:" "}],
            arrangement:esri.dijit.Legend.ALIGN_LEFT
          },"legendDiv");
          legend.startup();
        });
        
        var scalebar = new esri.dijit.Scalebar({
            map: map,
            scalebarUnit:'english'
          });

        dojo.connect(map, "onLoad", mapReady);

        locator = new esri.tasks.Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
        dojo.connect(locator, "onAddressToLocationsComplete", showResults);
      
    //resize the map when the browser resizes
      dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
      }




    //add menu 
dojo.addOnLoad(function() {
        var menu = new dijit.Menu({
            style: "display: none;"
        });
        
//////////////////////////////////Maricopa County//////////////////////////////////

        menu.addChild(new dijit.MenuSeparator());



        var maricopaCounty = new dijit.Menu();
        maricopaCounty.addChild(new dijit.MenuItem({
            label: "A New Leaf",
            
            onClick: function() {
                window.open('http://www.turnanewleaf.org');
            }

        }));
       maricopaCounty.addChild(new dijit.MenuItem({
            label: "Catholic Charities of Arizona",
            
            onClick: function() {
                window.open('http://www.catholiccharitiesaz.org');
            }

        }));
       maricopaCounty.addChild(new dijit.MenuItem({
            label: "Chrysalis Shelter Inc",
            
            onClick: function() {
                window.open('http://www.noabuse.org');
            }

        }));
       maricopaCounty.addChild(new dijit.MenuItem({
            label: "Community Alliance Against Family Abuse",
            
            onClick: function() {
                window.open('http://www.caafaaz.org');
            }

        }));
       maricopaCounty.addChild(new dijit.MenuItem({
            label: "CPLC De Colores",
            
            onClick: function() {
                window.open('http://www.cplc.org');
            }

        }));
       maricopaCounty.addChild(new dijit.MenuItem({
            label: "DOVES",
            
            onClick: function() {
                window.open('http://www.dovesprogram.org');
            }

        }));
       maricopaCounty.addChild(new dijit.MenuItem({
            label: "Eve's Place",
            
            onClick: function() {
                window.open('http://www.safetyatevesplace.org');
            }

        }));



 maricopaCounty.addChild(new dijit.MenuItem({
            label: "MOMA's house",
            
            onClick: function() {
                window.open('http://www.momashouse.org');
            }

        }));

 maricopaCounty.addChild(new dijit.MenuItem({
            label: "New Life Center",
            
            onClick: function() {
                window.open('http://www.newlifectr.org');
            }

        }));



 maricopaCounty.addChild(new dijit.MenuItem({
            label: "Sojourner Center",
            
            onClick: function() {
                window.open('http://www.sojournercenter.org');
            }

        }));
  

maricopaCounty.addChild(new dijit.MenuItem({
            label: "SEEDS",
            
            onClick: function() {
                window.open('http://www.natn-az.com');
            }

        }));


 maricopaCounty.addChild(new dijit.MenuItem({
            label: "UMOM",
            
            onClick: function() {
                window.open('http://www.umom.org/domestic_violence');
            }

        }));


        menu.addChild(new dijit.PopupMenuItem({
            label: "Maricopa County",
            popup: maricopaCounty
        }));

 menu.addChild(new dijit.MenuSeparator());

////////////////////north Arizona////////////////////////////////////

var northArizona = new dijit.Menu();
        northArizona.addChild(new dijit.MenuItem({
            label: "Alice's Place, an Empowerment Center",
            
            onClick: function() {
                window.open('http://alicesplaceshelter.org');
            }

        }));
        northArizona.addChild(new dijit.MenuItem({
            label: "Colorado River Regional Crisis Shelter",
            
            onClick: function() {
                window.open('http://crrcs.com');
            }

        }));

    northArizona.addChild(new dijit.MenuItem({
            label: "Interagency Council",
            
            onClick: function() {
                window.open('http://www.lhcinteragency.org');
            }

        }));


        northArizona.addChild(new dijit.MenuItem({
            label: "Kingman Aid To Abused People",
            
            onClick: function() {
                window.open('http://www.mykaap.org');
            }

        }));

    

          northArizona.addChild(new dijit.MenuItem({
            label: "Northland Family Help Center",
            
            onClick: function() {
                window.open('http://www.northlandfamily.org');
            }

        }));


northArizona.addChild(new dijit.MenuItem({
            label: "Page Regional Domestic Violence Services",
            
            onClick: function() {
                window.open('http://pageregionaldomesticviolenceservices.org');
            }

        }));




            northArizona.addChild(new dijit.MenuItem({
            label: "Stepping Stones",
            
            onClick: function() {
                window.open('http://www.steppingstonesaz.org');
            }

        }));
              northArizona.addChild(new dijit.MenuItem({
            label: "Time Out Inc",
            
            onClick: function() {
                window.open('http://www.timeoutshelter.org');
            }

        }));

              northArizona.addChild(new dijit.MenuItem({
            label: "Verde Valley Sanctuary",
            
            onClick: function() {
                window.open('http://verdevalleysanctuary.org');
            }

        }));

          northArizona.addChild(new dijit.MenuItem({
            label: "WestCare AZ",
            
            onClick: function() {
                window.open('http://www.westcare.com/slarizona.jsp');
            }

        }));

  northArizona.addChild(new dijit.MenuItem({
            label: "White Mountain S.A.F.E.House",
            
            onClick: function() {
                window.open('http://www.wmsafehouse.org');
            }

        }));


 

        menu.addChild(new dijit.PopupMenuItem({
            label: "Northern Arizona",
            popup: northArizona
        }));


 menu.addChild(new dijit.MenuSeparator());

/////////////////////south Arizona ///////////////////////

var southArizona = new dijit.Menu();
        southArizona.addChild(new dijit.MenuItem({
            label: "Emerge! Center Against Domestic Abuse",
            
            onClick: function() {
                window.open('http://www.emergecenter.org');
            }

        }));
        southArizona.addChild(new dijit.MenuItem({
            label: "Forgach House",
            
            onClick: function() {
                window.open('http://www.ccs-soaz.org/Domestic-Violence-Shelter.html');
            }

        }));
           southArizona.addChild(new dijit.MenuItem({
            label: "Genesis House",
            
            onClick: function() {
                window.open('http://domesticviolencehelp.us');
            }

        }));


southArizona.addChild(new dijit.MenuItem({
            label: "Horizon Human Services",
            
            onClick: function() {
                window.open('http://www.horizonhumanservices.org');
            }

        }));


             southArizona.addChild(new dijit.MenuItem({
            label: "House of Hope",
            
            onClick: function() {
                window.open('http://www.ccs-soaz.org/');
            }

        }));

          

              
                 southArizona.addChild(new dijit.MenuItem({
            label: "Mt. Graham Safe House",
            
            onClick: function() {
                window.open('http://www.mtgrahamsh.org');
            }

        }));


 
            southArizona.addChild(new dijit.MenuItem({
            label: "Our House/Nuestra Casae",
            
            onClick: function() {
                window.open('http://www.ccs-soaz.org');
            }

        }));

                 
                  southArizona.addChild(new dijit.MenuItem({
            label: "Safe House Shelter",
            
            onClick: function() {
                window.open('http://www.ccs-soaz.org');
            }

        }));
                   southArizona.addChild(new dijit.MenuItem({
            label: "Genesis House",
            
            onClick: function() {
                window.open('http://domesticviolencehelp.us');
            }

        }));
        menu.addChild(new dijit.PopupMenuItem({
            label: "Southern Arizona",
            popup: southArizona
        }));

///////////////////////////////////CHANGED ABOVE////////////////////////////////////////

  

        var button = new dijit.form.DropDownButton({
            label: "Shelter List",
            name: "programmatic2",
            dropDown: menu,
            id: "progButton"
        });
        dojo.byId("dropdownButtonContainer").appendChild(button.domNode);
    });

    // test for key up on the text area
    // *** UPDATED SCOTT **
 

   //locator
      function locate() {
       map.graphics.clear();
        var address = {"SingleLine":dojo.byId("address").value};
        locator.outSpatialReference= map.spatialReference;
        var options = {
          address:address,
          outFields:["Loc_name"]
        }
        locator.addressToLocations(options);
       
      }


         function myKeyUpMethod(txtArea, e) {
        if (e.keyCode == 13) {
            
            locate();

            
        }
    }

    // refresh map pane  
function refresh(){
  map.graphics.clear();
  var refreshExtent = new esri.geometry.Extent({"xmin":-12550000,
          "ymin":3921100,
          "xmax":-12403000,
          "ymax":4013000,
          "spatialReference":{"wkid":102100}});
        map.setExtent(refreshExtent);
    

}
    


      function showResults(candidates) {
        var candidate;
        var symbol = new esri.symbol.PictureMarkerSymbol('images/arrow.png', 30, 30);
       

        var geom;
        
        dojo.every(candidates,function (candidate){
          console.log(candidate.score);
          if (candidate.score > 80) {
            console.log(candidate.location);
           // var attributes = { address: candidate.address, score:candidate.score, locatorName:candidate.attributes.Loc_name };   
            geom = candidate.location;
            var graphic = new esri.Graphic(geom, symbol);
           // add a graphic to the map at the geocoded location
            map.graphics.add(graphic);
           // add a text symbol to the map listing the location of the matched address.
          //  var displayText = candidate.address;
         // var font = new esri.symbol.Font("14pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Verdana");
           
           // var textSymbol = new esri.symbol.TextSymbol(displayText,font,new dojo.Color("#450061"));
          // textSymbol.setOffset(0,-25);

           map.graphics.add(new esri.Graphic(geom));
            return false; //break out of loop after one candidate with score greater  than 80 is found.
          }
        });
        if(geom !== undefined){
          map.centerAndZoom(geom,6);
        }
  else
   {
   alert("Address not found.");
   }
     //resize the map when the browser resizes
      dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
      }
        

      
      
      function mapReady(map){
       dojo.connect(map,"onClick",executeIdentifyTask);
       //create identify tasks and setup parameters 
       identifyTask = new esri.tasks.IdentifyTask("http://geo.azmag.gov/GISMAG/rest/services/maps/VictimServices/MapServer");
       
       identifyParams = new esri.tasks.IdentifyParameters();
       identifyParams.tolerance = 10;
       identifyParams.returnGeometry = true;
       identifyParams.layerIds = [0,1,2];
       identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
       identifyParams.width  = map.width;
       identifyParams.height = map.height;
      }
      
      function executeIdentifyTask(evt) {
        identifyParams.geometry = evt.mapPoint;
        identifyParams.mapExtent = map.extent;
       
        var deferred = identifyTask.execute (identifyParams);

        deferred.addCallback(function (response) {
            // response is an array of identify result objects
            // Let's return an array of features.
            return dojo.map(response, function (result) {
                var feature = result.feature;
                //feature.attributes.Name = result.layerName;
                
                 if (result.layerName === 'Justice Courts') {
                    console.log(feature.attributes.layerName);
                    var template = new esri.InfoTemplate("", "<b>Court Name: </b>${CourtName}<br>"+"<b>Court Number: </b>${CourtNum}<br>"+"<b>Location: </b>${Address}, ${City}, ${Zip}<br>"+"<b>Phone: </b>${Phone}<br>"+"<b>Fax: </b>${Fax}");
                    feature.setInfoTemplate(template);
                    console.log(template);
                  }   
                  else if (result.layerName === 'Law Enforcement') {
                    console.log(feature.attributes.layerName);
                    var template = new esri.InfoTemplate("", "${Name}<br>"+"${AltName}<br>"+"${Address}, ${City}<br>"+"<a href='http://${Web}'target='_blank'>Website</a>");
                    feature.setInfoTemplate(template);
                    console.log(template);
                  }
                else if (result.layerName === 'Victim Services') {



                    // try and loop through the services???
                    var servicesString = "";
                    var serviceFields = ["SvcType_Crisis", "SvcType_Legal", "SvcType_Civil", "SvcType_Safe", "SvcType_Soc", "SvcType_Med", "SvcType_Shelter", "SvcType_PO", "SvcType_Refer", "SvcType_OnLocCoun", "SvcType_OnLocFin", "SvcType_RefFin"];
                    var serviceNames = ["Crisis Response", "Criminal Legal Advocacy", "Civil Legal Advocacy", "Safety Planning", "Social Services Referral", "Medical Referral", "Shelter Referral", "Assist with Order of Protection", "Referrals for Counseling", "On Location Counseling", "On Location Financial Assistance", "Referrals for Financial Assistance"];
                    for (i = 0; i < serviceFields.length; i++) 
                    {
                        if (feature.attributes[serviceFields[i]] == 1) 
                        {
                           servicesString = servicesString + "<tr>&nbsp;&nbsp;-&nbsp; " + serviceNames[i] + "</tr><br>";
                        }
                    }



                    var template = new esri.InfoTemplate("",
                                
                                "<b>Agency: </b><td>${Agency}<br/>" +
                                "<b>Address: </b><td>${Address}<br/>" +
                                "<b>City: </b>${City}<br/>" +
                                "<b>Phone: </b>${Phone}<br/>" +
                                "<b>Hours: </b>${Hours}<br/>" +
                                "<a href='http://${Web}' target='_blank'>Website</a><br/>" +
                                "<b>Services Available: </b><br/>" +
                                servicesString);




                    feature.setInfoTemplate(template);




                }
                return feature;
            });
        });

      
        // InfoWindow expects an array of features from each deferred
        // object that you pass. If the response from the task execution 
        // above is not an array of features, then you need to add a callback
        // like the one above to post-process the response and return an
        // array of features.
        map.infoWindow.setFeatures([ deferred ]);
        map.infoWindow.show(evt.mapPoint);
      }
      
      dojo.ready(init);

