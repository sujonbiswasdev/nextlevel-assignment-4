var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum Role {\n  Customer\n  Provider\n  Admin\n}\n\nenum Status {\n  activate\n  suspend\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String    @unique\n  emailVerified Boolean   @default(false)\n  image         String?\n  bgimage       String?\n  phone         String?   @db.VarChar(20)\n  role          Role      @default(Customer)\n  status        Status    @default(activate)\n  isActive      Boolean   @default(true)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  // relationship\n  reviews  Review[]\n  orders   Order[]\n  category Category[]\n  provider ProviderProfile?\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  adminId   String\n  name      String   @unique @db.VarChar(150)\n  image     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  // relationship\n  meals     Meal[]\n  user      User     @relation(fields: [adminId], references: [id], onDelete: Cascade)\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id                String            @id @default(uuid())\n  meals_name        String            @db.VarChar(100)\n  description       String?           @db.Text\n  image             String?\n  price             Int\n  isAvailable       Boolean           @default(true)\n  dietaryPreference DietaryPreference @default(HALAL)\n  providerId        String\n  category_name     String\n  cuisine           Cuisine           @default(BANGLEDESHI)\n  status            MealsStatus       @default(APPROVED)\n  createdAt         DateTime          @default(now())\n  updatedAt         DateTime          @updatedAt\n  //   relationship\n  provider          ProviderProfile   @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  reviews           Review[]\n  orderitem         Orderitem[]\n  category          Category          @relation(fields: [category_name], references: [name], onDelete: Cascade)\n\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  HALAL\n  VEGAN\n  VEGETARIAN\n  ANY\n  GLUTEN_FREE\n  KETO\n  PALEO\n  DAIRY_FREE\n  NUT_FREE\n  LOW_SUGAR\n}\n\nenum Cuisine {\n  BANGLEDESHI\n  ITALIAN\n  CHINESE\n  INDIAN\n  MEXICAN\n  THAI\n  JAPANESE\n  FRENCH\n  MEDITERRANEAN\n  AMERICAN\n  MIDDLE_EASTERN\n}\n\nenum MealsStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nmodel Order {\n  id         String          @id @default(uuid())\n  customerId String\n  providerId String\n  first_name String?\n  last_name  String?\n  status     OrderStatus     @default(PLACED)\n  totalPrice Int\n  phone      String?\n  address    String          @db.Text\n  createdAt  DateTime        @default(now())\n  updatedAt  DateTime        @updatedAt\n  // relationship\n  orderitem  Orderitem[]\n  customer   User            @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n\n  @@map("order")\n}\n\nmodel Orderitem {\n  id        String   @id @default(uuid())\n  orderId   String\n  price     Float\n  quantity  Int\n  mealId    String\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // relationship\n\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@map("orderitem")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel ProviderProfile {\n  id             String  @id @default(uuid())\n  userId         String  @unique\n  restaurantName String  @db.VarChar(100)\n  address        String  @db.VarChar(200)\n  description    String? @db.Text\n  image          String? @db.VarChar(100)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  // relationship\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals     Meal[]\n  orders    Order[]\n\n  @@map("providerprofile")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  customerId String\n  mealId     String\n  parentId   String?\n  rating     Int\n  status     ReviewStatus @default(APPROVED)\n  comment    String       @db.Text\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  // relationship\n  parent     Review?      @relation("reviewsReply", fields: [parentId], references: [id], onDelete: Cascade)\n  replies    Review[]     @relation("reviewsReply")\n  customer   User         @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  meal       Meal         @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@map("review")\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"meals_name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"dietaryPreference","kind":"enum","type":"DietaryPreference"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"cuisine","kind":"enum","type":"Cuisine"},{"name":"status","kind":"enum","type":"MealsStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"MealToOrderitem"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"}],"dbName":"meal"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"first_name","kind":"scalar","type":"String"},{"name":"last_name","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"OrderToOrderitem"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"}],"dbName":"order"},"Orderitem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderitem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderitem"}],"dbName":"orderitem"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"}],"dbName":"providerprofile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":"review"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  OrderitemScalarFieldEnum: () => OrderitemScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Meal: "Meal",
  Order: "Order",
  Orderitem: "Orderitem",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  bgimage: "bgimage",
  phone: "phone",
  role: "role",
  status: "status",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  adminId: "adminId",
  name: "name",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  meals_name: "meals_name",
  description: "description",
  image: "image",
  price: "price",
  isAvailable: "isAvailable",
  dietaryPreference: "dietaryPreference",
  providerId: "providerId",
  category_name: "category_name",
  cuisine: "cuisine",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  first_name: "first_name",
  last_name: "last_name",
  status: "status",
  totalPrice: "totalPrice",
  phone: "phone",
  address: "address",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderitemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  price: "price",
  quantity: "quantity",
  mealId: "mealId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  address: "address",
  description: "description",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  mealId: "mealId",
  parentId: "parentId",
  rating: "rating",
  status: "status",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app.ts
import express from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: ["Customer", "Provider", "Admin"],
        required: false,
        defaultValue: "Customer"
      },
      status: {
        type: ["activate", "suspend"],
        required: false,
        defaultValue: "activate"
      },
      phone: {
        type: "string",
        required: false
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true
      },
      bgimage: {
        type: "string",
        required: false,
        defaultValue: true
      }
    }
  },
  plugins: [
    bearer()
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/modules/auth/auth.service.ts
import status from "http-status";
var getCurrentUser = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      provider: true
    }
  });
};
var signoutUser = async (id, sessionToken) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return {
    success: true,
    message: `current user signout successfully`,
    result
  };
};
var signup = async (data) => {
  const result = await auth.api.signUpEmail({
    body: {
      name: data.name,
      // required
      email: data.email,
      // required
      password: data.password,
      // required
      image: data.image,
      bgimage: data.bgimage,
      role: data.role
    }
  });
  try {
    let provider;
    if (data.role == "Provider") {
      provider = await prisma.$transaction(async (tx) => {
        await tx.providerProfile.create({
          data: {
            userId: result.user.id,
            restaurantName: data.restaurantName,
            address: data.address,
            description: data.description
          }
        });
      });
      return provider;
    }
    const accessToken = tokenUtils.getAccessToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      status: result.user.status,
      emailVerified: result.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      status: result.user.status,
      emailVerified: result.user.emailVerified
    });
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password
      }
    });
    return {
      ...result.user,
      token: result.token,
      accessToken,
      refreshToken,
      provider
    };
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: result.user.id
      }
    });
    throw new AppError_default(400, "user created fail");
  }
};
var signin = async (data) => {
  const existingUesr = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if (!existingUesr) {
    throw new AppError_default(404, "user not found");
  }
  const result = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password
    }
  });
  if (result.user.status === "suspend") {
    throw new AppError_default(status.UNAUTHORIZED, "User is suspend");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken
};

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Something went wrong";
      res.status(statusCode).json({
        success: false,
        message,
        error: error.data
      });
    }
  };
};

