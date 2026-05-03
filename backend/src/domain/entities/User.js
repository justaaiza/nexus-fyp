// ============================================================
// Domain Entity: User
// Pure business object — no framework dependencies.
// ============================================================

class User {
  constructor({ id, name, email, role, rollNumber, department, isApproved, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;                 // student | supervisor | admin | jury
    this.rollNumber = rollNumber || null;
    this.department = department || null;
    this.isApproved = isApproved ?? false;
    this.createdAt = createdAt || new Date();
  }

  isStudent()     { return this.role === 'student'; }
  isSupervisor()  { return this.role === 'supervisor'; }
  isAdmin()       { return this.role === 'admin'; }
  isJury()        { return this.role === 'jury'; }

  canSubmitProposal() {
    return this.isStudent() && this.isApproved;
  }

  canManageUsers() {
    return this.isAdmin();
  }
}

module.exports = User;
