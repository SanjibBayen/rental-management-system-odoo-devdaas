import { Request, Response } from 'express';
import { RentalService } from '../services/rental.service';
import { ProductService } from '../services/product.service';

const rentalService = new RentalService();
const productService = new ProductService();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const [activeRentals, overdueRentals, totalProducts, revenue] = await Promise.all([
        rentalService.getActiveRentals(),
        rentalService.getOverdueRentals(),
        productService.findAll(),
        rentalService.getTotalRevenue()
      ]);

      res.json({
        data: {
          activeRentals: activeRentals.length,
          overdueRentals: overdueRentals.length,
          totalProducts: totalProducts.length,
          totalRevenue: revenue,
          today: new Date().toISOString().split('T')[0]
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecentRentals(req: Request, res: Response) {
    try {
      const rentals = await rentalService.getRecentRentals(10);
      res.json({ data: rentals });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRevenueChart(req: Request, res: Response) {
    try {
      const data = await rentalService.getRevenueByMonth();
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}