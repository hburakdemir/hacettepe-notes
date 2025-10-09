// backend/routes/sitemapRoutes.js
import express from "express";
import bolumData from "../data/bolumData.js"; // yukarıdaki verilerin olduğu dosya

const router = express.Router();

router.get("/sitemap.xml", (req, res) => {
  const { faculties, departments } = bolumData;
  const baseUrl = "https://nottepe.com";

  let urls = [
    `${baseUrl}/`,
    `${baseUrl}/departments`,
    `${baseUrl}/help`,
    `${baseUrl}/login`,
    `${baseUrl}/register`,
  ];

  // Dinamik olarak fakülte ve bölümler ekleniyor
  faculties.forEach((faculty) => {
    const encodedFaculty = encodeURIComponent(faculty);
    const deptList = departments[faculty] || [];
    deptList.forEach((dept) => {
      const encodedDept = encodeURIComponent(dept);
      urls.push(`${baseUrl}/department/${encodedFaculty}/${encodedDept}`);
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
        <priority>0.6</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

export default router;
