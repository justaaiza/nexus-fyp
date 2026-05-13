/**
 * Use case: Get all panels the jury member is assigned to.
 * Adds submissions to each assignedGroup (Proposal).
 */
async function getMyPanels(panelRepo, submissionRepo, feedbackRepo, juryUserId) {
  const panels = await panelRepo.findByJuryMember(juryUserId);

  for (const panel of panels) {
    if (panel.assignedGroups && panel.assignedGroups.length > 0) {
      for (const group of panel.assignedGroups) {
        const teamIds = group.teamMembers ? group.teamMembers.map((m) => m._id) : [];
        if (teamIds.length > 0) {
          const submissions = await submissionRepo.findByMultipleUsers(teamIds);
          // Attach feedback (by this jury member) to each submission if it exists
          for (const sub of submissions) {
            const fb = await feedbackRepo.findBySubmissionAndGiver(sub._id, juryUserId);
            if (fb) {
              sub.myFeedback = fb;
            }
          }
          group.submissions = submissions;
        } else {
          group.submissions = [];
        }
      }
    }
  }

  return panels;
}

module.exports = getMyPanels;
