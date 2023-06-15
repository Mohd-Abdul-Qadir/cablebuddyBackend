const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

instance.payments.fetch(paymentId);

//*************************** payment date*/

instance.payments.all(
  {
    from: "2016-08-01",
    to: "2016-08-20",
  },
  (error, response) => {
    if (error) {
      // handle error
    } else {
      // handle success
    }
  }
);

// *********************************main function***************************
var instance = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_SECRET",
});

var options = {
  amount: 50000, // amount in the smallest currency unit
  currency: "INR",
  receipt: "order_rcptid_11",
};
instance.orders.create(options, function (err, order) {
  console.log(order);
});

//**************************************Qr code genrated*****************************/

var instance = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_SECRET",
});

instance.qrCode.close(qrCodeId);

//***************payment Id*********************/
instance.payments.refund(paymentId, {
  amount: "100",
  speed: "normal",
  notes: {
    notes_key_1: "Beam me up Scotty.",
    notes_key_2: "Engage",
  },
  receipt: "Receipt No. 31",
});

// {
//     "id": "qr_HMsVL8HOpbMcjU",
//     "entity": "qr_code",
//     "created_at": 1623660301,
//     "name": "Store_1",
//     "usage": "single_use",
//     "type": "upi_qr",
//     "image_url": "https://rzp.io/i/BWcUVrLp",
//     "payment_amount": 300,
//     "status": "closed",
//     "description": "For Store 1",
//     "fixed_amount": true,
//     "payments_amount_received": 0,
//     "payments_count_received": 0,
//     "notes": {
//       "purpose": "Test UPI QR Code notes"
//     },
//     "customer_id": "cust_HKsR5se84c5LTO",
//     "close_by": 1681615838,
//     "closed_at": 1623660445,
//     "close_reason": "on_demand"
//   }

// {
//     "entity": "collection",
//     "count": 2,
//     "items": [
//       {
//         "id": "qr_HO2jGkWReVBMNu",
//         "entity": "qr_code",
//         "created_at": 1623914648,
//         "name": "Store_1",
//         "usage": "single_use",
//         "type": "upi_qr",
//         "image_url": "https://rzp.io/i/w2CEwYmkAu",
//         "payment_amount": 300,
//         "status": "active",
//         "description": "For Store 1",
//         "fixed_amount": true,
//         "payments_amount_received": 0,
//         "payments_count_received": 0,
//         "notes": {
//           "purpose": "Test UPI QR Code notes"
//         },
//         "customer_id": "cust_HKsR5se84c5LTO",
//         "close_by": 1681615838,
//         "closed_at": null,
//         "close_reason": null
//       },
//       {
//         "id": "qr_HO2e0813YlchUn",
//         "entity": "qr_code",
//         "created_at": 1623914349,
//         "name": "Acme Groceries",
//         "usage": "multiple_use",
//         "type": "upi_qr",
//         "image_url": "https://rzp.io/i/X6QM7LL",
//         "payment_amount": null,
//         "status": "closed",
//         "description": "Buy fresh groceries",
//         "fixed_amount": false,
//         "payments_amount_received": 200,
//         "payments_count_received": 1,
//         "notes": {
//           "Branch": "Bangalore - Rajaji Nagar"
//         },
//         "customer_id": "cust_HKsR5se84c5LTO",
//         "close_by": 1625077799,
//         "closed_at": 1623914515,
//         "close_reason": "on_demand"
//       }
//     ]
//   }

//********************************** */
import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
