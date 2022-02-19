const MIN_ZOOM_FOR_POINTS=12;let fanMarkers=[];const SERVER_URL="https://vmine.xyz/",DEFAULT_POINT={lat:38.18638677411551,lng:-97.05322265625001},DEFAULT_ZOOM=5,startPoint=getLastPoint(),startZoom=getLastZoom(),map=L.map("map",{zoomControl:!1}).setView([startPoint.lat,startPoint.lng],startZoom);let selectLayer;L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV2YW5zaHVsaW51eCIsImEiOiJja3h1MWcybngwcWRyMm5waDlyemoyMHkzIn0.raNjTos02K9cmbKdWLuceA",{attribution:'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',id:"devanshulinux/ckxviyram382z14muuytohhkp",minZoom:4,maxZoom:16,tileSize:512,zoomOffset:-1}).addTo(map),map.addControl(new L.Control.Search({url:"https://nominatim.openstreetmap.org/search?format=json&q={s}",jsonpParam:"json_callback",propertyName:"display_name",propertyLoc:["lat","lon"],autoCollapse:!0,textPlaceholder:"Search location",marker:null,autoType:!1,minLength:2,zoom:MIN_ZOOM_FOR_POINTS}));const editableLayers=new L.FeatureGroup;map.addLayer(editableLayers);const drawOptions={position:"topleft",draw:{polyline:!1,polygon:!1,circle:!1,marker:!1,circlemarker:!1,rectangle:{shapeOptions:{clickable:!1}},edit:{featureGroup:editableLayers,remove:!1}}},drawControl=new L.Control.Draw(drawOptions);let rectBounds;map.addControl(drawControl),document.querySelector(".leaflet-draw-draw-rectangle").setAttribute("title","Multi Select"),map.on("draw:created",e=>{rectBounds=e.layer._bounds,selectLayer=editableLayers.addLayer(e.layer),selectInBounds(e.layer._bounds)});let selectedIds=[];function selectInBounds(){if(_scope.pointsLoading)return toast("Loading Data",!0),void editableLayers.clearLayers();selectedIds=[];for(let e=0;e<loadedPoints.length;e+=4)inBounds({lat:loadedPoints[e],lng:loadedPoints[e+1]})&&selectedIds.push(loadedPoints[e+2]);setTimeout(()=>{editableLayers.clearLayers()},1500),0==selectedIds.length?toast("No locations selected",!0):dealWithSelected()}let toBuyList=[],toInstallList=[];function dealWithSelected(){toBuyList=[],toInstallList=[];const e={},t=getRating(selectedIds[0]);for(let o=0;o<selectedIds.length;o++){const n=selectedIds[o];if(t!=getRating(n))return void toast("Select LAND units with same rating",!0);e[n]=!0,0==loadedPointsTypes[n]?toBuyList.push(n):_scope.account.lands.indexOf(""+n)>=0&&toInstallList.push(n)}_scope.sl.checkList=e,_scope.sl.selectedIds=selectedIds,_scope.sl.toBuyList=toBuyList,_scope.sl.totalBuyPrice=(toBuyList.length*_scope.LAND_BASE_PRICES[t-1]).toFixed(1),_scope.sl.toInstallList=toInstallList,_scope.sl.rating=t,_scope.sl.multiMode=0,toInstallList.length>toBuyList.length&&(_scope.sl.multiMode=1),_scope.sl.noRadio=toInstallList.length<1||toBuyList.length<1,_scope.$apply(),getSelectNames(_scope,selectedIds),selectModal.open()}const fanIcons={};for(let e=2;e<=10;e++)fanIcons[e]=L.icon({iconUrl:`images/fan${e}.gif`,iconSize:[60,60]});const squareIcons={small:[L.icon({iconUrl:"images/level1.png",iconSize:[5,5]}),L.icon({iconUrl:"images/level2.png",iconSize:[5,5]}),L.icon({iconUrl:"images/level3.png",iconSize:[5,5]})],big:[L.icon({iconUrl:"images/level1.png",iconSize:[20,20]}),L.icon({iconUrl:"images/level2.png",iconSize:[20,20]}),L.icon({iconUrl:"images/level3.png",iconSize:[20,20]})]},FLAG_ICON_SIZE=40,flagIcons={small:[L.icon({iconUrl:"images/flag1.png",iconSize:[5,5]}),L.icon({iconUrl:"images/flag2.png",iconSize:[5,5]}),L.icon({iconUrl:"images/flag3.png",iconSize:[5,5]})],big:[L.icon({iconUrl:"images/flag1.png",iconSize:[40,40]}),L.icon({iconUrl:"images/flag2.png",iconSize:[40,40]}),L.icon({iconUrl:"images/flag3.png",iconSize:[40,40]})]},mineIcons={small:[L.icon({iconUrl:"images/flag1_mine.png",iconSize:[5,5]}),L.icon({iconUrl:"images/flag2_mine.png",iconSize:[5,5]}),L.icon({iconUrl:"images/flag3_mine.png",iconSize:[5,5]})],big:[L.icon({iconUrl:"images/mine1.png",iconSize:[40,40]}),L.icon({iconUrl:"images/mine2.png",iconSize:[40,40]}),L.icon({iconUrl:"images/mine3.png",iconSize:[40,40]})]};map.on("moveend",e=>{loadPoints(map.getBounds(),!1),setLastPoint(map.getCenter()),setLastZoom()}),map.on("zoomend",e=>{loadPoints(map.getBounds(),!0),setLastPoint(map.getCenter()),setLastZoom()});let pendingPointReqs,loadedPoints=[],loadedPointsTypes={},prevBounds=null;function loadPoints(e,t){const o=Math.floor(e._southWest.lng);let n=Math.ceil(e._northEast.lng);181==n?n=180:-181==n&&(n=-180);const s=Math.floor(e._southWest.lat),a=Math.ceil(e._northEast.lat),i={latStartN:s,latEndN:a,lngStartN:o,lngEndN:n};if((t||!prevBounds||!isObjEqual(i,prevBounds))&&(prevBounds=Object.assign({},i),removeFans(),loadedPoints=[],loadedPointsTypes={},pendingPointReqs=0,!(map.getZoom()<MIN_ZOOM_FOR_POINTS))){try{_scope.pointsLoading=!0,_scope.$apply()}catch(e){}for(let e=o;e<=n;e++)for(let t=s;t<=a;t++){const o=`${e<0?"m":"p"}${Math.abs(e)}_${t<0?"m":"p"}${Math.abs(t)}.json`;for(let e=1;e<=3;e++)loadPoint(o,e);pendingPointReqs+=3}}}function loadPoint(e,t){const o=new XMLHttpRequest;o.onreadystatechange=(async()=>{if(o.readyState==XMLHttpRequest.DONE&&200==o.status){const e=JSON.parse(o.responseText);if(loadedPoints.push(...e),0==--pendingPointReqs){if(loadedPoints.length>1){setStatuses(await getStatus2(loadedPoints)),_scope.pointsLoading=!1,_scope.$apply()}renderFans()}}}),o.open("GET",`${SERVER_URL}${t}/${e}`,!0),o.send()}function setStatuses(e){loadedPointsTypes=e}function renderFans(){removeFans();for(let e=0;e<loadedPoints.length;e+=4){const t=loadedPoints[e+2];let o=map.getZoom()>=9?squareIcons.big[getRatingIndex(t)]:squareIcons.small[getRatingIndex(t)];1==loadedPointsTypes[t]?o=_scope.account&&_scope.account.lands&&_scope.account.lands.indexOf(""+t)>=0?mineIcons.big[getRatingIndex(t)]:flagIcons.big[getRatingIndex(t)]:loadedPointsTypes[t]>1&&(o=fanIcons[loadedPointsTypes[t]]);const n=L.marker([loadedPoints[e],loadedPoints[e+1]],{icon:o}).addTo(map).on("click",()=>{_scope.pointsLoading||(_scope.openLocationModal(t,_scope.account&&_scope.account.lands&&_scope.account.lands.indexOf(""+t)>=0,loadedPointsTypes[t]),getSimpleAddress(loadedPoints[e],loadedPoints[e+1]))});if(loadedPointsTypes[t]>1){n._icon.classList.add("fan");const e=getRatingIndex(t);0==e?n._icon.classList.add("fyellow"):1==e?n._icon.classList.add("fwhite"):n._icon.classList.add("fblue")}fanMarkers.push(n)}}function removeFans(){fanMarkers.forEach(e=>map.removeLayer(e))}function getSimpleAddress(e,t){const o=new XMLHttpRequest;o.onreadystatechange=(()=>{o.readyState==XMLHttpRequest.DONE&&200==o.status&&(_scope.sl.address=JSON.parse(o.responseText).display_name,_scope.$apply())}),o.open("GET",`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e}&lon=${t}`,!0),o.send()}function setLastPoint(e){localStorage.setItem("lastPoint",JSON.stringify(e))}function getLastPoint(){const e={lat:getParam("lat"),lng:getParam("lng")};if(e.lat&&e.lng)return e;const t=localStorage.getItem("lastPoint");return null==t?DEFAULT_POINT:JSON.parse(t)}function setLastZoom(){localStorage.setItem("lastZoom",map.getZoom())}function getLastZoom(){const e=localStorage.getItem("lastZoom");return null==e?DEFAULT_ZOOM:e}function isObjEqual(e,t){const o=Object.keys,n=typeof e;return e&&t&&"object"===n&&n===typeof t?o(e).length===o(t).length&&o(e).every(o=>isObjEqual(e[o],t[o])):e===t}function inBounds(e){var t,o=e.lng<rectBounds._northEast.lng,n=e.lng>rectBounds._southWest.lng;return t=rectBounds._northEast.lng<rectBounds._southWest.lng?o||n:o&&n,e.lat>rectBounds._southWest.lat&&e.lat<rectBounds._northEast.lat&&t}function getParam(e){return new URL(location.href).searchParams.get(e)}loadPoints(map.getBounds(),!1);