import { Router } from "express";
import axios from "axios";
import passport from "passport";
import { routeResponse } from "../index";
import { addressRepository, orderRepository } from "../../../appDataSource";

export const paypalRouter = Router();

const generateToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const {
    data: { access_token },
  } = await axios.post(`${process.env.PAYPAL_API!}/v1/oauth2/token`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.PAYPAL_CLIENT!,
      password: process.env.PAYPAL_SECRET!,
    },
  });
  return access_token;
};

const generateOrderObject = (orderId: string, total: string) => {
  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
        },
        reference_id: orderId,
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "FanShop",
          shipping_preference: "NO_SHIPPING",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          locale: "en-US",
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          payment_method_selected: "PAYPAL",
          return_url: `${process.env.BACKEND}/order/paypal/capture`,
          cancel_url: `${process.env.BACKEND}/order/paypal/cancel`,
        },
      },
    },
  };
};

paypalRouter.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { orderId, total, addressId } = req.body;
  try {
    const orderOnDb = await orderRepository.findOne({ where: { id: orderId } });
    if (!orderOnDb) return;
    const addressOnDb = await addressRepository.findOne({ where: { id: addressId } });
    if (!addressOnDb) return;
    orderOnDb.status = "in-progress";
    orderOnDb.address = addressOnDb;

    const token = await generateToken();
    const order = generateOrderObject(orderId, total);
    const { data: create_order_response } = await axios.post(
      `${process.env.PAYPAL_API!}/v2/checkout/orders`,
      order,
      {
        headers: {
          "PayPal-Request-Id": orderId,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    orderOnDb.paypalId = create_order_response.id;
    await orderRepository.save(orderOnDb);
    return res.send(create_order_response);
  } catch (e) {
    res.send(routeResponse(false, (e as Error).message));
  }
});

paypalRouter.get("/capture", async (req, res) => {
  const { token } = req.query;
  try {
    const auth_token = await generateToken();
    const { data: captureResponse } = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    if (captureResponse.status !== "COMPLETED") return;
    const orderOnDb = await orderRepository.findOne({
      where: { paypalId: captureResponse.id },
    });
    if (!orderOnDb) return;
    orderOnDb.status = "completed";
    await orderRepository.save(orderOnDb);
    return res.redirect(`${process.env.FRONTEND}/order`);
  } catch (e) {
    res.send(routeResponse(false, (e as Error).message));
  }
});

paypalRouter.get("/cancel", async (req, res) => {
  const { token } = req.query;
  try {
    const orderOnDb = await orderRepository.findOne({ where: { paypalId: token as string } });
    if (!orderOnDb) return;
    orderOnDb.status = "incomplete";
    await orderRepository.save(orderOnDb);
    return res.redirect(`${process.env.FRONTEND}/order`);
  } catch (e) {
    res.send(routeResponse(false, (e as Error).message));
  }
});
