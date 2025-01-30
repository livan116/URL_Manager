const Url = require("../Models/url.schema");
const moment = require("moment");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all URLs for the user
    const urls = await Url.find({ userId });

    // Calculate total clicks across all URLs
    const totalClicks = urls.reduce((sum, url) => sum + url.totalClicks, 0);

    // Get date-wise clicks for the last 7 days
    const endDate = moment();
    const startDate = moment().subtract(7, 'days');
    
    // Initialize dateWiseClicks with all dates
    const dateWiseClicks = {};
    for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
      dateWiseClicks[m.format('YYYY-MM-DD')] = 0;
    }

    // Aggregate clicks by date
    urls.forEach(url => {
      url.clicksPerDay.forEach(day => {
        if (moment(day.date).isBetween(startDate, endDate, 'day', '[]')) {
          dateWiseClicks[day.date] = (dateWiseClicks[day.date] || 0) + day.count;
        }
      });
    });

    // Convert to array format for frontend
    const dateWiseClicksArray = Object.entries(dateWiseClicks).map(([date, count]) => ({
      date: moment(date).format('DD-MM-YY'),
      clicks: count
    })).reverse();

    // Calculate device-wise clicks
    const deviceClicks = {};
    urls.forEach(url => {
      url.accessLogs.forEach(log => {
        const device = log.deviceType || 'Desktop';
        deviceClicks[device] = (deviceClicks[device] || 0) + 1;
      });
    });

    // Convert to array format for frontend
    const deviceClicksArray = Object.entries(deviceClicks).map(([device, count]) => ({
      device,
      clicks: count
    }));

    res.json({
      totalClicks,
      dateWiseClicks: dateWiseClicksArray,
      deviceClicks: deviceClicksArray
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};