// src/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/modules/auth/auth.controller.ts
import status2 from "http-status";
var getCurrentUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.id);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "retrieve current user successsfully",
    data: result
  });
});
var signoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.signoutUser(user.id, betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var signup2 = catchAsync(async (req, res) => {
  const result = await authService.signup(req.body);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.CREATED,
    success: true,
    message: "user signup successfully",
    data: result
  });
});
var signin2 = catchAsync(async (req, res) => {
  const result = await authService.signin(req.body);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "user signin successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError_default(status2.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);
var authController = {
  getCurrentUser: getCurrentUser2,
  signoutUser: signoutUser2,
  signup: signup2,
  signin: signin2,
  getNewToken: getNewToken2
};

// src/middleware/auth.ts
import status3 from "http-status";
var auth2 = (roles) => {
  return async (req, res, next) => {
    console.log(roles);
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(status3.UNAUTHORIZED).json({
          success: false,
          message: "You are Unauthorized"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
        status: session.user.status,
        isActive: session.user.isActive
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(status3.FORBIDDEN).json({
          success: false,
          message: "Access denied: You do not have the required permissions to perform this action."
        });
      }
      next();
    } catch (error) {
      throw new AppError_default(status3.BAD_REQUEST, "Authentication failed");
    }
  };
};
var auth_default = auth2;

// src/middleware/auth.const.ts
var UserRoles = {
  Admin: "Admin",
  Customer: "Customer",
  Provider: "Provider"
};

// src/modules/auth/auth.route.ts
var router = Router();
router.get("/me", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.getCurrentUser);
router.post("/logout", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.signoutUser);
router.post("/register", authController.signup);
router.post("/login", authController.signin);
router.post("/refresh-token", authController.getNewToken);
var authRouter = { router };

// src/modules/meal/meal.route.ts
import { Router as Router2 } from "express";

// src/modules/meal/meal.service.ts
import status4 from "http-status";
var createMeal = async (data, userid) => {
  const providerid = await prisma.user.findUnique({
    where: { id: userid },
    include: { provider: { select: { id: true } } }
  });
  if (!providerid) {
    throw new AppError_default(status4.NOT_FOUND, "provider not found");
  }
  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name
    }
  });
  if (!categoryCheck) {
    throw new AppError_default(status4.NOT_FOUND, "category not found");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId: providerid.provider.id
    }
  });
  return result;
};
var getAllmeals = async (data, isAvailable, page, limit, skip, sortBy, sortOrder) => {
  console.log(data, "data for busines");
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (data.meals_name) {
      orConditions.push({
        meals_name: {
          contains: data.meals_name,
          mode: "insensitive"
        }
      });
    }
    if (data.description) {
      orConditions.push({
        description: {
          contains: data.description,
          mode: "insensitive"
        }
      });
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive"
        }
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable });
  }
  if (data.price) {
    andConditions.push({
      price: {
        gte: 1,
        lte: Number(data.price)
      }
    });
  }
  if (data.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ","
    );
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item }))
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED"
    },
    include: {
      provider: true,
      reviews: {
        where: {
          parentId: null,
          rating: { gt: 0 },
          status: "APPROVED"
        },
        include: {
          customer: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED"
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const mealsWithStats = meals.map((meal) => {
    const stats = reviewStats.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      averageRating: stats?._avg?.rating || 0,
      // Default to 0
      totalReview: stats?._count?.rating || 0
      // Default to 0
    };
  });
  const total = await prisma.meal.count({ where: { AND: andConditions } });
  return {
    data: mealsWithStats,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var getSinglemeals = async (id) => {
  const result = await prisma.meal.findUniqueOrThrow({
    where: {
      id,
      status: "APPROVED"
    },
    include: {
      category: true,
      provider: {
        include: {
          user: true
        }
      },
      reviews: {
        where: {
          parentId: null
        },
        include: {
          replies: {
            include: {
              replies: true
            }
          },
          customer: {
            include: {
              reviews: true
            }
          }
        }
      }
    }
  });
  const providerRating = await prisma.review.aggregate({
    where: {
      customer: {
        provider: {
          id: result.provider.id
        }
      },
      rating: {
        gt: 0
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  return {
    ...result,
    providerRating: {
      totalReview: providerRating._count.rating,
      averageRating: providerRating._avg.rating ?? 0
    }
  };
};
var UpdateMeals = async (data, mealid) => {
  const { category_name } = data;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid }
  });
  if (!existmeal) {
    throw new AppError_default(status4.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError_default(status4.CONFLICT, "category_name is already up to date.");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      ...data
    }
  });
  return result;
};
var DeleteMeals = async (mealid) => {
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (!existmeal) {
    throw new AppError_default(status4.NOT_FOUND, "meal not found");
  }
  const result = await prisma.meal.delete({
    where: {
      id: mealid
    }
  });
  return result;
};
var getOwnMeals = async (userid) => {
  const meals = await prisma.meal.findMany({
    where: {
      provider: {
        userId: userid
      }
    },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: {
          parentId: null
        },
        include: {
          replies: {
            include: {
              replies: true
            }
          }
        }
      }
    }
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED"
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const mealsWithStats = meals.map((meal) => {
    const stats = reviewStats.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      averageRating: stats?._avg?.rating || 0,
      // Default to 0
      totalReview: stats?._count?.rating || 0
      // Default to 0
    };
  });
  return mealsWithStats;
};
var updateStatus = async (data, mealid) => {
  const { status: status16 } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (existmeal?.status === status16) {
    throw new AppError_default(409, "meal status already up to date");
  }
  if (existmeal?.id !== mealid) {
    throw new AppError_default(404, "mealid is invalid,please check your mealid");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      status: status16
    }
  });
  return result;
};
var mealService = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  getAllmeals,
  getSinglemeals,
  getOwnMeals,
  updateStatus
};

// src/helpers/paginationHelping.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 9;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationHelping_default = paginationSortingHelper;

// src/modules/meal/meal.controller.ts
import status5 from "http-status";
var createMeal2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await mealService.createMeal(req.body, user.id);
  sendResponse(res, {
    httpStatusCode: status5.CREATED,
    success: true,
    message: "your meal has been created",
    data: result
  });
});
var UpdateMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({ success: false, message: "you are not authorized" });
  }
  const result = await mealService.UpdateMeals(req.body, req.params.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "meal update successfully",
    data: result
  });
});
var DeleteMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await mealService.DeleteMeals(user.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "your meal delete has been successfully",
    data: result
  });
});
var Getallmeals = catchAsync(async (req, res) => {
  const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await mealService.getAllmeals(req.query, isAvailable, page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: " retrieve all meals successfully",
    data: result
  });
});
var GetSignlemeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mealService.getSinglemeals(id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: " retrieve single meal successfully",
    data: result
  });
});
var getownmeals = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await mealService.getOwnMeals(user.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "your own meal retrieve has been successfully",
    data: result
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { id } = req.params;
  const result = await mealService.updateStatus(req.body, id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "meal status update successfully",
    data: result
  });
});
var mealController = {
  createMeal: createMeal2,
  UpdateMeals: UpdateMeals2,
  DeleteMeals: DeleteMeals2,
  Getallmeals,
  GetSignlemeals,
  getownmeals,
  updateStatus: updateStatus2
};

