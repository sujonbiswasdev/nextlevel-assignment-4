var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String           @id\n  name          String\n  email         String           @unique\n  emailVerified Boolean          @default(false)\n  image         String?\n  bgimage       String?          @default("https://images.pexels.com/photos/8250184/pexels-photo-8250184.jpeg")\n  phone         String?          @db.VarChar(15)\n  role          Role             @default(Customer)\n  status        Status           @default(activate)\n  isActive      Boolean          @default(true)\n  createdAt     DateTime         @default(now())\n  updatedAt     DateTime         @updatedAt\n  accounts      Account[]\n  category      Category[]\n  payments      Payment[]\n  orders        Order[]\n  provider      ProviderProfile?\n  reviews       Review[]\n  sessions      Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  Customer\n  Provider\n  Admin\n}\n\nenum Status {\n  activate\n  suspend\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  adminId   String\n  name      String   @unique @db.VarChar(150)\n  image     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  user      User     @relation(fields: [adminId], references: [id], onDelete: Cascade)\n  meals     Meal[]\n\n  @@map("categories")\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n  FREE\n}\n\nmodel Meal {\n  id                String            @id @default(uuid())\n  meals_name        String            @db.VarChar(100)\n  description       String?\n  image             String?\n  price             Int\n  isAvailable       Boolean           @default(true)\n  dietaryPreference DietaryPreference @default(HALAL)\n  providerId        String\n  category_name     String\n  deliverycharge    Int\n  cuisine           Cuisine           @default(BANGLEDESHI)\n  status            MealsStatus       @default(APPROVED)\n  createdAt         DateTime          @default(now())\n  updatedAt         DateTime          @updatedAt\n  category          Category          @relation(fields: [category_name], references: [name], onDelete: Cascade)\n  provider          ProviderProfile   @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem         Orderitem[]\n  reviews           Review[]\n  payment           Payment[]\n\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  HALAL\n  VEGAN\n  VEGETARIAN\n  ANY\n  GLUTEN_FREE\n  KETO\n  PALEO\n  DAIRY_FREE\n  NUT_FREE\n  LOW_SUGAR\n}\n\nenum Cuisine {\n  BANGLEDESHI\n  ITALIAN\n  CHINESE\n  INDIAN\n  MEXICAN\n  THAI\n  JAPANESE\n  FRENCH\n  MEDITERRANEAN\n  AMERICAN\n  MIDDLE_EASTERN\n}\n\nenum MealsStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nmodel Order {\n  id            String          @id @default(uuid())\n  customerId    String\n  providerId    String\n  first_name    String?\n  last_name     String?\n  status        OrderStatus     @default(PLACED)\n  totalPrice    Int\n  phone         String?\n  address       String\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        @updatedAt\n  customer      User            @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider      ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem     Orderitem[]\n  payment       Payment?\n  paymentStatus PaymentStatus   @default(UNPAID)\n\n  @@map("order")\n}\n\nmodel Orderitem {\n  id        String   @id @default(uuid())\n  orderId   String\n  price     Float\n  quantity  Int\n  mealId    String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@map("orderitem")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  userId             String\n  mealId             String\n  stripeEventId      String? @unique\n  transactionId      String? @unique @db.Uuid()\n  paymentGatewayData Json?\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  amount  Float\n  status  PaymentStatus @default(UNPAID)\n  orderId String        @unique\n  order   Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String   @unique @db.VarChar(100)\n  address        String   @db.VarChar(200)\n  description    String?\n  image          String?  @db.VarChar(100)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n  meals          Meal[]\n  orders         Order[]\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("providerprofile")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  customerId String\n  mealId     String\n  parentId   String?\n  rating     Int\n  status     ReviewStatus @default(APPROVED)\n  comment    String\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  customer   User         @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  meal       Meal         @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  parent     Review?      @relation("reviewsReply", fields: [parentId], references: [id], onDelete: Cascade)\n  replies    Review[]     @relation("reviewsReply")\n\n  @@map("review")\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"meals_name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"dietaryPreference","kind":"enum","type":"DietaryPreference"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"deliverycharge","kind":"scalar","type":"Int"},{"name":"cuisine","kind":"enum","type":"Cuisine"},{"name":"status","kind":"enum","type":"MealsStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"MealToOrderitem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"MealToPayment"}],"dbName":"meal"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"first_name","kind":"scalar","type":"String"},{"name":"last_name","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"OrderToOrderitem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"}],"dbName":"order"},"Orderitem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderitem"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderitem"}],"dbName":"orderitem"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"}],"dbName":"providerprofile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"}],"dbName":"review"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","accounts","category","meals","customer","provider","meal","order","orderitem","payment","_count","orders","parent","replies","reviews","payments","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","Orderitem.findUnique","Orderitem.findUniqueOrThrow","Orderitem.findFirst","Orderitem.findFirstOrThrow","Orderitem.findMany","Orderitem.createOne","Orderitem.createMany","Orderitem.createManyAndReturn","Orderitem.updateOne","Orderitem.updateMany","Orderitem.updateManyAndReturn","Orderitem.upsertOne","Orderitem.deleteOne","Orderitem.deleteMany","Orderitem.groupBy","Orderitem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","customerId","mealId","parentId","rating","ReviewStatus","status","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","restaurantName","address","description","image","every","some","none","stripeEventId","transactionId","paymentGatewayData","amount","PaymentStatus","orderId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","price","quantity","providerId","first_name","last_name","OrderStatus","totalPrice","phone","paymentStatus","meals_name","isAvailable","DietaryPreference","dietaryPreference","category_name","deliverycharge","Cuisine","cuisine","MealsStatus","adminId","name","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","bgimage","Role","role","Status","isActive","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "pgZpsAEWBAAA_gIAIAUAAP8CACAIAACBAwAgDgAAzQIAIBEAAIIDACASAACAAwAgEwAAgwMAIMwBAAD6AgAwzQEAADwAEM4BAAD6AgAwzwEBAAAAAdUBAAD9AqACItcBQADLAgAh2AFAAMsCACHoAQEAygIAIf8BAQDKAgAhiwIBAMkCACGaAgEAAAABmwIgAPsCACGcAgEAygIAIZ4CAAD8Ap4CIqACIAD7AgAhAQAAAAEAIBEDAADOAgAgzAEAAJ0DADDNAQAAAwAQzgEAAJ0DADDPAQEAyQIAIdcBQADLAgAh2AFAAMsCACHkAQEAyQIAIfoBAQDJAgAhjwIBAMkCACGQAgEAygIAIZECAQDKAgAhkgIBAMoCACGTAkAAngMAIZQCQACeAwAhlQIBAMoCACGWAgEAygIAIQgDAACvBAAgkAIAAJ8DACCRAgAAnwMAIJICAACfAwAgkwIAAJ8DACCUAgAAnwMAIJUCAACfAwAglgIAAJ8DACARAwAAzgIAIMwBAACdAwAwzQEAAAMAEM4BAACdAwAwzwEBAAAAAdcBQADLAgAh2AFAAMsCACHkAQEAyQIAIfoBAQDJAgAhjwIBAMkCACGQAgEAygIAIZECAQDKAgAhkgIBAMoCACGTAkAAngMAIZQCQACeAwAhlQIBAMoCACGWAgEAygIAIQMAAAADACABAAAEADACAAAFACALAwAAzgIAIAYAAMwCACDMAQAAnAMAMM0BAAAHABDOAQAAnAMAMM8BAQDJAgAh1wFAAMsCACHYAUAAywIAIegBAQDJAgAhigIBAMkCACGLAgEAyQIAIQIDAACvBAAgBgAArQQAIAsDAADOAgAgBgAAzAIAIMwBAACcAwAwzQEAAAcAEM4BAACcAwAwzwEBAAAAAdcBQADLAgAh2AFAAMsCACHoAQEAyQIAIYoCAQDJAgAhiwIBAAAAAQMAAAAHACABAAAIADACAAAJACAWBQAAmwMAIAgAAJQDACALAACVAwAgDAAAgAMAIBEAAIIDACDMAQAAlwMAMM0BAAALABDOAQAAlwMAMM8BAQDJAgAh1QEAAJoDigIi1wFAAMsCACHYAUAAywIAIecBAQDKAgAh6AEBAMoCACH4AQIAjAMAIfoBAQDJAgAhgQIBAMkCACGCAiAA-wIAIYQCAACYA4QCIoUCAQDJAgAhhgICAIwDACGIAgAAmQOIAiIHBQAAyAUAIAgAAMAFACALAADGBQAgDAAAvwUAIBEAAMEFACDnAQAAnwMAIOgBAACfAwAgFgUAAJsDACAIAACUAwAgCwAAlQMAIAwAAIADACARAACCAwAgzAEAAJcDADDNAQAACwAQzgEAAJcDADDPAQEAAAAB1QEAAJoDigIi1wFAAMsCACHYAUAAywIAIecBAQDKAgAh6AEBAMoCACH4AQIAjAMAIfoBAQDJAgAhgQIBAMkCACGCAiAA-wIAIYQCAACYA4QCIoUCAQDJAgAhhgICAIwDACGIAgAAmQOIAiIDAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIBMHAADOAgAgCAAAlAMAIAsAAJUDACAMAACWAwAgzAEAAJIDADDNAQAAEAAQzgEAAJIDADDPAQEAyQIAIdABAQDJAgAh1QEAAJMD_gEi1wFAAMsCACHYAUAAywIAIeYBAQDJAgAh-gEBAMkCACH7AQEAygIAIfwBAQDKAgAh_gECAIwDACH_AQEAygIAIYACAACIA_EBIgcHAACvBAAgCAAAwAUAIAsAAMYFACAMAADHBQAg-wEAAJ8DACD8AQAAnwMAIP8BAACfAwAgEwcAAM4CACAIAACUAwAgCwAAlQMAIAwAAJYDACDMAQAAkgMAMM0BAAAQABDOAQAAkgMAMM8BAQAAAAHQAQEAyQIAIdUBAACTA_4BItcBQADLAgAh2AFAAMsCACHmAQEAyQIAIfoBAQDJAgAh-wEBAMoCACH8AQEAygIAIf4BAgCMAwAh_wEBAMoCACGAAgAAiAPxASIDAAAAEAAgAQAAEQAwAgAAEgAgDAkAAIkDACAKAACKAwAgzAEAAJEDADDNAQAAFAAQzgEAAJEDADDPAQEAyQIAIdEBAQDJAgAh1wFAAMsCACHYAUAAywIAIfEBAQDJAgAh-AEIAIcDACH5AQIAjAMAIQIJAADDBQAgCgAAxAUAIAwJAACJAwAgCgAAigMAIMwBAACRAwAwzQEAABQAEM4BAACRAwAwzwEBAAAAAdEBAQDJAgAh1wFAAMsCACHYAUAAywIAIfEBAQDJAgAh-AEIAIcDACH5AQIAjAMAIQMAAAAUACABAAAVADACAAAWACAQAwAAzgIAIAkAAIkDACAKAACKAwAgzAEAAIUDADDNAQAAGAAQzgEAAIUDADDPAQEAyQIAIdEBAQDJAgAh1QEAAIgD8QEi1wFAAMsCACHkAQEAyQIAIewBAQDKAgAh7QEBAI8DACHuAQAAhgMAIO8BCACHAwAh8QEBAMkCACEBAAAAGAAgAQAAABQAIAEAAAALACABAAAAEAAgAwAAABQAIAEAABUAMAIAABYAIBAHAADOAgAgCQAAiQMAIA8AAI4DACAQAACCAwAgzAEAAIsDADDNAQAAHgAQzgEAAIsDADDPAQEAyQIAIdABAQDJAgAh0QEBAMkCACHSAQEAygIAIdMBAgCMAwAh1QEAAI0D1QEi1gEBAMkCACHXAUAAywIAIdgBQADLAgAhBQcAAK8EACAJAADDBQAgDwAAxQUAIBAAAMEFACDSAQAAnwMAIBAHAADOAgAgCQAAiQMAIA8AAI4DACAQAACCAwAgzAEAAIsDADDNAQAAHgAQzgEAAIsDADDPAQEAAAAB0AEBAMkCACHRAQEAyQIAIdIBAQDKAgAh0wECAIwDACHVAQAAjQPVASLWAQEAyQIAIdcBQADLAgAh2AFAAMsCACEDAAAAHgAgAQAAHwAwAgAAIAAgAQAAAB4AIAMAAAAeACABAAAfADACAAAgACABAAAAHgAgBgMAAK8EACAJAADDBQAgCgAAxAUAIOwBAACfAwAg7QEAAJ8DACDuAQAAnwMAIBADAADOAgAgCQAAiQMAIAoAAIoDACDMAQAAhQMAMM0BAAAYABDOAQAAhQMAMM8BAQAAAAHRAQEAyQIAIdUBAACIA_EBItcBQADLAgAh5AEBAMkCACHsAQEAAAAB7QEBAAAAAe4BAACGAwAg7wEIAIcDACHxAQEAAAABAwAAABgAIAEAACUAMAIAACYAIAEAAAAUACABAAAAHgAgAQAAABgAIAEAAAALACADAAAAGAAgAQAAJQAwAgAAJgAgAwAAABAAIAEAABEAMAIAABIAIA4DAADOAgAgBgAAzAIAIA4AAM0CACDMAQAAyAIAMM0BAAAuABDOAQAAyAIAMM8BAQDJAgAh1wFAAMsCACHYAUAAywIAIeQBAQDJAgAh5QEBAMkCACHmAQEAyQIAIecBAQDKAgAh6AEBAMoCACEBAAAALgAgAwAAAB4AIAEAAB8AMAIAACAAIAwDAADOAgAgzAEAAIQDADDNAQAAMQAQzgEAAIQDADDPAQEAyQIAIdcBQADLAgAh2AFAAMsCACHkAQEAyQIAIY4CQADLAgAhlwIBAMkCACGYAgEAygIAIZkCAQDKAgAhAwMAAK8EACCYAgAAnwMAIJkCAACfAwAgDAMAAM4CACDMAQAAhAMAMM0BAAAxABDOAQAAhAMAMM8BAQAAAAHXAUAAywIAIdgBQADLAgAh5AEBAMkCACGOAkAAywIAIZcCAQAAAAGYAgEAygIAIZkCAQDKAgAhAwAAADEAIAEAADIAMAIAADMAIAEAAAADACABAAAABwAgAQAAABgAIAEAAAAQACABAAAAHgAgAQAAADEAIAEAAAABACAWBAAA_gIAIAUAAP8CACAIAACBAwAgDgAAzQIAIBEAAIIDACASAACAAwAgEwAAgwMAIMwBAAD6AgAwzQEAADwAEM4BAAD6AgAwzwEBAMkCACHVAQAA_QKgAiLXAUAAywIAIdgBQADLAgAh6AEBAMoCACH_AQEAygIAIYsCAQDJAgAhmgIBAMkCACGbAiAA-wIAIZwCAQDKAgAhngIAAPwCngIioAIgAPsCACEKBAAAvQUAIAUAAL4FACAIAADABQAgDgAArgQAIBEAAMEFACASAAC_BQAgEwAAwgUAIOgBAACfAwAg_wEAAJ8DACCcAgAAnwMAIAMAAAA8ACABAAA9ADACAAABACADAAAAPAAgAQAAPQAwAgAAAQAgAwAAADwAIAEAAD0AMAIAAAEAIBMEAAC2BQAgBQAAtwUAIAgAALoFACAOAAC5BQAgEQAAuwUAIBIAALgFACATAAC8BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAEBGQAAQQAgDM8BAQAAAAHVAQAAAKACAtcBQAAAAAHYAUAAAAAB6AEBAAAAAf8BAQAAAAGLAgEAAAABmgIBAAAAAZsCIAAAAAGcAgEAAAABngIAAACeAgKgAiAAAAABARkAAEMAMAEZAABDADATBAAA6wQAIAUAAOwEACAIAADvBAAgDgAA7gQAIBEAAPAEACASAADtBAAgEwAA8QQAIM8BAQClAwAh1QEAAOoEoAIi1wFAAKgDACHYAUAAqAMAIegBAQCpAwAh_wEBAKkDACGLAgEApQMAIZoCAQClAwAhmwIgAPoDACGcAgEAqQMAIZ4CAADpBJ4CIqACIAD6AwAhAgAAAAEAIBkAAEYAIAzPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIQIAAAA8ACAZAABIACACAAAAPAAgGQAASAAgAwAAAAEAICAAAEEAICEAAEYAIAEAAAABACABAAAAPAAgBg0AAOYEACAmAADoBAAgJwAA5wQAIOgBAACfAwAg_wEAAJ8DACCcAgAAnwMAIA_MAQAA8wIAMM0BAABPABDOAQAA8wIAMM8BAQC2AgAh1QEAAPUCoAIi1wFAALoCACHYAUAAugIAIegBAQC3AgAh_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-ACAgAACGAQAgIQAAiwEAIAEAAAB-ACABAAAAgQEAIAMNAADYBAAgJgAA2gQAICcAANkEACAJzAEAAOwCADDNAQAAlAEAEM4BAADsAgAwzwEBALYCACHXAUAAugIAIdgBQAC6AgAhjAIBALYCACGNAgEAtgIAIY4CQAC6AgAhAwAAAIEBACABAACTAQAwJQAAlAEAIAMAAACBAQAgAQAAggEAMAIAAH4AIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgCAMAANYEACAGAADXBAAgzwEBAAAAAdcBQAAAAAHYAUAAAAAB6AEBAAAAAYoCAQAAAAGLAgEAAAABARkAAJwBACAGzwEBAAAAAdcBQAAAAAHYAUAAAAAB6AEBAAAAAYoCAQAAAAGLAgEAAAABARkAAJ4BADABGQAAngEAMAgDAADLBAAgBgAAzAQAIM8BAQClAwAh1wFAAKgDACHYAUAAqAMAIegBAQClAwAhigIBAKUDACGLAgEApQMAIQIAAAAJACAZAAChAQAgBs8BAQClAwAh1wFAAKgDACHYAUAAqAMAIegBAQClAwAhigIBAKUDACGLAgEApQMAIQIAAAAHACAZAACjAQAgAgAAAAcAIBkAAKMBACADAAAACQAgIAAAnAEAICEAAKEBACABAAAACQAgAQAAAAcAIAMNAADIBAAgJgAAygQAICcAAMkEACAJzAEAAOsCADDNAQAAqgEAEM4BAADrAgAwzwEBALYCACHXAUAAugIAIdgBQAC6AgAh6AEBALYCACGKAgEAtgIAIYsCAQC2AgAhAwAAAAcAIAEAAKkBADAlAACqAQAgAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgEwUAAKYEACAIAADHBAAgCwAApwQAIAwAAKkEACARAACoBAAgzwEBAAAAAdUBAAAAigIC1wFAAAAAAdgBQAAAAAHnAQEAAAAB6AEBAAAAAfgBAgAAAAH6AQEAAAABgQIBAAAAAYICIAAAAAGEAgAAAIQCAoUCAQAAAAGGAgIAAAABiAIAAACIAgIBGQAAsgEAIA7PAQEAAAAB1QEAAACKAgLXAUAAAAAB2AFAAAAAAecBAQAAAAHoAQEAAAAB-AECAAAAAfoBAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAIChQIBAAAAAYYCAgAAAAGIAgAAAIgCAgEZAAC0AQAwARkAALQBADATBQAA_wMAIAgAAMYEACALAACABAAgDAAAggQAIBEAAIEEACDPAQEApQMAIdUBAAD9A4oCItcBQACoAwAh2AFAAKgDACHnAQEAqQMAIegBAQCpAwAh-AECAKYDACH6AQEApQMAIYECAQClAwAhggIgAPoDACGEAgAA-wOEAiKFAgEApQMAIYYCAgCmAwAhiAIAAPwDiAIiAgAAAA0AIBkAALcBACAOzwEBAKUDACHVAQAA_QOKAiLXAUAAqAMAIdgBQACoAwAh5wEBAKkDACHoAQEAqQMAIfgBAgCmAwAh-gEBAKUDACGBAgEApQMAIYICIAD6AwAhhAIAAPsDhAIihQIBAKUDACGGAgIApgMAIYgCAAD8A4gCIgIAAAALACAZAAC5AQAgAgAAAAsAIBkAALkBACADAAAADQAgIAAAsgEAICEAALcBACABAAAADQAgAQAAAAsAIAcNAADBBAAgJgAAxAQAICcAAMMEACB4AADCBAAgeQAAxQQAIOcBAACfAwAg6AEAAJ8DACARzAEAAN4CADDNAQAAwAEAEM4BAADeAgAwzwEBALYCACHVAQAA4gKKAiLXAUAAugIAIdgBQAC6AgAh5wEBALcCACHoAQEAtwIAIfgBAgC4AgAh-gEBALYCACGBAgEAtgIAIYICIADfAgAhhAIAAOAChAIihQIBALYCACGGAgIAuAIAIYgCAADhAogCIgMAAAALACABAAC_AQAwJQAAwAEAIAMAAAALACABAAAMADACAAANACABAAAAEgAgAQAAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIBAHAADtAwAgCAAAwAQAIAsAAO4DACAMAADvAwAgzwEBAAAAAdABAQAAAAHVAQAAAP4BAtcBQAAAAAHYAUAAAAAB5gEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAgAAAAH_AQEAAAABgAIAAADxAQIBGQAAyAEAIAzPAQEAAAAB0AEBAAAAAdUBAAAA_gEC1wFAAAAAAdgBQAAAAAHmAQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gECAAAAAf8BAQAAAAGAAgAAAPEBAgEZAADKAQAwARkAAMoBADAQBwAA0QMAIAgAAL8EACALAADSAwAgDAAA0wMAIM8BAQClAwAh0AEBAKUDACHVAQAAzgP-ASLXAUAAqAMAIdgBQACoAwAh5gEBAKUDACH6AQEApQMAIfsBAQCpAwAh_AEBAKkDACH-AQIApgMAIf8BAQCpAwAhgAIAAM8D8QEiAgAAABIAIBkAAM0BACAMzwEBAKUDACHQAQEApQMAIdUBAADOA_4BItcBQACoAwAh2AFAAKgDACHmAQEApQMAIfoBAQClAwAh-wEBAKkDACH8AQEAqQMAIf4BAgCmAwAh_wEBAKkDACGAAgAAzwPxASICAAAAEAAgGQAAzwEAIAIAAAAQACAZAADPAQAgAwAAABIAICAAAMgBACAhAADNAQAgAQAAABIAIAEAAAAQACAIDQAAugQAICYAAL0EACAnAAC8BAAgeAAAuwQAIHkAAL4EACD7AQAAnwMAIPwBAACfAwAg_wEAAJ8DACAPzAEAANoCADDNAQAA1gEAEM4BAADaAgAwzwEBALYCACHQAQEAtgIAIdUBAADbAv4BItcBQAC6AgAh2AFAALoCACHmAQEAtgIAIfoBAQC2AgAh-wEBALcCACH8AQEAtwIAIf4BAgC4AgAh_wEBALcCACGAAgAA0wLxASIDAAAAEAAgAQAA1QEAMCUAANYBACADAAAAEAAgAQAAEQAwAgAAEgAgAQAAABYAIAEAAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACAJCQAA6wMAIAoAAKQEACDPAQEAAAAB0QEBAAAAAdcBQAAAAAHYAUAAAAAB8QEBAAAAAfgBCAAAAAH5AQIAAAABARkAAN4BACAHzwEBAAAAAdEBAQAAAAHXAUAAAAAB2AFAAAAAAfEBAQAAAAH4AQgAAAAB-QECAAAAAQEZAADgAQAwARkAAOABADAJCQAA6QMAIAoAAKIEACDPAQEApQMAIdEBAQClAwAh1wFAAKgDACHYAUAAqAMAIfEBAQClAwAh-AEIANkDACH5AQIApgMAIQIAAAAWACAZAADjAQAgB88BAQClAwAh0QEBAKUDACHXAUAAqAMAIdgBQACoAwAh8QEBAKUDACH4AQgA2QMAIfkBAgCmAwAhAgAAABQAIBkAAOUBACACAAAAFAAgGQAA5QEAIAMAAAAWACAgAADeAQAgIQAA4wEAIAEAAAAWACABAAAAFAAgBQ0AALUEACAmAAC4BAAgJwAAtwQAIHgAALYEACB5AAC5BAAgCswBAADZAgAwzQEAAOwBABDOAQAA2QIAMM8BAQC2AgAh0QEBALYCACHXAUAAugIAIdgBQAC6AgAh8QEBALYCACH4AQgA0gIAIfkBAgC4AgAhAwAAABQAIAEAAOsBADAlAADsAQAgAwAAABQAIAEAABUAMAIAABYAIAEAAAAmACABAAAAJgAgAwAAABgAIAEAACUAMAIAACYAIAMAAAAYACABAAAlADACAAAmACADAAAAGAAgAQAAJQAwAgAAJgAgDQMAANwDACAJAADdAwAgCgAAkAQAIM8BAQAAAAHRAQEAAAAB1QEAAADxAQLXAUAAAAAB5AEBAAAAAewBAQAAAAHtAQEAAAAB7gGAAAAAAe8BCAAAAAHxAQEAAAABARkAAPQBACAKzwEBAAAAAdEBAQAAAAHVAQAAAPEBAtcBQAAAAAHkAQEAAAAB7AEBAAAAAe0BAQAAAAHuAYAAAAAB7wEIAAAAAfEBAQAAAAEBGQAA9gEAMAEZAAD2AQAwDQMAANoDACAJAADbAwAgCgAAjgQAIM8BAQClAwAh0QEBAKUDACHVAQAAzwPxASLXAUAAqAMAIeQBAQClAwAh7AEBAKkDACHtAQEAqQMAIe4BgAAAAAHvAQgA2QMAIfEBAQClAwAhAgAAACYAIBkAAPkBACAKzwEBAKUDACHRAQEApQMAIdUBAADPA_EBItcBQACoAwAh5AEBAKUDACHsAQEAqQMAIe0BAQCpAwAh7gGAAAAAAe8BCADZAwAh8QEBAKUDACECAAAAGAAgGQAA-wEAIAIAAAAYACAZAAD7AQAgAwAAACYAICAAAPQBACAhAAD5AQAgAQAAACYAIAEAAAAYACAIDQAAsAQAICYAALMEACAnAACyBAAgeAAAsQQAIHkAALQEACDsAQAAnwMAIO0BAACfAwAg7gEAAJ8DACANzAEAAM8CADDNAQAAggIAEM4BAADPAgAwzwEBALYCACHRAQEAtgIAIdUBAADTAvEBItcBQAC6AgAh5AEBALYCACHsAQEAtwIAIe0BAQDQAgAh7gEAANECACDvAQgA0gIAIfEBAQC2AgAhAwAAABgAIAEAAIECADAlAACCAgAgAwAAABgAIAEAACUAMAIAACYAIA4DAADOAgAgBgAAzAIAIA4AAM0CACDMAQAAyAIAMM0BAAAuABDOAQAAyAIAMM8BAQAAAAHXAUAAywIAIdgBQADLAgAh5AEBAAAAAeUBAQAAAAHmAQEAyQIAIecBAQDKAgAh6AEBAMoCACEBAAAAhQIAIAEAAACFAgAgBQMAAK8EACAGAACtBAAgDgAArgQAIOcBAACfAwAg6AEAAJ8DACADAAAALgAgAQAAiAIAMAIAAIUCACADAAAALgAgAQAAiAIAMAIAAIUCACADAAAALgAgAQAAiAIAMAIAAIUCACALAwAArAQAIAYAAKoEACAOAACrBAAgzwEBAAAAAdcBQAAAAAHYAUAAAAAB5AEBAAAAAeUBAQAAAAHmAQEAAAAB5wEBAAAAAegBAQAAAAEBGQAAjAIAIAjPAQEAAAAB1wFAAAAAAdgBQAAAAAHkAQEAAAAB5QEBAAAAAeYBAQAAAAHnAQEAAAAB6AEBAAAAAQEZAACOAgAwARkAAI4CADALAwAAwwMAIAYAAMEDACAOAADCAwAgzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh5AEBAKUDACHlAQEApQMAIeYBAQClAwAh5wEBAKkDACHoAQEAqQMAIQIAAACFAgAgGQAAkQIAIAjPAQEApQMAIdcBQACoAwAh2AFAAKgDACHkAQEApQMAIeUBAQClAwAh5gEBAKUDACHnAQEAqQMAIegBAQCpAwAhAgAAAC4AIBkAAJMCACACAAAALgAgGQAAkwIAIAMAAACFAgAgIAAAjAIAICEAAJECACABAAAAhQIAIAEAAAAuACAFDQAAvgMAICYAAMADACAnAAC_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_AgAgJwAAvwIAINkBAAAA1QEC2gEAAADVAQjbAQAAANUBCOABAAC-AtUBIgTZAQAAANUBAtoBAAAA1QEI2wEAAADVAQjgAQAAvwLVASINDQAAvAIAICYAALwCACAnAAC8AgAgeAAAwQIAIHkAALwCACDZAQIAAAAB2gECAAAABNsBAgAAAATcAQIAAAAB3QECAAAAAd4BAgAAAAHfAQIAAAAB4AECAMACACEI2QEIAAAAAdoBCAAAAATbAQgAAAAE3AEIAAAAAd0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCADBAgAhDg0AAMMCACAmAADEAgAgJwAAxAIAINkBAQAAAAHaAQEAAAAF2wEBAAAABdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHgAQEAwgIAIeEBAQAAAAHiAQEAAAAB4wEBAAAAAQjZAQIAAAAB2gECAAAABdsBAgAAAAXcAQIAAAAB3QECAAAAAd4BAgAAAAHfAQIAAAAB4AECAMMCACEL2QEBAAAAAdoBAQAAAAXbAQEAAAAF3AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABAQDEAgAh4QEBAAAAAeIBAQAAAAHjAQEAAAABDg0AALwCACAmAADGAgAgJwAAxgIAINkBAQAAAAHaAQEAAAAE2wEBAAAABNwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHgAQEAxQIAIeEBAQAAAAHiAQEAAAAB4wEBAAAAAQvZAQEAAAAB2gEBAAAABNsBAQAAAATcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBAMYCACHhAQEAAAAB4gEBAAAAAeMBAQAAAAELzAEAAMcCADDNAQAAmgIAEM4BAADHAgAwzwEBALYCACHXAUAAugIAIdgBQAC6AgAh5AEBALYCACHlAQEAtgIAIeYBAQC2AgAh5wEBALcCACHoAQEAtwIAIQ4DAADOAgAgBgAAzAIAIA4AAM0CACDMAQAAyAIAMM0BAAAuABDOAQAAyAIAMM8BAQDJAgAh1wFAAMsCACHYAUAAywIAIeQBAQDJAgAh5QEBAMkCACHmAQEAyQIAIecBAQDKAgAh6AEBAMoCACEL2QEBAAAAAdoBAQAAAATbAQEAAAAE3AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABAQDGAgAh4QEBAAAAAeIBAQAAAAHjAQEAAAABC9kBAQAAAAHaAQEAAAAF2wEBAAAABdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHgAQEAxAIAIeEBAQAAAAHiAQEAAAAB4wEBAAAAAQjZAUAAAAAB2gFAAAAABNsBQAAAAATcAUAAAAAB3QFAAAAAAd4BQAAAAAHfAUAAAAAB4AFAAL0CACED6QEAAAsAIOoBAAALACDrAQAACwAgA-kBAAAQACDqAQAAEAAg6wEAABAAIBgEAAD-AgAgBQAA_wIAIAgAAIEDACAOAADNAgAgEQAAggMAIBIAAIADACATAACDAwAgzAEAAPoCADDNAQAAPAAQzgEAAPoCADDPAQEAyQIAIdUBAAD9AqACItcBQADLAgAh2AFAAMsCACHoAQEAygIAIf8BAQDKAgAhiwIBAMkCACGaAgEAyQIAIZsCIAD7AgAhnAIBAMoCACGeAgAA_AKeAiKgAiAA-wIAIaECAAA8ACCiAgAAPAAgDcwBAADPAgAwzQEAAIICABDOAQAAzwIAMM8BAQC2AgAh0QEBALYCACHVAQAA0wLxASLXAUAAugIAIeQBAQC2AgAh7AEBALcCACHtAQEA0AIAIe4BAADRAgAg7wEIANICACHxAQEAtgIAIQsNAADDAgAgJgAAxAIAICcAAMQCACDZAQEAAAAB2gEBAAAABdsBAQAAAAXcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBANgCACEPDQAAwwIAICYAANcCACAnAADXAgAg2QGAAAAAAdwBgAAAAAHdAYAAAAAB3gGAAAAAAd8BgAAAAAHgAYAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QGAAAAAAfYBgAAAAAH3AYAAAAABDQ0AALwCACAmAADBAgAgJwAAwQIAIHgAAMECACB5AADBAgAg2QEIAAAAAdoBCAAAAATbAQgAAAAE3AEIAAAAAd0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCADWAgAhBw0AALwCACAmAADVAgAgJwAA1QIAINkBAAAA8QEC2gEAAADxAQjbAQAAAPEBCOABAADUAvEBIgcNAAC8AgAgJgAA1QIAICcAANUCACDZAQAAAPEBAtoBAAAA8QEI2wEAAADxAQjgAQAA1ALxASIE2QEAAADxAQLaAQAAAPEBCNsBAAAA8QEI4AEAANUC8QEiDQ0AALwCACAmAADBAgAgJwAAwQIAIHgAAMECACB5AADBAgAg2QEIAAAAAdoBCAAAAATbAQgAAAAE3AEIAAAAAd0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCADWAgAhDNkBgAAAAAHcAYAAAAAB3QGAAAAAAd4BgAAAAAHfAYAAAAAB4AGAAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBgAAAAAH2AYAAAAAB9wGAAAAAAQsNAADDAgAgJgAAxAIAICcAAMQCACDZAQEAAAAB2gEBAAAABdsBAQAAAAXcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBANgCACEKzAEAANkCADDNAQAA7AEAEM4BAADZAgAwzwEBALYCACHRAQEAtgIAIdcBQAC6AgAh2AFAALoCACHxAQEAtgIAIfgBCADSAgAh-QECALgCACEPzAEAANoCADDNAQAA1gEAEM4BAADaAgAwzwEBALYCACHQAQEAtgIAIdUBAADbAv4BItcBQAC6AgAh2AFAALoCACHmAQEAtgIAIfoBAQC2AgAh-wEBALcCACH8AQEAtwIAIf4BAgC4AgAh_wEBALcCACGAAgAA0wLxASIHDQAAvAIAICYAAN0CACAnAADdAgAg2QEAAAD-AQLaAQAAAP4BCNsBAAAA_gEI4AEAANwC_gEiBw0AALwCACAmAADdAgAgJwAA3QIAINkBAAAA_gEC2gEAAAD-AQjbAQAAAP4BCOABAADcAv4BIgTZAQAAAP4BAtoBAAAA_gEI2wEAAAD-AQjgAQAA3QL-ASIRzAEAAN4CADDNAQAAwAEAEM4BAADeAgAwzwEBALYCACHVAQAA4gKKAiLXAUAAugIAIdgBQAC6AgAh5wEBALcCACHoAQEAtwIAIfgBAgC4AgAh-gEBALYCACGBAgEAtgIAIYICIADfAgAhhAIAAOAChAIihQIBALYCACGGAgIAuAIAIYgCAADhAogCIgUNAAC8AgAgJgAA6gIAICcAAOoCACDZASAAAAAB4AEgAOkCACEHDQAAvAIAICYAAOgCACAnAADoAgAg2QEAAACEAgLaAQAAAIQCCNsBAAAAhAII4AEAAOcChAIiBw0AALwCACAmAADmAgAgJwAA5gIAINkBAAAAiAIC2gEAAACIAgjbAQAAAIgCCOABAADlAogCIgcNAAC8AgAgJgAA5AIAICcAAOQCACDZAQAAAIoCAtoBAAAAigII2wEAAACKAgjgAQAA4wKKAiIHDQAAvAIAICYAAOQCACAnAADkAgAg2QEAAACKAgLaAQAAAIoCCNsBAAAAigII4AEAAOMCigIiBNkBAAAAigIC2gEAAACKAgjbAQAAAIoCCOABAADkAooCIgcNAAC8AgAgJgAA5gIAICcAAOYCACDZAQAAAIgCAtoBAAAAiAII2wEAAACIAgjgAQAA5QKIAiIE2QEAAACIAgLaAQAAAIgCCNsBAAAAiAII4AEAAOYCiAIiBw0AALwCACAmAADoAgAgJwAA6AIAINkBAAAAhAIC2gEAAACEAgjbAQAAAIQCCOABAADnAoQCIgTZAQAAAIQCAtoBAAAAhAII2wEAAACEAgjgAQAA6AKEAiIFDQAAvAIAICYAAOoCACAnAADqAgAg2QEgAAAAAeABIADpAgAhAtkBIAAAAAHgASAA6gIAIQnMAQAA6wIAMM0BAACqAQAQzgEAAOsCADDPAQEAtgIAIdcBQAC6AgAh2AFAALoCACHoAQEAtgIAIYoCAQC2AgAhiwIBALYCACEJzAEAAOwCADDNAQAAlAEAEM4BAADsAgAwzwEBALYCACHXAUAAugIAIdgBQAC6AgAhjAIBALYCACGNAgEAtgIAIY4CQAC6AgAhCcwBAADtAgAwzQEAAIEBABDOAQAA7QIAMM8BAQDJAgAh1wFAAMsCACHYAUAAywIAIYwCAQDJAgAhjQIBAMkCACGOAkAAywIAIRDMAQAA7gIAMM0BAAB7ABDOAQAA7gIAMM8BAQC2AgAh1wFAALoCACHYAUAAugIAIeQBAQC2AgAh-gEBALYCACGPAgEAtgIAIZACAQC3AgAhkQIBALcCACGSAgEAtwIAIZMCQADvAgAhlAJAAO8CACGVAgEAtwIAIZYCAQC3AgAhCw0AAMMCACAmAADxAgAgJwAA8QIAINkBQAAAAAHaAUAAAAAF2wFAAAAABdwBQAAAAAHdAUAAAAAB3gFAAAAAAd8BQAAAAAHgAUAA8AIAIQsNAADDAgAgJgAA8QIAICcAAPECACDZAUAAAAAB2gFAAAAABdsBQAAAAAXcAUAAAAAB3QFAAAAAAd4BQAAAAAHfAUAAAAAB4AFAAPACACEI2QFAAAAAAdoBQAAAAAXbAUAAAAAF3AFAAAAAAd0BQAAAAAHeAUAAAAAB3wFAAAAAAeABQADxAgAhC8wBAADyAgAwzQEAAGUAEM4BAADyAgAwzwEBALYCACHXAUAAugIAIdgBQAC6AgAh5AEBALYCACGOAkAAugIAIZcCAQC2AgAhmAIBALcCACGZAgEAtwIAIQ_MAQAA8wIAMM0BAABPABDOAQAA8wIAMM8BAQC2AgAh1QEAAPUCoAIi1wFAALoCACHYAUAAugIAIegBAQC3AgAh_wEBALcCACGLAgEAtgIAIZoCAQC2AgAhmwIgAN8CACGcAgEAtwIAIZ4CAAD0Ap4CIqACIADfAgAhBw0AALwCACAmAAD5AgAgJwAA-QIAINkBAAAAngIC2gEAAACeAgjbAQAAAJ4CCOABAAD4Ap4CIgcNAAC8AgAgJgAA9wIAICcAAPcCACDZAQAAAKACAtoBAAAAoAII2wEAAACgAgjgAQAA9gKgAiIHDQAAvAIAICYAAPcCACAnAAD3AgAg2QEAAACgAgLaAQAAAKACCNsBAAAAoAII4AEAAPYCoAIiBNkBAAAAoAIC2gEAAACgAgjbAQAAAKACCOABAAD3AqACIgcNAAC8AgAgJgAA-QIAICcAAPkCACDZAQAAAJ4CAtoBAAAAngII2wEAAACeAgjgAQAA-AKeAiIE2QEAAACeAgLaAQAAAJ4CCNsBAAAAngII4AEAAPkCngIiFgQAAP4CACAFAAD_AgAgCAAAgQMAIA4AAM0CACARAACCAwAgEgAAgAMAIBMAAIMDACDMAQAA-gIAMM0BAAA8ABDOAQAA-gIAMM8BAQDJAgAh1QEAAP0CoAIi1wFAAMsCACHYAUAAywIAIegBAQDKAgAh_wEBAMoCACGLAgEAyQIAIZoCAQDJAgAhmwIgAPsCACGcAgEAygIAIZ4CAAD8Ap4CIqACIAD7AgAhAtkBIAAAAAHgASAA6gIAIQTZAQAAAJ4CAtoBAAAAngII2wEAAACeAgjgAQAA-QKeAiIE2QEAAACgAgLaAQAAAKACCNsBAAAAoAII4AEAAPcCoAIiA-kBAAADACDqAQAAAwAg6wEAAAMAIAPpAQAABwAg6gEAAAcAIOsBAAAHACAD6QEAABgAIOoBAAAYACDrAQAAGAAgEAMAAM4CACAGAADMAgAgDgAAzQIAIMwBAADIAgAwzQEAAC4AEM4BAADIAgAwzwEBAMkCACHXAUAAywIAIdgBQADLAgAh5AEBAMkCACHlAQEAyQIAIeYBAQDJAgAh5wEBAMoCACHoAQEAygIAIaECAAAuACCiAgAALgAgA-kBAAAeACDqAQAAHgAg6wEAAB4AIAPpAQAAMQAg6gEAADEAIOsBAAAxACAMAwAAzgIAIMwBAACEAwAwzQEAADEAEM4BAACEAwAwzwEBAMkCACHXAUAAywIAIdgBQADLAgAh5AEBAMkCACGOAkAAywIAIZcCAQDJAgAhmAIBAMoCACGZAgEAygIAIRADAADOAgAgCQAAiQMAIAoAAIoDACDMAQAAhQMAMM0BAAAYABDOAQAAhQMAMM8BAQDJAgAh0QEBAMkCACHVAQAAiAPxASLXAUAAywIAIeQBAQDJAgAh7AEBAMoCACHtAQEAjwMAIe4BAACGAwAg7wEIAIcDACHxAQEAyQIAIQzZAYAAAAAB3AGAAAAAAd0BgAAAAAHeAYAAAAAB3wGAAAAAAeABgAAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AYAAAAAB9gGAAAAAAfcBgAAAAAEI2QEIAAAAAdoBCAAAAATbAQgAAAAE3AEIAAAAAd0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCADBAgAhBNkBAAAA8QEC2gEAAADxAQjbAQAAAPEBCOABAADVAvEBIhgFAACbAwAgCAAAlAMAIAsAAJUDACAMAACAAwAgEQAAggMAIMwBAACXAwAwzQEAAAsAEM4BAACXAwAwzwEBAMkCACHVAQAAmgOKAiLXAUAAywIAIdgBQADLAgAh5wEBAMoCACHoAQEAygIAIfgBAgCMAwAh-gEBAMkCACGBAgEAyQIAIYICIAD7AgAhhAIAAJgDhAIihQIBAMkCACGGAgIAjAMAIYgCAACZA4gCIqECAAALACCiAgAACwAgFQcAAM4CACAIAACUAwAgCwAAlQMAIAwAAJYDACDMAQAAkgMAMM0BAAAQABDOAQAAkgMAMM8BAQDJAgAh0AEBAMkCACHVAQAAkwP-ASLXAUAAywIAIdgBQADLAgAh5gEBAMkCACH6AQEAyQIAIfsBAQDKAgAh_AEBAMoCACH-AQIAjAMAIf8BAQDKAgAhgAIAAIgD8QEioQIAABAAIKICAAAQACAQBwAAzgIAIAkAAIkDACAPAACOAwAgEAAAggMAIMwBAACLAwAwzQEAAB4AEM4BAACLAwAwzwEBAMkCACHQAQEAyQIAIdEBAQDJAgAh0gEBAMoCACHTAQIAjAMAIdUBAACNA9UBItYBAQDJAgAh1wFAAMsCACHYAUAAywIAIQjZAQIAAAAB2gECAAAABNsBAgAAAATcAQIAAAAB3QECAAAAAd4BAgAAAAHfAQIAAAAB4AECALwCACEE2QEAAADVAQLaAQAAANUBCNsBAAAA1QEI4AEAAL8C1QEiEgcAAM4CACAJAACJAwAgDwAAjgMAIBAAAIIDACDMAQAAiwMAMM0BAAAeABDOAQAAiwMAMM8BAQDJAgAh0AEBAMkCACHRAQEAyQIAIdIBAQDKAgAh0wECAIwDACHVAQAAjQPVASLWAQEAyQIAIdcBQADLAgAh2AFAAMsCACGhAgAAHgAgogIAAB4AIAjZAQEAAAAB2gEBAAAABdsBAQAAAAXcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBAJADACEI2QEBAAAAAdoBAQAAAAXbAQEAAAAF3AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeABAQCQAwAhDAkAAIkDACAKAACKAwAgzAEAAJEDADDNAQAAFAAQzgEAAJEDADDPAQEAyQIAIdEBAQDJAgAh1wFAAMsCACHYAUAAywIAIfEBAQDJAgAh-AEIAIcDACH5AQIAjAMAIRMHAADOAgAgCAAAlAMAIAsAAJUDACAMAACWAwAgzAEAAJIDADDNAQAAEAAQzgEAAJIDADDPAQEAyQIAIdABAQDJAgAh1QEAAJMD_gEi1wFAAMsCACHYAUAAywIAIeYBAQDJAgAh-gEBAMkCACH7AQEAygIAIfwBAQDKAgAh_gECAIwDACH_AQEAygIAIYACAACIA_EBIgTZAQAAAP4BAtoBAAAA_gEI2wEAAAD-AQjgAQAA3QL-ASIQAwAAzgIAIAYAAMwCACAOAADNAgAgzAEAAMgCADDNAQAALgAQzgEAAMgCADDPAQEAyQIAIdcBQADLAgAh2AFAAMsCACHkAQEAyQIAIeUBAQDJAgAh5gEBAMkCACHnAQEAygIAIegBAQDKAgAhoQIAAC4AIKICAAAuACAD6QEAABQAIOoBAAAUACDrAQAAFAAgEgMAAM4CACAJAACJAwAgCgAAigMAIMwBAACFAwAwzQEAABgAEM4BAACFAwAwzwEBAMkCACHRAQEAyQIAIdUBAACIA_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_gEC1wFAAAAAAdgBQAAAAAHmAQEAAAAB-wEBAAAAAfwBAQAAAAH-AQIAAAAB_wEBAAAAAYACAAAA8QECAgAAABIAICAAAOwDACADAAAAEgAgIAAA7AMAICEAANADACABGQAAkwYAMBMHAADOAgAgCAAAlAMAIAsAAJUDACAMAACWAwAgzAEAAJIDADDNAQAAEAAQzgEAAJIDADDPAQEAAAAB0AEBAMkCACHVAQAAkwP-ASLXAUAAywIAIdgBQADLAgAh5gEBAMkCACH6AQEAyQIAIfsBAQDKAgAh_AEBAMoCACH-AQIAjAMAIf8BAQDKAgAhgAIAAIgD8QEiAgAAABIAIBkAANADACACAAAAzAMAIBkAAM0DACAPzAEAAMsDADDNAQAAzAMAEM4BAADLAwAwzwEBAMkCACHQAQEAyQIAIdUBAACTA_4BItcBQADLAgAh2AFAAMsCACHmAQEAyQIAIfoBAQDJAgAh-wEBAMoCACH8AQEAygIAIf4BAgCMAwAh_wEBAMoCACGAAgAAiAPxASIPzAEAAMsDADDNAQAAzAMAEM4BAADLAwAwzwEBAMkCACHQAQEAyQIAIdUBAACTA_4BItcBQADLAgAh2AFAAMsCACHmAQEAyQIAIfoBAQDJAgAh-wEBAMoCACH8AQEAygIAIf4BAgCMAwAh_wEBAMoCACGAAgAAiAPxASILzwEBAKUDACHQAQEApQMAIdUBAADOA_4BItcBQACoAwAh2AFAAKgDACHmAQEApQMAIfsBAQCpAwAh_AEBAKkDACH-AQIApgMAIf8BAQCpAwAhgAIAAM8D8QEiAaYCAAAA_gECAaYCAAAA8QECDgcAANEDACALAADSAwAgDAAA0wMAIM8BAQClAwAh0AEBAKUDACHVAQAAzgP-ASLXAUAAqAMAIdgBQACoAwAh5gEBAKUDACH7AQEAqQMAIfwBAQCpAwAh_gECAKYDACH_AQEAqQMAIYACAADPA_EBIgUgAAD-BQAgIQAAkQYAIKMCAAD_BQAgpAIAAJAGACCpAgAAAQAgCyAAAN4DADAhAADjAwAwowIAAN8DADCkAgAA4AMAMKUCAADhAwAgpgIAAOIDADCnAgAA4gMAMKgCAADiAwAwqQIAAOIDADCqAgAA5AMAMKsCAADlAwAwByAAANQDACAhAADXAwAgowIAANUDACCkAgAA1gMAIKcCAAAYACCoAgAAGAAgqQIAACYAIAsDAADcAwAgCQAA3QMAIM8BAQAAAAHRAQEAAAAB1QEAAADxAQLXAUAAAAAB5AEBAAAAAewBAQAAAAHtAQEAAAAB7gGAAAAAAe8BCAAAAAECAAAAJgAgIAAA1AMAIAMAAAAYACAgAADUAwAgIQAA2AMAIA0AAAAYACADAADaAwAgCQAA2wMAIBkAANgDACDPAQEApQMAIdEBAQClAwAh1QEAAM8D8QEi1wFAAKgDACHkAQEApQMAIewBAQCpAwAh7QEBAKkDACHuAYAAAAAB7wEIANkDACELAwAA2gMAIAkAANsDACDPAQEApQMAIdEBAQClAwAh1QEAAM8D8QEi1wFAAKgDACHkAQEApQMAIewBAQCpAwAh7QEBAKkDACHuAYAAAAAB7wEIANkDACEFpgIIAAAAAawCCAAAAAGtAggAAAABrgIIAAAAAa8CCAAAAAEFIAAAiAYAICEAAI4GACCjAgAAiQYAIKQCAACNBgAgqQIAAAEAIAUgAACGBgAgIQAAiwYAIKMCAACHBgAgpAIAAIoGACCpAgAADQAgAyAAAIgGACCjAgAAiQYAIKkCAAABACADIAAAhgYAIKMCAACHBgAgqQIAAA0AIAcJAADrAwAgzwEBAAAAAdEBAQAAAAHXAUAAAAAB2AFAAAAAAfgBCAAAAAH5AQIAAAABAgAAABYAICAAAOoDACADAAAAFgAgIAAA6gMAICEAAOgDACABGQAAhQYAMAwJAACJAwAgCgAAigMAIMwBAACRAwAwzQEAABQAEM4BAACRAwAwzwEBAAAAAdEBAQDJAgAh1wFAAMsCACHYAUAAywIAIfEBAQDJAgAh-AEIAIcDACH5AQIAjAMAIQIAAAAWACAZAADoAwAgAgAAAOYDACAZAADnAwAgCswBAADlAwAwzQEAAOYDABDOAQAA5QMAMM8BAQDJAgAh0QEBAMkCACHXAUAAywIAIdgBQADLAgAh8QEBAMkCACH4AQgAhwMAIfkBAgCMAwAhCswBAADlAwAwzQEAAOYDABDOAQAA5QMAMM8BAQDJAgAh0QEBAMkCACHXAUAAywIAIdgBQADLAgAh8QEBAMkCACH4AQgAhwMAIfkBAgCMAwAhBs8BAQClAwAh0QEBAKUDACHXAUAAqAMAIdgBQACoAwAh-AEIANkDACH5AQIApgMAIQcJAADpAwAgzwEBAKUDACHRAQEApQMAIdcBQACoAwAh2AFAAKgDACH4AQgA2QMAIfkBAgCmAwAhBSAAAIAGACAhAACDBgAgowIAAIEGACCkAgAAggYAIKkCAAANACAHCQAA6wMAIM8BAQAAAAHRAQEAAAAB1wFAAAAAAdgBQAAAAAH4AQgAAAAB-QECAAAAAQMgAACABgAgowIAAIEGACCpAgAADQAgDgcAAO0DACALAADuAwAgDAAA7wMAIM8BAQAAAAHQAQEAAAAB1QEAAAD-AQLXAUAAAAAB2AFAAAAAAeYBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAgAAAAH_AQEAAAABgAIAAADxAQIDIAAA_gUAIKMCAAD_BQAgqQIAAAEAIAQgAADeAwAwowIAAN8DADClAgAA4QMAIKkCAADiAwAwAyAAANQDACCjAgAA1QMAIKkCAAAmACARBQAApgQAIAsAAKcEACAMAACpBAAgEQAAqAQAIM8BAQAAAAHVAQAAAIoCAtcBQAAAAAHYAUAAAAAB5wEBAAAAAegBAQAAAAH4AQIAAAABgQIBAAAAAYICIAAAAAGEAgAAAIQCAoUCAQAAAAGGAgIAAAABiAIAAACIAgICAAAADQAgIAAApQQAIAMAAAANACAgAAClBAAgIQAA_gMAIAEZAAD9BQAwFgUAAJsDACAIAACUAwAgCwAAlQMAIAwAAIADACARAACCAwAgzAEAAJcDADDNAQAACwAQzgEAAJcDADDPAQEAAAAB1QEAAJoDigIi1wFAAMsCACHYAUAAywIAIecBAQDKAgAh6AEBAMoCACH4AQIAjAMAIfoBAQDJAgAhgQIBAMkCACGCAiAA-wIAIYQCAACYA4QCIoUCAQDJAgAhhgICAIwDACGIAgAAmQOIAiICAAAADQAgGQAA_gMAIAIAAAD4AwAgGQAA-QMAIBHMAQAA9wMAMM0BAAD4AwAQzgEAAPcDADDPAQEAyQIAIdUBAACaA4oCItcBQADLAgAh2AFAAMsCACHnAQEAygIAIegBAQDKAgAh-AECAIwDACH6AQEAyQIAIYECAQDJAgAhggIgAPsCACGEAgAAmAOEAiKFAgEAyQIAIYYCAgCMAwAhiAIAAJkDiAIiEcwBAAD3AwAwzQEAAPgDABDOAQAA9wMAMM8BAQDJAgAh1QEAAJoDigIi1wFAAMsCACHYAUAAywIAIecBAQDKAgAh6AEBAMoCACH4AQIAjAMAIfoBAQDJAgAhgQIBAMkCACGCAiAA-wIAIYQCAACYA4QCIoUCAQDJAgAhhgICAIwDACGIAgAAmQOIAiINzwEBAKUDACHVAQAA_QOKAiLXAUAAqAMAIdgBQACoAwAh5wEBAKkDACHoAQEAqQMAIfgBAgCmAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoUCAQClAwAhhgICAKYDACGIAgAA_AOIAiIBpgIgAAAAAQGmAgAAAIQCAgGmAgAAAIgCAgGmAgAAAIoCAhEFAAD_AwAgCwAAgAQAIAwAAIIEACARAACBBAAgzwEBAKUDACHVAQAA_QOKAiLXAUAAqAMAIdgBQACoAwAh5wEBAKkDACHoAQEAqQMAIfgBAgCmAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoUCAQClAwAhhgICAKYDACGIAgAA_AOIAiIFIAAA6wUAICEAAPsFACCjAgAA7AUAIKQCAAD6BQAgqQIAAAkAIAsgAACaBAAwIQAAngQAMKMCAACbBAAwpAIAAJwEADClAgAAnQQAIKYCAADiAwAwpwIAAOIDADCoAgAA4gMAMKkCAADiAwAwqgIAAJ8EADCrAgAA5QMAMAsgAACRBAAwIQAAlQQAMKMCAACSBAAwpAIAAJMEADClAgAAlAQAIKYCAACyAwAwpwIAALIDADCoAgAAsgMAMKkCAACyAwAwqgIAAJYEADCrAgAAtQMAMAsgAACDBAAwIQAAiAQAMKMCAACEBAAwpAIAAIUEADClAgAAhgQAIKYCAACHBAAwpwIAAIcEADCoAgAAhwQAMKkCAACHBAAwqgIAAIkEADCrAgAAigQAMAsDAADcAwAgCgAAkAQAIM8BAQAAAAHVAQAAAPEBAtcBQAAAAAHkAQEAAAAB7AEBAAAAAe0BAQAAAAHuAYAAAAAB7wEIAAAAAfEBAQAAAAECAAAAJgAgIAAAjwQAIAMAAAAmACAgAACPBAAgIQAAjQQAIAEZAAD5BQAwEAMAAM4CACAJAACJAwAgCgAAigMAIMwBAACFAwAwzQEAABgAEM4BAACFAwAwzwEBAAAAAdEBAQDJAgAh1QEAAIgD8QEi1wFAAMsCACHkAQEAyQIAIewBAQAAAAHtAQEAAAAB7gEAAIYDACDvAQgAhwMAIfEBAQAAAAECAAAAJgAgGQAAjQQAIAIAAACLBAAgGQAAjAQAIA3MAQAAigQAMM0BAACLBAAQzgEAAIoEADDPAQEAyQIAIdEBAQDJAgAh1QEAAIgD8QEi1wFAAMsCACHkAQEAyQIAIewBAQDKAgAh7QEBAI8DACHuAQAAhgMAIO8BCACHAwAh8QEBAMkCACENzAEAAIoEADDNAQAAiwQAEM4BAACKBAAwzwEBAMkCACHRAQEAyQIAIdUBAACIA_EBItcBQADLAgAh5AEBAMkCACHsAQEAygIAIe0BAQCPAwAh7gEAAIYDACDvAQgAhwMAIfEBAQDJAgAhCc8BAQClAwAh1QEAAM8D8QEi1wFAAKgDACHkAQEApQMAIewBAQCpAwAh7QEBAKkDACHuAYAAAAAB7wEIANkDACHxAQEApQMAIQsDAADaAwAgCgAAjgQAIM8BAQClAwAh1QEAAM8D8QEi1wFAAKgDACHkAQEApQMAIewBAQCpAwAh7QEBAKkDACHuAYAAAAAB7wEIANkDACHxAQEApQMAIQUgAAD0BQAgIQAA9wUAIKMCAAD1BQAgpAIAAPYFACCpAgAAEgAgCwMAANwDACAKAACQBAAgzwEBAAAAAdUBAAAA8QEC1wFAAAAAAeQBAQAAAAHsAQEAAAAB7QEBAAAAAe4BgAAAAAHvAQgAAAAB8QEBAAAAAQMgAAD0BQAgowIAAPUFACCpAgAAEgAgCwcAALoDACAPAAC9AwAgEAAAvAMAIM8BAQAAAAHQAQEAAAAB0gEBAAAAAdMBAgAAAAHVAQAAANUBAtYBAQAAAAHXAUAAAAAB2AFAAAAAAQIAAAAgACAgAACZBAAgAwAAACAAICAAAJkEACAhAACYBAAgARkAAPMFADACAAAAIAAgGQAAmAQAIAIAAAC2AwAgGQAAlwQAIAjPAQEApQMAIdABAQClAwAh0gEBAKkDACHTAQIApgMAIdUBAACnA9UBItYBAQClAwAh1wFAAKgDACHYAUAAqAMAIQsHAACqAwAgDwAArAMAIBAAAK0DACDPAQEApQMAIdABAQClAwAh0gEBAKkDACHTAQIApgMAIdUBAACnA9UBItYBAQClAwAh1wFAAKgDACHYAUAAqAMAIQsHAAC6AwAgDwAAvQMAIBAAALwDACDPAQEAAAAB0AEBAAAAAdIBAQAAAAHTAQIAAAAB1QEAAADVAQLWAQEAAAAB1wFAAAAAAdgBQAAAAAEHCgAApAQAIM8BAQAAAAHXAUAAAAAB2AFAAAAAAfEBAQAAAAH4AQgAAAAB-QECAAAAAQIAAAAWACAgAACjBAAgAwAAABYAICAAAKMEACAhAAChBAAgARkAAPIFADACAAAAFgAgGQAAoQQAIAIAAADmAwAgGQAAoAQAIAbPAQEApQMAIdcBQACoAwAh2AFAAKgDACHxAQEApQMAIfgBCADZAwAh-QECAKYDACEHCgAAogQAIM8BAQClAwAh1wFAAKgDACHYAUAAqAMAIfEBAQClAwAh-AEIANkDACH5AQIApgMAIQUgAADtBQAgIQAA8AUAIKMCAADuBQAgpAIAAO8FACCpAgAAEgAgBwoAAKQEACDPAQEAAAAB1wFAAAAAAdgBQAAAAAHxAQEAAAAB-AEIAAAAAfkBAgAAAAEDIAAA7QUAIKMCAADuBQAgqQIAABIAIBEFAACmBAAgCwAApwQAIAwAAKkEACARAACoBAAgzwEBAAAAAdUBAAAAigIC1wFAAAAAAdgBQAAAAAHnAQEAAAAB6AEBAAAAAfgBAgAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAIChQIBAAAAAYYCAgAAAAGIAgAAAIgCAgMgAADrBQAgowIAAOwFACCpAgAACQAgBCAAAJoEADCjAgAAmwQAMKUCAACdBAAgqQIAAOIDADAEIAAAkQQAMKMCAACSBAAwpQIAAJQEACCpAgAAsgMAMAQgAACDBAAwowIAAIQEADClAgAAhgQAIKkCAACHBAAwBCAAAPADADCjAgAA8QMAMKUCAADzAwAgqQIAAPQDADAEIAAAxAMAMKMCAADFAwAwpQIAAMcDACCpAgAAyAMAMAMgAADpBQAgowIAAOoFACCpAgAAAQAgAAAKBAAAvQUAIAUAAL4FACAIAADABQAgDgAArgQAIBEAAMEFACASAAC_BQAgEwAAwgUAIOgBAACfAwAg_wEAAJ8DACCcAgAAnwMAIAAAAAAAAAAAAAAAAAAAAAUgAADkBQAgIQAA5wUAIKMCAADlBQAgpAIAAOYFACCpAgAAhQIAIAMgAADkBQAgowIAAOUFACCpAgAAhQIAIAAAAAAABSAAAN8FACAhAADiBQAgowIAAOAFACCkAgAA4QUAIKkCAACFAgAgAyAAAN8FACCjAgAA4AUAIKkCAACFAgAgAAAABSAAANkFACAhAADdBQAgowIAANoFACCkAgAA3AUAIKkCAAABACALIAAAzQQAMCEAANEEADCjAgAAzgQAMKQCAADPBAAwpQIAANAEACCmAgAA9AMAMKcCAAD0AwAwqAIAAPQDADCpAgAA9AMAMKoCAADSBAAwqwIAAPcDADARCAAAxwQAIAsAAKcEACAMAACpBAAgEQAAqAQAIM8BAQAAAAHVAQAAAIoCAtcBQAAAAAHYAUAAAAAB5wEBAAAAAegBAQAAAAH4AQIAAAAB-gEBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgKGAgIAAAABiAIAAACIAgICAAAADQAgIAAA1QQAIAMAAAANACAgAADVBAAgIQAA1AQAIAEZAADbBQAwAgAAAA0AIBkAANQEACACAAAA-AMAIBkAANMEACANzwEBAKUDACHVAQAA_QOKAiLXAUAAqAMAIdgBQACoAwAh5wEBAKkDACHoAQEAqQMAIfgBAgCmAwAh-gEBAKUDACGBAgEApQMAIYICIAD6AwAhhAIAAPsDhAIihgICAKYDACGIAgAA_AOIAiIRCAAAxgQAIAsAAIAEACAMAACCBAAgEQAAgQQAIM8BAQClAwAh1QEAAP0DigIi1wFAAKgDACHYAUAAqAMAIecBAQCpAwAh6AEBAKkDACH4AQIApgMAIfoBAQClAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoYCAgCmAwAhiAIAAPwDiAIiEQgAAMcEACALAACnBAAgDAAAqQQAIBEAAKgEACDPAQEAAAAB1QEAAACKAgLXAUAAAAAB2AFAAAAAAecBAQAAAAHoAQEAAAAB-AECAAAAAfoBAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAIChgICAAAAAYgCAAAAiAICAyAAANkFACCjAgAA2gUAIKkCAAABACAEIAAAzQQAMKMCAADOBAAwpQIAANAEACCpAgAA9AMAMAAAAAAAAAGmAkAAAAABBSAAANQFACAhAADXBQAgowIAANUFACCkAgAA1gUAIKkCAAABACADIAAA1AUAIKMCAADVBQAgqQIAAAEAIAAAAAUgAADPBQAgIQAA0gUAIKMCAADQBQAgpAIAANEFACCpAgAAAQAgAyAAAM8FACCjAgAA0AUAIKkCAAABACAAAAABpgIAAACeAgIBpgIAAACgAgILIAAAqgUAMCEAAK8FADCjAgAAqwUAMKQCAACsBQAwpQIAAK0FACCmAgAArgUAMKcCAACuBQAwqAIAAK4FADCpAgAArgUAMKoCAACwBQAwqwIAALEFADALIAAAngUAMCEAAKMFADCjAgAAnwUAMKQCAACgBQAwpQIAAKEFACCmAgAAogUAMKcCAACiBQAwqAIAAKIFADCpAgAAogUAMKoCAACkBQAwqwIAAKUFADALIAAAlQUAMCEAAJkFADCjAgAAlgUAMKQCAACXBQAwpQIAAJgFACCmAgAAhwQAMKcCAACHBAAwqAIAAIcEADCpAgAAhwQAMKoCAACaBQAwqwIAAIoEADALIAAAjAUAMCEAAJAFADCjAgAAjQUAMKQCAACOBQAwpQIAAI8FACCmAgAAyAMAMKcCAADIAwAwqAIAAMgDADCpAgAAyAMAMKoCAACRBQAwqwIAAMsDADAHIAAAhwUAICEAAIoFACCjAgAAiAUAIKQCAACJBQAgpwIAAC4AIKgCAAAuACCpAgAAhQIAIAsgAAD-BAAwIQAAggUAMKMCAAD_BAAwpAIAAIAFADClAgAAgQUAIKYCAACyAwAwpwIAALIDADCoAgAAsgMAMKkCAACyAwAwqgIAAIMFADCrAgAAtQMAMAsgAADyBAAwIQAA9wQAMKMCAADzBAAwpAIAAPQEADClAgAA9QQAIKYCAAD2BAAwpwIAAPYEADCoAgAA9gQAMKkCAAD2BAAwqgIAAPgEADCrAgAA-QQAMAfPAQEAAAAB1wFAAAAAAdgBQAAAAAGOAkAAAAABlwIBAAAAAZgCAQAAAAGZAgEAAAABAgAAADMAICAAAP0EACADAAAAMwAgIAAA_QQAICEAAPwEACABGQAAzgUAMAwDAADOAgAgzAEAAIQDADDNAQAAMQAQzgEAAIQDADDPAQEAAAAB1wFAAMsCACHYAUAAywIAIeQBAQDJAgAhjgJAAMsCACGXAgEAAAABmAIBAMoCACGZAgEAygIAIQIAAAAzACAZAAD8BAAgAgAAAPoEACAZAAD7BAAgC8wBAAD5BAAwzQEAAPoEABDOAQAA-QQAMM8BAQDJAgAh1wFAAMsCACHYAUAAywIAIeQBAQDJAgAhjgJAAMsCACGXAgEAyQIAIZgCAQDKAgAhmQIBAMoCACELzAEAAPkEADDNAQAA-gQAEM4BAAD5BAAwzwEBAMkCACHXAUAAywIAIdgBQADLAgAh5AEBAMkCACGOAkAAywIAIZcCAQDJAgAhmAIBAMoCACGZAgEAygIAIQfPAQEApQMAIdcBQACoAwAh2AFAAKgDACGOAkAAqAMAIZcCAQClAwAhmAIBAKkDACGZAgEAqQMAIQfPAQEApQMAIdcBQACoAwAh2AFAAKgDACGOAkAAqAMAIZcCAQClAwAhmAIBAKkDACGZAgEAqQMAIQfPAQEAAAAB1wFAAAAAAdgBQAAAAAGOAkAAAAABlwIBAAAAAZgCAQAAAAGZAgEAAAABCwkAALsDACAPAAC9AwAgEAAAvAMAIM8BAQAAAAHRAQEAAAAB0gEBAAAAAdMBAgAAAAHVAQAAANUBAtYBAQAAAAHXAUAAAAAB2AFAAAAAAQIAAAAgACAgAACGBQAgAwAAACAAICAAAIYFACAhAACFBQAgARkAAM0FADACAAAAIAAgGQAAhQUAIAIAAAC2AwAgGQAAhAUAIAjPAQEApQMAIdEBAQClAwAh0gEBAKkDACHTAQIApgMAIdUBAACnA9UBItYBAQClAwAh1wFAAKgDACHYAUAAqAMAIQsJAACrAwAgDwAArAMAIBAAAK0DACDPAQEApQMAIdEBAQClAwAh0gEBAKkDACHTAQIApgMAIdUBAACnA9UBItYBAQClAwAh1wFAAKgDACHYAUAAqAMAIQsJAAC7AwAgDwAAvQMAIBAAALwDACDPAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQIAAAAB1QEAAADVAQLWAQEAAAAB1wFAAAAAAdgBQAAAAAEJBgAAqgQAIA4AAKsEACDPAQEAAAAB1wFAAAAAAdgBQAAAAAHlAQEAAAAB5gEBAAAAAecBAQAAAAHoAQEAAAABAgAAAIUCACAgAACHBQAgAwAAAC4AICAAAIcFACAhAACLBQAgCwAAAC4AIAYAAMEDACAOAADCAwAgGQAAiwUAIM8BAQClAwAh1wFAAKgDACHYAUAAqAMAIeUBAQClAwAh5gEBAKUDACHnAQEAqQMAIegBAQCpAwAhCQYAAMEDACAOAADCAwAgzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh5QEBAKUDACHmAQEApQMAIecBAQCpAwAh6AEBAKkDACEOCAAAwAQAIAsAAO4DACAMAADvAwAgzwEBAAAAAdUBAAAA_gEC1wFAAAAAAdgBQAAAAAHmAQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gECAAAAAf8BAQAAAAGAAgAAAPEBAgIAAAASACAgAACUBQAgAwAAABIAICAAAJQFACAhAACTBQAgARkAAMwFADACAAAAEgAgGQAAkwUAIAIAAADMAwAgGQAAkgUAIAvPAQEApQMAIdUBAADOA_4BItcBQACoAwAh2AFAAKgDACHmAQEApQMAIfoBAQClAwAh-wEBAKkDACH8AQEAqQMAIf4BAgCmAwAh_wEBAKkDACGAAgAAzwPxASIOCAAAvwQAIAsAANIDACAMAADTAwAgzwEBAKUDACHVAQAAzgP-ASLXAUAAqAMAIdgBQACoAwAh5gEBAKUDACH6AQEApQMAIfsBAQCpAwAh_AEBAKkDACH-AQIApgMAIf8BAQCpAwAhgAIAAM8D8QEiDggAAMAEACALAADuAwAgDAAA7wMAIM8BAQAAAAHVAQAAAP4BAtcBQAAAAAHYAUAAAAAB5gEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAgAAAAH_AQEAAAABgAIAAADxAQILCQAA3QMAIAoAAJAEACDPAQEAAAAB0QEBAAAAAdUBAAAA8QEC1wFAAAAAAewBAQAAAAHtAQEAAAAB7gGAAAAAAe8BCAAAAAHxAQEAAAABAgAAACYAICAAAJ0FACADAAAAJgAgIAAAnQUAICEAAJwFACABGQAAywUAMAIAAAAmACAZAACcBQAgAgAAAIsEACAZAACbBQAgCc8BAQClAwAh0QEBAKUDACHVAQAAzwPxASLXAUAAqAMAIewBAQCpAwAh7QEBAKkDACHuAYAAAAAB7wEIANkDACHxAQEApQMAIQsJAADbAwAgCgAAjgQAIM8BAQClAwAh0QEBAKUDACHVAQAAzwPxASLXAUAAqAMAIewBAQCpAwAh7QEBAKkDACHuAYAAAAAB7wEIANkDACHxAQEApQMAIQsJAADdAwAgCgAAkAQAIM8BAQAAAAHRAQEAAAAB1QEAAADxAQLXAUAAAAAB7AEBAAAAAe0BAQAAAAHuAYAAAAAB7wEIAAAAAfEBAQAAAAEGBgAA1wQAIM8BAQAAAAHXAUAAAAAB2AFAAAAAAegBAQAAAAGLAgEAAAABAgAAAAkAICAAAKkFACADAAAACQAgIAAAqQUAICEAAKgFACABGQAAygUAMAsDAADOAgAgBgAAzAIAIMwBAACcAwAwzQEAAAcAEM4BAACcAwAwzwEBAAAAAdcBQADLAgAh2AFAAMsCACHoAQEAyQIAIYoCAQDJAgAhiwIBAAAAAQIAAAAJACAZAACoBQAgAgAAAKYFACAZAACnBQAgCcwBAAClBQAwzQEAAKYFABDOAQAApQUAMM8BAQDJAgAh1wFAAMsCACHYAUAAywIAIegBAQDJAgAhigIBAMkCACGLAgEAyQIAIQnMAQAApQUAMM0BAACmBQAQzgEAAKUFADDPAQEAyQIAIdcBQADLAgAh2AFAAMsCACHoAQEAyQIAIYoCAQDJAgAhiwIBAMkCACEFzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh6AEBAKUDACGLAgEApQMAIQYGAADMBAAgzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh6AEBAKUDACGLAgEApQMAIQYGAADXBAAgzwEBAAAAAdcBQAAAAAHYAUAAAAAB6AEBAAAAAYsCAQAAAAEMzwEBAAAAAdcBQAAAAAHYAUAAAAAB-gEBAAAAAY8CAQAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAGTAkAAAAABlAJAAAAAAZUCAQAAAAGWAgEAAAABAgAAAAUAICAAALUFACADAAAABQAgIAAAtQUAICEAALQFACABGQAAyQUAMBEDAADOAgAgzAEAAJ0DADDNAQAAAwAQzgEAAJ0DADDPAQEAAAAB1wFAAMsCACHYAUAAywIAIeQBAQDJAgAh-gEBAMkCACGPAgEAyQIAIZACAQDKAgAhkQIBAMoCACGSAgEAygIAIZMCQACeAwAhlAJAAJ4DACGVAgEAygIAIZYCAQDKAgAhAgAAAAUAIBkAALQFACACAAAAsgUAIBkAALMFACAQzAEAALEFADDNAQAAsgUAEM4BAACxBQAwzwEBAMkCACHXAUAAywIAIdgBQADLAgAh5AEBAMkCACH6AQEAyQIAIY8CAQDJAgAhkAIBAMoCACGRAgEAygIAIZICAQDKAgAhkwJAAJ4DACGUAkAAngMAIZUCAQDKAgAhlgIBAMoCACEQzAEAALEFADDNAQAAsgUAEM4BAACxBQAwzwEBAMkCACHXAUAAywIAIdgBQADLAgAh5AEBAMkCACH6AQEAyQIAIY8CAQDJAgAhkAIBAMoCACGRAgEAygIAIZICAQDKAgAhkwJAAJ4DACGUAkAAngMAIZUCAQDKAgAhlgIBAMoCACEMzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh-gEBAKUDACGPAgEApQMAIZACAQCpAwAhkQIBAKkDACGSAgEAqQMAIZMCQADeBAAhlAJAAN4EACGVAgEAqQMAIZYCAQCpAwAhDM8BAQClAwAh1wFAAKgDACHYAUAAqAMAIfoBAQClAwAhjwIBAKUDACGQAgEAqQMAIZECAQCpAwAhkgIBAKkDACGTAkAA3gQAIZQCQADeBAAhlQIBAKkDACGWAgEAqQMAIQzPAQEAAAAB1wFAAAAAAdgBQAAAAAH6AQEAAAABjwIBAAAAAZACAQAAAAGRAgEAAAABkgIBAAAAAZMCQAAAAAGUAkAAAAABlQIBAAAAAZYCAQAAAAEEIAAAqgUAMKMCAACrBQAwpQIAAK0FACCpAgAArgUAMAQgAACeBQAwowIAAJ8FADClAgAAoQUAIKkCAACiBQAwBCAAAJUFADCjAgAAlgUAMKUCAACYBQAgqQIAAIcEADAEIAAAjAUAMKMCAACNBQAwpQIAAI8FACCpAgAAyAMAMAMgAACHBQAgowIAAIgFACCpAgAAhQIAIAQgAAD-BAAwowIAAP8EADClAgAAgQUAIKkCAACyAwAwBCAAAPIEADCjAgAA8wQAMKUCAAD1BAAgqQIAAPYEADAAAAAFAwAArwQAIAYAAK0EACAOAACuBAAg5wEAAJ8DACDoAQAAnwMAIAAABwUAAMgFACAIAADABQAgCwAAxgUAIAwAAL8FACARAADBBQAg5wEAAJ8DACDoAQAAnwMAIAcHAACvBAAgCAAAwAUAIAsAAMYFACAMAADHBQAg-wEAAJ8DACD8AQAAnwMAIP8BAACfAwAgBQcAAK8EACAJAADDBQAgDwAAxQUAIBAAAMEFACDSAQAAnwMAIAAGAwAArwQAIAkAAMMFACAKAADEBQAg7AEAAJ8DACDtAQAAnwMAIO4BAACfAwAgAgMAAK8EACAGAACtBAAgDM8BAQAAAAHXAUAAAAAB2AFAAAAAAfoBAQAAAAGPAgEAAAABkAIBAAAAAZECAQAAAAGSAgEAAAABkwJAAAAAAZQCQAAAAAGVAgEAAAABlgIBAAAAAQXPAQEAAAAB1wFAAAAAAdgBQAAAAAHoAQEAAAABiwIBAAAAAQnPAQEAAAAB0QEBAAAAAdUBAAAA8QEC1wFAAAAAAewBAQAAAAHtAQEAAAAB7gGAAAAAAe8BCAAAAAHxAQEAAAABC88BAQAAAAHVAQAAAP4BAtcBQAAAAAHYAUAAAAAB5gEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAgAAAAH_AQEAAAABgAIAAADxAQIIzwEBAAAAAdEBAQAAAAHSAQEAAAAB0wECAAAAAdUBAAAA1QEC1gEBAAAAAdcBQAAAAAHYAUAAAAABB88BAQAAAAHXAUAAAAAB2AFAAAAAAY4CQAAAAAGXAgEAAAABmAIBAAAAAZkCAQAAAAESBAAAtgUAIAUAALcFACAIAAC6BQAgDgAAuQUAIBEAALsFACASAAC4BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAECAAAAAQAgIAAAzwUAIAMAAAA8ACAgAADPBQAgIQAA0wUAIBQAAAA8ACAEAADrBAAgBQAA7AQAIAgAAO8EACAOAADuBAAgEQAA8AQAIBIAAO0EACAZAADTBQAgzwEBAKUDACHVAQAA6gSgAiLXAUAAqAMAIdgBQACoAwAh6AEBAKkDACH_AQEAqQMAIYsCAQClAwAhmgIBAKUDACGbAiAA-gMAIZwCAQCpAwAhngIAAOkEngIioAIgAPoDACESBAAA6wQAIAUAAOwEACAIAADvBAAgDgAA7gQAIBEAAPAEACASAADtBAAgzwEBAKUDACHVAQAA6gSgAiLXAUAAqAMAIdgBQACoAwAh6AEBAKkDACH_AQEAqQMAIYsCAQClAwAhmgIBAKUDACGbAiAA-gMAIZwCAQCpAwAhngIAAOkEngIioAIgAPoDACESBQAAtwUAIAgAALoFACAOAAC5BQAgEQAAuwUAIBIAALgFACATAAC8BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAECAAAAAQAgIAAA1AUAIAMAAAA8ACAgAADUBQAgIQAA2AUAIBQAAAA8ACAFAADsBAAgCAAA7wQAIA4AAO4EACARAADwBAAgEgAA7QQAIBMAAPEEACAZAADYBQAgzwEBAKUDACHVAQAA6gSgAiLXAUAAqAMAIdgBQACoAwAh6AEBAKkDACH_AQEAqQMAIYsCAQClAwAhmgIBAKUDACGbAiAA-gMAIZwCAQCpAwAhngIAAOkEngIioAIgAPoDACESBQAA7AQAIAgAAO8EACAOAADuBAAgEQAA8AQAIBIAAO0EACATAADxBAAgzwEBAKUDACHVAQAA6gSgAiLXAUAAqAMAIdgBQACoAwAh6AEBAKkDACH_AQEAqQMAIYsCAQClAwAhmgIBAKUDACGbAiAA-gMAIZwCAQCpAwAhngIAAOkEngIioAIgAPoDACESBAAAtgUAIAgAALoFACAOAAC5BQAgEQAAuwUAIBIAALgFACATAAC8BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAECAAAAAQAgIAAA2QUAIA3PAQEAAAAB1QEAAACKAgLXAUAAAAAB2AFAAAAAAecBAQAAAAHoAQEAAAAB-AECAAAAAfoBAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAIChgICAAAAAYgCAAAAiAICAwAAADwAICAAANkFACAhAADeBQAgFAAAADwAIAQAAOsEACAIAADvBAAgDgAA7gQAIBEAAPAEACASAADtBAAgEwAA8QQAIBkAAN4FACDPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIRIEAADrBAAgCAAA7wQAIA4AAO4EACARAADwBAAgEgAA7QQAIBMAAPEEACDPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIQoDAACsBAAgDgAAqwQAIM8BAQAAAAHXAUAAAAAB2AFAAAAAAeQBAQAAAAHlAQEAAAAB5gEBAAAAAecBAQAAAAHoAQEAAAABAgAAAIUCACAgAADfBQAgAwAAAC4AICAAAN8FACAhAADjBQAgDAAAAC4AIAMAAMMDACAOAADCAwAgGQAA4wUAIM8BAQClAwAh1wFAAKgDACHYAUAAqAMAIeQBAQClAwAh5QEBAKUDACHmAQEApQMAIecBAQCpAwAh6AEBAKkDACEKAwAAwwMAIA4AAMIDACDPAQEApQMAIdcBQACoAwAh2AFAAKgDACHkAQEApQMAIeUBAQClAwAh5gEBAKUDACHnAQEAqQMAIegBAQCpAwAhCgMAAKwEACAGAACqBAAgzwEBAAAAAdcBQAAAAAHYAUAAAAAB5AEBAAAAAeUBAQAAAAHmAQEAAAAB5wEBAAAAAegBAQAAAAECAAAAhQIAICAAAOQFACADAAAALgAgIAAA5AUAICEAAOgFACAMAAAALgAgAwAAwwMAIAYAAMEDACAZAADoBQAgzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh5AEBAKUDACHlAQEApQMAIeYBAQClAwAh5wEBAKkDACHoAQEAqQMAIQoDAADDAwAgBgAAwQMAIM8BAQClAwAh1wFAAKgDACHYAUAAqAMAIeQBAQClAwAh5QEBAKUDACHmAQEApQMAIecBAQCpAwAh6AEBAKkDACESBAAAtgUAIAUAALcFACAOAAC5BQAgEQAAuwUAIBIAALgFACATAAC8BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAECAAAAAQAgIAAA6QUAIAcDAADWBAAgzwEBAAAAAdcBQAAAAAHYAUAAAAAB6AEBAAAAAYoCAQAAAAGLAgEAAAABAgAAAAkAICAAAOsFACAPBwAA7QMAIAgAAMAEACAMAADvAwAgzwEBAAAAAdABAQAAAAHVAQAAAP4BAtcBQAAAAAHYAUAAAAAB5gEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAgAAAAH_AQEAAAABgAIAAADxAQICAAAAEgAgIAAA7QUAIAMAAAAQACAgAADtBQAgIQAA8QUAIBEAAAAQACAHAADRAwAgCAAAvwQAIAwAANMDACAZAADxBQAgzwEBAKUDACHQAQEApQMAIdUBAADOA_4BItcBQACoAwAh2AFAAKgDACHmAQEApQMAIfoBAQClAwAh-wEBAKkDACH8AQEAqQMAIf4BAgCmAwAh_wEBAKkDACGAAgAAzwPxASIPBwAA0QMAIAgAAL8EACAMAADTAwAgzwEBAKUDACHQAQEApQMAIdUBAADOA_4BItcBQACoAwAh2AFAAKgDACHmAQEApQMAIfoBAQClAwAh-wEBAKkDACH8AQEAqQMAIf4BAgCmAwAh_wEBAKkDACGAAgAAzwPxASIGzwEBAAAAAdcBQAAAAAHYAUAAAAAB8QEBAAAAAfgBCAAAAAH5AQIAAAABCM8BAQAAAAHQAQEAAAAB0gEBAAAAAdMBAgAAAAHVAQAAANUBAtYBAQAAAAHXAUAAAAAB2AFAAAAAAQ8HAADtAwAgCAAAwAQAIAsAAO4DACDPAQEAAAAB0AEBAAAAAdUBAAAA_gEC1wFAAAAAAdgBQAAAAAHmAQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gECAAAAAf8BAQAAAAGAAgAAAPEBAgIAAAASACAgAAD0BQAgAwAAABAAICAAAPQFACAhAAD4BQAgEQAAABAAIAcAANEDACAIAAC_BAAgCwAA0gMAIBkAAPgFACDPAQEApQMAIdABAQClAwAh1QEAAM4D_gEi1wFAAKgDACHYAUAAqAMAIeYBAQClAwAh-gEBAKUDACH7AQEAqQMAIfwBAQCpAwAh_gECAKYDACH_AQEAqQMAIYACAADPA_EBIg8HAADRAwAgCAAAvwQAIAsAANIDACDPAQEApQMAIdABAQClAwAh1QEAAM4D_gEi1wFAAKgDACHYAUAAqAMAIeYBAQClAwAh-gEBAKUDACH7AQEAqQMAIfwBAQCpAwAh_gECAKYDACH_AQEAqQMAIYACAADPA_EBIgnPAQEAAAAB1QEAAADxAQLXAUAAAAAB5AEBAAAAAewBAQAAAAHtAQEAAAAB7gGAAAAAAe8BCAAAAAHxAQEAAAABAwAAAAcAICAAAOsFACAhAAD8BQAgCQAAAAcAIAMAAMsEACAZAAD8BQAgzwEBAKUDACHXAUAAqAMAIdgBQACoAwAh6AEBAKUDACGKAgEApQMAIYsCAQClAwAhBwMAAMsEACDPAQEApQMAIdcBQACoAwAh2AFAAKgDACHoAQEApQMAIYoCAQClAwAhiwIBAKUDACENzwEBAAAAAdUBAAAAigIC1wFAAAAAAdgBQAAAAAHnAQEAAAAB6AEBAAAAAfgBAgAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAIChQIBAAAAAYYCAgAAAAGIAgAAAIgCAhIEAAC2BQAgBQAAtwUAIAgAALoFACARAAC7BQAgEgAAuAUAIBMAALwFACDPAQEAAAAB1QEAAACgAgLXAUAAAAAB2AFAAAAAAegBAQAAAAH_AQEAAAABiwIBAAAAAZoCAQAAAAGbAiAAAAABnAIBAAAAAZ4CAAAAngICoAIgAAAAAQIAAAABACAgAAD-BQAgEgUAAKYEACAIAADHBAAgDAAAqQQAIBEAAKgEACDPAQEAAAAB1QEAAACKAgLXAUAAAAAB2AFAAAAAAecBAQAAAAHoAQEAAAAB-AECAAAAAfoBAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAIChQIBAAAAAYYCAgAAAAGIAgAAAIgCAgIAAAANACAgAACABgAgAwAAAAsAICAAAIAGACAhAACEBgAgFAAAAAsAIAUAAP8DACAIAADGBAAgDAAAggQAIBEAAIEEACAZAACEBgAgzwEBAKUDACHVAQAA_QOKAiLXAUAAqAMAIdgBQACoAwAh5wEBAKkDACHoAQEAqQMAIfgBAgCmAwAh-gEBAKUDACGBAgEApQMAIYICIAD6AwAhhAIAAPsDhAIihQIBAKUDACGGAgIApgMAIYgCAAD8A4gCIhIFAAD_AwAgCAAAxgQAIAwAAIIEACARAACBBAAgzwEBAKUDACHVAQAA_QOKAiLXAUAAqAMAIdgBQACoAwAh5wEBAKkDACHoAQEAqQMAIfgBAgCmAwAh-gEBAKUDACGBAgEApQMAIYICIAD6AwAhhAIAAPsDhAIihQIBAKUDACGGAgIApgMAIYgCAAD8A4gCIgbPAQEAAAAB0QEBAAAAAdcBQAAAAAHYAUAAAAAB-AEIAAAAAfkBAgAAAAESBQAApgQAIAgAAMcEACALAACnBAAgEQAAqAQAIM8BAQAAAAHVAQAAAIoCAtcBQAAAAAHYAUAAAAAB5wEBAAAAAegBAQAAAAH4AQIAAAAB-gEBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgKFAgEAAAABhgICAAAAAYgCAAAAiAICAgAAAA0AICAAAIYGACASBAAAtgUAIAUAALcFACAIAAC6BQAgDgAAuQUAIBEAALsFACATAAC8BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAECAAAAAQAgIAAAiAYAIAMAAAALACAgAACGBgAgIQAAjAYAIBQAAAALACAFAAD_AwAgCAAAxgQAIAsAAIAEACARAACBBAAgGQAAjAYAIM8BAQClAwAh1QEAAP0DigIi1wFAAKgDACHYAUAAqAMAIecBAQCpAwAh6AEBAKkDACH4AQIApgMAIfoBAQClAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoUCAQClAwAhhgICAKYDACGIAgAA_AOIAiISBQAA_wMAIAgAAMYEACALAACABAAgEQAAgQQAIM8BAQClAwAh1QEAAP0DigIi1wFAAKgDACHYAUAAqAMAIecBAQCpAwAh6AEBAKkDACH4AQIApgMAIfoBAQClAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoUCAQClAwAhhgICAKYDACGIAgAA_AOIAiIDAAAAPAAgIAAAiAYAICEAAI8GACAUAAAAPAAgBAAA6wQAIAUAAOwEACAIAADvBAAgDgAA7gQAIBEAAPAEACATAADxBAAgGQAAjwYAIM8BAQClAwAh1QEAAOoEoAIi1wFAAKgDACHYAUAAqAMAIegBAQCpAwAh_wEBAKkDACGLAgEApQMAIZoCAQClAwAhmwIgAPoDACGcAgEAqQMAIZ4CAADpBJ4CIqACIAD6AwAhEgQAAOsEACAFAADsBAAgCAAA7wQAIA4AAO4EACARAADwBAAgEwAA8QQAIM8BAQClAwAh1QEAAOoEoAIi1wFAAKgDACHYAUAAqAMAIegBAQCpAwAh_wEBAKkDACGLAgEApQMAIZoCAQClAwAhmwIgAPoDACGcAgEAqQMAIZ4CAADpBJ4CIqACIAD6AwAhAwAAADwAICAAAP4FACAhAACSBgAgFAAAADwAIAQAAOsEACAFAADsBAAgCAAA7wQAIBEAAPAEACASAADtBAAgEwAA8QQAIBkAAJIGACDPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIRIEAADrBAAgBQAA7AQAIAgAAO8EACARAADwBAAgEgAA7QQAIBMAAPEEACDPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIQvPAQEAAAAB0AEBAAAAAdUBAAAA_gEC1wFAAAAAAdgBQAAAAAHmAQEAAAAB-wEBAAAAAfwBAQAAAAH-AQIAAAAB_wEBAAAAAYACAAAA8QECAwAAADwAICAAAOkFACAhAACWBgAgFAAAADwAIAQAAOsEACAFAADsBAAgDgAA7gQAIBEAAPAEACASAADtBAAgEwAA8QQAIBkAAJYGACDPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIRIEAADrBAAgBQAA7AQAIA4AAO4EACARAADwBAAgEgAA7QQAIBMAAPEEACDPAQEApQMAIdUBAADqBKACItcBQACoAwAh2AFAAKgDACHoAQEAqQMAIf8BAQCpAwAhiwIBAKUDACGaAgEApQMAIZsCIAD6AwAhnAIBAKkDACGeAgAA6QSeAiKgAiAA-gMAIQwHAAC6AwAgCQAAuwMAIA8AAL0DACDPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wECAAAAAdUBAAAA1QEC1gEBAAAAAdcBQAAAAAHYAUAAAAABAgAAACAAICAAAJcGACASBQAApgQAIAgAAMcEACALAACnBAAgDAAAqQQAIM8BAQAAAAHVAQAAAIoCAtcBQAAAAAHYAUAAAAAB5wEBAAAAAegBAQAAAAH4AQIAAAAB-gEBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgKFAgEAAAABhgICAAAAAYgCAAAAiAICAgAAAA0AICAAAJkGACASBAAAtgUAIAUAALcFACAIAAC6BQAgDgAAuQUAIBIAALgFACATAAC8BQAgzwEBAAAAAdUBAAAAoAIC1wFAAAAAAdgBQAAAAAHoAQEAAAAB_wEBAAAAAYsCAQAAAAGaAgEAAAABmwIgAAAAAZwCAQAAAAGeAgAAAJ4CAqACIAAAAAECAAAAAQAgIAAAmwYAIAjPAQEAAAAB0AEBAAAAAdEBAQAAAAHTAQIAAAAB1QEAAADVAQLWAQEAAAAB1wFAAAAAAdgBQAAAAAEDAAAAHgAgIAAAlwYAICEAAKAGACAOAAAAHgAgBwAAqgMAIAkAAKsDACAPAACsAwAgGQAAoAYAIM8BAQClAwAh0AEBAKUDACHRAQEApQMAIdIBAQCpAwAh0wECAKYDACHVAQAApwPVASLWAQEApQMAIdcBQACoAwAh2AFAAKgDACEMBwAAqgMAIAkAAKsDACAPAACsAwAgzwEBAKUDACHQAQEApQMAIdEBAQClAwAh0gEBAKkDACHTAQIApgMAIdUBAACnA9UBItYBAQClAwAh1wFAAKgDACHYAUAAqAMAIQMAAAALACAgAACZBgAgIQAAowYAIBQAAAALACAFAAD_AwAgCAAAxgQAIAsAAIAEACAMAACCBAAgGQAAowYAIM8BAQClAwAh1QEAAP0DigIi1wFAAKgDACHYAUAAqAMAIecBAQCpAwAh6AEBAKkDACH4AQIApgMAIfoBAQClAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoUCAQClAwAhhgICAKYDACGIAgAA_AOIAiISBQAA_wMAIAgAAMYEACALAACABAAgDAAAggQAIM8BAQClAwAh1QEAAP0DigIi1wFAAKgDACHYAUAAqAMAIecBAQCpAwAh6AEBAKkDACH4AQIApgMAIfoBAQClAwAhgQIBAKUDACGCAiAA-gMAIYQCAAD7A4QCIoUCAQClAwAhhgICAKYDACGIAgAA_AOIAiIDAAAAPAAgIAAAmwYAICEAAKYGACAUAAAAPAAgBAAA6wQAIAUAAOwEACAIAADvBAAgDgAA7gQAIBIAAO0EACATAADxBAAgGQAApgYAIM8BAQClAwAh1QEAAOoEoAIi1wFAAKgDACHYAUAAqAMAIegBAQCpAwAh_wEBAKkDACGLAgEApQMAIZoCAQClAwAhmwIgAPoDACGcAgEAqQMAIZ4CAADpBJ4CIqACIAD6AwAhEgQAAOsEACAFAADsBAAgCAAA7wQAIA4AAO4EACASAADtBAAgEwAA8QQAIM8BAQClAwAh1QEAAOoEoAIi1wFAAKgDACHYAUAAqAMAIegBAQCpAwAh_wEBAKkDACGLAgEApQMAIZoCAQClAwAhmwIgAPoDACGcAgEAqQMAIZ4CAADpBJ4CIqACIAD6AwAhCAQGAgUKAwgvBQ0AEA4tBhEwCxIsCBM0DwEDAAEDAwABBg4EDQAOBgUAAwgABQsdBwwnCA0ADREhCwQDAAEGDwQNAAoOEwYFBwABCAAFCxcHDBkIDQAJAgkABAoABgMDAAEJAAQKAAYBCxoAAgYbAA4cAAUHAAEJAAQNAAwPIgsQIwsBECQAAwsoAAwqABEpAAEGKwABAwABBgQ1AAU2AA44ABE5ABI3ABM6AAAAAAMNABUmABYnABcAAAADDQAVJgAWJwAXAQMAAQEDAAEDDQAcJgAdJwAeAAAAAw0AHCYAHScAHgEDAAEBAwABAw0AIyYAJCcAJQAAAAMNACMmACQnACUAAAADDQArJgAsJwAtAAAAAw0AKyYALCcALQEDAAEBAwABAw0AMiYAMycANAAAAAMNADImADMnADQCBQADCAAFAgUAAwgABQUNADkmADwnAD14ADp5ADsAAAAAAAUNADkmADwnAD14ADp5ADsCBwABCAAFAgcAAQgABQUNAEImAEUnAEZ4AEN5AEQAAAAAAAUNAEImAEUnAEZ4AEN5AEQCCQAECgAGAgkABAoABgUNAEsmAE4nAE94AEx5AE0AAAAAAAUNAEsmAE4nAE94AEx5AE0DAwABCQAECgAGAwMAAQkABAoABgUNAFQmAFcnAFh4AFV5AFYAAAAAAAUNAFQmAFcnAFh4AFV5AFYBAwABAQMAAQMNAF0mAF4nAF8AAAADDQBdJgBeJwBfAwcAAQkABA-nAgsDBwABCQAED60CCwUNAGQmAGcnAGh4AGV5AGYAAAAAAAUNAGQmAGcnAGh4AGV5AGYUAgEVOwEWPgEXPwEYQAEaQgEbRBEcRRIdRwEeSREfShMiSwEjTAEkTREoUBQpURgqUg8rUw8sVA8tVQ8uVg8vWA8wWhExWxkyXQ8zXxE0YBo1YQ82Yg83YxE4Zhs5Zx86aAI7aQI8agI9awI-bAI_bgJAcBFBcSBCcwJDdRFEdiFFdwJGeAJHeRFIfCJJfSZKfydLgAEnTIMBJ02EASdOhQEnT4cBJ1CJARFRigEoUowBJ1OOARFUjwEpVZABJ1aRASdXkgERWJUBKlmWAS5alwEDW5gBA1yZAQNdmgEDXpsBA1-dAQNgnwERYaABL2KiAQNjpAERZKUBMGWmAQNmpwEDZ6gBEWirATFprAE1aq0BBGuuAQRsrwEEbbABBG6xAQRvswEEcLUBEXG2ATZyuAEEc7oBEXS7ATd1vAEEdr0BBHe-ARF6wQE4e8IBPnzDAQZ9xAEGfsUBBn_GAQaAAccBBoEByQEGggHLARGDAcwBP4QBzgEGhQHQARGGAdEBQIcB0gEGiAHTAQaJAdQBEYoB1wFBiwHYAUeMAdkBB40B2gEHjgHbAQePAdwBB5AB3QEHkQHfAQeSAeEBEZMB4gFIlAHkAQeVAeYBEZYB5wFJlwHoAQeYAekBB5kB6gERmgHtAUqbAe4BUJwB7wEInQHwAQieAfEBCJ8B8gEIoAHzAQihAfUBCKIB9wERowH4AVGkAfoBCKUB_AERpgH9AVKnAf4BCKgB_wEIqQGAAhGqAYMCU6sBhAJZrAGGAgWtAYcCBa4BiQIFrwGKAgWwAYsCBbEBjQIFsgGPAhGzAZACWrQBkgIFtQGUAhG2AZUCW7cBlgIFuAGXAgW5AZgCEboBmwJcuwGcAmC8AZ0CC70BngILvgGfAgu_AaACC8ABoQILwQGjAgvCAaUCEcMBpgJhxAGpAgvFAasCEcYBrAJixwGuAgvIAa8CC8kBsAIRygGzAmPLAbQCaQ"
};
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
  JsonNullValueFilter: () => JsonNullValueFilter,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  OrderitemScalarFieldEnum: () => OrderitemScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
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
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
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
  Payment: "Payment",
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
  deliverycharge: "deliverycharge",
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
  updatedAt: "updatedAt",
  paymentStatus: "paymentStatus"
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
var PaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mealId: "mealId",
  stripeEventId: "stripeEventId",
  transactionId: "transactionId",
  paymentGatewayData: "paymentGatewayData",
  amount: "amount",
  status: "status",
  orderId: "orderId",
  createdAt: "createdAt"
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
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  Customer: "Customer",
  Provider: "Provider",
  Admin: "Admin"
};
var Status = {
  activate: "activate",
  suspend: "suspend"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  FREE: "FREE"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app.ts
import express2 from "express";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import status2 from "http-status";
import nodemailer from "nodemailer";

// src/app/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/app/errorHelper/AppError.ts
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

// src/app/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "FRONTEND_URL",
    "PORT",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "APP_USER",
    "APP_PASS",
    "EMAIL",
    "PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "NODE_ENV",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_FROM",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Server configuration error: The required environment variable "${variable}" is not set. Verify your .env file or deployment environment settings.`
      );
    }
  });
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    APP_USER: process.env.APP_USER,
    APP_PASS: process.env.APP_PASS,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_FROM: process.env.SMTP_FROM
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    }
  };
};
var envVars = loadEnvVariables();

// src/app/templates/htmlEmailTemplete.ts
function generateEmailTemplate(templateName, templateData) {
  const COLORS = {
    brand: "#ff5722",
    // main accent (carrot orange)
    highlight: "#ffe082",
    // highlight (lemon yellow)
    leaf: "#43a047",
    // green (fresh herb/leaf)
    background: "#f9fafc",
    // light, airy
    card: "#fffefb",
    // card background, light warm
    border: "#e0e0e0",
    // subtle border
    heading: "#2d2a31",
    // deep food brown/gray
    text: "#41392e",
    // appetizing brown
    subtext: "#7e7465",
    // muted brown
    error: "#e64a19",
    // for missing OTP, accent red-orange
    shadow: "rgba(255, 87, 34, 0.10)"
    // orange tint shadow
  };
  switch (templateName) {
    case "otp":
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family:'Segoe UI','Montserrat',Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${COLORS.card};margin:48px auto 0 auto;border-radius:16px;box-shadow:0 10px 42px ${COLORS.shadow};border:1px solid ${COLORS.border};overflow:hidden;">
              <tr>
                <td style="padding:3em 2.2em 1.2em 2.2em;">
                  <div style="text-align:center;">
                    <img src="https://images.pexels.com/photos/36982119/pexels-photo-36982119.jpeg" alt="FoodHub" height="54" style="display:block;margin:0 auto 18px auto;border-radius:10px;box-shadow:0 2px 10px #f3d2b0;"/>
                    <h1 style="margin:0 0 10px 0;font-size:2.1em;font-weight:800;letter-spacing:-1px;color:${COLORS.brand};line-height:1.16;">
                      FoodHub Secure Verification
                    </h1>
                    <span style="display:inline-block;margin:0 auto 8px auto;font-size:1.19em;color:${COLORS.leaf};font-weight:700;">
                      One Step Away From Tasty Journeys!
                    </span>
                  </div>
                  <div style="margin:32px 0 22px 0;border-radius:15px;padding:28px 0;background:linear-gradient(92deg,#fff9ee 55%,${COLORS.highlight} 120%);border:1.5px dashed ${COLORS.brand};text-align:center;box-shadow:0 3px 22px #ffe9d5;">
                    <span style="
                      display:inline-block;
                      font-size:2.3em;
                      font-family:'Space Mono',monospace;
                      color:${COLORS.card};
                      background:linear-gradient(89deg,${COLORS.leaf} 14%,${COLORS.brand} 110%);
                      border-radius:10px;
                      padding:15px 56px;
                      font-weight:900;
                      letter-spacing:0.22em;
                      box-shadow:0 4px 18px 0 rgba(255,87,34,0.09);
                      ">
                      ${templateData.otp ? escapeStr(templateData.otp) : `<span style="color:${COLORS.error}">\u2022\u2022\u2022\u2022\u2022\u2022\u2022</span>`}
                    </span>
                  </div>
                  <p style="color:${COLORS.text};font-size:1.32em;line-height:1.66;margin:20px 0 24px 0;font-weight:500;">
                    Hi${templateData.name ? ` <b>${escapeStr(templateData.name)}</b>,` : ","}<br/>
                    Welcome to FoodHub! Please enter the above code to verify your email and continue to delightful food experiences.
                  </p>
                  <ul style="font-size:1em;color:${COLORS.subtext};margin:0 0 40px 14px;padding:0;">
                    <li style="margin-bottom:7px;">This OTP is valid for a limited time, so complete your verification promptly.</li>
                    <li style="margin-bottom:7px;">Keep your code confidential for account security.</li>
                  </ul>
                  <div style="margin:40px 0 0 0;text-align:center;">
                    <a href="https://foodhub.app" target="_blank" style="
                      display:inline-block;
                      padding:12px 42px;
                      background:linear-gradient(90deg,${COLORS.brand},${COLORS.leaf});
                      color:white;
                      text-decoration:none;
                      font-weight:700;
                      border-radius:7px;
                      font-size:1.07em;
                      letter-spacing:0.04em;
                      box-shadow:0 4px 14px rgba(67,160,71,0.13);
                      border:none;
                      ">
                      Explore FoodHub
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:${COLORS.background};padding:1.3em 2.4em 1.38em 2.4em;text-align:center;border-top:1px solid ${COLORS.border};">
                  <span style="color:${COLORS.subtext};font-size:1.02em;">
                    If you did not request this, simply ignore this email.<br/>
                    Enjoy fresh discoveries with <strong style="color:${COLORS.brand}">FoodHub</strong>!
                  </span>
                  <div style="margin-top:15px;">
                    <span style="font-size:0.95em;color:#b6b2ad;">
                      &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} FoodHub. All rights reserved.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    default:
      return `
        <html>
          <body style="margin:0;padding:0;background:${COLORS.background};font-family:'Segoe UI','Montserrat',Arial,sans-serif;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${COLORS.card};margin:48px auto 0 auto;border-radius:16px;box-shadow:0 10px 42px ${COLORS.shadow};border:1px solid ${COLORS.border};overflow:hidden;">
              <tr>
                <td style="padding:2.6em 2.4em 1.5em 2.4em;">
                  <div style="text-align:center;">
                    <img src="https://images.pexels.com/photos/36982119/pexels-photo-36982119.jpeg" alt="FoodHub" height="48" style="display:block;margin:0 auto 24px auto;border-radius:10px;box-shadow:0 2px 10px #f3d2b0;" />
                  </div>
                  <h2 style="margin:0 0 10px 0;color:${COLORS.leaf};font-size:2.05em;font-weight:800;letter-spacing:-1px;text-align:center;">
                    FoodHub Notification
                  </h2>
                  <span style="display:block;font-size:1.16em;color:${COLORS.brand};margin-bottom:12px;text-align:center;font-weight:600;">
                    Discover. Taste. Enjoy.
                  </span>
                  <p style="font-size:1.10em;color:${COLORS.text};margin:12px 0 27px 0;text-align:center;">
                    You\u2019ve received a system message from FoodHub.
                  </p>
                  <div style="border:1px solid ${COLORS.border};border-radius:11px;padding:20px 22px;background:#fcf8ee;">
                    <p style="color:${COLORS.text};font-size:1.07em;line-height:1.7;margin:8px 0;">
                      This is an automated notification. For more delicious updates, visit FoodHub and enjoy a world of experiences!
                    </p>
                  </div>
                  <div style="margin:42px 0 16px 0;text-align:center;">
                    <a href="https://foodhub.app" target="_blank" style="
                      display:inline-block;
                      background:linear-gradient(90deg,${COLORS.leaf},${COLORS.brand});
                      color:white;
                      font-weight:700;
                      font-size:1.06em;
                      padding:11px 38px;
                      border-radius:8px;
                      text-decoration:none;
                      box-shadow:0 3px 12px 0 rgba(255,87,34,0.08);
                      border:none;">
                      Go to FoodHub
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:${COLORS.background};padding:1.28em 2em 1.26em 2em;text-align:center;border-top:1px solid ${COLORS.border};">
                  <span style="color:${COLORS.subtext};font-size:0.97em;">
                    Thank you for being part of <strong style="color:${COLORS.brand}">FoodHub</strong>.
                  </span>
                  <div style="margin-top:13px;">
                    <span style="font-size:0.92em;color:#b6b2ad;">
                      &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} FoodHub. All rights reserved.
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
  }
}
function escapeStr(str) {
  return str.replace(/[&<>"'`]/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;"
  })[m]);
}

