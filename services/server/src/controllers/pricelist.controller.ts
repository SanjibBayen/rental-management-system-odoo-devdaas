import { Request, Response } from 'express';
import { PricelistService } from '../services/pricelist.service';

const pricelistService = new PricelistService();

export class PricelistController {
  async getAll(req: Request, res: Response) {
    try {

      const { id, name, organization_id } = req.body;

      if (!id || !name || !organization_id) {
        res.status(400).json({ error: 'Missing required fields: id, name, organization_id' });
        return;
      } else {
        res.status(200).json({
          data: { id, name, organization_id },
          message: 'Pricelists retrieved successfully'
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pricelist = await pricelistService.getById(id);
      if (!pricelist) {
        return res.status(404).json({ error: 'Pricelist not found' });
      }
      res.json({ data: pricelist });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const pricelist = await pricelistService.create(data);
      res.status(201).json({ data: pricelist });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const pricelist = await pricelistService.update(id, data);
      res.json({ data: pricelist });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await pricelistService.delete(id);
      res.json({ message: 'Pricelist deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}