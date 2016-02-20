
var request = require("request");
var promisify = require("../helpers/promisify");

promisify.f(request, "http://services5.arcgis.com/1jrn63iFisouJg45/arcgis/rest/services/Enriched%20neighbourhoods_planning_areas_wgs84/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&geohash=&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=AREA_NAME&returnGeometry=true&returnCentroid=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json&token=RqbKxwz2lPYz9eBAQpd-M16YBivSXCVpC6dH8FcJpQVhdXCsIw_eETmDr5Xys6-OxCwKgnSditK30_gLin-Fpp5bFwEBo2WgS6nlzb_fJuGSyB9yVf727F1nmNeg8w0Sldv6UtA-xTlKGiI1wetHNQ..")
  .then(function(response){
    body = JSON.parse(response.body);
    // body.features.forEach(function(feature){
    //   console.log(feature.geometry.rings[0].map(function(ring){
    //     return ring[0] + " : " + ring[1]
    //   }));
    // });
    console.log(JSON.stringify(body));
    var polygons = {
      geometries: body.features.map(function(feature){
        return feature.geometry;
      })
    };
    //console.log(JSON.stringify(polygons));
    process.exit();
    //return promisify.f(request, "http://services5.arcgis.com/1jrn63iFisouJg45/arcgis/rest/services/Utilities/Geometry/GeometryServer/areasAndLengths?f=json&polygons=" + JSON.stringify(polygons) + "&sr=4326&lengthUnit=9001&areaUnit=" + JSON.stringify({"areaUnit":"esriSquareMeters"}) + "&calculationType=planar")
  })
  .then(function(response){
    console.log(response.body);
  })
  .catch(function(err){
    console.error(err);
  })