// src/utils/handleZodError.ts
var formatZodIssues = (error) => {
  return error.issues.map((e) => {
    let message = "";
    switch (e.code) {
      case "invalid_type":
        message = `field ${e.path.join(", ") || "unknown"} expected ${e.expected} type,but  received ${e.input},please provide a valid type`;
        break;
      case "unrecognized_keys":
        message = `You provided extra fields: ${e.keys || "unknown"}. Please remove keys ${e.keys}`;
        break;
      case "invalid_format":
        message = `field ${e.path.join(",") || "unknown"} is not a valid format(${e.format}) but received ${e.input},please prrovide a valid format`;
        break;
      case "invalid_value":
        message = `Invalid value. Allowed values are (${e.values}) but received ${e.input},plese provide a currect value`;
        break;
      case "too_big":
        message = `field  ${e.path} provide a big data,received ${e.input},please provide a valid value`;
        break;
      case "too_small":
        message = `field  ${e.path} provide a small data,received ${e.input},please provide a valid value`;
        break;
      default:
        message = `field ${e.path} is invalid data,received ${e.input}`;
    }
    return {
      message
    };
  });
};

// src/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in data field"
        });
      }
    }
    if (!parsedResult.success) {
      const zodmessage = formatZodIssues(parsedResult.error);
      return res.status(400).json({
        success: false,
        message: "your provided data is invalid",
        zodmessage
      });
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/modules/meal/meal.validation.ts
import z from "zod";
var CreatemealData = z.object({
  meals_name: z.string(),
  description: z.string().optional(),
  image: z.string(),
  price: z.number(),
  isAvailable: z.boolean().optional(),
  dietaryPreference: z.enum([
    "HALAL",
    "VEGAN",
    "VEGETARIAN",
    "ANY",
    "GLUTEN_FREE",
    "KETO",
    "PALEO",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_SUGAR"
  ]).default("VEGETARIAN"),
  category_name: z.string(),
  cuisine: z.enum([
    "BANGLEDESHI",
    "ITALIAN",
    "CHINESE",
    "INDIAN",
    "MEXICAN",
    "THAI",
    "JAPANESE",
    "FRENCH",
    "MEDITERRANEAN",
    "AMERICAN",
    "MIDDLE_EASTERN"
  ]).default("BANGLEDESHI")
}).strict();
var UpdatemealData = z.object({
  meals_name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
  category_name: z.string().optional(),
  cuisine: z.enum([
    "BANGLEDESHI",
    "ITALIAN",
    "CHINESE",
    "INDIAN",
    "MEXICAN",
    "THAI",
    "JAPANESE",
    "FRENCH",
    "MEDITERRANEAN",
    "AMERICAN",
    "MIDDLE_EASTERN"
  ]).optional(),
  dietaryPreference: z.enum([
    "HALAL",
    "VEGAN",
    "VEGETARIAN",
    "ANY",
    "GLUTEN_FREE",
    "KETO",
    "PALEO",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_SUGAR"
  ]).optional()
});
var mealQuerySchema = z.object({
  data: z.object({
    meals_name: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    // Coerce handles strings from forms/URLs
    dietaryPreference: z.string().optional(),
    cuisine: z.string().optional(),
    category_name: z.string().optional()
  })
});

// src/modules/meal/meal.route.ts
var router2 = Router2();
router2.get("/meals", mealController.Getallmeals);
router2.get("/provider/meals/own", auth_default([UserRoles.Provider]), mealController.getownmeals);
router2.post("/provider/meal", auth_default([UserRoles.Provider]), validateRequest(CreatemealData), mealController.createMeal);
router2.delete("/provider/meal/:id", auth_default([UserRoles.Provider, UserRoles.Admin]), mealController.DeleteMeals);
router2.put("/provider/meal/:id", auth_default([UserRoles.Provider]), validateRequest(UpdatemealData), mealController.UpdateMeals);
router2.get("/meal/:id", mealController.GetSignlemeals);
router2.put("/admin/meal/:id", auth_default([UserRoles.Admin]), mealController.updateStatus);
var mealRouter = { router: router2 };

// src/middleware/globalErrorHandeller.ts
import status6 from "http-status";
function errorHandler(err, req, res, next) {
  let statusCode = status6.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = status6.BAD_REQUEST;
    message = "Validation Error";
    errorSources.push({ message: err.message });
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode || status6.BAD_REQUEST;
    message = err.message;
    errorSources.push({ message: err.message });
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // ডেভেলপমেন্ট মোডে থাকলে স্ট্যাক ট্রেস দেখতে পারেন
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
}
var globalErrorHandeller_default = errorHandler;

// src/middleware/notFound.ts
function Notfound(req, res) {
  res.status(404).json({ message: "route not found" });
}

// src/modules/provider/provider.route.ts
import { Router as Router3 } from "express";

// src/modules/provider/provider.service.ts
import status7 from "http-status";
var createProvider = async (data, userId) => {
  const existinguser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existinguser) {
    throw new AppError_default(404, "user not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      restaurantName: data.restaurantName,
      address: data.address,
      description: data.description,
      image: data.image,
      userId
    }
  });
  return result;
};
var getAllProvider = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const userid = providers.map((p) => p.userId);
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0
      },
      parentId: null,
      meal: {
        provider: {
          userId: {
            in: userid
          }
        }
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const providerWithRating = providers.map((provider) => {
    const providerMeals = ratings.filter((r) => r.mealId && provider.userId);
    const totalReview = providerMeals.reduce(
      (sum, r) => sum + r._count.rating,
      0
    );
    const totalRating = providerMeals.reduce(
      (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
      0
    );
    const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
    return {
      ...provider,
      rating: {
        totalReview,
        averageRating
      }
    };
  });
  return providerWithRating;
};
var getProviderWithMeals = async (id) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id }
  });
  if (!existprovider) {
    throw new AppError_default(status7.NOT_FOUND, "provider not found for this id");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          reviews: true
        }
      },
      meals: {
        include: { category: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!provider) {
    throw new AppError_default(status7.NOT_FOUND, "provider not found for this id");
  }
  const userid = provider.userId;
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0
      },
      parentId: null,
      meal: {
        provider: {
          userId: userid
        }
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const totalReview = ratings.reduce(
    (sum, r) => sum + r._count.rating,
    0
  );
  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0
  );
  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
  return {
    result: {
      ...provider,
      totalReview: totalReview || 0,
      averageRating: Number(averageRating.toFixed(1)) || 0
    }
  };
};
var UpateProviderProfile = async (data, userid) => {
  if (!data) {
    throw new AppError_default(status7.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      provider: true
    }
  });
  if (!providerinfo) {
    throw new AppError_default(status7.NOT_FOUND, "user not found");
  }
  const result = await prisma.providerProfile.update({
    where: { id: providerinfo.provider.id },
    data: {
      restaurantName: data.restaurantName,
      image: data.image,
      description: data.description,
      address: data.address
    }
  });
  return result;
};
var providerService = {
  createProvider,
  getAllProvider,
  getProviderWithMeals,
  UpateProviderProfile
};

