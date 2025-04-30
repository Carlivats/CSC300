const express = require('express');
const axios = require('axios');
const router = express.Router();

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
      .map(item => item.attributes.arrival_time || item.attributes.departure_time) // Use arrival_time or fallback to departure_time
      .filter(time => time !== null); // Remove null values

    // If there are no valid times, send an appropriate message
    if (arrivalTimes.length === 0) {
      return res.status(404).json({ error: 'No valid arrival times found.' });
    }

    // Sort times in ascending order and slice to return only the next 2 times
    const nextTwoTimes = arrivalTimes.sort((a, b) => new Date(a) - new Date(b)).slice(0, 2);

    // Return the list of arrival times
    res.json({ arrival_times: nextTwoTimes });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch train predictions' });
  }
});

module.exports = router;
