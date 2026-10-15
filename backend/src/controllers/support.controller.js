import { createTicket, listTickets, resolveTicket } from './support.repo.js';
import { ok, list } from '../utils/http.js';
import { requireInt, requireString } from '../utils/validate.js';

/** POST /api/support/tickets { subject, message } — форма "Не нашли ответ?" */
export async function createSupportTicket(req, res) {
  const data = {
    subject: requireString(req.body?.subject, 'subject', { max: 200 }),
    message: requireString(req.body?.message, 'message', { max: 4000 }),
  };
  return ok(res, await createTicket(req.user.user_id, data), 201);
}

/** GET /api/support/tickets — свои заявки */
export async function myTickets(req, res) {
  return list(res, await listTickets(req.user.user_id));
}

/** GET /api/support/tickets/all — все заявки (для админа) */
export async function allTickets(req, res) {
  if (req.user.role_name !== 'admin') {
    return res.status(403).json({ success: false, error: 'Доступно только администратору' });
  }
  return list(res, await listTickets());
}

/** PATCH /api/support/tickets/:id/resolve */
export async function resolveSupportTicket(req, res) {
  const ticketId = requireInt(req.params.id, 'id');
  return ok(res, await resolveTicket(ticketId, true));
}
