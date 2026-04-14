import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import { Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";
// controller for payment module
const handleStripeWebhookEvent = catchAsync(async (req : Request, res : Response) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
    // #region agent log
    fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "20e4f1",
      },
      body: JSON.stringify({
        sessionId: "20e4f1",
        runId: "pre-fix",
        location: "payment.controller.ts:entry",
        message: "Webhook request received",
        data: {
          hasSignature: Boolean(signature),
          bodyIsBuffer: Buffer.isBuffer(req.body),
          contentType: req.headers["content-type"],
          webhookSecretPrefix: webhookSecret?.slice(0, 10),
        },
        hypothesisId: "H2_H3_H4",
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
      if(!signature || !webhookSecret){
        console.error("Missing Stripe signature or webhook secret");
        return res.status(status.BAD_REQUEST).json({message : "Missing Stripe signature or webhook secret"})
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        // #region agent log
        // fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "X-Debug-Session-Id": "20e4f1",
        //   },
        //   body: JSON.stringify({
        //     sessionId: "20e4f1",
        //     runId: "pre-fix",
        //     location: "payment.controller.ts:constructEvent",
        //     message: "Stripe webhook signature OK",
        //     data: {
        //       eventType: event.type,
        //       bodyIsBuffer: Buffer.isBuffer(req.body),
        //     },
        //     hypothesisId: "H1",
        //     timestamp: Date.now(),
        //   }),
        // }).catch(() => {});
        // #endregion
    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        // #region agent log
        fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "20e4f1",
          },
          body: JSON.stringify({
            sessionId: "20e4f1",
            runId: "pre-fix",
            location: "payment.controller.ts:constructEvent:catch",
            message: "Stripe webhook signature failed",
            data: {
              errMsg: error instanceof Error ? error.message : String(error),
              bodyIsBuffer: Buffer.isBuffer(req.body),
            },
            hypothesisId: "H1",
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        return res.status(status.BAD_REQUEST).json({message : "Error processing Stripe webhook"})
    }
     try {
        const result = await PaymentService.handlerStripeWebhookEvent(event);
        console.log(result)
        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "Stripe webhook event processed successfully",
            data : result
        })
    } catch (error) {
        console.error("Error handling Stripe webhook event:", error);
        sendResponse(res, {
            httpStatusCode : status.INTERNAL_SERVER_ERROR,
            success : false,
            message : "Error handling Stripe webhook event"
        })
    }
})

export const PaymentController = {
    handleStripeWebhookEvent
}