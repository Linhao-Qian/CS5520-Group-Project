export const fetchNearbyPlaces = async (location, type) => {
    try {
      const { latitude, longitude } = location;
      const radius = 10000; 
      let query = "pharmacy|london+drugs|Rexall|drug+mart";
  
      if (type === "Hospital") {
        query = "hospital";
      } else if (type === "Clinic") {
        query = "medical+clinic|medical+center|medical+centre";
      }
  
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${latitude},${longitude}&radius=${radius}&key=${process.env.EXPO_PUBLIC_mapsApiKey}`;
      
      const response = await fetch(url);
      const result = await response.json();
  
      if (result.status !== "OK") {
        console.error("Error fetching nearby places:", result.status);
        return [];
      }
  
      return result.results;
    } catch (error) {
      console.error("Error in fetchNearbyPlaces:", error);
      return [];
    }
  };
  