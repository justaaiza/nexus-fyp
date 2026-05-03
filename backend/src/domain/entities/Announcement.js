/**
 * Announcement domain entity.
 * Represents a global or role-targeted announcement posted by admin/coordinator.
 */
class Announcement {
  constructor({ id, title, content, postedBy, audience, pinned, type, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.postedBy = postedBy;
    this.audience = audience || 'all'; // all | students | supervisors | jury
    this.pinned = pinned || false;
    this.type = type || 'info'; // info | warning | success
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Announcement;