// src/app/utils/email.ts
var smtpConfig = {
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
  // true for 465, false for others
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15e3,
  greetingTimeout: 15e3,
  socketTimeout: 3e4
};
var transporter = nodemailer.createTransport(smtpConfig);
var sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}) => {
  try {
    const mailOptions = {
      from: `foodhub <${envVars.EMAIL_SENDER.SMTP_USER}>`,
      to,
      subject,
      html: generateEmailTemplate(templateName, templateData),
      attachments: attachments?.map(({ filename, content, contentType }) => ({
        filename,
        content,
        contentType
      }))
    };
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Sending Error", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode
    });
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  secret: envVars.BETTER_AUTH_SECRET,
  baseURL: envVars.FRONTEND_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [envVars.FRONTEND_URL],
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
        required: false
      },
      emailVerified: {
        type: "boolean",
        required: false
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user?.role === "Admin") {
            await prisma.user.update({
              where: {
                email
              },
              data: {
                emailVerified: true
              }
            });
          }
          if (user && !user.emailVerified) {
            await sendEmail({
              to: user.email,
              subject: "Verify your email address",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            await sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 10 * 60,
      otpLength: 6,
      resendStrategy: "rotate"
    })
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
    // requireEmailVerification: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    strategy: "jwt"
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
      redirectURI: `${envVars.FRONTEND_URL}/api/auth/callback/google`,
      mapProfileToUser: () => {
        return {
          role: Role.Customer,
          status: Status.activate,
          emailVerified: true,
          bgimage: ""
        };
      }
    }
  },
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  },
  redirectURLs: {
    signin: `${process.env.BETTER_AUTH_URL}`
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/app/middleware/notFound.ts
function Notfound(req, res) {
  res.status(404).json({ message: "route not found" });
}

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";

// src/app/middleware/globalErrorHandeller.ts
import status3 from "http-status";
function errorHandler(err, req, res, next) {
  let statusCode = status3.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = status3.BAD_REQUEST;
    message = "Validation Error";
    errorSources.push({ message: err.message });
  } else if (err?.code === "ETIMEDOUT" || err?.code === "PROTOCOL_TIMEOUT") {
    statusCode = status3.GATEWAY_TIMEOUT;
    message = "Database request timed out. Please retry after a short while.";
    errorSources.push({ message });
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode || status3.BAD_REQUEST;
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

// src/app/routes/index.route.ts
import { Router as Router9 } from "express";

// src/app/modules/meal/meal.route.ts
import { Router } from "express";

// src/app/middleware/auth.ts
import status4 from "http-status";

// src/app/utils/cookie.ts
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

// src/app/utils/jwt.ts
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

// src/app/middleware/auth.ts
var auth2 = (roles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (sessionToken) {
        const betterSession = await auth.api.getSession({
          headers: req.headers
        });
        if (betterSession?.session) {
          const sessionData = await prisma.session.findFirst({
            where: {
              token: betterSession.session.token,
              expiresAt: { gt: /* @__PURE__ */ new Date() }
            },
            include: { user: true }
          });
          if (sessionData?.user) {
            const { user } = sessionData;
            handleSessionExpiryHeader(res, sessionData);
            validateUserStatus(user.status);
            validateUserRole(user.role, roles);
            req.user = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              emailVerified: user.emailVerified,
              status: user.status,
              isActive: user.isActive
            };
            return next();
          }
        }
      }
      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (verifiedToken.success && verifiedToken.data) {
          const userData = verifiedToken.data;
          validateUserRole(userData.role, roles);
          req.user = {
            id: userData.id,
            role: userData.role,
            email: userData.email,
            emailVerified: userData.emailVerified,
            isActive: userData.isActive,
            name: userData.name,
            status: userData.status
          };
          return next();
        }
      }
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized! Please login to continue.");
    } catch (error) {
      next(new AppError_default(error.statusCode || status4.BAD_REQUEST, error.message));
    }
  };
};
var validateUserStatus = (userStatus) => {
  const forbiddenStatus = ["suspend"];
  if (forbiddenStatus.includes(userStatus)) {
    throw new AppError_default(status4.UNAUTHORIZED, "Access denied! Your account is not active.");
  }
};
var validateUserRole = (userRole, allowedRoles) => {
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    throw new AppError_default(status4.FORBIDDEN, "Forbidden! You don't have permission.");
  }
};
var handleSessionExpiryHeader = (res, session) => {
  const now = (/* @__PURE__ */ new Date()).getTime();
  const expiresAt = new Date(session.expiresAt).getTime();
  const createdAt = new Date(session.createdAt).getTime();
  const totalLife = expiresAt - createdAt;
  const remaining = expiresAt - now;
  const percentRemaining = remaining / totalLife * 100;
  if (percentRemaining < 20) {
    res.setHeader("X-Session-Refresh", "true");
    res.setHeader("X-Session-Expires-At", new Date(expiresAt).toISOString());
  }
};
var auth_default = auth2;

