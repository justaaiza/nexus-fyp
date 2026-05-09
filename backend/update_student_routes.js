const fs = require('fs');
const path = './src/adapters/http/routes/student.routes.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "  getProposal,",
  "  getProposal,\n  updateProposal,\n  getProposalOptions,"
);

content = content.replace(
  "// GET /api/student/proposals/me\nrouter.get('/proposals/me', getProposal);",
  "// GET /api/student/proposals/me\nrouter.get('/proposals/me', getProposal);\n\n// GET /api/student/proposals/options\nrouter.get('/proposals/options', getProposalOptions);\n\n// PUT /api/student/proposals/:proposalId\nrouter.put('/proposals/:proposalId', updateProposal);"
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated routes.");
