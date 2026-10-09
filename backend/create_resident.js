const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const hash = await bcrypt.hash('resident123', 10);
        await mongoose.connection.db.collection('users').updateOne(
            { email: 'resident@lumina.com' },
            { 
               $set: { name: 'M. Ben Ali', email: 'resident@lumina.com', passwordHash: hash, role: 'GUEST', updatedAt: new Date() },
               $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
        );
        console.log('Resident created');
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
});