// src/app/middleware/auth.const.ts
var UserRoles = {
  Admin: "Admin",
  Customer: "Customer",
  Provider: "Provider"
};

// src/app/modules/meal/meal.service.ts
import status5 from "http-status";
var createMeal = async (data, email) => {
  if (!data.image) {
    throw new AppError_default(404, "Image is required");
  }
  const providerid = await prisma.user.findUnique({
    where: { email },
    include: { provider: { select: { id: true } } }
  });
  if (!providerid) {
    throw new AppError_default(status5.NOT_FOUND, "provider not found");
  }
  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name
    }
  });
  if (!categoryCheck) {
    throw new AppError_default(status5.NOT_FOUND, "category not found");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId: providerid.provider.id,
      deliverycharge: data.deliverycharge !== void 0 ? data.deliverycharge : 0
    }
  });
  return result;
};
var getAllmeals = async (data, isAvailable, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (search) {
      orConditions.push(
        {
          meals_name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
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
        gte: 0,
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
      provider: {
        include: { user: true }
      },
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
  const mealsWithStats = meals.map((meal) => {
    const totalReviews = meal.reviews.length;
    const avgRating = totalReviews > 0 ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    return { ...meal, avgRating, totalReviews };
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
var getMealByProvider = async () => {
  const meal = await prisma.meal.findFirst({
    where: {
      status: "APPROVED"
    },
    select: {
      deliverycharge: true
    }
  });
  return meal;
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
          user: true,
          meals: {
            include: {
              reviews: {
                where: {
                  parentId: null,
                  status: "APPROVED",
                  rating: { gt: 0 }
                }
              }
            }
          }
        }
      },
      reviews: {
        where: {
          parentId: null,
          status: "APPROVED",
          rating: { gt: 0 }
        },
        include: {
          replies: {
            include: {
              customer: true,
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
  const mealTotalReviews = result.reviews.length;
  const mealAvgRating = mealTotalReviews > 0 ? Number(
    (result.reviews.reduce((sum, review) => sum + review.rating, 0) / mealTotalReviews).toFixed(1)
  ) : 0;
  const providerMeals = result.provider?.meals ?? [];
  let providerTotalReviews = 0;
  let providerRatingSum = 0;
  providerMeals.forEach((meal) => {
    const ratingReviews = meal.reviews.filter(
      (review) => typeof review.rating === "number"
    );
    providerTotalReviews += ratingReviews.length;
    providerRatingSum += ratingReviews.reduce((sum, r) => sum + r.rating, 0);
  });
  const providerAvgRating = providerTotalReviews > 0 ? Number((providerRatingSum / providerTotalReviews).toFixed(1)) : 0;
  return {
    ...result,
    avgRating: mealAvgRating,
    totalReviews: mealTotalReviews,
    providerRating: {
      averageRating: providerAvgRating,
      totalReview: providerTotalReviews
    }
  };
};
var UpdateMeals = async (data, mealid) => {
  const { category_name } = data;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid }
  });
  if (!existmeal) {
    throw new AppError_default(status5.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError_default(status5.CONFLICT, "category_name is already up to date.");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      meals_name: data.meals_name,
      description: data.description,
      ...data.image !== null && typeof data.image !== "undefined" ? { image: data.image } : {},
      price: data.price,
      isAvailable: data.isAvailable,
      category_name: data.category_name,
      cuisine: data.cuisine,
      dietaryPreference: data.dietaryPreference
    }
  });
  return result;
};
var DeleteMeals = async (mealid) => {
  const orderitem = await prisma.orderitem.findFirst({
    where: {
      mealId: mealid
    },
    select: {
      orderId: true
    }
  });
  await prisma.order.delete({ where: { id: orderitem?.orderId } });
  const result = await prisma.meal.delete({
    where: {
      id: mealid
    }
  });
  return result;
};
var getOwnMeals = async (email, data, isAvailable, page, limit, skip, sortBy, sortOrder, search) => {
  let userid;
  if (email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new AppError_default(status5.NOT_FOUND, "User not found");
    }
    userid = user.id;
  }
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (search) {
      orConditions.push(
        {
          meals_name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
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
  if (data?.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price)
      }
    });
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  if (data?.dietaryPreference?.length) {
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
      provider: {
        userId: userid
      },
      AND: andConditions
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
  const reviewData = await prisma.review.groupBy({
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
  const mealsData = meals.map((meal) => {
    const stats = reviewData.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      avgRating: stats?._avg?.rating || 0,
      // Default to 0
      totalReviews: stats?._count?.rating || 0
      // Default to 0
    };
  });
  const total = await prisma.meal.count({ where: {
    AND: andConditions,
    provider: {
      userId: userid
    }
  } });
  return {
    mealsData,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)) || 1
    }
  };
};
var updateStatus = async (data, mealid) => {
  const { status: status22 } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (existmeal?.status === status22) {
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
      status: status22
    }
  });
  return result;
};
var getAllMealsForAdmin = async (data, isAvailable, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (search) {
      orConditions.push(
        {
          meals_name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.status) {
      orConditions.push({
        status: {
          equals: data.status
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
        gte: 0,
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
      AND: andConditions
    },
    include: {
      provider: {
        include: { user: true }
      },
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
  const total = await prisma.meal.count({ where: { AND: andConditions } });
  return {
    data: meals,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var mealService = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  getAllmeals,
  getSinglemeals,
  getOwnMeals,
  updateStatus,
  getAllMealsForAdmin,
  getMealByProvider
};

// src/app/helpers/paginationHelping.ts
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

// src/app/shared/catchAsync.ts
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

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/modules/meal/meal.controller.ts
import status6 from "http-status";
var createMeal2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const result = await mealService.createMeal(payload, user.email);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "your meal has been created",
    data: result
  });
});
var UpdateMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({ success: false, message: "you are not authorized" });
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image || null
  };
  const result = await mealService.UpdateMeals(
    payload,
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "meal update successfully",
    data: result
  });
});
var DeleteMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await mealService.DeleteMeals(req.params.id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "your meal delete has been successfully",
    data: result
  });
});
var Getallmeals = catchAsync(async (req, res) => {
  const { search } = req.query;
  const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await mealService.getAllmeals(
    req.query,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: " retrieve all meals successfully",
    data: result
  });
});
var getAllMealsForAdmin2 = catchAsync(
  async (req, res) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    const { search } = req.query;
    const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
    const result = await mealService.getAllMealsForAdmin(
      req.query,
      isAvailable,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      search
    );
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: " retrieve all meals for admin successfully",
      data: result
    });
  }
);
var GetSignlemeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mealService.getSinglemeals(id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: " retrieve single meal successfully",
    data: result
  });
});
var getownmeals = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { search } = req.query;
  const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await mealService.getOwnMeals(
    user.email,
    req.query,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "your own meal retrieve has been successfully",
    data: result
  });
});
var DeviceryCharge = catchAsync(async (req, res) => {
  const { providerId } = req.query;
  if (!providerId) {
    return res.status(status6.BAD_REQUEST).json({
      success: false,
      message: "providerId is required"
    });
  }
  const meal = await mealService.getMealByProvider();
  if (!meal) {
    return res.status(status6.NOT_FOUND).json({
      success: false,
      message: "No meal found for this provider"
    });
  }
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Delivery charge retrieved successfully",
    data: { deliveryCharge: meal.deliverycharge }
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status6.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { id } = req.params;
  const result = await mealService.updateStatus(req.body, id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
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
  updateStatus: updateStatus2,
  getAllMealsForAdmin: getAllMealsForAdmin2,
  DeviceryCharge
};

// src/app/utils/handleZodError.ts
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

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
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
    const parsedResult = zodSchema.safeParse(req.body);
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

// src/app/modules/meal/meal.validation.ts
import z from "zod";
var CreatemealData = z.object({
  meals_name: z.string(),
  description: z.string().optional(),
  image: z.any(),
  price: z.number(),
  deliverycharge: z.number().optional(),
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
  image: z.any().optional(),
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
var mealupdateStatus = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

// src/app/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status7 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 6e4
});
var cloudinaryUpload = cloudinary;

// src/app/config/multer.config.ts
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `foodhub/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
      format: extension === "pdf" ? "pdf" : "webp",
      // ইমেজ হলে অটোমেটিক webp হবে (ফাইল সাইজ কমায়)
      transformation: extension !== "pdf" ? [{ quality: "auto", fetch_format: "auto" }] : void 0
    };
  }
});
var multerUpload = multer({ storage, limits: {
  fileSize: 1024 * 1024
} });

// src/app/modules/meal/meal.route.ts
var router = Router();
router.get("/meals", mealController.Getallmeals);
router.get("/deviveryCharge", mealController.DeviceryCharge);
router.get("/admin/meals", auth_default([UserRoles.Admin]), mealController.getAllMealsForAdmin);
router.get("/provider/meals/own", auth_default([UserRoles.Provider]), mealController.getownmeals);
router.post("/provider/meal", auth_default([UserRoles.Provider]), multerUpload.single("file"), validateRequest(CreatemealData), mealController.createMeal);
router.delete("/provider/meal/:id", auth_default([UserRoles.Provider, UserRoles.Admin]), mealController.DeleteMeals);
router.put("/provider/meal/:id", auth_default([UserRoles.Provider]), multerUpload.single("file"), validateRequest(UpdatemealData), mealController.UpdateMeals);
router.get("/meal/:id", mealController.GetSignlemeals);
router.patch("/meal/:id", auth_default([UserRoles.Admin]), mealController.updateStatus);
var mealRouter = { router };

// src/app/modules/provider/provider.route.ts
import { Router as Router2 } from "express";

// src/app/modules/provider/provider.service.ts
import status8 from "http-status";
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
var getAllProvider = async (query, isActive, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (search || query) {
    const orConditions = [];
    orConditions.push({
      restaurantName: {
        contains: search,
        mode: "insensitive"
      }
    });
    orConditions.push({
      address: {
        contains: search,
        mode: "insensitive"
      }
    });
    orConditions.push({
      description: {
        contains: search,
        mode: "insensitive"
      }
    });
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  const providers = await prisma.providerProfile.findMany({
    where: {
      AND: andConditions,
      user: {
        name: {
          contains: search,
          mode: "insensitive"
        },
        isActive,
        email: query?.email
      }
    },
    take: limit,
    skip,
    include: {
      user: true,
      meals: {
        include: {
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const result = providers.map((provider) => {
    const allReviews = provider.meals.flatMap((meal) => meal.reviews);
    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    return {
      ...provider,
      totalReviews,
      avgRating
    };
  });
  return result;
};
var getProviderWithMeals = async (id) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id }
  });
  if (!existprovider) {
    throw new AppError_default(status8.NOT_FOUND, "provider not found for this id");
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
        include: { category: true, reviews: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!provider) {
    throw new AppError_default(status8.NOT_FOUND, "provider not found for this id");
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
  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);
  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0
  );
  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
  return {
    result: {
      ...provider,
      totalReviews: totalReview || 0,
      avgRating: Number(averageRating.toFixed(1)) || 0
    }
  };
};
var getTopProviders = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      meals: {
        include: {
          reviews: {
            where: {
              parentId: null,
              status: "APPROVED"
            }
          }
        }
      }
    }
  });
  const topProviders = providers.map((provider) => {
    let totalRating = 0;
    let totalReviews = 0;
    provider.meals.forEach((meal) => {
      meal.reviews.filter((review) => review.parentId == null).forEach((review) => {
        if (typeof review.rating === "number") {
          totalRating += review.rating;
          totalReviews++;
        }
      });
    });
    const avgRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;
    return {
      id: provider.id,
      restaurantName: provider.restaurantName,
      ownerName: provider.user?.name || "N/A",
      email: provider.user?.email || "N/A",
      address: provider.address,
      description: provider.description,
      image: provider.image || provider.user?.image || null,
      totalReviews,
      avgRating
    };
  }).sort((a, b) => {
    if (b.avgRating !== a.avgRating) {
      return b.avgRating - a.avgRating;
    }
    return b.totalReviews - a.totalReviews;
  }).slice(0, 15);
  return { topProviders };
};
var UpateProviderProfile = async (data, email) => {
  if (!data) {
    throw new AppError_default(status8.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { email },
    include: {
      provider: true
    }
  });
  if (!providerinfo) {
    throw new AppError_default(status8.NOT_FOUND, "user not found");
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
  UpateProviderProfile,
  getTopProviders
};

// src/app/modules/provider/provider.controller.ts
import status9 from "http-status";
var createProvider2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await providerService.createProvider(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "your provider profile has been created",
      data: result
    });
  }
);
var gelAllprovider = catchAsync(
  async (req, res) => {
    const { search } = req.query;
    const isActive = req.query.isActive ? req.query.isActive === "true" ? true : req.query.isActive == "false" ? false : void 0 : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
    const result = await providerService.getAllProvider(req.query, isActive, page, limit, skip, sortBy, sortOrder, search);
    sendResponse(res, {
      httpStatusCode: status9.OK,
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
      httpStatusCode: status9.OK,
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
  const result = await providerService.UpateProviderProfile(req.body, user.email);
  if (!result) {
    sendResponse(res, {
      httpStatusCode: status9.BAD_REQUEST,
      success: false,
      message: "update provider profile failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "update provider profile successfully",
    data: result
  });
});
var getTopProviders2 = catchAsync(async (req, res) => {
  const result = await providerService.getTopProviders();
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "retrieve top providers successfully",
    data: result
  });
});
var providerController = { createProvider: createProvider2, gelAllprovider, getProviderWithMeals: getProviderWithMeals2, UpateProviderProfile: UpateProviderProfile2, getTopProviders: getTopProviders2 };

// src/app/modules/provider/provider.validation.ts
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

// src/app/modules/provider/provider.route.ts
var router2 = Router2();
router2.post("/provider/profile", auth_default([UserRoles.Provider]), validateRequest(CreateproviderData), providerController.createProvider);
router2.put("/provider/update", auth_default([UserRoles.Provider]), validateRequest(UpdateproviderData), providerController.UpateProviderProfile);
router2.get("/providers", providerController.gelAllprovider);
router2.get("/providers/:id", providerController.getProviderWithMeals);
router2.get("/top-providers", providerController.getTopProviders);
var providerRouter = { router: router2 };

// src/app/modules/order/order.route.ts
import { Router as Router3 } from "express";

// src/app/modules/order/order.service.ts
import { v6 as uuidv6 } from "uuid";
import status10 from "http-status";

// src/app/utils/parseDate.ts
function parseDateForPrisma(dateStr) {
  const parsedDate = new Date(dateStr);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format! Use YYYY-MM-DD or ISO string.");
  }
  const startOfDay = new Date(parsedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(parsedDate);
  endOfDay.setHours(23, 59, 59, 999);
  return { gte: startOfDay, lte: endOfDay };
}

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/modules/order/order.service.ts
var CreateOrder = async (payload, email) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) throw new AppError_default(404, "User not found");
  if (!payload.items?.length) {
    throw new AppError_default(400, "Order items are required");
  }
  const customerId = existingUser.id;
  const mealIds = payload.items.map((item) => item.mealId);
  const meals = await prisma.meal.findMany({
    where: { id: { in: mealIds } }
  });
  if (meals.length !== mealIds.length) {
    throw new AppError_default(404, "One or more meals were not found");
  }
  const mealById = new Map(meals.map((meal) => [meal.id, meal]));
  const providerIds = Array.from(new Set(meals.map((meal) => meal.providerId)));
  if (providerIds.length !== 1) {
    throw new AppError_default(
      400,
      "Single order supports meals from one provider only."
    );
  }
  const providerId = providerIds[0];
  const deliverycharge = Number(meals[0]?.deliverycharge ?? 0);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findMany({
        where: {
          paymentStatus: "UNPAID"
        }
      });
      if (existingOrder) {
        await prisma.order.deleteMany({
          where: {
            id: {
              in: existingOrder.map((item) => item.id)
            }
          }
        });
      }
      const existingActiveOrder = await tx.order.findMany({
        where: {
          customerId,
          providerId,
          status: { in: ["PLACED", "PREPARING", "READY"] },
          paymentStatus: "PAID"
        },
        include: {
          orderitem: { include: { meal: true } }
        }
      });
      const existingMealIds = existingActiveOrder.flatMap(
        (order2) => order2.orderitem.map((item) => item.mealId)
      );
      const matchedMealIds = existingMealIds.filter(
        (id) => mealIds.includes(id)
      );
      if (matchedMealIds.length > 0) {
        throw new AppError_default(
          409,
          `Already ordered meals: ${matchedMealIds.join(", ")}`
        );
      }
      const totalMealPrice = payload.items.reduce((sum, item) => {
        const meal = mealById.get(item.mealId);
        return sum + Number(meal?.price ?? 0) * item.quantity;
      }, 0);
      const order = await tx.order.create({
        data: {
          customerId,
          providerId,
          address: payload.address,
          phone: payload.phone,
          paymentStatus: deliverycharge > 0 ? "UNPAID" : "PAID",
          totalPrice: totalMealPrice,
          first_name: payload.first_name ?? null,
          last_name: payload.last_name ?? null,
          orderitem: {
            createMany: {
              data: payload.items.map((item) => {
                const meal = mealById.get(item.mealId);
                return {
                  mealId: item.mealId,
                  price: Number(meal?.price ?? 0),
                  quantity: item.quantity
                };
              })
            }
          }
        }
      });
      if (deliverycharge === 0) {
        return {
          order,
          payment: null,
          paymentUrl: null,
          message: "Order created successfully (no delivery charge)."
        };
      }
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: deliverycharge,
          transactionId: String(uuidv6()),
          status: "UNPAID",
          userId: customerId,
          mealId: payload.items[0].mealId
        }
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: { name: "Delivery charge" },
              unit_amount: 120 * 100
            },
            quantity: 1
          }
        ],
        metadata: {
          orderId: order.id,
          paymentId: payment.id
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
            paymentId: payment.id
          }
        },
        success_url: `${envVars.FRONTEND_URL}/payment/${order.id}?paymentId=${payment.id}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment/${order.id}?paymentId=${payment.id}`
      });
      return {
        order,
        payment,
        paymentUrl: session.url,
        message: "Order created successfully. Please complete payment from checkout URL."
      };
    });
    return result;
  } catch (error) {
    console.error(error);
    if (error instanceof AppError_default) throw error;
    throw new AppError_default(500, "Failed to create order. Please try again.");
  }
};
var getOwnmealsOrder = async (email, data, page, limit, skip, sortBy, sortOrder, search) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { provider: true }
  });
  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
      result: null
    };
  }
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  if (data?.phone) {
    andConditions.push({
      phone: data.phone
    });
  }
  if (data?.paymentStatus) {
    andConditions.push({
      paymentStatus: {
        equals: data.paymentStatus
      }
    });
  }
  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.totalPrice)
      }
    });
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: existingUser.id,
        AND: andConditions
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
      take: limit,
      skip,
      where: {
        providerId: existingUser.provider?.id,
        AND: andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      }
    });
    let total = 0;
    if (existingUser?.role === "Provider") {
      total = await prisma.order.count({
        where: {
          providerId: existingUser.provider?.id,
          AND: andConditions
        }
      });
    } else if (existingUser?.role === "Customer") {
      total = await prisma.order.count({
        where: {
          customerId: existingUser.id,
          AND: andConditions
        }
      });
    }
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalpage: Math.ceil(total / (limit || 1)) || 1
      }
    };
  }
};
var getOwnPaymentService = async (id, data, email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError_default(401, "User not found or unauthorized");
  }
  const orderres = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      payment: true
    }
  });
  if (orderres?.customerId !== user.id) {
    throw new AppError_default(403, "You are not authorized to view this order payment");
  }
  if (orderres?.paymentStatus == "UNPAID") {
    throw new AppError_default(400, "your payment is not paid");
  }
  if (!orderres?.payment || orderres.payment.id !== data.paymentId) {
    throw new AppError_default(404, "order payment not found");
  }
  if (!orderres) {
    throw new AppError_default(400, "Order not found for the provided ID or payment info");
  }
  return orderres;
};
var UpdateOrderStatus = async (id, data, role) => {
  const { status: status22 } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED"
  ];
  if (!statusValue.includes(status22)) {
    throw new AppError_default(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError_default(404, "no order found for this id");
  }
  if (existingOrder?.status == status22) {
    throw new AppError_default(409, `order already ${status22}`);
  }
  if (role == "Customer" && status22 !== "CANCELLED") {
    throw new AppError_default(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status22 == "CANCELLED") {
    if (existingOrder?.status == "DELIVERED" || existingOrder?.status == "PREPARING" || existingOrder?.status == "READY") {
      throw new AppError_default(
        400,
        `you can't cancel order when order status is ${existingOrder.status}`
      );
    }
    const result = await prisma.order.update({
      where: {
        id
      },
      data: {
        status: status22
      }
    });
    return result;
  }
  if (role == "Provider" && status22 === "CANCELLED") {
    throw new AppError_default(400, "CANCELLED only Customer Change");
  }
  if (role == "Provider") {
    if (status22 == "PLACED" || status22 == "PREPARING" || status22 == "READY" || status22 == "DELIVERED") {
      const result = await prisma.order.update({
        where: {
          id
        },
        data: {
          status: status22
        }
      });
      return {
        success: true,
        message: `update order status successfully`,
        result
      };
    }
  }
  if (role === "Admin") {
    const result = await prisma.order.update({
      where: {
        id
      },
      data: {
        status: status22
      }
    });
    return {
      success: true,
      message: `update order status successfully`,
      result
    };
  }
};
var getAllorder = async (role, data, page, limit, skip, sortBy, sortOrder, search) => {
  if (role !== "Admin") {
    throw new AppError_default(403, "View all orders is only allowed for Admin users.");
  }
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  if (data?.phone) {
    andConditions.push({
      phone: data.phone
    });
  }
  if (data?.paymentStatus) {
    andConditions.push({
      paymentStatus: {
        equals: data.paymentStatus
      }
    });
  }
  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.totalPrice)
      }
    });
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  const result = await prisma.order.findMany({
    where: {
      AND: andConditions
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
  const total = await prisma.order.count({
    where: {
      AND: andConditions
    }
  });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)) || 1
    }
  };
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
    throw new AppError_default(status10.NOT_FOUND, "no order found for this meal");
  }
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder
  };
};
var CustomerRunningAndOldOrder = async (userid, status22) => {
  const andConditions = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status22;
  if (status22 == "DELIVERED") {
    andConditions.push({ status: status22 });
    message = "Recent order information retrieved successfully.", currentStatus = status22;
  }
  if (status22 == "CANCELLED") {
    andConditions.push({ status: status22 });
    message = "CANCELLED order information retrieved successfully.", currentStatus = status22;
  }
  if (status22 == "PLACED" || status22 == "PREPARING" || status22 == "READY") {
    andConditions.push({ status: status22 });
    message = "running order retrieved successfully.", currentStatus = status22;
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
    throw new AppError_default(status10.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result
  };
};
var deleteOrder = async (id, role) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id }
  });
  if (!existingOrder) {
    throw new AppError_default(status10.NOT_FOUND, "Order not found");
  }
  const deletedOrder = await prisma.order.delete({
    where: { id }
  });
  return {
    success: true,
    message: "Order deleted successfully",
    result: deletedOrder
  };
};
var ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder,
  getOwnPaymentService,
  deleteOrder
};

