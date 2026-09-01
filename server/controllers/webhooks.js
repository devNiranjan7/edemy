import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import purchaseModel from "../models/purchaseModel.js";
import courseModel from "../models/courseModel.js";

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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const getPurchaseId = async (paymentIntentId) => {
    const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
    });
    return sessions.data[0]?.metadata?.purchaseId;
};

const markPurchaseCompleted = async (purchaseId) => {
    const purchase = await purchaseModel.findById(purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    // Stripe may deliver the same event more than once, so avoid duplicate entries.
    const [user, course] = await Promise.all([
        userModel.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { enrolledCourses: purchase.courseId } },
        ),
        courseModel.findByIdAndUpdate(
            purchase.courseId,
            { $addToSet: { enrolledStudents: purchase.userId } },
        ),
    ]);
    if (!user || !course) throw new Error("User or course not found");

    // findByIdAndUpdate belongs to the model, not to a purchase document.
    await purchaseModel.findByIdAndUpdate(purchaseId, { status: "completed" });
};

export const stripeWebhooks = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            // Checkout sends this after a normal card payment succeeds.
            case "checkout.session.completed": {
                const session = event.data.object;
                if (session.payment_status !== "paid") break;
                const purchaseId = session.metadata?.purchaseId;
                if (!purchaseId) throw new Error("purchaseId is missing from session metadata");
                await markPurchaseCompleted(purchaseId);
                break;
            }
            // Support a webhook endpoint already configured for PaymentIntent events.
            case "payment_intent.succeeded": {
                const purchaseId = await getPurchaseId(event.data.object.id);
                if (!purchaseId) throw new Error("Checkout session not found");
                await markPurchaseCompleted(purchaseId);
                break;
            }
            case "payment_intent.payment_failed": {
                const purchaseId = await getPurchaseId(event.data.object.id);
                if (!purchaseId) throw new Error("Checkout session not found");
                await purchaseModel.findOneAndUpdate(
                    { _id: purchaseId, status: { $ne: "completed" } },
                    { status: "failed" },
                );
                break;
            }
            default:
                console.log(`Unhandled Stripe event type ${event.type}`);
        }

        return res.json({ received: true });
    } catch (error) {
        console.error("Stripe webhook processing error:", error.message);
        return res.status(500).json({ received: false });
    }
};
