import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLeadValidators, updateLeadValidators } from '../validators/lead.validators';
import { UserRole } from '../types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

/**
 * @route  GET /api/leads/export
 * @desc   Export leads as CSV
 * @access Private (Admin, Sales)
 */
router.get('/export', exportLeadsCSV);

/**
 * @route  GET /api/leads
 * @desc   Get all leads with filtering, search, sorting, pagination
 * @access Private (Admin sees all, Sales sees own)
 */
router.get('/', getLeads);

/**
 * @route  GET /api/leads/:id
 * @desc   Get a single lead by ID
 * @access Private
 */
router.get('/:id', getLeadById);

/**
 * @route  POST /api/leads
 * @desc   Create a new lead
 * @access Private (Admin, Sales)
 */
router.post('/', createLeadValidators, validate, createLead);

/**
 * @route  PUT /api/leads/:id
 * @desc   Update a lead
 * @access Private
 */
router.put('/:id', updateLeadValidators, validate, updateLead);

/**
 * @route  DELETE /api/leads/:id
 * @desc   Delete a lead
 * @access Private (Admin only for others' leads)
 */
router.delete('/:id', deleteLead);

export default router;