// src/app/modules/order/order.controller.ts
import status11 from "http-status";
var createOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.email);
    sendResponse(res, {
      httpStatusCode: status11.CREATED,
      success: true,
      message: "your order has been created successfully",
      data: result
    });
  }
);
var getOwnmealsOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { search } = req.query;
  if (!user) {
    return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await ServiceOrder.getOwnmealsOrder(user.email, req.query, page, limit, skip, sortBy, sortOrder, search);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "your own meals orders retrieve successfully",
    data: result
  });
});
var UpdateOrderStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.UpdateOrderStatus(req.params.id, req.body, user.role);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "update order status successfully",
      data: result
    });
  }
);
var getAllOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    const { search } = req.query;
    if (!user) {
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
    const result = await ServiceOrder.getAllorder(user.role, req.query, page, limit, skip, sortBy, sortOrder, search);
    if (!result) {
      sendResponse(res, {
        httpStatusCode: status11.BAD_REQUEST,
        success: false,
        message: "retrieve all orders failed",
        data: result
      });
    }
    sendResponse(res, {
      httpStatusCode: status11.OK,
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    const { search } = req.query;
    const result = await ServiceOrder.customerOrderStatusTrack(req.params.id, users.id);
    if (!result?.success) {
      sendResponse(res, {
        httpStatusCode: status11.BAD_REQUEST,
        success: false,
        message: result?.message,
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status11.OK,
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
      return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id, req.query.status);
    if (!result.success) {
      sendResponse(res, {
        httpStatusCode: status11.BAD_REQUEST,
        success: false,
        message: "customer order status track failed",
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status11.OK,
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
      httpStatusCode: status11.BAD_REQUEST,
      success: false,
      message: "retrieve single order failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "retrieve single order successfully",
    data: result?.result
  });
});
var getOwnPayment = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ServiceOrder.getOwnPaymentService(req.params.id, req.query, user?.email);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Fetched own payment order successfully",
    data: result
  });
});
var deleteOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const orderId = req.params.id;
  try {
    const result = await ServiceOrder.deleteOrder(orderId, user.role);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Order deleted successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: error.statusCode || status11.BAD_REQUEST,
      success: false,
      message: error.message || "Failed to delete order",
      data: error
    });
  }
});
var OrderController = {
  createOrder,
  getOwnmealsOrder: getOwnmealsOrder2,
  UpdateOrderStatus: UpdateOrderStatus2,
  getAllOrder,
  customerOrderStatusTrack: customerOrderStatusTrack2,
  CustomerRunningAndOldOrder: CustomerRunningAndOldOrder2,
  getSingleOrder: getSingleOrder2,
  getOwnPayment,
  deleteOrder: deleteOrder2
};

