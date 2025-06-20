
// LoadLink Basic API (Node.js + Express)

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store (use Firebase/MongoDB in real version)
const users = []; // [{ id, name, phone, role }]
const loads = []; // [{ id, shipperId, origin, destination, trucksNeeded, status }]
const applications = []; // [{ loadId, userId, trucksApplied }]

// Register user (individual, agent, company)
app.post('/register', (req, res) => {
  const { name, phone, role } = req.body;
  if (!name || !phone || !role) return res.status(400).send('All fields required');
  const id = users.length + 1;
  users.push({ id, name, phone, role });
  res.status(201).send({ id, name, phone, role });
});

// Post a load
app.post('/post-load', (req, res) => {
  const { shipperId, origin, destination, trucksNeeded } = req.body;
  if (!shipperId || !origin || !destination || !trucksNeeded) return res.status(400).send('Missing info');
  const id = loads.length + 1;
  loads.push({ id, shipperId, origin, destination, trucksNeeded, status: 'open' });
  res.status(201).send({ id });
});

// Find available loads
app.get('/find-loads', (req, res) => {
  res.send(loads.filter(l => l.status === 'open'));
});

// Apply for a load
app.post('/apply-load', (req, res) => {
  const { loadId, userId, trucksApplied } = req.body;
  if (!loadId || !userId || !trucksApplied) return res.status(400).send('Missing info');
  applications.push({ loadId, userId, trucksApplied });
  res.send({ message: 'Applied successfully' });
});

// View applications for a load
app.get('/load-applications/:loadId', (req, res) => {
  const loadId = parseInt(req.params.loadId);
  const apps = applications.filter(a => a.loadId === loadId);
  res.send(apps);
});

app.listen(PORT, () => {
  console.log(`LoadLink API running on http://localhost:${PORT}`);
});
