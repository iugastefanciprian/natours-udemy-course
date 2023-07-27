export const displayMap = (locations) => {
  var map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    crossOrigin: '',
  }).addTo(map);

  const points = [];
  let pointA = new L.LatLng(
    locations[0].coordinates[1],
    locations[0].coordinates[0]
  );

  let pointB;

  // Add the rest of the locations
  locations.forEach((loc) => {
    points.push([loc.coordinates[1], loc.coordinates[0]]);
    if (loc.coordinates[0] !== pointA.lat)
      pointB = new L.LatLng(loc.coordinates[1], loc.coordinates[0]);
    let pointList = [pointA, pointB];
    L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(`<h1>Day: ${loc.day} ${loc.description}</h1>`, {
        autoClose: false,
      })
      .openPopup();
    L.polyline(pointList).addTo(map);

    pointA = new L.LatLng(loc.coordinates[1], loc.coordinates[0]);
  });

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.enable();
};