// src/app/modules/order/order.validation.ts
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

// src/app/modules/order/order.route.ts
var router3 = Router3();
router3.post("/orders", auth_default([UserRoles.Customer]), validateRequest(CreateorderData), OrderController.createOrder);
router3.get("/orders/meal/:id/status", auth_default([UserRoles.Customer]), OrderController.customerOrderStatusTrack);
router3.get("/myorders/status", auth_default([UserRoles.Customer]), OrderController.CustomerRunningAndOldOrder);
router3.get("/orders/all", auth_default([UserRoles.Admin]), OrderController.getAllOrder);
router3.get("/orders", auth_default([UserRoles.Customer, UserRoles.Provider]), OrderController.getOwnmealsOrder);
router3.patch("/provider/orders/:id", auth_default([UserRoles.Provider, UserRoles.Customer, UserRoles.Admin]), OrderController.UpdateOrderStatus);
router3.get("/orders/:id", auth_default([UserRoles.Customer]), OrderController.getSingleOrder);
router3.delete("/order/:id", auth_default([UserRoles.Admin]), OrderController.deleteOrder);
router3.get("/order/:id/own-payment", auth_default([UserRoles.Customer]), OrderController.getOwnPayment);
var OrderRouter = { router: router3 };

// src/app/modules/category/category.route.ts
import { Router as Router4 } from "express";

