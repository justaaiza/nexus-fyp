/**
 * Port: Email service interface.
 * Stub for future implementation — partner or later phase can implement.
 *
 * TODO: Implement concrete adapter (e.g., NodemailerEmailService) when
 *       email notifications are required.
 */
class IEmailService {
  async sendEmail(to, subject, body) { throw new Error('Not implemented'); }
}

module.exports = IEmailService;
