const fs = require('fs');
const path = './src/adapters/http/controllers/StudentController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { submitProposal, getMyProposal } = require('../../application/student/proposal.usecase');",
  "const { submitProposal, getMyProposal, editProposal, getAvailableOptions } = require('../../application/student/proposal.usecase');"
);

content = content.replace(
  "const getProposal = async (req, res) => {",
  `const updateProposal = async (req, res) => {
  try {
    const proposal = await editProposal(req.user._id, req.params.proposalId, req.body);
    res.status(200).json({ success: true, data: proposal });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getProposalOptions = async (req, res) => {
  try {
    const options = await getAvailableOptions();
    res.status(200).json({ success: true, data: options });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getProposal = async (req, res) => {`
);

content = content.replace(
  "  postProposal,",
  "  postProposal,\n  updateProposal,\n  getProposalOptions,"
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated controller.");
