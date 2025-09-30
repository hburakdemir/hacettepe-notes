import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Token bulunamadı. Lütfen giriş yapın.');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
     console.log('Token geçersiz veya süresi dolmuş.');
      return res.sendStatus(403);
    }

    req.user = user; 
    next();
  });
}