// src/app/modules/category/category.service.ts
import status12 from "http-status";
var CreateCategory = async (data, email) => {
  if (!data.image) {
    throw new AppError_default(404, "Image is required");
  }
  const adminUser = await prisma.user.findUnique({
    where: { email }
  });
  if (!adminUser) {
    throw new AppError_default(status12.UNAUTHORIZED, "Admin user not found or unauthorized");
  }
  const adminId = adminUser.id;
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
var getCategory = async (data, page, limit, skip) => {
  const andConditions = [];
  if (data?.name) {
    andConditions.push({
      name: data.name
    });
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (data?.adminId) {
    andConditions.push({
      adminId: {
        contains: data.adminId,
        mode: "insensitive"
      }
    });
  }
  if (data?.id) {
    andConditions.push({
      id: {
        contains: data.id,
        mode: "insensitive"
      }
    });
  }
  const result = await prisma.category.findMany({
    where: {
      AND: andConditions
    },
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
  const total = await prisma.category.count({ where: {
    AND: andConditions
  } });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
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
  if (result && Array.isArray(result.meals)) {
    result.meals = result.meals.map((meal) => {
      let totalRating = 0;
      let totalReviews = 0;
      if (Array.isArray(meal.reviews)) {
        meal.reviews = meal.reviews.filter(
          (review) => review.status === "APPROVED" && review.parentId === null || typeof review.status === "undefined"
        );
        meal.reviews.forEach((review) => {
          if ((review.status === "APPROVED" || typeof review.status === "undefined") && typeof review.rating === "number") {
            totalRating += review.rating;
            totalReviews++;
          }
        });
      }
      const avgRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;
      return {
        ...meal,
        avgRating,
        totalReviews
      };
    });
  }
  return result;
};
var UpdateCategory = async (id, data) => {
  const { name } = data;
  if (!data.image) {
    throw new AppError_default(404, "Image is required");
  }
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

// src/app/modules/category/category.controller.ts
import { status as status13 } from "http-status";
var CreateCategory2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status13.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const payload = {
      ...req.body,
      image: req.file?.path || req.body.image
    };
    const result = await categoryService.CreateCategory(
      payload,
      user.email
    );
    sendResponse(res, {
      httpStatusCode: status13.CREATED,
      success: true,
      message: "your category has been created",
      data: result
    });
  }
);
var getCategory2 = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await categoryService.getCategory(req.query, page, limit, skip);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "retrieve category successfully",
    data: result
  });
});
var SingleCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.SingleCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
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
    httpStatusCode: status13.OK,
    success: true,
    message: "your category has beed changed",
    data: result
  });
});
var DeleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.DeleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
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

