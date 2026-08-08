import { Request, Response } from 'express';
import { QuotationService } from '../services/quotation.service';

const quotationService = new QuotationService();

export class QuotationController {
  async createQuotation(req: Request, res: Response) {
    try {
      const data = req.body;
      const quotation = await quotationService.createQuotation(data);
      res.status(201).json({
        message: 'Quotation created successfully',
        data: quotation
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getQuotation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const quotation = await quotationService.getQuotationById(id);
      if (!quotation) {
        return res.status(404).json({ error: 'Quotation not found' });
      }
      res.json({ data: quotation });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async convertToRental(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rental = await quotationService.convertToRental(id, req.body);
      res.json({
        message: 'Quotation converted to rental successfully',
        data: rental
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}