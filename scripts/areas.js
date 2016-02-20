
var request = require("request");
var promisify = require("../helpers/promisify");

polygons = {
  url: "http://pastebin.com/raw/zwq3GsCt"
}
url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer/areasAndLengths?f=json&polygons=" + JSON.stringify(polygons) + "&sr=4326&lengthUnit=9001&areaUnit=" + JSON.stringify({"areaUnit":"esriSquareMeters"}) + "&calculationType=planar";
console.log(url);
promisify.f(request, "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer/areasAndLengths?f=json&polygons=" + JSON.stringify(polygons) + "&sr=102100&lengthUnit=9001&areaUnit=" + JSON.stringify({"areaUnit":"esriSquareMeters"}) + "&calculationType=geodesic")
  .then(function(response){
    body = JSON.parse(response.body);
    console.log(JSON.stringify(body));
    process.exit()
  })
  .then(function(response){
    console.log(response.body);
  })
  .catch(function(err){
    console.error(err);
  })
