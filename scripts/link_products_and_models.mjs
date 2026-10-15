import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Inspecting categories and products...');
  let categories = await prisma.category.findMany();
  console.log(`Found ${categories.length} categories.`);

  // Ensure standard categories exist if none
  const defaultCats = [
    { name: 'Custom T-Shirts', audience: 'MAN', description: 'Premium custom printed t-shirts' },
    { name: 'Shirts', audience: 'MAN', description: 'Executive collared and formal shirts' },
    { name: 'Mugs & Drinkware', audience: 'UNISEX', description: 'Custom printed ceramic coffee mugs' },
    { name: 'Desk & Office Accessories', audience: 'UNISEX', description: 'Gaming and office mouse pads' }
  ];

  for (const cat of defaultCats) {
    const existing = categories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
    if (!existing) {
      const created = await prisma.category.create({
        data: {
          name: cat.name,
          audience: cat.audience,
          description: cat.description,
          isActive: true
        }
      });
      categories.push(created);
      console.log(`Created category: ${created.name} (${created.id})`);
    }
  }

  // Now inspect existing 3D models and ensure each has a catalog Product
  const models = await prisma.customModel3D.findMany({
    include: { product: true }
  });
  console.log(`Found ${models.length} 3D models.`);

  for (const model of models) {
    if (!model.productId || !model.product) {
      // Find category that matches productType
      const cat = categories.find(c => 
        c.name.toLowerCase().includes(model.productType.toLowerCase()) ||
        model.productType.toLowerCase().includes('t-shirt') && c.name.toLowerCase().includes('t-shirt') ||
        model.productType.toLowerCase().includes('shirt') && c.name.toLowerCase().includes('shirt') ||
        model.productType.toLowerCase().includes('mug') && c.name.toLowerCase().includes('mug') ||
        model.productType.toLowerCase().includes('mouse') && c.name.toLowerCase().includes('desk')
      ) || categories[0];

      const sku = `MOD3D-${model.productType.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${model.id.slice(-6).toUpperCase()}`;

      // Check if product with this SKU already exists
      let prod = await prisma.product.findUnique({ where: { sku } });
      if (!prod) {
        prod = await prisma.product.create({
          data: {
            sku,
            name: model.name,
            categoryId: cat.id,
            audience: cat.audience || 'UNISEX',
            description: `Customizable 3D ${model.productType} with high-definition DTF / UV printing.`,
            basePrice: model.basePrice,
            salePrice: model.basePrice,
            status: 'ACTIVE',
            isCustomizable: true,
            defaultColor: '#18181b',
            defaultSize: 'L',
            sizes: JSON.stringify(model.sizes || ['S', 'M', 'L', 'XL', '2XL']),
            colors: JSON.stringify(model.colors || ['#18181b', '#ffffff']),
          }
        });
        console.log(`Created linked catalog product: ${prod.name} (SKU: ${prod.sku}, ID: ${prod.id})`);
      }

      // Link model to this product
      await prisma.customModel3D.update({
        where: { id: model.id },
        data: { productId: prod.id }
      });
      console.log(`Linked model ${model.name} -> Product ${prod.id}`);
    } else {
      console.log(`Model ${model.name} already linked to product ${model.productId}`);
    }
  }

  console.log('Linking complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
