const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
app.use(express.json());

app.get('/v1/:doctorId/sessions', (req, res) => {
  const doctorId = req.params.doctorId;
  fs.readFile('doctorsData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading doctor data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const doctorData = JSON.parse(data);
  const doctor = doctorData.find((doc) => doc.doctorId == doctorId);

  if (!doctor) {
    return res.status(404).json({ message: `Doctor with ID ${doctorId} not found` });
  }
  res.json(doctor.sessions);
});
});

app.get('/v1/:doctorId/doctor', (req, res) => {
  const doctorId = req.params.doctorId;
  fs.readFile('doctorsData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading doctor data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const doctorData = JSON.parse(data);
  const doctor = doctorData.find((doc) => doc.doctorId == doctorId);

  if (!doctor) {
    return res.status(404).json({ message: `Doctor with ID ${doctorId} not found` });
  }
  res.json(doctor);
});
});

app.get('/v1/doctors', (req, res) => {
  const doctorId = req.params.doctorId;
  fs.readFile('doctorsData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading doctor data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const doctorData = JSON.parse(data);
  if (doctorData.length == 0) {
    return res.status(404).json({ message: `No doctor found` });
  }
  res.json(doctorData);
});
});

app.get('/v1/:doctorId/availability', (req, res) => {
  const doctorId = req.params.doctorId;
  fs.readFile('doctorsData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading doctor data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const doctorData = JSON.parse(data);
    const doctor = doctorData.find((doc) => doc.doctorId == doctorId);

    if (!doctor) {
      return res.status(404).json({ message: `Doctor with ID ${doctorId} not found` });
    }
    const mergedConsultingDays = doctor.sessions.reduce((mergedDays, session) => {
      return [...new Set([...mergedDays, ...session.consultingDays])];
    }, []);
    const daysMap = {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      7: 'Sunday',
    };
    mergedConsultingDays.sort();
    const consultingDaysNames = mergedConsultingDays.map((day) => `${daysMap[day]}`);
    res.json({ doctorId : doctorId,
      availabileOn: consultingDaysNames.join('-') });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
