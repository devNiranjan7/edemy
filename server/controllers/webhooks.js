import { Webhook } from "svix";
import Stripe from "stripe";
import userModel from "../models/userModel.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });
        const { data, type } = req.body;
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await userModel.create(userData);
                res.json({});
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await userModel.findByIdAndUpdate(data.id, userData);
                res.json({});
                break;
            }

            case "user.deleted":
                await userModel.findByIdAndDelete(data.id);
                res.json({});
                break;

            default:
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const stripeWebhooks = async (req, res) => {
    console.log("✅ Stripe webhook reached");
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
        console.log("✅ Event Type:", event.type);
        return res.json({ received: true });
    } catch (error) {
        console.log("❌ Webhook Error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};
