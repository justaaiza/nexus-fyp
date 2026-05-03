/**
 * User domain entity.
 * Pure business object — no framework dependencies.
 */
class User {
  constructor({ id, name, email, password, role, rollNumber, department, isApproved, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // student | supervisor | admin | jury
    this.rollNumber = rollNumber || null;
    this.department = department || null;
    this.isApproved = isApproved !== undefined ? isApproved : false;
    this.createdAt = createdAt || new Date();
  }

  isStudent() {
    return this.role === 'student';
  }

  isSupervisor() {
    return this.role === 'supervisor';
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isJury() {
    return this.role === 'jury';
  }

  hasApproval() {
    return this.isApproved === true;
  }
}

module.exports = User;
