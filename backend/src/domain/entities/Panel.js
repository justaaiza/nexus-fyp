// ============================================================
// Domain Entity: Panel
// ============================================================

class Panel {
  constructor({ id, name, juryMembers, assignedGroups, defenseDate, room, createdAt }) {
    this.id = id;
    this.name = name;
    this.juryMembers = juryMembers || [];    // ref: User[]
    this.assignedGroups = assignedGroups || []; // ref: Proposal[]
    this.defenseDate = defenseDate || null;
    this.room = room || null;
    this.createdAt = createdAt || new Date();
  }

  hasEnoughJurors(min = 3) {
    return this.juryMembers.length >= min;
  }
}

module.exports = Panel;
