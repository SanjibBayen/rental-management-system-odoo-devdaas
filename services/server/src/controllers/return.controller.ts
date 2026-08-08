import { Request, Response } from 'express';
import { ReturnService } from '../services/return.service';

const returnService = new ReturnService();

export class ReturnController {
  async getTodayReturns(req: Request, res: Response) {
    try {
      const returns = await returnService.getTodayReturns();
      res.json({ data: returns });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReturnById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const returnRecord = await returnService.getReturnById(id);
      if (!returnRecord) {
        return res.status(404).json({ error: 'Return record not found' });
      }
      res.json({ data: returnRecord });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async inspectReturn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { condition, damage_report, missing_accessories } = req.body;
      const updated = await returnService.inspectReturn(id, {
        condition,
        damage_report,
        missing_accessories
      });
      res.json({
        message: 'Return inspection completed',
        data: updated
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async confirmReturn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await returnService.confirmReturn(id);
      res.json({
        message: 'Return confirmed successfully',
        data: updated
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}