// src/app/modules/category/category.validation.ts
import z4 from "zod";
var createcategoryData = z4.object({
  name: z4.string(),
  image: z4.any()
}).strict();
var UpdatecategoryData = z4.object({
  name: z4.string().optional(),
  image: z4.any().optional()
}).strict();

// src/app/modules/category/category.route.ts
var router4 = Router4();
router4.post("/admin/category", auth_default([UserRoles.Admin]), multerUpload.single("file"), validateRequest(createcategoryData), CategoryController.CreateCategory);
router4.get("/category", CategoryController.getCategory);
router4.get("/category/:id", CategoryController.SingleCategory);
router4.put("/admin/category/:id", auth_default([UserRoles.Admin]), validateRequest(UpdatecategoryData), CategoryController.UpdateCategory);
router4.delete("/admin/category/:id", auth_default([UserRoles.Admin]), CategoryController.DeleteCategory);
var CategoryRouter = { router: router4 };

// src/app/modules/user/user.route.ts
import { Router as Router5 } from "express";

// src/app/modules/user/user.service.ts
import status14 from "http-status";
var GetAllUsers = async (data, isactivequery, emailVerifiedquery, page, limit, skip, sortBy, sortOrder, search) => {
  const andCondition = [];
  if (typeof data.email == "string") {
    andCondition.push({
      email: data.email
    });
  }
  if (typeof isactivequery === "boolean") {
    andCondition.push({ isActive: isactivequery });
  }
  if (typeof data.name == "string") {
    andCondition.push({
      name: data.name
    });
  }
  if (typeof data.phone == "string") {
    andCondition.push({
      email: data.phone
    });
  }
  if (typeof emailVerifiedquery == "boolean") {
    andCondition.push({ emailVerified: emailVerifiedquery });
  }
  if (typeof data.role == "string") {
    andCondition.push({ role: data.role });
  }
  if (typeof data.status == "string") {
    andCondition.push({ status: data.status });
  }
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
      ...data.data?.isActive !== null ? { isActive: data.data?.isActive } : {}
    },
    include: {
      provider: true,
      accounts: true
    },
    orderBy: {
      [data.sortBy]: data.sortOrder
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: andCondition,
      ...data.data?.isActive !== null ? { isActive: data.data?.isActive } : {}
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var getUserprofile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(status14.NOT_FOUND, "user not found for this id");
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
var UpateUserProfile = async (data, email) => {
  if (!data) {
    throw new AppError_default(400, "your data isn't found,please provide a information");
  }
  const userinfo = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true
    }
  });
  if (!userinfo) {
    throw new AppError_default(404, "user data not found");
  }
  const isCustomer = userinfo.role == "Customer";
  const result = await prisma.user.update({
    where: { email },
    data: {
      name: data.name,
      image: data.image,
      bgimage: data.bgimage,
      phone: data.phone,
      isActive: data.isActive,
      ...isCustomer ? {} : { email: data.email },
      accounts: {
        updateMany: {
          where: { userId: userinfo.id },
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

// src/app/modules/user/user.controller.ts
import status15 from "http-status";
var GetAllUsers2 = catchAsync(async (req, res) => {
  const { search } = req.query;
  const { isActive } = req.query;
  const isactivequery = isActive ? req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0 : void 0;
  const emailVerifiedquery = req.query.emailVerified ? req.query.emailVerified === "true" ? true : req.query.emailVerified === "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await UserService.GetAllUsers(
    req.query,
    isactivequery,
    emailVerifiedquery,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result
  });
});
var getUserprofile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status15.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.getUserprofile(req.params.id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
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
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const result = await UserService.UpateUserProfile(
    payload,
    user.email
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
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
      httpStatusCode: status15.OK,
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
      httpStatusCode: status15.OK,
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
    httpStatusCode: status15.OK,
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

// src/app/modules/user/user.validation.ts
import z5 from "zod";
var UpdateuserProfileData = z5.object({
  name: z5.string().optional(),
  image: z5.any().optional(),
  bgimage: z5.string().optional(),
  email: z5.string().optional(),
  password: z5.string().min(8).optional(),
  phone: z5.string().min(10).max(15).optional(),
  isActive: z5.boolean().optional()
}).strict();
var UpdateUserCommonData = z5.object({
  role: z5.enum(["Admin", "Customer", "Provider"]).optional(),
  status: z5.enum(["activate", "suspend"]).optional(),
  email: z5.string().optional()
}).strict();

// src/app/modules/user/user.route.ts
var router5 = Router5();
router5.get("/admin/users", auth_default([UserRoles.Admin]), UserController.GetAllUsers);
router5.put("/user/profile/update", auth_default([UserRoles.Customer, UserRoles.Provider, UserRoles.Admin]), validateRequest(UpdateuserProfileData), UserController.UpateUserProfile);
router5.get("/user/profile/:id", auth_default([UserRoles.Customer, UserRoles.Admin, UserRoles.Provider]), UserController.getUserprofile);
router5.put("/admin/profile/:id", auth_default([UserRoles.Admin]), validateRequest(UpdateUserCommonData), UserController.UpdateUser);
router5.delete("/user/profile/own", auth_default([UserRoles.Provider, UserRoles.Customer, UserRoles.Admin]), UserController.OwnProfileDelete);
router5.delete("/user/profile/:id", auth_default([UserRoles.Admin]), UserController.DeleteUserProfile);
var UserRouter = { router: router5 };

// src/app/modules/reviews/reviews.route.ts
import { Router as Router6 } from "express";

// src/app/modules/reviews/reviews.service.ts
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
    throw new AppError_default(404, "your review not found,please update your own review");
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
  const review = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "review not found");
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
  const { status: status22 } = data;
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
      status: status22
    }
  });
  return result;
};
var getAllreviews = async (data, page, limit, skip, sortBy, sortOrder, search) => {
  const andConditions = [];
  if (search) {
    const orConditions = [];
    orConditions.push(
      {
        comment: {
          contains: search,
          mode: "insensitive"
        }
      }
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (data?.rating) {
    andConditions.push({
      rating: {
        equals: data.rating
      }
    });
  }
  if (data?.parentId) {
    andConditions.push({
      parentId: {
        equals: data.parentId
      }
    });
  }
  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status
      }
    });
  }
  const result = await prisma.review.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    include: {
      customer: true,
      meal: true,
      replies: true
    }
  });
  const total = await prisma.review.count({ where: {
    AND: andConditions
  } });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
  return result;
};
var ReviewsService = { CreateReviews, updateReview, deleteReview, getReviewByid, moderateReview, getAllreviews };

