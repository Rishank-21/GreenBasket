import { auth } from "@/auth";
import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

async function acceptAssignment(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      );
    }

    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment is not available for acceptance" },
        { status: 400 }
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "Delivery boy already has an assignment" },
        { status: 400 }
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await order.populate("assignedDeliveryBoy", "name email");
    await emitEventHandler("order-assigned", {
      orderId: order._id,
      assignedeliveryBoy: order.assignedDeliveryBoy,
    });

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      }
    );

    return NextResponse.json(
      { message: "order accepted successfully", assignment },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return acceptAssignment(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return acceptAssignment(req, context);
}