// src/modules/provider/provider.controller.ts
import status8 from "http-status";
var createProvider2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await providerService.createProvider(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status8.CREATED,
      success: true,
      message: "your provider profile has been created",
      data: result
    });
  }
);
var gelAllprovider = catchAsync(
  async (req, res) => {
    const result = await providerService.getAllProvider();
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: "retrieve all provider successfully",
      data: result
    });
  }
);
var getProviderWithMeals2 = catchAsync(
  async (req, res) => {
    const result = await providerService.getProviderWithMeals(req.params.id);
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: "retrieve provider with meals successfully",
      data: result
    });
  }
);
var UpateProviderProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await providerService.UpateProviderProfile(req.body, user.id);
  if (!result) {
    sendResponse(res, {
      httpStatusCode: status8.BAD_REQUEST,
      success: false,
      message: "update provider profile failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "update provider profile successfully",
    data: result
  });
});
var providerController = { createProvider: createProvider2, gelAllprovider, getProviderWithMeals: getProviderWithMeals2, UpateProviderProfile: UpateProviderProfile2 };

// src/modules/provider/provider.validation.ts
import z2 from "zod";
var CreateproviderData = z2.object({
  restaurantName: z2.string(),
  address: z2.string(),
  description: z2.string().optional(),
  image: z2.string().optional()
}).strict();
var UpdateproviderData = z2.object({
  restaurantName: z2.string().optional(),
  address: z2.string().optional(),
  description: z2.string().optional(),
  image: z2.string().min(8).optional()
}).strict();

// src/modules/provider/provider.route.ts
var router3 = Router3();
router3.post("/provider/profile", auth_default([UserRoles.Provider]), validateRequest(CreateproviderData), providerController.createProvider);
router3.put("/providers/update", auth_default([UserRoles.Provider]), validateRequest(UpdateproviderData), providerController.UpateProviderProfile);
router3.get("/providers", providerController.gelAllprovider);
router3.get("/providers/:id", providerController.getProviderWithMeals);
var providerRouter = { router: router3 };

// src/modules/order/order.route.ts
import { Router as Router4 } from "express";

// src/modules/order/order.service.ts
import status9 from "http-status";
var CreateOrder = async (payload, customerId) => {
  const mealId = payload.items.find((i) => i.mealId);
  const existingmeals = await prisma.meal.findMany({
    where: {
      id: mealId?.mealId
    }
  });
  const mealdata = existingmeals.find((meal) => meal.id);
  const orderexisting = await prisma.order.findFirst(
    {
      where: {
        customerId,
        orderitem: {
          some: {
            mealId: mealId?.mealId
          }
        }
      }
    }
  );
  if (orderexisting?.status == "PLACED" || orderexisting?.status == "PREPARING" || orderexisting?.status == "READY") {
    throw new AppError_default(status9.BAD_REQUEST, "you already have order for this meal");
  }
  const result = await prisma.order.create({
    data: {
      customerId,
      providerId: mealdata.providerId,
      address: payload.address,
      phone: payload.phone,
      first_name: payload.first_name,
      last_name: payload.last_name,
      orderitem: {
        createMany: {
          data: payload.items.map((item) => ({
            mealId: item.mealId,
            price: mealdata.price,
            quantity: item.quantity
          }))
        }
      },
      totalPrice: mealdata.price * payload.items.reduce((acc, item) => acc + item.quantity, 0) || 0
    },
    include: {
      orderitem: {
        include: {
          meal: {
            select: {
              meals_name: true,
              cuisine: true,
              price: true
            }
          }
        }
      },
      provider: true
    }
  });
  return result;
};
var getOwnmealsOrder = async (userid) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userid },
    include: { provider: true }
  });
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: userid
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result
    };
  }
  if (existingUser?.role == "Provider") {
    const result = await prisma.order.findMany({
      where: {
        providerId: existingUser.provider?.id
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      }
    });
    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result
    };
  }
};
var UpdateOrderStatus = async (id, data, role) => {
  const { status: status16 } = data;
  const statusValue = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
  if (!statusValue.includes(status16)) {
    throw new AppError_default(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError_default(404, "no order found for this id");
  }
  if (existingOrder?.status == status16) {
    throw new AppError_default(409, `order already ${status16}`);
  }
  if (role == "Customer" && status16 !== "CANCELLED") {
    throw new AppError_default(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status16 == "CANCELLED") {
    if (existingOrder?.status == "DELIVERED" || existingOrder?.status == "PREPARING" || existingOrder?.status == "READY") {
      throw new AppError_default(400, `you can't cancel order when order status is ${existingOrder.status}`);
    }
    const result = await prisma.order.update({
      where: {
        id
      },
      data: {
        status: status16
      }
    });
    return result;
  }
  if (role == "Provider" && status16 === "CANCELLED") {
    return "CANCELLED only Customer Change";
  }
  if (role == "Provider") {
    if (status16 == "PLACED" || status16 == "PREPARING" || status16 == "READY" || status16 == "DELIVERED") {
      const result = await prisma.order.update({
        where: {
          id
        },
        data: {
          status: status16
        }
      });
      return {
        success: true,
        message: `update order status successfully`,
        result
      };
    }
  }
};
var getAllorder = async (role) => {
  if (role !== "Admin") {
    return "view all order only Admin";
  }
  const result = await prisma.order.findMany({
    include: {
      orderitem: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var customerOrderStatusTrack = async (mealid, userid) => {
  const existingOrder = await prisma.order.findMany({
    where: {
      customerId: userid,
      orderitem: {
        some: {
          mealId: mealid
        }
      }
    }
  });
  if (existingOrder.length === 0) {
    throw new AppError_default(status9.NOT_FOUND, "no order found for this meal");
  }
  console.log(existingOrder, "data");
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder
  };
};
var CustomerRunningAndOldOrder = async (userid, status16) => {
  const andConditions = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status16;
  if (status16 == "DELIVERED") {
    andConditions.push({ status: status16 });
    message = "Recent order information retrieved successfully.", currentStatus = status16;
  }
  if (status16 == "CANCELLED") {
    andConditions.push({ status: status16 });
    message = "CANCELLED order information retrieved successfully.", currentStatus = status16;
  }
  if (status16 == "PLACED" || status16 == "PREPARING" || status16 == "READY") {
    andConditions.push({ status: status16 });
    message = "running order retrieved successfully.", currentStatus = status16;
  }
  const result = await prisma.order.findMany({
    where: {
      customerId: userid,
      AND: andConditions
    },
    include: {
      orderitem: { orderBy: { createdAt: "desc" } }
    }
  });
  return {
    success: true,
    message,
    result
  };
};
var getSingleOrder = async (id) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderitem: {
        select: {
          meal: true,
          orderId: true,
          price: true,
          quantity: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status9.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result
  };
};
var ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder
};

// src/modules/order/order.controller.ts
import status10 from "http-status";
var createOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status10.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status10.CREATED,
      success: true,
      message: "your order has been created successfully",
      data: result
    });
  }
);
var getOwnmealsOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status10.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ServiceOrder.getOwnmealsOrder(user.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: result?.success,
    message: result?.message,
    data: result?.result
  });
});
var UpdateOrderStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status10.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.UpdateOrderStatus(req.params.id, req.body, user.role);
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: "update order status successfully",
      data: result
    });
  }
);
var getAllOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status10.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.getAllorder(user.role);
    if (!result) {
      sendResponse(res, {
        httpStatusCode: status10.BAD_REQUEST,
        success: false,
        message: "retrieve all orders failed",
        data: result
      });
    }
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: "retrieve all orders successfully",
      data: result
    });
  }
);
var customerOrderStatusTrack2 = catchAsync(
  async (req, res) => {
    const users = req.user;
    if (!users) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.customerOrderStatusTrack(req.params.id, users.id);
    if (!result?.success) {
      sendResponse(res, {
        httpStatusCode: status10.BAD_REQUEST,
        success: false,
        message: result?.message,
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: "customer order status track successfully",
      data: result?.result
    });
  }
);
var CustomerRunningAndOldOrder2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status10.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id, req.query.status);
    if (!result.success) {
      sendResponse(res, {
        httpStatusCode: status10.BAD_REQUEST,
        success: false,
        message: "customer order status track failed",
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: result.message,
      data: result?.result
    });
  }
);
var getSingleOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ServiceOrder.getSingleOrder(req.params.id);
  if (!result.success) {
    sendResponse(res, {
      httpStatusCode: status10.BAD_REQUEST,
      success: false,
      message: "retrieve single order failed",
      data: result?.result
    });
  }
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "retrieve single order successfully",
    data: result?.result
  });
});
var OrderController = {
  createOrder,
  getOwnmealsOrder: getOwnmealsOrder2,
  UpdateOrderStatus: UpdateOrderStatus2,
  getAllOrder,
  customerOrderStatusTrack: customerOrderStatusTrack2,
  CustomerRunningAndOldOrder: CustomerRunningAndOldOrder2,
  getSingleOrder: getSingleOrder2
};

