const MongoPanelRepository = require('../../adapters/db/repositories/MongoPanelRepository');
const panelRepository = new MongoPanelRepository();
const { validatePanelSize, validatePanelGroups } = require('../../domain/rules/eligibility');

// ─── Create Panel ─────────────────────────────────────────────────────────────
const createPanel = async ({ name, juryMembers, assignedGroups, defenseDate, room }) => {
  const sizeCheck = validatePanelSize(juryMembers);
  if (!sizeCheck.valid) throw Object.assign(new Error(sizeCheck.reason), { statusCode: 400 });

  const groupCheck = validatePanelGroups(assignedGroups);
  if (!groupCheck.valid) throw Object.assign(new Error(groupCheck.reason), { statusCode: 400 });

  const panel = await panelRepository.create({ name, juryMembers, assignedGroups, defenseDate: defenseDate || null, room: room || null });
  return panelRepository.findById(panel._id);
};

// ─── Get All Panels ───────────────────────────────────────────────────────────
const listPanels = async () => {
  return panelRepository.findAll();
};

// ─── Update Panel ─────────────────────────────────────────────────────────────
const updatePanel = async (panelId, data) => {
  const panel = await panelRepository.findById(panelId);
  if (!panel) throw Object.assign(new Error('Panel not found.'), { statusCode: 404 });

  if (data.juryMembers) {
    const sizeCheck = validatePanelSize(data.juryMembers);
    if (!sizeCheck.valid) throw Object.assign(new Error(sizeCheck.reason), { statusCode: 400 });
  }

  if (data.assignedGroups) {
    const groupCheck = validatePanelGroups(data.assignedGroups);
    if (!groupCheck.valid) throw Object.assign(new Error(groupCheck.reason), { statusCode: 400 });
  }

  return panelRepository.updateById(panelId, data);
};

// ─── Delete Panel ─────────────────────────────────────────────────────────────
const deletePanel = async (panelId) => {
  const panel = await panelRepository.deleteById(panelId);
  if (!panel) throw Object.assign(new Error('Panel not found.'), { statusCode: 404 });
};

module.exports = { createPanel, listPanels, updatePanel, deletePanel };
