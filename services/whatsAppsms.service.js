const axios = require("axios");
// const token = process.env.TOKEN;
// const mytoken = process.env.MYTOKEN;

const token =
  "EAAhjN7Vb8ZAwBABRutBGPcjOtNCEJbErs6x2wrzHmx4ICM4HgZBdmMcRrcrZAoZCA4WYew9oe3bvhrF4l9WpYY2pMj85a9WxuTc1H1lhto9ho58kzxa564JmlR6rKyec8H1t1ZA9wZBiMNglFnEPmsxLbqo6ZBELirubmxW1ONuSZAHdthzeapWhZAZATrDVFtiT6G844fUZAtErgZDZD";
const mytoken = "Abdul";

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});

// app.post("/webhook", (req, res) => {
exports.createUser = (req, res) => {
  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id = 9458431173;
      body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v13.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi.. I'm Abdul, your message is " + msg_body,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
};
