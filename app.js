import "dotenv/config";
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";


const app = express();
app.use(cors({ origin: "*" })); // Middleware CORS

// Middleware CORS forçado
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use(express.json());

// Mercado Pago config
const preference = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 },
});

const preferenceClient = new Preference(preference);

app.post("/create-preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          id: "item_id",
          title: "Lembrança",
          description: "Lembrança eternizada para seu parceiro",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 100.00,
        },
      ],
    };

    const response = await preferenceClient.create({ body });
    console.log("Preference criada:", response);
    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
