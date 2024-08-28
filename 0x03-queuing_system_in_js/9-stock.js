import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient();
const clientGetAsync = promisify(client.get).bind(client);
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});


const app = express();

const listProducts = [
  { Id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { Id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { Id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

function getItemById(id) {
  return listProducts.find(item => item.Id === id);
}

function reserveStockById(itemId, stock) {
  client.set(itemId, stock);
}

async function getCurrentReservedStockById(itemId) {
  return await clientGetAsync(itemId);
}

app.get('/list_products', (req, res) => {
  res.send(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const stock = await getCurrentReservedStockById(itemId);
  const item = getItemById(itemId);

  if (item) {
    item['currentQuantity'] = stock;
    res.json(item);
  } else {
    res.status(404).send({"status":"Product not found"});
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const stock = await getCurrentReservedStockById(itemId);
  const item = getItemById(itemId);

  const noStock = {
    "status": "Not enough stock available",
    "itemId": itemId
  }

  if (item) {
    if (stock && stock > 0) {
      const newStock = parseInt(stock) - 1;
      reserveStockById(itemId, newStock);
      res.json({
        "status": "Reservation confirmed",
        "itemId": itemId,
        "newStock": newStock
      });
    } else {
      res.json(noStock);
    }
  } else {
    res.status(404).send(noStock);
  }


});

app.listen(1245, () => {
  console.log(`Server is running on http://localhost:${1245}`);
});

reserveStockById(1, 4)
