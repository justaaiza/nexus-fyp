// ============================================================
// Domain Entity: Announcement
// ============================================================

class Announcement {
  constructor({ id, title, content, audience, type, postedBy, pinned, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.audience = audience || 'all';  // all | students | supervisors | jury
    this.type = type || 'info';         // info | warning | success
    this.postedBy = postedBy;           // ref: User (admin)
    this.pinned = pinned ?? false;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Announcement;