// src/modules/order/order.validation.ts
import z3 from "zod";
var CreateorderData = z3.object({
  first_name: z3.string().optional(),
  last_name: z3.string().optional(),
  phone: z3.string().min(11).max(14),
  address: z3.string().min(1),
  items: z3.array(
    z3.object({
      mealId: z3.string(),
      quantity: z3.number().min(1)
    })
  ).min(1)
});

// src/modules/order/order.route.ts
var router4 = Router4();
router4.post("/orders", auth_default([UserRoles.Customer]), validateRequest(CreateorderData), OrderController.createOrder);
router4.get("/orders/meal/:id/status", auth_default([UserRoles.Customer]), OrderController.customerOrderStatusTrack);
router4.get("/myorders/status", auth_default([UserRoles.Customer]), OrderController.CustomerRunningAndOldOrder);
router4.get("/orders/all", auth_default([UserRoles.Admin]), OrderController.getAllOrder);
router4.get("/orders", auth_default([UserRoles.Customer, UserRoles.Provider]), OrderController.getOwnmealsOrder);
router4.patch("/provider/orders/:id", auth_default([UserRoles.Provider, UserRoles.Customer]), OrderController.UpdateOrderStatus);
router4.get("/orders/:id", auth_default([UserRoles.Customer]), OrderController.getSingleOrder);
var OrderRouter = { router: router4 };

// src/modules/category/category.route.ts
import { Router as Router5 } from "express";

// src/modules/category/category.service.ts
var CreateCategory = async (data, adminId) => {
  const categorydata = await prisma.category.findUnique({
    where: {
      name: data.name
    }
  });
  if (categorydata) {
    throw new AppError_default(409, "Category already exists");
  }
  await prisma.user.findUniqueOrThrow({
    where: { id: adminId }
  });
  const result = await prisma.category.create({
    data: {
      ...data,
      adminId
    }
  });
  return result;
};
var getCategory = async () => {
  const result = await prisma.category.findMany({
    include: {
      meals: {
        where: {
          status: "APPROVED"
        }
      },
      user: true
    },
    orderBy: { name: "desc" }
  });
  return result;
};
var SingleCategory = async (id) => {
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: {
      meals: {
        include: {
          reviews: true
        }
      },
      user: true
    }
  });
  return result;
};
var UpdateCategory = async (id, data) => {
  const { name } = data;
  const existcategory = await prisma.category.findUniqueOrThrow({
    where: { id }
  });
  if (existcategory.name == name) {
    throw new AppError_default(409, "Category name is already up to date.");
  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return result;
};
var DeleteCategory = async (id) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
};
var categoryService = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory
};

// src/modules/category/category.controller.ts
import { status as status11 } from "http-status";
var CreateCategory2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await categoryService.CreateCategory(
      req.body,
      user.id
    );
    sendResponse(res, {
      httpStatusCode: status11.CREATED,
      success: true,
      message: "your category has been created",
      data: result
    });
  }
);
var getCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.getCategory();
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "retrieve category successfully",
    data: result
  });
});
var SingleCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.SingleCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "retrieve single category successfully",
    data: result
  });
});
var UpdateCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.UpdateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "your category has beed changed",
    data: result
  });
});
var DeleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.DeleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "your category has beed deleted",
    data: result
  });
});
var CategoryController = {
  CreateCategory: CreateCategory2,
  getCategory: getCategory2,
  UpdateCategory: UpdateCategory2,
  DeleteCategory: DeleteCategory2,
  SingleCategory: SingleCategory2
};

// src/modules/category/category.validation.ts
import z4 from "zod";
var createcategoryData = z4.object({
  name: z4.string(),
  image: z4.string()
}).strict();
var UpdatecategoryData = z4.object({
  name: z4.string().optional(),
  image: z4.string().optional()
}).strict();

// src/modules/category/category.route.ts
var router5 = Router5();
router5.post("/admin/category", auth_default([UserRoles.Admin]), validateRequest(createcategoryData), CategoryController.CreateCategory);
router5.get("/category", CategoryController.getCategory);
router5.get("/category/:id", CategoryController.SingleCategory);
router5.put("/admin/category/:id", auth_default([UserRoles.Admin]), validateRequest(UpdatecategoryData), CategoryController.UpdateCategory);
router5.delete("/admin/category/:id", auth_default([UserRoles.Admin]), CategoryController.DeleteCategory);
var CategoryRouter = { router: router5 };

// src/modules/user/user.route.ts
import { Router as Router6 } from "express";

