const fs = require('fs');
const path = '../frontend/src/app/services/api.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "getMyProposal: () => request('/student/proposals/me'),",
  "getMyProposal: () => request('/student/proposals/me'),\n  getProposalOptions: () => request('/student/proposals/options'),\n  updateProposal: (id: string, body: object) => request(`/student/proposals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),"
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated api.ts.");
