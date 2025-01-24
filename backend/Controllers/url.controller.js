const Url = require('../Models/url.schema');
const shortid = require("shortid")

exports.shortenUrl = async (req, res) => {
    const { originalUrl, expirationDate } = req.body;
  
    // Dynamically get the base URL (works for both development and production)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
  
    // Generate URL code (use shortid, nanoid, or any unique ID generator)
    const urlCode = shortid.generate();
  
    try {
      // Check if the original URL already exists in the database
      let url = await Url.findOne({ originalUrl });
  
      if (url) {
        // If the URL exists, return the existing shortened URL
        return res.json(url);
      } else {
        // Create a new shortened URL
        const shortUrl = `${baseUrl}/${urlCode}`;
  
        // Handle expiration date if provided
        let expiration = null;
        if (expirationDate) {
          expiration = new Date(expirationDate);
        }
  
        // Save the new URL to the database
        url = new Url({
          originalUrl,
          shortUrl,
          urlCode,
          expirationDate: expiration,
        });
  
        await url.save();
        return res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  };
  

  // In routes/url.js or similar file

// Route to redirect short URL to the original URL
exports.redirectUrl =  async (req, res) => {
  
    const shortUrlCode = req.params.shortUrl;
    console.log(shortUrlCode)
   
    try {
        // Look up the original URL using the short URL code
        const urlData = await Url.findOne({ urlCode: shortUrlCode });
        console.log(urlData)

        if (!urlData) {
            return res.status(404).json('No URL found');
        }

        // If found, redirect the user to the original URL
        return res.redirect(urlData.originalUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
    }
};
