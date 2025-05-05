const express = require('express');
const axios = require('axios');
const router = express.Router();

// Function to convert time to AM/PM format
const formatTimeToAMPM = (time) => {
  const date = new Date(time);  // Convert ISO string to Date object
  let hours = date.getHours();  // Get the hours from the Date object
  let minutes = date.getMinutes();  // Get the minutes from the Date object
  const ampm = hours >= 12 ? 'PM' : 'AM';  // Determine AM or PM
  hours = hours % 12;  // Convert 24-hour to 12-hour format
  hours = hours ? hours : 12;  // Handle midnight (0 becomes 12)
  minutes = minutes < 10 ? '0' + minutes : minutes;  // Ensure minutes are always two digits
  return `${hours}:${minutes} ${ampm}`;  // Return the formatted time string in AM/PM format
};
router.get('/stations', async (req, res) => {
  const { line } = req.query;

  if (!line) {
    return res.status(400).json({ error: 'Missing line parameter' });
  }

  try {
    const response = await axios.get('https://api-v3.mbta.com/stops', {
      params: {
        'filter[route]': line,
        'page[limit]': 100, // Just in case, get up to 100 stops
        sort: 'name',
      },
    });

    // Map station data into { id, name } pairs
    const stations = response.data.data.map(stop => ({
      id: stop.id,
      name: stop.attributes.name,
    }));

    res.json({ stations });
  } catch (error) {
    console.error('Failed to fetch stations:', error.message);
    res.status(500).json({ error: 'Failed to retrieve stations' });
  }
});

router.get('/trains', async (req, res) => {
  const { line, station, direction } = req.query;

  try {
    // Construct the URL for the MBTA API
    let url = 'https://api-v3.mbta.com/predictions';

    // Set up parameters for filtering data
    const params = {};
    if (line) params.route = line;           // Filter by line (route)
    if (station) params.stop = station;      // Filter by station (stop)
    if (direction !== undefined) {
      if (direction === '0' || direction === '1') { // Ensure direction is valid (0 or 1)
        params.direction_id = direction;
      } else {
        return res.status(400).json({ error: 'Invalid direction value. Must be 0 or 1.' });
      }
    }

    // Send the request to the MBTA API with the dynamic parameters
    const response = await axios.get(url, { params });

    // Log the full API response for debugging
    console.log('API Response:', response.data);

    // Extract and process the times (using arrival_time or fallback to departure_time)
    const arrivalTimes = response.data.data
      .map(item => item.attributes.arrival_time)    // Use arrival_time or fallback to departure_time
      .filter(time => time !== null); // Remove null values

    // If there are no valid times, send an appropriate message
    if (arrivalTimes.length === 0) {
      return res.status(404).json({ error: 'No valid arrival times found.' });
    }

    // Sort times in ascending order and slice to return only the next 2 times
    const nextTwoTimes = arrivalTimes
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(0, 3)
    .map(time => formatTimeToAMPM(time)); // Converts times to AM/PM format

    // Return the list of arrival times
    res.json({ arrival_times: nextTwoTimes });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch train predictions' });
  }
});


module.exports = router;