// src/modules/user/user.service.ts
import status12 from "http-status";
var GetAllUsers = async (data) => {
  const andCondition = [];
  if (typeof data.data?.email == "string") {
    andCondition.push({
      email: data.data?.email
    });
  }
  if (typeof data.data?.phone == "string") {
    andCondition.push({
      email: data.data?.phone
    });
  }
  if (typeof data.data?.emailVerified == "boolean") {
    andCondition.push({ emailVerified: data.data?.emailVerified });
  }
  if (typeof data.data?.role == "string") {
    andCondition.push({ role: data.data?.role });
  }
  if (typeof data.data?.status == "string") {
    andCondition.push({ status: data.data?.status });
  }
  if (typeof data.isactivequery == "boolean") {
    andCondition.push({ isActive: data.isactivequery });
  }
  const result = await prisma.user.findMany({
    take: data.limit,
    skip: data.skip,
    where: {
      AND: andCondition
    },
    include: {
      provider: true
    },
    orderBy: {
      [data.sortBy]: data.sortOrder
    }
  });
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition
    }
  });
  return {
    data: result,
    pagination: {
      totalusers,
      page: data.page,
      limit: data.limit,
      totalpage: Math.ceil(totalusers / data.limit) || 1
    }
  };
};
var getUserprofile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "user not found for this id");
  }
  if (user.role !== "Provider") {
    return user;
  }
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      userId: id
    },
    include: {
      user: {
        include: {
          reviews: {
            where: {
              rating: {
                gt: 0
              },
              parentId: null
            }
          }
        }
      }
    }
  });
  const totalReview = providerProfile?.user.reviews.length;
  const averageRating = totalReview ? providerProfile.user.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReview : 0;
  return {
    ...user,
    providerProfile,
    totalReview: totalReview || 0,
    averageRating: Number(averageRating.toFixed(1)) || 0
  };
};
var UpateUserProfile = async (data, userid) => {
  if (!data) {
    throw new AppError_default(400, "your data isn't found,please provide a information");
  }
  const userinfo = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      accounts: true
    }
  });
  if (!userinfo) {
    throw new AppError_default(404, "user data not found");
  }
  const isCustomer = userinfo.role == "Customer";
  const result = await prisma.user.update({
    where: { id: userid },
    data: {
      name: data.name,
      image: data.image,
      bgimage: data.bgimage,
      phone: data.phone,
      isActive: data.isActive,
      ...isCustomer ? {} : { email: data.email },
      accounts: {
        updateMany: {
          where: { userId: userid },
          data: {
            password: data.password
          }
        }
      }
    }
  });
  return result;
};
var UpdateUser = async (id, data) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  if (userData.role == data.role) {
    throw new AppError_default(409, `your status(${data.role}) already up to date`);
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: data.role,
      status: data.status,
      email: data.email
    }
  });
  return result;
};
var DeleteUserProfile = async (id) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  const result = await prisma.user.delete({
    where: { id }
  });
  return result;
};
var OwnProfileDelete = async (userid) => {
  console.log(userid);
  const userData = await prisma.user.findUnique({
    where: { id: userid }
  });
  if (!userData) {
    throw new AppError_default(404, "your user data not found");
  }
  const result = await prisma.user.delete({
    where: { id: userid }
  });
  return result;
};
var UserService = {
  GetAllUsers,
  UpdateUser,
  getUserprofile,
  UpateUserProfile,
  DeleteUserProfile,
  OwnProfileDelete
};

// src/modules/user/user.controller.ts
import status13 from "http-status";
var GetAllUsers2 = catchAsync(async (req, res) => {
  const search = req.query;
  const { isActive } = req.query;
  const isactivequery = isActive ? req.params.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await UserService.GetAllUsers({
    data: search,
    isactivequery,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  });
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result
  });
});
var getUserprofile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status13.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.getUserprofile(req.params.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: user.role !== "Provider" ? "your user profile has been retrieved successfully" : "your user profile has been retrieved successfully",
    data: result
  });
});
var UpateUserProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.UpateUserProfile(
    req.body,
    user.id
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "your profile has been updated successfully",
    data: result
  });
});
var UpdateUser2 = catchAsync(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.UpdateUser(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: `user change successfully`,
      data: result
    });
  }
);
var DeleteUserProfile2 = catchAsync(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.DeleteUserProfile(req.params.id);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "user account delete successfully",
      data: result
    });
  }
);
var OwnProfileDelete2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.OwnProfileDelete(user.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "user own account delete successfully",
    data: result
  });
});
var UserController = {
  GetAllUsers: GetAllUsers2,
  UpdateUser: UpdateUser2,
  getUserprofile: getUserprofile2,
  UpateUserProfile: UpateUserProfile2,
  DeleteUserProfile: DeleteUserProfile2,
  OwnProfileDelete: OwnProfileDelete2
};

// src/modules/user/user.validation.ts
import z5 from "zod";
var UpdateuserProfileData = z5.object({
  name: z5.string().optional(),
  image: z5.string().optional(),
  bgimage: z5.string().optional(),
  email: z5.string().optional(),
  password: z5.string().min(8).optional(),
  phone: z5.string().min(10).max(15).optional(),
  isActive: z5.boolean().optional()
}).strict();
var UpdataroleData = z5.object({
  role: z5.enum(["Admin", "Customer", "Provider"]).optional(),
  status: z5.enum(["activate", "suspend"]).optional(),
  email: z5.string().optional()
}).strict();

// src/modules/user/user.route.ts
var router6 = Router6();
router6.get("/admin/users", auth_default([UserRoles.Admin]), UserController.GetAllUsers);
router6.put("/user/profile/update", auth_default([UserRoles.Customer, UserRoles.Provider, UserRoles.Admin]), validateRequest(UpdateuserProfileData), UserController.UpateUserProfile);
router6.get("/user/profile/:id", auth_default([UserRoles.Customer, UserRoles.Admin, UserRoles.Provider]), UserController.getUserprofile);
router6.put("/admin/profile/:id", auth_default([UserRoles.Admin]), validateRequest(UpdataroleData), UserController.UpdateUser);
router6.delete("/user/profile/own", auth_default([UserRoles.Provider, UserRoles.Customer, UserRoles.Admin]), UserController.OwnProfileDelete);
router6.delete("/user/profile/:id", auth_default([UserRoles.Admin]), UserController.DeleteUserProfile);
var UserRouter = { router: router6 };

// src/modules/reviews/reviews.route.ts
import { Router as Router7 } from "express";

// src/modules/reviews/reviews.service.ts
var CreateReviews = async (customerid, mealid, data) => {
  const existingmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (!existingmeal) {
    throw new AppError_default(404, "meal not found for this id");
  }
  const orderMeal = await prisma.orderitem.findFirst({
    where: {
      mealId: mealid,
      order: {
        customerId: customerid
      }
    }
  });
  if (!orderMeal) {
    throw new AppError_default(404, "you can not review for this meal without order");
  }
  if (data.rating >= 6) {
    throw new AppError_default(400, "rating must be between 1 and 5");
  }
  const result = await prisma.review.create({
    data: {
      customerId: customerid,
      mealId: mealid,
      ...data
    }
  });
  return result;
};
var updateReview = async (reviewId, data, authorId) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      customerId: authorId
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "review not found");
  }
  const result = await prisma.review.update({
    where: {
      id: reviewId,
      customerId: authorId
    },
    data: {
      ...data
    }
  });
  return {
    success: true,
    message: `your review update successfully`,
    result
  };
};
var deleteReview = async (reviewid, authorid) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewid,
      customerId: authorid
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "review not found for this id");
  }
  const result = await prisma.review.delete({
    where: {
      id: review.id
    }
  });
  return result;
};
var getReviewByid = async (reviewid) => {
  const result = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    include: {
      meal: true
    }
  });
  if (!result) {
    throw new AppError_default(404, "review not found");
  }
  return result;
};
var moderateReview = async (id, data) => {
  const { status: status16 } = data;
  const reviewData = await prisma.review.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!reviewData) {
    throw new AppError_default(404, "review data not found by id");
  }
  if (reviewData.status === data.status) {
    throw new AppError_default(409, `Your provided status (${data.status}) is already up to date.`);
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: status16
    }
  });
  return result;
};
var getAllreviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      customer: true,
      meal: true,
      replies: true
    }
  });
  return result;
};
var ReviewsService = { CreateReviews, updateReview, deleteReview, getReviewByid, moderateReview, getAllreviews };

