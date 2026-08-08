import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';

const rentalService = new RentalService();

export class RentalController {
  // GET /api/rentals
  async getAll(req: Request, res: Response) {
    try {
      const rentals = await rentalService.findAll();
      res.json({ data: rentals });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/rentals/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rental = await rentalService.findById(id);

      if (!rental) {
        return res.status(404).json({ error: 'Rental not found' });
      }

      res.json({ data: rental });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/rentals
  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const rental = await rentalService.create(data);
      res.status(201).json({ data: rental });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/rentals/:id/return
  async returnRental(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { returnDate } = req.body;

      if (!returnDate) {
        return res.status(400).json({ error: 'returnDate is required' });
      }

      const rental = await rentalService.returnRental(id, new Date(returnDate));

      res.json({
        message: 'Rental returned successfully',
        data: rental
      });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: 'Rental not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/rentals/active (Admin only)
  async getActive(req: Request, res: Response) {
    try {
      const rentals = await rentalService.getActiveRentals();
      res.json({ data: rentals });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/rentals/overdue (Admin only)
  async getOverdue(req: Request, res: Response) {
    try {
      const rentals = await rentalService.getOverdueRentals();
      res.json({ data: rentals });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/rentals/user (Customer only)
  async getByUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const rentals = await rentalService.findByUser(user.id);
      res.json({ data: rentals });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}