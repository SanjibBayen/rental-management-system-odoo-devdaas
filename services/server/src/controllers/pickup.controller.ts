import { Request, Response } from 'express';
import { PickupService } from '../services/pickup.service';

const pickupService = new PickupService();

export class PickupController {
  async getTodayPickups(req: Request, res: Response) {
    try {
      const { id, rental_id, scheduled_at, completed_at, status } = req.body;
      if (!id || !rental_id || !scheduled_at || !completed_at || !status) {
        res.status(400).json({ error: 'Missing required fields: id, rental_id, scheduled_at, completed_at, status' });
        return;
      }
      const pickups = await pickupService.getTodayPickups();
      res.status(200).json({ data: pickups });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPickupById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pickup = await pickupService.getPickupById(id);
      if (!pickup) {
        return res.status(404).json({ error: 'Pickup not found' });
      }
      res.json({ data: pickup });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async confirmPickup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const updated = await pickupService.confirmPickup(id, notes);
      res.json({
        message: 'Pickup confirmed successfully',
        data: updated
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}