// src/app/modules/reviews/reviews.controller.ts
import status16 from "http-status";
var CreateReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsService.CreateReviews(user.id, req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status16.CREATED,
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
    httpStatusCode: status16.OK,
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
      httpStatusCode: status16.OK,
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
    httpStatusCode: status16.OK,
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
      httpStatusCode: status16.OK,
      success: true,
      message: "retrieve review by id successfully",
      data: result
    });
  }
);
var getAllreviews2 = catchAsync(
  async (req, res) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
      req.query
    );
    const { search } = req.query;
    const result = await ReviewsService.getAllreviews(req.query, page, limit, skip, sortBy, sortOrder, search);
    sendResponse(res, {
      httpStatusCode: status16.OK,
      success: true,
      message: "retrieve all reviews successfully",
      data: result
    });
  }
);
var ReviewsController = { CreateReviews: CreateReviews2, updateReview: updateReview2, deleteReview: deleteReview2, getReviewByid: getReviewByid2, moderateReview: moderateReview2, getAllreviews: getAllreviews2 };

// src/app/modules/reviews/reviews.validation.ts
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

// src/app/modules/reviews/reviews.route.ts
var router6 = Router6();
router6.post("/meal/:id/review", auth_default([UserRoles.Customer]), validateRequest(createReviewsData), ReviewsController.CreateReviews);
router6.put("/review/:reviewid", auth_default([UserRoles.Customer]), validateRequest(updateReviewsData), ReviewsController.updateReview);
router6.delete("/review/:reviewid", auth_default([UserRoles.Customer, UserRoles.Admin]), ReviewsController.deleteReview);
router6.get("/reviews", ReviewsController.getAllreviews);
router6.get("/review/:reviewid", ReviewsController.getReviewByid);
router6.patch("/review/:reviewid/moderate", auth_default([UserRoles.Admin]), validateRequest(moderateData), ReviewsController.moderateReview);
var ReviewsRouter = { router: router6 };

// src/app/modules/auth/auth.route.ts
import { Router as Router7 } from "express";

// src/app/utils/token.ts
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

// src/app/modules/auth/auth.service.ts
import status17 from "http-status";
var getCurrentUser = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { provider: true }
  });
  if (!user) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  return user;
};
var signoutUser = async (sessionToken) => {
  await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return {
    success: true,
    message: `current user signout successfully`
  };
};
var signup = async (data) => {
  const {
    name,
    email,
    password,
    image,
    phone,
    role,
    restaurantName,
    address,
    description
  } = data;
  const userExist = await prisma.user.findUnique({
    where: { email }
  });
  if (!image) {
    throw new AppError_default(
      status17.BAD_REQUEST,
      "Image is required to register a user."
    );
  }
  if (userExist) {
    throw new AppError_default(status17.CONFLICT, "Email already in use");
  }
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      image,
      phone,
      role
    }
  });
  if (data.role === "Provider") {
    await prisma.providerProfile.create({
      data: {
        userId: result.user.id,
        restaurantName,
        address,
        description
      }
    });
  }
  await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password
    }
  });
  return {
    ...result.user,
    token: result.token
  };
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
    throw new AppError_default(status17.UNAUTHORIZED, "User is suspend");
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
    throw new AppError_default(status17.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status17.UNAUTHORIZED, "Invalid refresh token");
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
var verifyEmail = async (email, otp) => {
  const data = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (data.status && !data.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var sendOtp = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  if (user.status === "suspend") {
    throw new AppError_default(status17.NOT_FOUND, "your are suspend");
  }
  if (user.emailVerified) {
    throw new AppError_default(status17.BAD_REQUEST, "Email already verified");
  }
  const result = await auth.api.sendVerificationOTP({
    body: {
      email,
      // required
      type: "email-verification"
    }
  });
  return result;
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  if (isUserExist.status == "suspend") {
    throw new AppError_default(status17.NOT_FOUND, "your account is suspend");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status17.NOT_FOUND, "User not found");
  }
  if (isUserExist.status == "suspend") {
    throw new AppError_default(status17.NOT_FOUND, "your account is suspend");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status17.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!result) {
    throw new AppError_default(400, "user change password failed");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken,
  verifyEmail,
  sendOtp,
  forgetPassword,
  resetPassword,
  changePassword
};

// src/app/modules/auth/auth.controller.ts
import status18 from "http-status";
var getCurrentUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.email);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "retrieve current user successsfully",
    data: result
  });
});
var signoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.signoutUser(betterAuthSessionToken);
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
    httpStatusCode: status18.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var signup2 = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image
  };
  const result = await authService.signup(payload);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
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
    httpStatusCode: status18.OK,
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
      throw new AppError_default(status18.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status18.OK,
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
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var sendOtp2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.sendOtp(email);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "OTP sent to email successfully"
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var authController = {
  getCurrentUser: getCurrentUser2,
  signoutUser: signoutUser2,
  signup: signup2,
  signin: signin2,
  getNewToken: getNewToken2,
  verifyEmail: verifyEmail2,
  sendOtp: sendOtp2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  changePassword: changePassword2
};

// src/app/modules/auth/auth.validation.ts
import z7 from "zod";
var createUserSchema = z7.object({
  name: z7.string(),
  email: z7.string().email(),
  password: z7.string().min(6),
  image: z7.any(),
  phone: z7.string(),
  role: z7.string(),
  restaurantName: z7.string(),
  address: z7.string(),
  description: z7.string()
});
var updateValidation = z7.object({
  name: z7.string().optional(),
  email: z7.string().email().optional(),
  password: z7.string().min(6).optional(),
  image: z7.any().optional(),
  bgimage: z7.string().optional(),
  phone: z7.string().optional(),
  role: z7.string().optional(),
  restaurantName: z7.string().optional(),
  address: z7.string().optional(),
  description: z7.string().optional()
});

// src/app/modules/auth/auth.route.ts
var router7 = Router7();
router7.get("/me", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.getCurrentUser);
router7.post("/logout", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.signoutUser);
router7.post("/register", multerUpload.single("file"), validateRequest(createUserSchema), authController.signup);
router7.post("/login", authController.signin);
router7.post("/change-password", auth_default([UserRoles.Admin, UserRoles.Provider, UserRoles.Customer]), authController.changePassword);
router7.post("/refresh-token", authController.getNewToken);
router7.post("/verify-email", authController.verifyEmail);
router7.post("/send-otp", authController.sendOtp);
router7.post("/forget-password", authController.forgetPassword);
router7.post("/reset-password", authController.resetPassword);
var authRouter = { router: router7 };

// src/app/modules/stats/stats.route.ts
import express from "express";

// src/app/modules/stats/stats.controller.ts
import status20 from "http-status";

// src/app/modules/stats/stats.service.ts
import status19 from "http-status";
var getDashboardStatsData = async (user) => {
  const userExists = await prisma.user.findUnique({
    where: { email: user.email }
  });
  if (!userExists) {
    throw new AppError_default(status19.NOT_FOUND, "User does not exist");
  }
  let statsData;
  switch (user.role) {
    case Role.Admin:
      statsData = getAdminDashboardStats();
      break;
    case Role.Provider:
      statsData = getProviderDashboardStats(userExists.id);
      break;
    default:
      throw new AppError_default(status19.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getAdminDashboardStats = async () => {
  try {
    const counts = await prisma.$transaction([
      prisma.meal.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.review.count(),
      prisma.payment.count()
    ]);
    const [mealsCount, userCount, orderCount, reviewCount, paymentCount] = counts;
    const [approvedmeals, pendingmeals, rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { status: "APPROVED" } }),
      prisma.meal.count({ where: { status: "PENDING" } }),
      prisma.meal.count({ where: { status: "REJECTED" } })
    ]);
    const [cancelledorder, deliveredorder, placedorder, preparingorder, readyorder] = await Promise.all([
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "PLACED" } }),
      prisma.order.count({ where: { status: "PREPARING" } }),
      prisma.order.count({ where: { status: "READY" } })
    ]);
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID }
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;
    const payments = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true }
    });
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = {};
    payments.forEach((payment) => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });
    const barChartData = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0
    }));
    return {
      counts: {
        mealsCount,
        orderCount,
        reviewCount,
        userCount,
        paymentCount
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      order: {
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder
      },
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      }
      // pieChartData,
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    throw new Error("Could not fetch dashboard stats");
  }
};
var getProviderDashboardStats = async (userId) => {
  try {
    const provider = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    if (!provider) {
      throw new Error("Provider not found");
    }
    const counts = await prisma.$transaction([
      prisma.meal.count({
        where: { provider: { userId } }
      }),
      prisma.order.count({
        where: { provider: { userId } }
      })
    ]);
    const [mealsCount, orderCount] = counts;
    const [approvedmeals, pendingmeals, rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { provider: { userId }, status: "APPROVED" } }),
      prisma.meal.count({ where: { provider: { userId }, status: "PENDING" } }),
      prisma.meal.count({ where: { provider: { userId }, status: "REJECTED" } })
    ]);
    const [cancelledorder, deliveredorder, placedorder, preparingorder, readyorder] = await Promise.all([
      prisma.order.count({ where: { provider: { userId }, status: "CANCELLED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "DELIVERED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "PLACED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "PREPARING" } }),
      prisma.order.count({ where: { provider: { userId }, status: "READY" } })
    ]);
    const providerOrders = await prisma.order.findMany({
      where: {
        provider: { userId }
      },
      select: { id: true }
    });
    const orderIds = providerOrders.map((order) => order.id);
    let totalRevenue = 0;
    let barChartData = [];
    if (orderIds.length > 0) {
      const revenueResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          orderId: { in: orderIds },
          status: PaymentStatus.PAID
        }
      });
      totalRevenue = revenueResult._sum.amount ?? 0;
      const payments = await prisma.payment.findMany({
        where: {
          orderId: { in: orderIds },
          status: PaymentStatus.PAID
        },
        select: { amount: true, createdAt: true }
      });
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenue = {};
      payments.forEach((payment) => {
        const month = payment.createdAt.getMonth();
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
      });
      barChartData = monthNames.map((month, idx) => ({
        month,
        revenue: monthlyRevenue[idx] ?? 0
      }));
    } else {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      barChartData = monthNames.map((month) => ({ month, revenue: 0 }));
    }
    return {
      counts: {
        mealsCount,
        orderCount
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      },
      order: {
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder
      }
    };
  } catch (error) {
    console.error("Failed to fetch provider dashboard stats:", error);
    throw new Error("Could not fetch provider dashboard stats");
  }
};
var statsService = { getDashboardStatsData };

// src/app/modules/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status20.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await statsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2
};

// src/app/modules/stats/stats.route.ts
var router8 = express.Router();
router8.get(
  "/stats",
  auth_default([Role.Admin, Role.Provider]),
  StatsController.getDashboardStatsData
);
var StatsRoutes = router8;

// src/app/modules/payment/payment.route.ts
import { Router as Router8 } from "express";

// src/app/modules/payment/payment.controller.ts
import status21 from "http-status";

// src/app/modules/payment/payment.service.ts
var deleteParticipantAndPayment = async (participantId, paymentId) => {
  if (!participantId || !paymentId) {
    console.error("Missing participantId or paymentId in session metadata");
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: { id: paymentId }
    });
    await tx.order.deleteMany({
      where: { id: participantId }
    });
  });
  console.log(
    `Payment failed. Deleted participant ${participantId} and payment ${paymentId}`
  );
};
var cleanupAllUnpaidPayments = async () => {
  const unpaidPayments = await prisma.payment.findMany({
    where: { status: PaymentStatus.UNPAID },
    select: { id: true, orderId: true }
  });
  if (!unpaidPayments.length) {
    return { deletedPayments: 0, deletedParticipants: 0 };
  }
  const paymentIds = unpaidPayments.map((p) => p.id);
  const orderIds = unpaidPayments.map((p) => p.orderId);
  const [deletedPayments, deletedParticipants] = await prisma.$transaction([
    prisma.payment.deleteMany({
      where: { id: { in: paymentIds } }
    }),
    prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    })
  ]);
  return {
    deletedPayments: deletedPayments.count,
    deletedParticipants: deletedParticipants.count
  };
};
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      if (!orderId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return {
          message: "Missing appointmentId or paymentId in session metadata"
        };
      }
      const order = await prisma.order.findUnique({
        where: {
          id: orderId
        }
      });
      if (!order) {
        console.error(`order with id ${orderId} not found`);
        return { message: `order with id ${orderId} not found` };
      }
      if (session.payment_status !== "paid") {
        await deleteParticipantAndPayment(orderId, paymentId);
        await cleanupAllUnpaidPayments();
        break;
      }
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            paymentStatus: PaymentStatus.PAID
          }
        });
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.PAID,
            paymentGatewayData: session
          }
        });
      });
      console.log(
        `Processed checkout.session.completed for order ${orderId} and payment ${paymentId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} succeeded.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    case "payment_intent.canceled": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(orderId, paymentId);
      await cleanupAllUnpaidPayments();
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var getAllPaymentsService = async (email, page, limit, skip, sortBy, sortOrder, query) => {
  await cleanupAllUnpaidPayments();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.role !== "Admin") {
    throw new Error("Unauthorized: Only admin can access all payments");
  }
  const filters = [];
  if (query.status) filters.push({ status: query.status });
  if (query.amount) filters.push({ amount: Number(query.amount) });
  if (query.paymentStatus) filters.push({ status: query.paymentStatus });
  if (query.createdAt) {
    const dateRange = parseDateForPrisma(query.createdAt);
    filters.push({ createdAt: dateRange });
  }
  if (query.userId) filters.push({ userId: query.userId });
  if (query.eventId) filters.push({ eventId: query.eventId });
  const whereOptions = filters.length ? { AND: filters } : {};
  ;
  const payments = await prisma.payment.findMany({
    where: whereOptions,
    skip,
    take: limit,
    orderBy: { "createdAt": "desc" },
    include: {
      meal: true,
      order: true,
      user: true
    }
  });
  const total = await prisma.payment.count({ where: whereOptions });
  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updatePaymentStatusWithOrderCheck = async (paymentId, newStatus) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { meal: true }
  });
  if (!payment) {
    throw new AppError_default(404, "Payment not found");
  }
  if (!payment.meal) {
    throw new AppError_default(404, "Associated meal not found");
  }
  if (newStatus.toUpperCase() === PaymentStatus.UNPAID) {
    const [deletedPayment, deletedParticipant] = await prisma.$transaction([
      prisma.payment.delete({
        where: { id: paymentId }
      }),
      prisma.order.delete({
        where: { id: payment.orderId }
      })
    ]);
    return {
      payment: deletedPayment,
      participant: deletedParticipant,
      message: "Payment is UNPAID, so payment and order were deleted"
    };
  }
  const [updatedPayment, updatedOrder] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus }
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: newStatus }
    })
  ]);
  return {
    payment: updatedPayment,
    order: updatedOrder
  };
};
var deletePayment = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (!payment.order) {
    throw new Error("Associated participant not found");
  }
  const [deletedPayment, deletedOrder] = await prisma.$transaction([
    prisma.payment.delete({
      where: { id: paymentId }
    }),
    prisma.order.delete({
      where: { id: payment.order.id }
    })
  ]);
  return {
    payment: deletedPayment,
    order: deletedOrder
  };
};
var PaymentService = {
  handlerStripeWebhookEvent,
  getAllPaymentsService,
  updatePaymentStatusWithOrderCheck,
  deletePayment
};

// src/app/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "20e4f1"
    },
    body: JSON.stringify({
      sessionId: "20e4f1",
      runId: "pre-fix",
      location: "payment.controller.ts:entry",
      message: "Webhook request received",
      data: {
        hasSignature: Boolean(signature),
        bodyIsBuffer: Buffer.isBuffer(req.body),
        contentType: req.headers["content-type"],
        webhookSecretPrefix: webhookSecret?.slice(0, 10)
      },
      hypothesisId: "H2_H3_H4",
      timestamp: Date.now()
    })
  }).catch(() => {
  });
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(status21.BAD_REQUEST).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    fetch("http://127.0.0.1:7268/ingest/0e44685c-8c68-4e88-86ca-8c289d1bed8b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "20e4f1"
      },
      body: JSON.stringify({
        sessionId: "20e4f1",
        runId: "pre-fix",
        location: "payment.controller.ts:constructEvent:catch",
        message: "Stripe webhook signature failed",
        data: {
          errMsg: error instanceof Error ? error.message : String(error),
          bodyIsBuffer: Buffer.isBuffer(req.body)
        },
        hypothesisId: "H1",
        timestamp: Date.now()
      })
    }).catch(() => {
    });
    return res.status(status21.BAD_REQUEST).json({ message: "Error processing Stripe webhook" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event"
    });
  }
});
var getAllPayment = catchAsync(async (req, res) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const payments = await PaymentService.getAllPaymentsService(req.user?.email, page, limit, skip, sortBy, sortOrder, req.query);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "All payment fetched",
    data: payments
  });
});
var updatePaymentStatus = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { status: newStatus } = req.body;
  try {
    const result = await PaymentService.updatePaymentStatusWithOrderCheck(paymentId, newStatus);
    return sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Payment status updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error updating payment status"
    });
  }
});
var deletePayment2 = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const result = await PaymentService.deletePayment(paymentId);
    return sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Payment deleted successfully",
      data: result
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error deleting payment"
    });
  }
});
var PaymentController = {
  handleStripeWebhookEvent,
  getAllPayment,
  updatePaymentStatus,
  deletePayment: deletePayment2
};

// src/app/modules/payment/payment.route.ts
var router9 = Router8();
router9.get("/payments", auth_default([UserRoles.Admin]), PaymentController.getAllPayment);
router9.patch(
  "/payments/:paymentId/status",
  auth_default([UserRoles.Admin]),
  PaymentController.updatePaymentStatus
);
router9.delete(
  "/payments/:paymentId",
  auth_default([UserRoles.Admin]),
  PaymentController.deletePayment
);
var PaymentRouter = router9;

// src/app/routes/index.route.ts
var router10 = Router9();
router10.use("/v1", mealRouter.router);
router10.use("/v1", providerRouter.router);
router10.use("/v1", OrderRouter.router);
router10.use("/v1", CategoryRouter.router);
router10.use("/v1", UserRouter.router);
router10.use("/v1", ReviewsRouter.router);
router10.use("/v1", StatsRoutes);
router10.use("/v1", PaymentRouter);
router10.use("/v1/auth", authRouter.router);
var IndexRouter = router10;

// src/app.ts
var app = express2();
app.post("/webhook", express2.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(express2.json());
app.use(cookieParser());
app.use(express2.urlencoded({ extended: true }));
app.use(cors({
  origin: envVars.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api", IndexRouter);
app.use(globalErrorHandeller_default);
app.use(Notfound);
var app_default = app;

// src/server.ts
var port = envVars.PORT || 4e3;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("connected to database successfully");
    app_default.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message || error);
    if (error?.stack) console.error(error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
};
main();
