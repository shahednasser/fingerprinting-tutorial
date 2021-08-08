// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sqlite3 = require('sqlite3').verbose();

export default function handler(req, res) {
  //get visitor id
  const { slug } = req.query
  const visitorId = slug[0];
  if (!visitorId) {
    return res.status(400).json({success: false, message: 'Visitor ID is required'});
  }
  
  const db = new sqlite3.Database('./database/db.db', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({success: false, message: 'An error occurred, please try again later.'});
    }

    db.get(`SELECT dark_mode FROM users WHERE visitor_id = ?`, [visitorId], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({success: false, message: 'An error occurred, please try again later.'});
      }
  
      if (row) {
        if (req.method === 'POST' && slug.length > 1 && slug[1] != row.darkMode) {
          const darkMode = slug[1];
          //update dark mode in database
          db.run(`UPDATE users SET dark_mode = ? WHERE visitor_id = ?`, [darkMode, visitorId], function (err) {
            if (err) {
              console.error(err);
              return res.status(500).json({success: false, message: 'An error occurred, please try again later.'});
            }

            return res.status(200).json({success: true, darkMode});
          })
        } else {
          return res.status(200).json({success: true, darkMode: row.dark_mode});
        }
      } else {
        const darkMode = slug.length > 1 ? slug[1] : 0;
        //visitor does not exist, insert
        db.run(`INSERT INTO users(visitor_id, dark_mode) VALUES (?, ?)`, [visitorId, darkMode], function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({success: false, message: 'An error occurred, please try again later.'});
          }

          return res.status(200).json({success: true, darkMode});
        })
      }
    })
  })
}
