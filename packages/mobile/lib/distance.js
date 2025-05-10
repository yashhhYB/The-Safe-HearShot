export const distance = (notifLocation) => {
  // overkill of haversines formula
  if (notifLocation == null) return 0;
  if (notifLocation?.length !== 2) return 0;

  const [lat1, long1] = notifLocation;
  const [lat2, long2] = [34.070313, -118.446938];
  const R = 6371; // Radius of the earth in km
  const KM_TO_MI = 0.621371;
  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }
  const dLat = (degToRad(lat2 - lat1) * Math.PI) / 180;
  const dLon = (degToRad(long2 - long1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * KM_TO_MI; // Distance in miles
};
