import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Coloque seu Access Token do Mercado Pago aqui
mercadopago.configure({
    access_token: "SEU_ACCESS_TOKEN_AQUI"
});

app.post("/create_preference", async (req, res) => {
    try {
        const preference = {
            items: [
                {
                    title: "Lembrança Digital Eternare",
                    unit_price: 15.00,
                    quantity: 1
                }
            ],
            back_urls: {
                success: "http://localhost:5173/sucesso.html",
                failure: "http://localhost:5173/erro.html",
                pending: "http://localhost:5173/pendente.html"
            },
            auto_return: "approved"
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({ url: response.body.init_point });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar preferência" });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
