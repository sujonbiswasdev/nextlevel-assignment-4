// service for payment module

import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { parseDateForPrisma } from "../../utils/parseDate";
import AppError from "../../errorHelper/AppError";
import { PaymentStatus } from "../../../../generated/prisma/enums";

const deleteParticipantAndPayment = async (
    orderId?: string,
  paymentId?: string,
) => {
  if (!orderId || !paymentId) {
    console.error("Missing participantId or paymentId in session metadata");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: { id: paymentId },
    });

    await tx.order.deleteMany({
      where: { id: orderId },
    });
  });

  console.log(
    `Payment failed. Deleted participant ${orderId} and payment ${paymentId}`,
  );
};

const deleteParticipantAndPaymentByIds = async (
  participantId: string,
  paymentId: string,
) => {
  await deleteParticipantAndPayment(participantId, paymentId);
  return { message: "Payment canceled. Payment and participant deleted." };
};

const cleanupAllUnpaidPayments = async () => {
  const unpaidPayments = await prisma.payment.findMany({
    where: { status: PaymentStatus.UNPAID },
    select: { id: true, orderId: true },
  });

  if (!unpaidPayments.length) {
    return { deletedPayments: 0, deletedParticipants: 0 };
  }

  const paymentIds = unpaidPayments.map((p) => p.id);
  const oderIds = unpaidPayments.map((p) => p.orderId);

  const [deletedPayments, deletedParticipants] = await prisma.$transaction([
    prisma.payment.deleteMany({
      where: { id: { in: paymentIds } },
    }),
    prisma.order.deleteMany({
      where: { id: { in: oderIds } },
    }),
  ]);

  return {
    deletedPayments: deletedPayments.count,
    deletedParticipants: deletedParticipants.count,
  };
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.oderId;
      const paymentId = session.metadata?.paymentId;

      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return {
          message: "Missing orderId or paymentId in session metadata",
        };
      }

      const orderID = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });
      if (!orderID) {
        console.error(`Appointment with id ${orderID} not found`);
        return { message: `Appointment with id ${orderID} not found` };
      }

      if (session.payment_status !== "paid") {
        await deleteParticipantAndPayment(orderId, paymentId);
        break;
      }

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: {
            id: orderId,
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.PAID,
            paymentGatewayData: session as any,
          },
        });
      });

      console.log(
        `Processed checkout.session.completed for appointment ${orderId} and payment ${paymentId}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }

    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} succeeded.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "checkout.session.async_payment_failed":{
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "payment_intent.canceled":{
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;

      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return {message : `Webhook Event ${event.id} processed successfully`}
};
export const PaymentService = {
    handlerStripeWebhookEvent
}