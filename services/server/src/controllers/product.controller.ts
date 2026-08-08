import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const products = await productService.getAll();
      res.json({ data: products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ data: product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const product = await productService.create(data);
      res.status(201).json({ data: product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const product = await productService.update(id, data);
      res.json({ data: product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productService.delete(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const products = await productService.getByCategory(category);
      res.json({ data: products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
