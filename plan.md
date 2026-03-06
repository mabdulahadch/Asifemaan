Since you’re going with:

Backend → Node.js
Database → MySQL
Frontend → React + jsx
Hosting → SiteGround

I’ll give you a clear production structure, tools, and full request flow from React → Node → MySQL → back.

1️⃣ What Tools You Should Use
✅ Backend Tools (Node.js)


Inside .env:

DATABASE_URL="mysql://uzwmmbyxy6xmn:asifemaan123@localhost:3306/db6bd05mziowfc"
JWT_SECRET="asifemaan123"


Inside schema.prisma:

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  country   String
  role      Role     @default(USER)
  favourites Favourite[]
  createdAt DateTime @default(now())
}


model Content {
  id              Int         @id @default(autoincrement())
  title           String
  type            ContentType
  textContent     String?
  filePath        String?
  youtubeLink     String?
  hasAudio        Boolean     @default(false)

  favourites      Favourite[]   // One content → many favourites
  favouriteCount  Int         @default(0)
  createdAt       DateTime    @default(now())
}

model Favourite {
  id         Int      @id @default(autoincrement())
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
  content    Content  @relation(fields: [contentId], references: [id])
  contentId  Int
  createdAt  DateTime @default(now())
  @@unique([userId, contentId])   // Prevent duplicate favourites
}


enum Role {
  USER
  ADMIN
}

enum ContentType {
  GHAZAL
  NAZM
  SHER
  EBOOK
  AUDIO
  VIDEO
}


Run:

npx prisma migrate dev


4️⃣ API Flow (Frontend → Backend → DB)

Let’s say user clicks “Login”

Step 1: React Axios API Call

import axios from "axios";

const login = async () => {
  const res = await axios.post("https://yourdomain.com/api/auth/login", {
    email: "[EMAIL_ADDRESS]",
    password: "[PASSWORD]"
  });

  console.log(res.data); // JWT token + user
};

Step 2: Express Route

// routes/auth.js
router.post("/login", loginController);


//Controller
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token, user });


Step 3: MySQL Database

INSERT INTO User (email, password, country) VALUES ("[EMAIL_ADDRESS]", "hashed_password", "Pakistan");

5️⃣ Deployment on SiteGround

Step 1: Upload Backend

Zip your backend folder.

Upload to SiteGround:

Go to SiteGround → File Manager

Upload zip to /public_html

Extract it.

Step 2: Install Dependencies

SSH into your SiteGround server.

cd public_html/backend
npm install --production

Step 3: Configure Environment

Create .env file:

DATABASE_URL="mysql://uzwmmbyxy6xmn:asifemaan123@localhost:3306/db6bd05mziowfc"
JWT_SECRET="asifemaan123"

Step 4: Run Database Migration

npx prisma migrate deploy

Step 5: Start Server

node dist/server.js

(Or use PM2 for production)

6️⃣ Frontend Deployment

Build:

npm run build

Upload build folder to SiteGround /public_html.

Done.
