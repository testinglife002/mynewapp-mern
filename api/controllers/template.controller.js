import Template from '../models/template.model.js';

export const listTemplates = async (req, res) => {
  const t = await Template.find({}).sort({ createdAt: -1 });
  res.json(t);
};

export const seedTemplates = async (req, res) => {
  const count = await Template.countDocuments();
  if (count > 0) return res.json({ message: 'Already seeded' });

  const demo = [
    {
      name: 'Promo Flyer',
      thumbnailUrl: '',
      width: 1080,
      height: 1350,
      background: '#F3F4F6',
      elements: [
        { id: 't1', type: 'rect', attrs: { x: 80, y: 80, width: 920, height: 1190, fill: '#ffffff', cornerRadius: 16 } },
        { id: 't2', type: 'text', attrs: { x: 120, y: 140, text: 'Big Summer Sale', fontSize: 64, fontStyle: '700', fill: '#111827' } },
        { id: 't3', type: 'text', attrs: { x: 120, y: 220, text: 'Up to 50% off', fontSize: 36, fill: '#6B7280' } },
      ],
    },
  ];

  await Template.insertMany(demo);
  res.json({ inserted: demo.length });
};
