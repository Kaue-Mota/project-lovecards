// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Order } from "mercadopago";

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
	accessToken: "APP_USR-4217615482082122-081319-0ec6678bdddaaa6b4fadfb6ff3a95474-2622761269",
	options: { timeout: 5000 },
});

// Step 3: Initialize the API object
const order = new Order(client);

// Step 4: Create the request object
const body = {
	type: "online",
	processing_mode: "automatic",
	total_amount: 1000.00,
	external_reference: "ext_ref_1234",
	payer: {
		email: "<PAYER_EMAIL>",
	},
	transactions: [
		{
			payments: [
				{
					amount: 1000.00,
					payment_method: {
						id: "master",
						type: "credit_card",
						token: "<CARD_TOKEN>",
						installments: 1,
						statement_descriptor: "Store name",
					},
				},
			],
		},
	],
};

// Step 5: Create request options object - Optional
const requestOptions = {
	idempotencyKey: "<IDEMPOTENCY_KEY>",
};

// Step 6: Make the request
order.create({ body, requestOptions }).then(console.log).catch(console.error);