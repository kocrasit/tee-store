const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  console.log('[init-env] .env zaten var:', envPath);
  process.exit(0);
}

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

const template = `NODE_ENV=development
PORT=5000

# MongoDB Atlas
# <db_username> ve <db_password> alanlarını doldur.
MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.zfnkz44.mongodb.net/ecommerce-platform?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
`;

fs.writeFileSync(envPath, template, { encoding: 'utf8', flag: 'wx' });
console.log('[init-env] .env oluşturuldu:', envPath);
console.log('[init-env] Şimdi .env içindeki MONGO_URI kullanıcı/şifre kısmını doldur.');



