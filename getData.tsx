import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2";

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "http://localhost:3306",
  user: "root",
  password: "GraNiNo2019",
  database: "fairhold",
});

// Define your API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: "Error connecting to database" });
      return;
    }

    // Perform the query
    connection.query("SELECT * FROM pricesPaid LIMIT 5", (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        res.status(500).json({ error: "Error querying database" });
        return;
      }

      // Send the results back as JSON
      res.status(200).json(results);
    });
  });
}