// src/modules/reviews/reviews.controller.ts
import status14 from "http-status";
var CreateReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsService.CreateReviews(user.id, req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status14.CREATED,
    success: true,
    message: "your review has been created successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const { reviewid } = req.params;
  const result = await ReviewsService.updateReview(reviewid, req.body, user?.id);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "review update successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const { reviewid } = req.params;
    const result = await ReviewsService.deleteReview(reviewid, user?.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "review delete successfully",
      data: result
    });
  }
);
var moderateReview2 = catchAsync(async (req, res) => {
  const { reviewid } = req.params;
  const result = await ReviewsService.moderateReview(reviewid, req.body);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "review moderate successfully",
    data: result
  });
});
var getReviewByid2 = catchAsync(
  async (req, res) => {
    const { reviewid } = req.params;
    const result = await ReviewsService.getReviewByid(reviewid);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve review by id successfully",
      data: result
    });
  }
);
var getAllreviews2 = catchAsync(
  async (req, res) => {
    const result = await ReviewsService.getAllreviews();
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve all reviews successfully",
      data: result
    });
  }
);
var ReviewsController = { CreateReviews: CreateReviews2, updateReview: updateReview2, deleteReview: deleteReview2, getReviewByid: getReviewByid2, moderateReview: moderateReview2, getAllreviews: getAllreviews2 };

// src/modules/reviews/reviews.validation.ts
import z6 from "zod";
var createReviewsData = z6.object({
  rating: z6.number().min(1).max(5),
  comment: z6.string(),
  parentId: z6.string().optional()
});
var updateReviewsData = z6.object({
  rating: z6.number().min(1).max(5).optional(),
  comment: z6.string().optional()
});
var moderateData = z6.object({
  status: z6.enum(["APPROVED", "REJECTED"])
});

// src/modules/reviews/reviews.route.ts
var router7 = Router7();
router7.post("/meal/:id/reviews", auth_default([UserRoles.Customer]), validateRequest(createReviewsData), ReviewsController.CreateReviews);
router7.put("/review/:reviewid", auth_default([UserRoles.Customer]), validateRequest(updateReviewsData), ReviewsController.updateReview);
router7.delete("/review/:reviewid", auth_default([UserRoles.Customer, UserRoles.Admin]), ReviewsController.deleteReview);
router7.get("/reviews", ReviewsController.getAllreviews);
router7.get("/review/:reviewid", ReviewsController.getReviewByid);
router7.patch("/review/:reviewid/moderate", auth_default([UserRoles.Admin]), validateRequest(moderateData), ReviewsController.moderateReview);
var ReviewsRouter = { router: router7 };

// src/modules/stats/stats.route.ts
import { Router as Router8 } from "express";

