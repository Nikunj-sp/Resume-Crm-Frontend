# Resume CRM System

## Tech Stack
- Frontend: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- Backend: Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT
- File Upload: Multer (PDF storage)

## Features
- Admin login with JWT authentication
- Protected dashboard routes
- Add resume with PDF upload
- View resume details
- Edit resume
- Delete resume with confirmation
- Update candidate status
- Search with debounce
- Frontend pagination
- Dashboard analytics cards
- Toast notifications
- Reusable component structure

## Project Structure
root/
├── client/
├── server/
├── uploads/

## How To Run

### Backend
cd server  
npm install  
npm run dev  

### Frontend
cd client  
npm install  
npm run dev  

## Environment Variables

### server/.env
MONGO_URL=your_mongo_connection  
JWT_SECRET=your_secret  

### client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api