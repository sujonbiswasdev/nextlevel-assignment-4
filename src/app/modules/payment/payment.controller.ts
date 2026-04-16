import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import { Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";
import paginationSortingHelper from "../../helpers/paginationHelping";
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


const getAllPayment= catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const payments = await PaymentService.getAllPaymentsService(req.user?.email as string,page as number,limit as number,skip as number,sortBy as string,sortOrder as string,req.query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "All payment fetched",
      data: payments,
    });
  })

  const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const { status: newStatus } = req.body;

    try {
        const result = await PaymentService.updatePaymentStatusWithOrderCheck(paymentId as string,newStatus)
        return sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Payment status updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Error updating payment status:", error);
        return sendResponse(res, {
            httpStatusCode: status.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error updating payment status"
        });
    }
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  try {
      const result = await PaymentService.deletePayment(paymentId as string);
      return sendResponse(res, {
          httpStatusCode: status.OK,
          success: true,
          message: "Payment deleted successfully",
          data: result
      });
  } catch (error) {
      console.error("Error deleting payment:", error);
      return sendResponse(res, {
          httpStatusCode: status.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Error deleting payment"
      });
  }
});


export const PaymentController = {
    handleStripeWebhookEvent,
    getAllPayment,
    updatePaymentStatus,
    deletePayment
}