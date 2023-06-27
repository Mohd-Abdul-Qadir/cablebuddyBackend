const Agent = require("../models/agentSchema");
const exceljs = require("exceljs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Add Agent **************************************************************
exports.AddAgent = async (req, res) => {
  try {
    const { name, number, password, city, state, address } = req.body;
    if (!req.user) {
      return res.json({
        message: "Unauthorized request",
      });
    }
    const newagent = new Agent({
      name,
      number,
      password,
      userId: req.user.id,
      city,
      state,
      address,
    });

    await newagent.save();
    res.status(201).json({ message: "agent added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get agent *********************************************************

exports.getAgent = async (req, res) => {
  try {
    const { id } = req.user;
    const agents = await Agent.find({ userId: id });
    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login agent ***********************************************************
function generateAuthToken(agent) {
  // Generate a JWT token with the agent's ID as the payload
  const token = jwt.sign({ agentId: agent._id }, "your-secret-key", {
    expiresIn: "1h",
  });
  return token;
}

exports.loginAgent = async (req, res) => {
  try {
    const { number, password } = req.body;

    const agent = await Agent.findOne({ number });

    if (!agent || agent.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateAuthToken(agent);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get agent from Token *********************************************************
exports.agentData = async (req, res) => {
  try {
    const token = req.headers.authorization || req.query.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, "your-secret-key");

    const agent = await Agent.findById(decoded.agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(agent);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Single Agent *************************************************************
exports.getSingleAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id); // retrieve product by ID
    if (!agent) {
      return res.status(404).json({ message: "agent not found" });
    }
    res.status(200).json(agent); // send the retrieved product as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Agent ********************************************************************
exports.updateAgent = async (req, res) => {
  const agentId = req.params.id;
  const { name, number, city, state, address } = req.body;

  try {
    const updatedAgent = await Agent.findByIdAndUpdate(
      agentId,
      { name, number, city, state, address },
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({
      message: "Agent updated successfully",
      agent: updatedAgent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Total Agent ************************************************************
exports.totalAgent = async (req, res) => {
  try {
    const { id } = req.user;
    const totalAgents = await Agent.countDocuments({ userId: id });
    res.json({ totalAgents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Download Agent*****************************************************************************

exports.downloadAgent = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("My-Product");

    worksheet.columns = [
      { header: "S no.", key: "s_no" },
      { header: "Name", key: "name" },
      { header: "Product Code", key: "product" },
      { header: "Price", key: "price" },
      { header: "Gst", key: "gst" },
    ];

    let count = 2012;
    const productData = await Product.find();
    productData.forEach((product) => {
      product.s_no = count;

      worksheet.addRow(product);
      count++;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=product.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error);
  }
};

// token **************************************************************************************************************************************************************

// router.post("/add-agent", async (req, res) => {
//   try {
//     const { name, number, password, confirmPassword } = req.body;

//     // Perform validation on name, number, password, and confirmPassword

//     const agentExists = await Agent.findOne({ number });

//     if (agentExists) {
//       return res.status(409).json({ message: "Agent already exists" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     const newAgent = new Agent({
//       name,
//       number,
//       password,
//       userId: req.user.id,
//     });

//     await newAgent.save();
//     res.status(201).json({ message: "Agent registered successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

//***************************Get Agent*****************************/
exports.getAgentByToken = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.id);

    if (!agent) {
      return res.status(404).send("User not found");
    }

    console.log(agent, "this is agent");
    res.send(agent);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
