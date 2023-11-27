const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());
require("./db/config");
const Exchange = require("./db/exchangeDataModel");

// Fetch and store exchange data in the database
app.get("/api/fetch-exchanges", async (req, res) => {
  try {
    // Fetch exchange data from CoinAPI
    const response1 = await axios.get("https://rest.coinapi.io/v1/exchanges", {
      headers: {
        "X-CoinAPI-Key": "FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9",
      },
    });
    const response2 = await axios.get(
      "https://rest.coinapi.io/v1/exchanges/icons/32",
      {
        headers: {
          "X-CoinAPI-Key": "FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9",
        },
      }
    );
    const data1 = response1.data;
    const data2 = response2.data;

    const combineData = data1.map((item1) => {
      const items2 = data2.find(
        (item2) => item2.exchange_id === item1.exchange_id
      );
      return { ...item1, ...items2 };
    });

    combineData.forEach((element) => {

      const { exchange_id, name, volume_1day_usd, url } = element;
      const exchange = new Exchange({
        exchange_id,
        name,
        volume_1day_usd,
        url,
      });
      Exchange.deleteMany();
      exchange.save();
    });

    res.json({
      success: true,
      message: "Exchanges fetched and stored successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/exchanges_list", async (req, res) => {
  try {
    const exchanges = await Exchange.find();
    res.send(exchanges);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching exchanges." });
  }
});
app.listen(5000, () => {
  console.log("server running on port 5000");
});