// src/modules/stats/stats.service.ts
var getuserStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalUsers, totalSuspendUser, totalActivateUser, totalAdmin, totalCustomer, totalprovider, todaystats, oneMonthago, totalemailvarified, totalactiveusers, totalunactiveuser] = await Promise.all([
      await tx.user.count(),
      await tx.user.count({ where: { status: "suspend" } }),
      await tx.user.count({ where: { status: "activate" } }),
      await tx.user.count({ where: { role: "Admin" } }),
      await tx.user.count({ where: { role: "Customer" } }),
      await tx.user.count({ where: { role: "Provider" } }),
      await tx.user.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.user.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.user.count({ where: { emailVerified: false } }),
      await tx.user.count({ where: { isActive: true } }),
      await tx.user.count({ where: { isActive: false } })
    ]);
    return {
      totalUsers,
      totalSuspendUser,
      totalActivateUser,
      totalAdmin,
      totalCustomer,
      totalprovider,
      todaystats,
      oneMonthago,
      totalemailvarified,
      totalactiveusers,
      totalunactiveuser
    };
  });
};
var getmealsStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const [totalmeals, totalavailabemeals, totalunavailabemeals, totalapprovedmeals, totalpendingmeals, totalrejectedmeals] = await Promise.all([
      await tx.meal.count(),
      await tx.meal.count({ where: { isAvailable: true } }),
      await tx.meal.count({ where: { isAvailable: false } }),
      await tx.meal.count({ where: { status: "APPROVED" } }),
      await tx.meal.count({ where: { status: "PENDING" } }),
      await tx.meal.count({ where: { status: "REJECTED" } })
    ]);
    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals,
      totalapprovedmeals,
      totalpendingmeals,
      totalrejectedmeals
    };
  });
};
var getordersStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalorders, oneMonth, totalcancelledmeals, totalplacedmeals, totalpreparingmeals, totalreadymeals, totaldeliveredmeals, allearn, totalquantity, todayorders] = await Promise.all([
      await tx.order.count(),
      await tx.order.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.count({ where: { status: "CANCELLED" } }),
      await tx.order.count({ where: { status: "PLACED" } }),
      await tx.order.count({ where: { status: "PREPARING" } }),
      await tx.order.count({ where: { status: "READY" } }),
      await tx.order.count({ where: { status: "DELIVERED" } }),
      await tx.order.aggregate({ _sum: { totalPrice: true } }),
      await tx.orderitem.aggregate({ _sum: { quantity: true } }),
      await tx.order.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } })
    ]);
    return {
      totalorders,
      oneMonth,
      totalcancelledmeals,
      totalplacedmeals,
      totalpreparingmeals,
      totalreadymeals,
      totaldeliveredmeals,
      allearn,
      totalquantity,
      todayorders
    };
  });
};
var getrevenueStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] = await Promise.all([
      await tx.order.aggregate({ _sum: { totalPrice: true } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.aggregate({ _avg: { totalPrice: true } }),
      await tx.order.groupBy({ by: ["providerId"], orderBy: { _sum: { totalPrice: "desc" } }, take: 5 })
    ]);
    return {
      totalrevenue,
      todaysRevenue,
      monthlyRevenue,
      avgrevenue,
      topProvidersrevenue
    };
  });
};
var getreviewStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalreviews, todayreviews, topRatedMeals] = await Promise.all([
      await tx.review.count(),
      await tx.review.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.review.groupBy({ by: ["mealId"], _avg: { rating: true }, orderBy: { _avg: { rating: "desc" } }, take: 4 })
    ]);
    return {
      totalreviews,
      todayreviews,
      topRatedMeals
    };
  });
};
var getcategoryStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const [totalcategory, totalcategory_name, mealsPerCategory] = await Promise.all([
      await tx.category.count(),
      await tx.category.findMany({ select: { name: true } }),
      await tx.meal.groupBy({
        by: ["category_name"],
        _count: {
          _all: true
        }
      })
    ]);
    return {
      totalcategory,
      totalcategory_name,
      mealsPerCategory
    };
  });
};
var getrevenueProviderStats = async (userid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userid
    },
    include: {
      provider: {
        select: {
          id: true
        }
      }
    }
  });
  console.log(userid);
  if (existuser.id !== userid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] = await Promise.all([
      await tx.order.aggregate({ where: { providerId: existuser.provider.id }, _sum: { totalPrice: true } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { providerId: existuser.provider.id, createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { providerId: existuser.provider.id, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.aggregate({ where: { providerId: existuser.provider.id }, _avg: { totalPrice: true } }),
      await tx.order.groupBy({ where: { providerId: existuser.provider.id }, by: ["providerId"], orderBy: { _sum: { totalPrice: "desc" } }, take: 5 })
    ]);
    return {
      totalrevenue,
      todaysRevenue,
      monthlyRevenue,
      avgrevenue,
      topProvidersrevenue
    };
  });
};
var getProvidermealsStats = async (userid) => {
  console.log("get melass");
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userid
    },
    include: {
      provider: {
        select: {
          id: true
        }
      }
    }
  });
  if (existuser.id !== userid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const [totalmeals, totalavailabemeals, totalunavailabemeals] = await Promise.all([
      await tx.meal.count({ where: { providerId: existuser.provider.id } }),
      await tx.meal.count({ where: { providerId: existuser.provider.id, isAvailable: true } }),
      await tx.meal.count({ where: { providerId: existuser.provider.id, isAvailable: false } })
      // await tx.meal.count({ where: { providerId:existuser.provider!.id,status: 'APPROVED' } }),
      // await tx.meal.count({ where: { providerId:existuser.provider!.id,status: 'PENDING' } }),
      // await tx.meal.count({ where: {providerId:existuser.provider!.id, status: 'REJECTED' } }),
    ]);
    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals
      // totalapprovedmeals,
      // totalpendingmeals,
      // totalrejectedmeals
    };
  });
};
var getProviderordersStats = async (userid) => {
  const todayOrdersData = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
        lte: new Date((/* @__PURE__ */ new Date()).setHours(23, 59, 59, 999))
      }
    }
  });
  console.log("TODAY DATA:", todayOrdersData);
  console.log("TODAY LENGTH:", todayOrdersData.length);
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userid
    },
    include: {
      provider: {
        select: {
          id: true
        }
      }
    }
  });
  const orderid = await prisma.order.findFirstOrThrow({ where: { providerId: existuser.provider.id } });
  if (existuser.id !== userid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalorders, oneMonth, totalcancelledmeals, totalplacedmeals, totalpreparingmeals, totalreadymeals, totaldeliveredmeals, allearn, totalquantity, todayorders] = await Promise.all([
      await tx.order.count({ where: { providerId: existuser.provider.id } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "CANCELLED" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "PLACED" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "PREPARING" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "READY" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "DELIVERED" } }),
      await tx.order.aggregate({ where: { providerId: existuser.provider.id }, _sum: { totalPrice: true } }),
      await tx.orderitem.aggregate({ where: { order: {
        providerId: existuser.provider.id
      } }, _sum: { quantity: true } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, createdAt: { gte: startOfToday, lte: endOfToday } } })
    ]);
    return {
      totalorders,
      oneMonth,
      totalcancelledmeals,
      totalplacedmeals,
      totalpreparingmeals,
      totalreadymeals,
      totaldeliveredmeals,
      allearn,
      totalquantity,
      todayorders
    };
  });
};
var StatsService = {
  getuserStats,
  getmealsStats,
  getordersStats,
  getrevenueStats,
  getreviewStats,
  getcategoryStats,
  getrevenueProviderStats,
  getProvidermealsStats,
  getProviderordersStats
};

// src/modules/stats/stats.controller.ts
import status15 from "http-status";
var getuserStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status15.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getuserStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve user stats successfully",
      data: result
    });
  }
);
var getmealsStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getmealsStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve meals stats successfully",
      data: result
    });
  }
);
var getordersStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getordersStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve orders stats successfully",
      data: result
    });
  }
);
var getrevenueStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getrevenueStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve revenue stats successfully",
      data: result
    });
  }
);
var getreviewStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getcategoryStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve review stats successfully",
      data: result
    });
  }
);
var getcategoryStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getrevenueStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve category stats successfully",
      data: result
    });
  }
);
var getrevenueProviderStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getrevenueProviderStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve revenue provider stats successfully",
      data: result
    });
  }
);
var getProvidermealsStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getProvidermealsStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve provider meals stats successfully",
      data: result
    });
  }
);
var getProviderordersStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getProviderordersStats(user.id);
    sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "retrieve provider order stats successfully",
      data: result
    });
  }
);
var StatsController = {
  getuserStats: getuserStats2,
  getmealsStats: getmealsStats2,
  getordersStats: getordersStats2,
  getrevenueStats: getrevenueStats2,
  getreviewStats: getreviewStats2,
  getcategoryStats: getcategoryStats2,
  getrevenueProviderStats: getrevenueProviderStats2,
  getProvidermealsStats: getProvidermealsStats2,
  getProviderordersStats: getProviderordersStats2
};

// src/modules/stats/stats.route.ts
var router8 = Router8();
router8.get("/admin/users/stats", auth_default([UserRoles.Admin]), StatsController.getuserStats);
router8.get("/admin/meals/stats", auth_default([UserRoles.Admin]), StatsController.getmealsStats);
router8.get("/admin/orders/stats", auth_default([UserRoles.Admin]), StatsController.getordersStats);
router8.get("/admin/revenue/stats", auth_default([UserRoles.Admin]), StatsController.getrevenueStats);
router8.get("/admin/reviews/stats", auth_default([UserRoles.Admin]), StatsController.getreviewStats);
router8.get("/admin/category/stats", auth_default([UserRoles.Admin]), StatsController.getcategoryStats);
router8.get("/provider/revenue/stats", auth_default([UserRoles.Provider]), StatsController.getrevenueProviderStats);
router8.get("/provider/meals/stats", auth_default([UserRoles.Provider]), StatsController.getProvidermealsStats);
router8.get("/provider/orders/stats", auth_default([UserRoles.Provider]), StatsController.getProviderordersStats);
var StatsRouter = { router: router8 };

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
var app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use("/api", mealRouter.router);
app.use("/api", providerRouter.router);
app.use("/api", OrderRouter.router);
app.use("/api", CategoryRouter.router);
app.use("/api", UserRouter.router);
app.use("/api", ReviewsRouter.router);
app.use("/api", StatsRouter.router);
app.use("/api/auth", authRouter.router);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(globalErrorHandeller_default);
app.use(Notfound);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 4e3;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("connected to databaes successfully");
    app_default.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
};
main();
