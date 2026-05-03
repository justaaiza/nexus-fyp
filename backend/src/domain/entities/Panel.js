/**
 * Panel domain entity.
 * Represents a defense panel with jury members and assigned student groups.
 */
class Panel {
  constructor({ id, name, juryMembers, assignedGroups, defenseDate, createdAt }) {
    this.id = id;
    this.name = name;
    this.juryMembers = juryMembers || [];
    this.assignedGroups = assignedGroups || [];
    this.defenseDate = defenseDate;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Panel;
