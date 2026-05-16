import { Response } from 'express';
import Lead from '../models/Lead';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource, SortOrder, UserRole } from '../types';
import { FilterQuery } from 'mongoose';
import { ILead } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = String(DEFAULT_PAGE),
      limit = String(DEFAULT_LIMIT),
      status,
      source,
      search,
      sort = SortOrder.LATEST,
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: FilterQuery<ILead> = {};

    // RBAC: Sales users can only see their own leads
    if (req.user?.role === UserRole.SALES) {
      filter.createdBy = req.user.userId;
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filter.status = status;
    }

    if (source && Object.values(LeadSource).includes(source)) {
      filter.source = source;
    }

    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const sortOrder = sort === SortOrder.OLDEST ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email role')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, 200, 'Leads fetched successfully.', leads, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    console.error('GetLeads error:', error);
    sendError(res, 500, 'Internal server error.');
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email role');
    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // Sales can only view their own leads
    if (req.user?.role === UserRole.SALES && lead.createdBy.toString() !== req.user.userId) {
      sendError(res, 403, 'Access denied.');
      return;
    }

    sendSuccess(res, 200, 'Lead fetched successfully.', lead);
  } catch (error) {
    console.error('GetLeadById error:', error);
    sendError(res, 500, 'Internal server error.');
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      notes,
      createdBy: req.user?.userId,
    });

    const populated = await lead.populate('createdBy', 'name email role');

    sendSuccess(res, 201, 'Lead created successfully.', populated);
  } catch (error) {
    console.error('CreateLead error:', error);
    sendError(res, 500, 'Internal server error.');
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // Sales can only update their own leads
    if (req.user?.role === UserRole.SALES && lead.createdBy.toString() !== req.user.userId) {
      sendError(res, 403, 'Access denied.');
      return;
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role');

    sendSuccess(res, 200, 'Lead updated successfully.', updated);
  } catch (error) {
    console.error('UpdateLead error:', error);
    sendError(res, 500, 'Internal server error.');
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // Sales can only delete their own leads
    if (req.user?.role === UserRole.SALES && lead.createdBy.toString() !== req.user.userId) {
      sendError(res, 403, 'Access denied.');
      return;
    }

    await lead.deleteOne();
    sendSuccess(res, 200, 'Lead deleted successfully.');
  } catch (error) {
    console.error('DeleteLead error:', error);
    sendError(res, 500, 'Internal server error.');
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams;

    const filter: FilterQuery<ILead> = {};

    if (req.user?.role === UserRole.SALES) {
      filter.createdBy = req.user.userId;
    }
    if (status && Object.values(LeadStatus).includes(status)) filter.status = status;
    if (source && Object.values(LeadSource).includes(source)) filter.source = source;
    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter)
      .populate<{ createdBy: { name: string; email: string } }>('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'];
    const rows = leads.map((lead) => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${lead.notes || ''}"`,
      `"${typeof lead.createdBy === 'object' ? lead.createdBy.name : ''}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('ExportCSV error:', error);
    sendError(res, 500, 'Internal server error.');
  }
};
