/**
 * Use case: Get all panels the jury member is assigned to.
 */
async function getMyPanels(panelRepo, juryUserId) {
  return panelRepo.findByJuryMember(juryUserId);
}

module.exports = getMyPanels;
