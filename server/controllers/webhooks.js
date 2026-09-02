import { Webhook } from "svix";
import Stripe from "stripe";
import userModel from "../models/userModel.js";
import purchaseModel from "../models/purchaseModel.js";
import courseModel from "../models/courseModel.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

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
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await userModel.findByIdAndUpdate(data.id, userData);
                break;
            }

            case "user.deleted":
                await userModel.findByIdAndDelete(data.id);
                break;

            default:
                console.log("Unhandled Clerk Event:", type);
                break;
        }
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const stripeWebhooks = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                if (!sessions.data.length) {
                    break;
                }
                const purchaseId = sessions.data[0].metadata.purchaseId;
                const purchaseData = await purchaseModel.findById(purchaseId);
                if (!purchaseData) {
                    break;
                }
                const userData = await userModel.findById(purchaseData.userId);
                const courseData = await courseModel.findById(
                    purchaseData.courseId,
                );
                if (!userData || !courseData) {
                    break;
                }
                if (
                    !courseData.enrolledStudents.some(
                        (id) => id.toString() === userData._id.toString(),
                    )
                ) {
                    courseData.enrolledStudents.push(userData._id);
                }
                if (
                    !userData.enrolledCourses.some(
                        (id) => id.toString() === courseData._id.toString(),
                    )
                ) {
                    userData.enrolledCourses.push(courseData._id);
                }
                purchaseData.status = "completed";
                await courseData.save();
                await userData.save();
                await purchaseData.save();
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                if (!sessions.data.length) {
                    break;
                }
                const purchaseId = sessions.data[0].metadata.purchaseId;
                await purchaseModel.findByIdAndUpdate(purchaseId, {
                    status: "failed",
                });
                break;
            }

            default:
                console.log(`Unhandled Event: ${event.type}`);
        }
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
