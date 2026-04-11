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
  "inlineSchema": 'model User {\n  id            String           @id\n  name          String\n  email         String           @unique\n  emailVerified Boolean          @default(false)\n  image         String?\n  bgimage       String?          @default("https://images.pexels.com/photos/8250184/pexels-photo-8250184.jpeg")\n  phone         String?          @db.VarChar(15)\n  role          Role             @default(Customer)\n  status        Status           @default(activate)\n  isActive      Boolean          @default(true)\n  createdAt     DateTime         @default(now())\n  updatedAt     DateTime         @updatedAt\n  accounts      Account[]\n  category      Category[]\n  orders        Order[]\n  provider      ProviderProfile?\n  reviews       Review[]\n  sessions      Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  Customer\n  Provider\n  Admin\n}\n\nenum Status {\n  activate\n  suspend\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  adminId   String\n  name      String   @unique @db.VarChar(150)\n  image     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  user      User     @relation(fields: [adminId], references: [id], onDelete: Cascade)\n  meals     Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id                String            @id @default(uuid())\n  meals_name        String            @db.VarChar(100)\n  description       String?\n  image             String?\n  price             Int\n  isAvailable       Boolean           @default(true)\n  dietaryPreference DietaryPreference @default(HALAL)\n  providerId        String\n  category_name     String\n  cuisine           Cuisine           @default(BANGLEDESHI)\n  status            MealsStatus       @default(APPROVED)\n  createdAt         DateTime          @default(now())\n  updatedAt         DateTime          @updatedAt\n  category          Category          @relation(fields: [category_name], references: [name], onDelete: Cascade)\n  provider          ProviderProfile   @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem         Orderitem[]\n  reviews           Review[]\n\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  HALAL\n  VEGAN\n  VEGETARIAN\n  ANY\n  GLUTEN_FREE\n  KETO\n  PALEO\n  DAIRY_FREE\n  NUT_FREE\n  LOW_SUGAR\n}\n\nenum Cuisine {\n  BANGLEDESHI\n  ITALIAN\n  CHINESE\n  INDIAN\n  MEXICAN\n  THAI\n  JAPANESE\n  FRENCH\n  MEDITERRANEAN\n  AMERICAN\n  MIDDLE_EASTERN\n}\n\nenum MealsStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nmodel Order {\n  id         String          @id @default(uuid())\n  customerId String\n  providerId String\n  first_name String?\n  last_name  String?\n  status     OrderStatus     @default(PLACED)\n  totalPrice Int\n  phone      String?\n  address    String\n  createdAt  DateTime        @default(now())\n  updatedAt  DateTime        @updatedAt\n  customer   User            @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem  Orderitem[]\n\n  @@map("order")\n}\n\nmodel Orderitem {\n  id        String   @id @default(uuid())\n  orderId   String\n  price     Float\n  quantity  Int\n  mealId    String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@map("orderitem")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String   @db.VarChar(100)\n  address        String   @db.VarChar(200)\n  description    String?\n  image          String?  @db.VarChar(100)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n  meals          Meal[]\n  orders         Order[]\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("providerprofile")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  customerId String\n  mealId     String\n  parentId   String?\n  rating     Int\n  status     ReviewStatus @default(APPROVED)\n  comment    String\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  customer   User         @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  meal       Meal         @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  parent     Review?      @relation("reviewsReply", fields: [parentId], references: [id], onDelete: Cascade)\n  replies    Review[]     @relation("reviewsReply")\n\n  @@map("review")\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"meals_name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"dietaryPreference","kind":"enum","type":"DietaryPreference"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"cuisine","kind":"enum","type":"Cuisine"},{"name":"status","kind":"enum","type":"MealsStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"MealToOrderitem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meal"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"first_name","kind":"scalar","type":"String"},{"name":"last_name","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"OrderToOrderitem"}],"dbName":"order"},"Orderitem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderitem"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderitem"}],"dbName":"orderitem"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"}],"dbName":"providerprofile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"}],"dbName":"review"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","accounts","category","meals","customer","provider","meal","order","orderitem","_count","orders","parent","replies","reviews","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","Orderitem.findUnique","Orderitem.findUniqueOrThrow","Orderitem.findFirst","Orderitem.findFirstOrThrow","Orderitem.findMany","Orderitem.createOne","Orderitem.createMany","Orderitem.createManyAndReturn","Orderitem.updateOne","Orderitem.updateMany","Orderitem.updateManyAndReturn","Orderitem.upsertOne","Orderitem.deleteOne","Orderitem.deleteMany","Orderitem.groupBy","Orderitem.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","customerId","mealId","parentId","rating","ReviewStatus","status","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","restaurantName","address","description","image","every","some","none","orderId","price","quantity","providerId","first_name","last_name","OrderStatus","totalPrice","phone","meals_name","isAvailable","DietaryPreference","dietaryPreference","category_name","Cuisine","cuisine","MealsStatus","adminId","name","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","bgimage","Role","role","Status","isActive","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "ugVfoAEVBAAA2AIAIAUAANkCACAIAADaAgAgDQAArwIAIBAAANsCACARAADcAgAgugEAANQCADC7AQAANAAQvAEAANQCADC9AQEAAAABwwEAANcCgQIixQFAAK0CACHGAUAArQIAIdYBAQCsAgAh4gEBAKwCACHsAQEAqwIAIfsBAQAAAAH8ASAA1QIAIf0BAQCsAgAh_wEAANYC_wEigQIgANUCACEBAAAAAQAgEQMAALACACC6AQAA8AIAMLsBAAADABC8AQAA8AIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh3QEBAKsCACHwAQEAqwIAIfEBAQCsAgAh8gEBAKwCACHzAQEArAIAIfQBQADxAgAh9QFAAPECACH2AQEArAIAIfcBAQCsAgAhCAMAAOYDACDxAQAA8gIAIPIBAADyAgAg8wEAAPICACD0AQAA8gIAIPUBAADyAgAg9gEAAPICACD3AQAA8gIAIBEDAACwAgAgugEAAPACADC7AQAAAwAQvAEAAPACADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh3QEBAKsCACHwAQEAqwIAIfEBAQCsAgAh8gEBAKwCACHzAQEArAIAIfQBQADxAgAh9QFAAPECACH2AQEArAIAIfcBAQCsAgAhAwAAAAMAIAEAAAQAMAIAAAUAIAsDAACwAgAgBgAArgIAILoBAADvAgAwuwEAAAcAELwBAADvAgAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh1gEBAKsCACHrAQEAqwIAIewBAQCrAgAhAgMAAOYDACAGAADkAwAgCwMAALACACAGAACuAgAgugEAAO8CADC7AQAABwAQvAEAAO8CADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdYBAQCrAgAh6wEBAKsCACHsAQEAAAABAwAAAAcAIAEAAAgAMAIAAAkAIBQFAADuAgAgCAAA6AIAIAsAAOkCACAQAADbAgAgugEAAOoCADC7AQAACwAQvAEAAOoCADC9AQEAqwIAIcMBAADtAusBIsUBQACtAgAhxgFAAK0CACHVAQEArAIAIdYBAQCsAgAh2wECAN8CACHdAQEAqwIAIeMBAQCrAgAh5AEgANUCACHmAQAA6wLmASLnAQEAqwIAIekBAADsAukBIgYFAADtBAAgCAAA5gQAIAsAAOwEACAQAADnBAAg1QEAAPICACDWAQAA8gIAIBQFAADuAgAgCAAA6AIAIAsAAOkCACAQAADbAgAgugEAAOoCADC7AQAACwAQvAEAAOoCADC9AQEAAAABwwEAAO0C6wEixQFAAK0CACHGAUAArQIAIdUBAQCsAgAh1gEBAKwCACHbAQIA3wIAId0BAQCrAgAh4wEBAKsCACHkASAA1QIAIeYBAADrAuYBIucBAQCrAgAh6QEAAOwC6QEiAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACARBwAAsAIAIAgAAOgCACALAADpAgAgugEAAOYCADC7AQAAEAAQvAEAAOYCADC9AQEAqwIAIb4BAQCrAgAhwwEAAOcC4QEixQFAAK0CACHGAUAArQIAIdQBAQCrAgAh3QEBAKsCACHeAQEArAIAId8BAQCsAgAh4QECAN8CACHiAQEArAIAIQYHAADmAwAgCAAA5gQAIAsAAOwEACDeAQAA8gIAIN8BAADyAgAg4gEAAPICACARBwAAsAIAIAgAAOgCACALAADpAgAgugEAAOYCADC7AQAAEAAQvAEAAOYCADC9AQEAAAABvgEBAKsCACHDAQAA5wLhASLFAUAArQIAIcYBQACtAgAh1AEBAKsCACHdAQEAqwIAId4BAQCsAgAh3wEBAKwCACHhAQIA3wIAIeIBAQCsAgAhAwAAABAAIAEAABEAMAIAABIAIAwJAADhAgAgCgAA5QIAILoBAADjAgAwuwEAABQAELwBAADjAgAwvQEBAKsCACG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACECCQAA6QQAIAoAAOsEACAMCQAA4QIAIAoAAOUCACC6AQAA4wIAMLsBAAAUABC8AQAA4wIAML0BAQAAAAG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACEDAAAAFAAgAQAAFQAwAgAAFgAgAQAAABQAIAEAAAALACABAAAAEAAgAwAAABQAIAEAABUAMAIAABYAIBAHAACwAgAgCQAA4QIAIA4AAOICACAPAADbAgAgugEAAN4CADC7AQAAHAAQvAEAAN4CADC9AQEAqwIAIb4BAQCrAgAhvwEBAKsCACHAAQEArAIAIcEBAgDfAgAhwwEAAOACwwEixAEBAKsCACHFAUAArQIAIcYBQACtAgAhBQcAAOYDACAJAADpBAAgDgAA6gQAIA8AAOcEACDAAQAA8gIAIBAHAACwAgAgCQAA4QIAIA4AAOICACAPAADbAgAgugEAAN4CADC7AQAAHAAQvAEAAN4CADC9AQEAAAABvgEBAKsCACG_AQEAqwIAIcABAQCsAgAhwQECAN8CACHDAQAA4ALDASLEAQEAqwIAIcUBQACtAgAhxgFAAK0CACEDAAAAHAAgAQAAHQAwAgAAHgAgAQAAABwAIAMAAAAcACABAAAdADACAAAeACABAAAAHAAgAQAAABQAIAEAAAAcACABAAAACwAgAwAAABAAIAEAABEAMAIAABIAIA4DAACwAgAgBgAArgIAIA0AAK8CACC6AQAAqgIAMLsBAAAnABC8AQAAqgIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh0wEBAKsCACHUAQEAqwIAIdUBAQCsAgAh1gEBAKwCACEBAAAAJwAgAwAAABwAIAEAAB0AMAIAAB4AIAwDAACwAgAgugEAAN0CADC7AQAAKgAQvAEAAN0CADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHSAQEAqwIAIe8BQACtAgAh-AEBAKsCACH5AQEArAIAIfoBAQCsAgAhAwMAAOYDACD5AQAA8gIAIPoBAADyAgAgDAMAALACACC6AQAA3QIAMLsBAAAqABC8AQAA3QIAML0BAQAAAAHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHvAUAArQIAIfgBAQAAAAH5AQEArAIAIfoBAQCsAgAhAwAAACoAIAEAACsAMAIAACwAIAEAAAADACABAAAABwAgAQAAABAAIAEAAAAcACABAAAAKgAgAQAAAAEAIBUEAADYAgAgBQAA2QIAIAgAANoCACANAACvAgAgEAAA2wIAIBEAANwCACC6AQAA1AIAMLsBAAA0ABC8AQAA1AIAML0BAQCrAgAhwwEAANcCgQIixQFAAK0CACHGAUAArQIAIdYBAQCsAgAh4gEBAKwCACHsAQEAqwIAIfsBAQCrAgAh_AEgANUCACH9AQEArAIAIf8BAADWAv8BIoECIADVAgAhCQQAAOQEACAFAADlBAAgCAAA5gQAIA0AAOUDACAQAADnBAAgEQAA6AQAINYBAADyAgAg4gEAAPICACD9AQAA8gIAIAMAAAA0ACABAAA1ADACAAABACADAAAANAAgAQAANQAwAgAAAQAgAwAAADQAIAEAADUAMAIAAAEAIBIEAADeBAAgBQAA3wQAIAgAAOEEACANAADgBAAgEAAA4gQAIBEAAOMEACC9AQEAAAABwwEAAACBAgLFAUAAAAABxgFAAAAAAdYBAQAAAAHiAQEAAAAB7AEBAAAAAfsBAQAAAAH8ASAAAAAB_QEBAAAAAf8BAAAA_wECgQIgAAAAAQEXAAA5ACAMvQEBAAAAAcMBAAAAgQICxQFAAAAAAcYBQAAAAAHWAQEAAAAB4gEBAAAAAewBAQAAAAH7AQEAAAAB_AEgAAAAAf0BAQAAAAH_AQAAAP8BAoECIAAAAAEBFwAAOwAwARcAADsAMBIEAACdBAAgBQAAngQAIAgAAKAEACANAACfBAAgEAAAoQQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD8AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIQIAAAABACAXAAA-ACAMvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACECAAAANAAgFwAAQAAgAgAAADQAIBcAAEAAIAMAAAABACAeAAA5ACAfAAA-ACABAAAAAQAgAQAAADQAIAYMAACYBAAgJAAAmgQAICUAAJkEACDWAQAA8gIAIOIBAADyAgAg_QEAAPICACAPugEAAM0CADC7AQAARwAQvAEAAM0CADC9AQEAmAIAIcMBAADPAoECIsUBQACcAgAhxgFAAJwCACHWAQEAmQIAIeIBAQCZAgAh7AEBAJgCACH7AQEAmAIAIfwBIAC5AgAh_QEBAJkCACH_AQAAzgL_ASKBAiAAuQIAIQMAAAA0ACABAABGADAjAABHACADAAAANAAgAQAANQAwAgAAAQAgAQAAACwAIAEAAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACAJAwAAlwQAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHvAUAAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAABARcAAE8AIAi9AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQEXAABRADABFwAAUQAwCQMAAJYEACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIe8BQAD7AgAh-AEBAPgCACH5AQEA_AIAIfoBAQD8AgAhAgAAACwAIBcAAFQAIAi9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIe8BQAD7AgAh-AEBAPgCACH5AQEA_AIAIfoBAQD8AgAhAgAAACoAIBcAAFYAIAIAAAAqACAXAABWACADAAAALAAgHgAATwAgHwAAVAAgAQAAACwAIAEAAAAqACAFDAAAkwQAICQAAJUEACAlAACUBAAg-QEAAPICACD6AQAA8gIAIAu6AQAAzAIAMLsBAABdABC8AQAAzAIAML0BAQCYAgAhxQFAAJwCACHGAUAAnAIAIdIBAQCYAgAh7wFAAJwCACH4AQEAmAIAIfkBAQCZAgAh-gEBAJkCACEDAAAAKgAgAQAAXAAwIwAAXQAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgDgMAAJIEACC9AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB3QEBAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AUAAAAAB9QFAAAAAAfYBAQAAAAH3AQEAAAABARcAAGUAIA29AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB3QEBAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AUAAAAAB9QFAAAAAAfYBAQAAAAH3AQEAAAABARcAAGcAMAEXAABnADAOAwAAkQQAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh3QEBAPgCACHwAQEA-AIAIfEBAQD8AgAh8gEBAPwCACHzAQEA_AIAIfQBQACQBAAh9QFAAJAEACH2AQEA_AIAIfcBAQD8AgAhAgAAAAUAIBcAAGoAIA29AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAId0BAQD4AgAh8AEBAPgCACHxAQEA_AIAIfIBAQD8AgAh8wEBAPwCACH0AUAAkAQAIfUBQACQBAAh9gEBAPwCACH3AQEA_AIAIQIAAAADACAXAABsACACAAAAAwAgFwAAbAAgAwAAAAUAIB4AAGUAIB8AAGoAIAEAAAAFACABAAAAAwAgCgwAAI0EACAkAACPBAAgJQAAjgQAIPEBAADyAgAg8gEAAPICACDzAQAA8gIAIPQBAADyAgAg9QEAAPICACD2AQAA8gIAIPcBAADyAgAgELoBAADIAgAwuwEAAHMAELwBAADIAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh0gEBAJgCACHdAQEAmAIAIfABAQCYAgAh8QEBAJkCACHyAQEAmQIAIfMBAQCZAgAh9AFAAMkCACH1AUAAyQIAIfYBAQCZAgAh9wEBAJkCACEDAAAAAwAgAQAAcgAwIwAAcwAgAwAAAAMAIAEAAAQAMAIAAAUAIAm6AQAAxwIAMLsBAAB5ABC8AQAAxwIAML0BAQAAAAHFAUAArQIAIcYBQACtAgAh7QEBAKsCACHuAQEAqwIAIe8BQACtAgAhAQAAAHYAIAEAAAB2ACAJugEAAMcCADC7AQAAeQAQvAEAAMcCADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHtAQEAqwIAIe4BAQCrAgAh7wFAAK0CACEAAwAAAHkAIAEAAHoAMAIAAHYAIAMAAAB5ACABAAB6ADACAAB2ACADAAAAeQAgAQAAegAwAgAAdgAgBr0BAQAAAAHFAUAAAAABxgFAAAAAAe0BAQAAAAHuAQEAAAAB7wFAAAAAAQEXAAB-ACAGvQEBAAAAAcUBQAAAAAHGAUAAAAAB7QEBAAAAAe4BAQAAAAHvAUAAAAABARcAAIABADABFwAAgAEAMAa9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHtAQEA-AIAIe4BAQD4AgAh7wFAAPsCACECAAAAdgAgFwAAgwEAIAa9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHtAQEA-AIAIe4BAQD4AgAh7wFAAPsCACECAAAAeQAgFwAAhQEAIAIAAAB5ACAXAACFAQAgAwAAAHYAIB4AAH4AIB8AAIMBACABAAAAdgAgAQAAAHkAIAMMAACKBAAgJAAAjAQAICUAAIsEACAJugEAAMYCADC7AQAAjAEAELwBAADGAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh7QEBAJgCACHuAQEAmAIAIe8BQACcAgAhAwAAAHkAIAEAAIsBADAjAACMAQAgAwAAAHkAIAEAAHoAMAIAAHYAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgCAMAAIgEACAGAACJBAAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB1gEBAAAAAesBAQAAAAHsAQEAAAABARcAAJQBACAGvQEBAAAAAcUBQAAAAAHGAUAAAAAB1gEBAAAAAesBAQAAAAHsAQEAAAABARcAAJYBADABFwAAlgEAMAgDAAD9AwAgBgAA_gMAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdYBAQD4AgAh6wEBAPgCACHsAQEA-AIAIQIAAAAJACAXAACZAQAgBr0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdYBAQD4AgAh6wEBAPgCACHsAQEA-AIAIQIAAAAHACAXAACbAQAgAgAAAAcAIBcAAJsBACADAAAACQAgHgAAlAEAIB8AAJkBACABAAAACQAgAQAAAAcAIAMMAAD6AwAgJAAA_AMAICUAAPsDACAJugEAAMUCADC7AQAAogEAELwBAADFAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh1gEBAJgCACHrAQEAmAIAIewBAQCYAgAhAwAAAAcAIAEAAKEBADAjAACiAQAgAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgEQUAAN4DACAIAAD5AwAgCwAA3wMAIBAAAOADACC9AQEAAAABwwEAAADrAQLFAUAAAAABxgFAAAAAAdUBAQAAAAHWAQEAAAAB2wECAAAAAd0BAQAAAAHjAQEAAAAB5AEgAAAAAeYBAAAA5gEC5wEBAAAAAekBAAAA6QECARcAAKoBACANvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHdAQEAAAAB4wEBAAAAAeQBIAAAAAHmAQAAAOYBAucBAQAAAAHpAQAAAOkBAgEXAACsAQAwARcAAKwBADARBQAAxgMAIAgAAPgDACALAADHAwAgEAAAyAMAIL0BAQD4AgAhwwEAAMQD6wEixQFAAPsCACHGAUAA-wIAIdUBAQD8AgAh1gEBAPwCACHbAQIA-QIAId0BAQD4AgAh4wEBAPgCACHkASAAwQMAIeYBAADCA-YBIucBAQD4AgAh6QEAAMMD6QEiAgAAAA0AIBcAAK8BACANvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASICAAAACwAgFwAAsQEAIAIAAAALACAXAACxAQAgAwAAAA0AIB4AAKoBACAfAACvAQAgAQAAAA0AIAEAAAALACAHDAAA8wMAICQAAPYDACAlAAD1AwAgdgAA9AMAIHcAAPcDACDVAQAA8gIAINYBAADyAgAgELoBAAC4AgAwuwEAALgBABC8AQAAuAIAML0BAQCYAgAhwwEAALwC6wEixQFAAJwCACHGAUAAnAIAIdUBAQCZAgAh1gEBAJkCACHbAQIAmgIAId0BAQCYAgAh4wEBAJgCACHkASAAuQIAIeYBAAC6AuYBIucBAQCYAgAh6QEAALsC6QEiAwAAAAsAIAEAALcBADAjAAC4AQAgAwAAAAsAIAEAAAwAMAIAAA0AIAEAAAASACABAAAAEgAgAwAAABAAIAEAABEAMAIAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgDgcAALUDACAIAADyAwAgCwAAtgMAIL0BAQAAAAG-AQEAAAABwwEAAADhAQLFAUAAAAABxgFAAAAAAdQBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHhAQIAAAAB4gEBAAAAAQEXAADAAQAgC70BAQAAAAG-AQEAAAABwwEAAADhAQLFAUAAAAABxgFAAAAAAdQBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHhAQIAAAAB4gEBAAAAAQEXAADCAQAwARcAAMIBADAOBwAAowMAIAgAAPEDACALAACkAwAgvQEBAPgCACG-AQEA-AIAIcMBAAChA-EBIsUBQAD7AgAhxgFAAPsCACHUAQEA-AIAId0BAQD4AgAh3gEBAPwCACHfAQEA_AIAIeEBAgD5AgAh4gEBAPwCACECAAAAEgAgFwAAxQEAIAu9AQEA-AIAIb4BAQD4AgAhwwEAAKED4QEixQFAAPsCACHGAUAA-wIAIdQBAQD4AgAh3QEBAPgCACHeAQEA_AIAId8BAQD8AgAh4QECAPkCACHiAQEA_AIAIQIAAAAQACAXAADHAQAgAgAAABAAIBcAAMcBACADAAAAEgAgHgAAwAEAIB8AAMUBACABAAAAEgAgAQAAABAAIAgMAADsAwAgJAAA7wMAICUAAO4DACB2AADtAwAgdwAA8AMAIN4BAADyAgAg3wEAAPICACDiAQAA8gIAIA66AQAAtAIAMLsBAADOAQAQvAEAALQCADC9AQEAmAIAIb4BAQCYAgAhwwEAALUC4QEixQFAAJwCACHGAUAAnAIAIdQBAQCYAgAh3QEBAJgCACHeAQEAmQIAId8BAQCZAgAh4QECAJoCACHiAQEAmQIAIQMAAAAQACABAADNAQAwIwAAzgEAIAMAAAAQACABAAARADACAAASACABAAAAFgAgAQAAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAkJAACzAwAgCgAA3AMAIL0BAQAAAAG_AQEAAAABxQFAAAAAAcYBQAAAAAHaAQEAAAAB2wEIAAAAAdwBAgAAAAEBFwAA1gEAIAe9AQEAAAABvwEBAAAAAcUBQAAAAAHGAUAAAAAB2gEBAAAAAdsBCAAAAAHcAQIAAAABARcAANgBADABFwAA2AEAMAkJAACxAwAgCgAA2gMAIL0BAQD4AgAhvwEBAPgCACHFAUAA-wIAIcYBQAD7AgAh2gEBAPgCACHbAQgArwMAIdwBAgD5AgAhAgAAABYAIBcAANsBACAHvQEBAPgCACG_AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHaAQEA-AIAIdsBCACvAwAh3AECAPkCACECAAAAFAAgFwAA3QEAIAIAAAAUACAXAADdAQAgAwAAABYAIB4AANYBACAfAADbAQAgAQAAABYAIAEAAAAUACAFDAAA5wMAICQAAOoDACAlAADpAwAgdgAA6AMAIHcAAOsDACAKugEAALECADC7AQAA5AEAELwBAACxAgAwvQEBAJgCACG_AQEAmAIAIcUBQACcAgAhxgFAAJwCACHaAQEAmAIAIdsBCACyAgAh3AECAJoCACEDAAAAFAAgAQAA4wEAMCMAAOQBACADAAAAFAAgAQAAFQAwAgAAFgAgDgMAALACACAGAACuAgAgDQAArwIAILoBAACqAgAwuwEAACcAELwBAACqAgAwvQEBAAAAAcUBQACtAgAhxgFAAK0CACHSAQEAAAAB0wEBAKsCACHUAQEAqwIAIdUBAQCsAgAh1gEBAKwCACEBAAAA5wEAIAEAAADnAQAgBQMAAOYDACAGAADkAwAgDQAA5QMAINUBAADyAgAg1gEAAPICACADAAAAJwAgAQAA6gEAMAIAAOcBACADAAAAJwAgAQAA6gEAMAIAAOcBACADAAAAJwAgAQAA6gEAMAIAAOcBACALAwAA4wMAIAYAAOEDACANAADiAwAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB0gEBAAAAAdMBAQAAAAHUAQEAAAAB1QEBAAAAAdYBAQAAAAEBFwAA7gEAIAi9AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAQEXAADwAQAwARcAAPABADALAwAAlgMAIAYAAJQDACANAACVAwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh0gEBAPgCACHTAQEA-AIAIdQBAQD4AgAh1QEBAPwCACHWAQEA_AIAIQIAAADnAQAgFwAA8wEAIAi9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhAgAAACcAIBcAAPUBACACAAAAJwAgFwAA9QEAIAMAAADnAQAgHgAA7gEAIB8AAPMBACABAAAA5wEAIAEAAAAnACAFDAAAkQMAICQAAJMDACAlAACSAwAg1QEAAPICACDWAQAA8gIAIAu6AQAAqQIAMLsBAAD8AQAQvAEAAKkCADC9AQEAmAIAIcUBQACcAgAhxgFAAJwCACHSAQEAmAIAIdMBAQCYAgAh1AEBAJgCACHVAQEAmQIAIdYBAQCZAgAhAwAAACcAIAEAAPsBADAjAAD8AQAgAwAAACcAIAEAAOoBADACAADnAQAgAQAAAB4AIAEAAAAeACADAAAAHAAgAQAAHQAwAgAAHgAgAwAAABwAIAEAAB0AMAIAAB4AIAMAAAAcACABAAAdADACAAAeACANBwAAjQMAIAkAAI4DACAOAACQAwAgDwAAjwMAIL0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEBFwAAhAIAIAm9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABARcAAIYCADABFwAAhgIAMAEAAAAcACANBwAA_QIAIAkAAP4CACAOAAD_AgAgDwAAgAMAIL0BAQD4AgAhvgEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACECAAAAHgAgFwAAigIAIAm9AQEA-AIAIb4BAQD4AgAhvwEBAPgCACHAAQEA_AIAIcEBAgD5AgAhwwEAAPoCwwEixAEBAPgCACHFAUAA-wIAIcYBQAD7AgAhAgAAABwAIBcAAIwCACACAAAAHAAgFwAAjAIAIAEAAAAcACADAAAAHgAgHgAAhAIAIB8AAIoCACABAAAAHgAgAQAAABwAIAYMAADzAgAgJAAA9gIAICUAAPUCACB2AAD0AgAgdwAA9wIAIMABAADyAgAgDLoBAACXAgAwuwEAAJQCABC8AQAAlwIAML0BAQCYAgAhvgEBAJgCACG_AQEAmAIAIcABAQCZAgAhwQECAJoCACHDAQAAmwLDASLEAQEAmAIAIcUBQACcAgAhxgFAAJwCACEDAAAAHAAgAQAAkwIAMCMAAJQCACADAAAAHAAgAQAAHQAwAgAAHgAgDLoBAACXAgAwuwEAAJQCABC8AQAAlwIAML0BAQCYAgAhvgEBAJgCACG_AQEAmAIAIcABAQCZAgAhwQECAJoCACHDAQAAmwLDASLEAQEAmAIAIcUBQACcAgAhxgFAAJwCACEODAAAngIAICQAAKgCACAlAACoAgAgxwEBAAAAAcgBAQAAAATJAQEAAAAEygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQCnAgAhzwEBAAAAAdABAQAAAAHRAQEAAAABDgwAAKUCACAkAACmAgAgJQAApgIAIMcBAQAAAAHIAQEAAAAFyQEBAAAABcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQEApAIAIc8BAQAAAAHQAQEAAAAB0QEBAAAAAQ0MAACeAgAgJAAAngIAICUAAJ4CACB2AACjAgAgdwAAngIAIMcBAgAAAAHIAQIAAAAEyQECAAAABMoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgAAAAHOAQIAogIAIQcMAACeAgAgJAAAoQIAICUAAKECACDHAQAAAMMBAsgBAAAAwwEIyQEAAADDAQjOAQAAoALDASILDAAAngIAICQAAJ8CACAlAACfAgAgxwFAAAAAAcgBQAAAAATJAUAAAAAEygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAAAAAAc4BQACdAgAhCwwAAJ4CACAkAACfAgAgJQAAnwIAIMcBQAAAAAHIAUAAAAAEyQFAAAAABMoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQAAAAAHOAUAAnQIAIQjHAQIAAAAByAECAAAABMkBAgAAAATKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAAAABzgECAJ4CACEIxwFAAAAAAcgBQAAAAATJAUAAAAAEygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAAAAAAc4BQACfAgAhBwwAAJ4CACAkAAChAgAgJQAAoQIAIMcBAAAAwwECyAEAAADDAQjJAQAAAMMBCM4BAACgAsMBIgTHAQAAAMMBAsgBAAAAwwEIyQEAAADDAQjOAQAAoQLDASINDAAAngIAICQAAJ4CACAlAACeAgAgdgAAowIAIHcAAJ4CACDHAQIAAAAByAECAAAABMkBAgAAAATKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAAAABzgECAKICACEIxwEIAAAAAcgBCAAAAATJAQgAAAAEygEIAAAAAcsBCAAAAAHMAQgAAAABzQEIAAAAAc4BCACjAgAhDgwAAKUCACAkAACmAgAgJQAApgIAIMcBAQAAAAHIAQEAAAAFyQEBAAAABcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQEApAIAIc8BAQAAAAHQAQEAAAAB0QEBAAAAAQjHAQIAAAAByAECAAAABckBAgAAAAXKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAAAABzgECAKUCACELxwEBAAAAAcgBAQAAAAXJAQEAAAAFygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQCmAgAhzwEBAAAAAdABAQAAAAHRAQEAAAABDgwAAJ4CACAkAACoAgAgJQAAqAIAIMcBAQAAAAHIAQEAAAAEyQEBAAAABMoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQEApwIAIc8BAQAAAAHQAQEAAAAB0QEBAAAAAQvHAQEAAAAByAEBAAAABMkBAQAAAATKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgEBAKgCACHPAQEAAAAB0AEBAAAAAdEBAQAAAAELugEAAKkCADC7AQAA_AEAELwBAACpAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh0gEBAJgCACHTAQEAmAIAIdQBAQCYAgAh1QEBAJkCACHWAQEAmQIAIQ4DAACwAgAgBgAArgIAIA0AAK8CACC6AQAAqgIAMLsBAAAnABC8AQAAqgIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh0wEBAKsCACHUAQEAqwIAIdUBAQCsAgAh1gEBAKwCACELxwEBAAAAAcgBAQAAAATJAQEAAAAEygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAc4BAQCoAgAhzwEBAAAAAdABAQAAAAHRAQEAAAABC8cBAQAAAAHIAQEAAAAFyQEBAAAABcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQEApgIAIc8BAQAAAAHQAQEAAAAB0QEBAAAAAQjHAUAAAAAByAFAAAAABMkBQAAAAATKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAAAABzgFAAJ8CACED1wEAAAsAINgBAAALACDZAQAACwAgA9cBAAAQACDYAQAAEAAg2QEAABAAIBcEAADYAgAgBQAA2QIAIAgAANoCACANAACvAgAgEAAA2wIAIBEAANwCACC6AQAA1AIAMLsBAAA0ABC8AQAA1AIAML0BAQCrAgAhwwEAANcCgQIixQFAAK0CACHGAUAArQIAIdYBAQCsAgAh4gEBAKwCACHsAQEAqwIAIfsBAQCrAgAh_AEgANUCACH9AQEArAIAIf8BAADWAv8BIoECIADVAgAhggIAADQAIIMCAAA0ACAKugEAALECADC7AQAA5AEAELwBAACxAgAwvQEBAJgCACG_AQEAmAIAIcUBQACcAgAhxgFAAJwCACHaAQEAmAIAIdsBCACyAgAh3AECAJoCACENDAAAngIAICQAAKMCACAlAACjAgAgdgAAowIAIHcAAKMCACDHAQgAAAAByAEIAAAABMkBCAAAAATKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgAAAABzgEIALMCACENDAAAngIAICQAAKMCACAlAACjAgAgdgAAowIAIHcAAKMCACDHAQgAAAAByAEIAAAABMkBCAAAAATKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgAAAABzgEIALMCACEOugEAALQCADC7AQAAzgEAELwBAAC0AgAwvQEBAJgCACG-AQEAmAIAIcMBAAC1AuEBIsUBQACcAgAhxgFAAJwCACHUAQEAmAIAId0BAQCYAgAh3gEBAJkCACHfAQEAmQIAIeEBAgCaAgAh4gEBAJkCACEHDAAAngIAICQAALcCACAlAAC3AgAgxwEAAADhAQLIAQAAAOEBCMkBAAAA4QEIzgEAALYC4QEiBwwAAJ4CACAkAAC3AgAgJQAAtwIAIMcBAAAA4QECyAEAAADhAQjJAQAAAOEBCM4BAAC2AuEBIgTHAQAAAOEBAsgBAAAA4QEIyQEAAADhAQjOAQAAtwLhASIQugEAALgCADC7AQAAuAEAELwBAAC4AgAwvQEBAJgCACHDAQAAvALrASLFAUAAnAIAIcYBQACcAgAh1QEBAJkCACHWAQEAmQIAIdsBAgCaAgAh3QEBAJgCACHjAQEAmAIAIeQBIAC5AgAh5gEAALoC5gEi5wEBAJgCACHpAQAAuwLpASIFDAAAngIAICQAAMQCACAlAADEAgAgxwEgAAAAAc4BIADDAgAhBwwAAJ4CACAkAADCAgAgJQAAwgIAIMcBAAAA5gECyAEAAADmAQjJAQAAAOYBCM4BAADBAuYBIgcMAACeAgAgJAAAwAIAICUAAMACACDHAQAAAOkBAsgBAAAA6QEIyQEAAADpAQjOAQAAvwLpASIHDAAAngIAICQAAL4CACAlAAC-AgAgxwEAAADrAQLIAQAAAOsBCMkBAAAA6wEIzgEAAL0C6wEiBwwAAJ4CACAkAAC-AgAgJQAAvgIAIMcBAAAA6wECyAEAAADrAQjJAQAAAOsBCM4BAAC9AusBIgTHAQAAAOsBAsgBAAAA6wEIyQEAAADrAQjOAQAAvgLrASIHDAAAngIAICQAAMACACAlAADAAgAgxwEAAADpAQLIAQAAAOkBCMkBAAAA6QEIzgEAAL8C6QEiBMcBAAAA6QECyAEAAADpAQjJAQAAAOkBCM4BAADAAukBIgcMAACeAgAgJAAAwgIAICUAAMICACDHAQAAAOYBAsgBAAAA5gEIyQEAAADmAQjOAQAAwQLmASIExwEAAADmAQLIAQAAAOYBCMkBAAAA5gEIzgEAAMIC5gEiBQwAAJ4CACAkAADEAgAgJQAAxAIAIMcBIAAAAAHOASAAwwIAIQLHASAAAAABzgEgAMQCACEJugEAAMUCADC7AQAAogEAELwBAADFAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh1gEBAJgCACHrAQEAmAIAIewBAQCYAgAhCboBAADGAgAwuwEAAIwBABC8AQAAxgIAML0BAQCYAgAhxQFAAJwCACHGAUAAnAIAIe0BAQCYAgAh7gEBAJgCACHvAUAAnAIAIQm6AQAAxwIAMLsBAAB5ABC8AQAAxwIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIe0BAQCrAgAh7gEBAKsCACHvAUAArQIAIRC6AQAAyAIAMLsBAABzABC8AQAAyAIAML0BAQCYAgAhxQFAAJwCACHGAUAAnAIAIdIBAQCYAgAh3QEBAJgCACHwAQEAmAIAIfEBAQCZAgAh8gEBAJkCACHzAQEAmQIAIfQBQADJAgAh9QFAAMkCACH2AQEAmQIAIfcBAQCZAgAhCwwAAKUCACAkAADLAgAgJQAAywIAIMcBQAAAAAHIAUAAAAAFyQFAAAAABcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQAAAAAHOAUAAygIAIQsMAAClAgAgJAAAywIAICUAAMsCACDHAUAAAAAByAFAAAAABckBQAAAAAXKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAAAABzgFAAMoCACEIxwFAAAAAAcgBQAAAAAXJAUAAAAAFygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAAAAAAc4BQADLAgAhC7oBAADMAgAwuwEAAF0AELwBAADMAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh0gEBAJgCACHvAUAAnAIAIfgBAQCYAgAh-QEBAJkCACH6AQEAmQIAIQ-6AQAAzQIAMLsBAABHABC8AQAAzQIAML0BAQCYAgAhwwEAAM8CgQIixQFAAJwCACHGAUAAnAIAIdYBAQCZAgAh4gEBAJkCACHsAQEAmAIAIfsBAQCYAgAh_AEgALkCACH9AQEAmQIAIf8BAADOAv8BIoECIAC5AgAhBwwAAJ4CACAkAADTAgAgJQAA0wIAIMcBAAAA_wECyAEAAAD_AQjJAQAAAP8BCM4BAADSAv8BIgcMAACeAgAgJAAA0QIAICUAANECACDHAQAAAIECAsgBAAAAgQIIyQEAAACBAgjOAQAA0AKBAiIHDAAAngIAICQAANECACAlAADRAgAgxwEAAACBAgLIAQAAAIECCMkBAAAAgQIIzgEAANACgQIiBMcBAAAAgQICyAEAAACBAgjJAQAAAIECCM4BAADRAoECIgcMAACeAgAgJAAA0wIAICUAANMCACDHAQAAAP8BAsgBAAAA_wEIyQEAAAD_AQjOAQAA0gL_ASIExwEAAAD_AQLIAQAAAP8BCMkBAAAA_wEIzgEAANMC_wEiFQQAANgCACAFAADZAgAgCAAA2gIAIA0AAK8CACAQAADbAgAgEQAA3AIAILoBAADUAgAwuwEAADQAELwBAADUAgAwvQEBAKsCACHDAQAA1wKBAiLFAUAArQIAIcYBQACtAgAh1gEBAKwCACHiAQEArAIAIewBAQCrAgAh-wEBAKsCACH8ASAA1QIAIf0BAQCsAgAh_wEAANYC_wEigQIgANUCACECxwEgAAAAAc4BIADEAgAhBMcBAAAA_wECyAEAAAD_AQjJAQAAAP8BCM4BAADTAv8BIgTHAQAAAIECAsgBAAAAgQIIyQEAAACBAgjOAQAA0QKBAiID1wEAAAMAINgBAAADACDZAQAAAwAgA9cBAAAHACDYAQAABwAg2QEAAAcAIBADAACwAgAgBgAArgIAIA0AAK8CACC6AQAAqgIAMLsBAAAnABC8AQAAqgIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh0wEBAKsCACHUAQEAqwIAIdUBAQCsAgAh1gEBAKwCACGCAgAAJwAggwIAACcAIAPXAQAAHAAg2AEAABwAINkBAAAcACAD1wEAACoAINgBAAAqACDZAQAAKgAgDAMAALACACC6AQAA3QIAMLsBAAAqABC8AQAA3QIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh7wFAAK0CACH4AQEAqwIAIfkBAQCsAgAh-gEBAKwCACEQBwAAsAIAIAkAAOECACAOAADiAgAgDwAA2wIAILoBAADeAgAwuwEAABwAELwBAADeAgAwvQEBAKsCACG-AQEAqwIAIb8BAQCrAgAhwAEBAKwCACHBAQIA3wIAIcMBAADgAsMBIsQBAQCrAgAhxQFAAK0CACHGAUAArQIAIQjHAQIAAAAByAECAAAABMkBAgAAAATKAQIAAAABywECAAAAAcwBAgAAAAHNAQIAAAABzgECAJ4CACEExwEAAADDAQLIAQAAAMMBCMkBAAAAwwEIzgEAAKECwwEiFgUAAO4CACAIAADoAgAgCwAA6QIAIBAAANsCACC6AQAA6gIAMLsBAAALABC8AQAA6gIAML0BAQCrAgAhwwEAAO0C6wEixQFAAK0CACHGAUAArQIAIdUBAQCsAgAh1gEBAKwCACHbAQIA3wIAId0BAQCrAgAh4wEBAKsCACHkASAA1QIAIeYBAADrAuYBIucBAQCrAgAh6QEAAOwC6QEiggIAAAsAIIMCAAALACASBwAAsAIAIAkAAOECACAOAADiAgAgDwAA2wIAILoBAADeAgAwuwEAABwAELwBAADeAgAwvQEBAKsCACG-AQEAqwIAIb8BAQCrAgAhwAEBAKwCACHBAQIA3wIAIcMBAADgAsMBIsQBAQCrAgAhxQFAAK0CACHGAUAArQIAIYICAAAcACCDAgAAHAAgDAkAAOECACAKAADlAgAgugEAAOMCADC7AQAAFAAQvAEAAOMCADC9AQEAqwIAIb8BAQCrAgAhxQFAAK0CACHGAUAArQIAIdoBAQCrAgAh2wEIAOQCACHcAQIA3wIAIQjHAQgAAAAByAEIAAAABMkBCAAAAATKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgAAAABzgEIAKMCACETBwAAsAIAIAgAAOgCACALAADpAgAgugEAAOYCADC7AQAAEAAQvAEAAOYCADC9AQEAqwIAIb4BAQCrAgAhwwEAAOcC4QEixQFAAK0CACHGAUAArQIAIdQBAQCrAgAh3QEBAKsCACHeAQEArAIAId8BAQCsAgAh4QECAN8CACHiAQEArAIAIYICAAAQACCDAgAAEAAgEQcAALACACAIAADoAgAgCwAA6QIAILoBAADmAgAwuwEAABAAELwBAADmAgAwvQEBAKsCACG-AQEAqwIAIcMBAADnAuEBIsUBQACtAgAhxgFAAK0CACHUAQEAqwIAId0BAQCrAgAh3gEBAKwCACHfAQEArAIAIeEBAgDfAgAh4gEBAKwCACEExwEAAADhAQLIAQAAAOEBCMkBAAAA4QEIzgEAALcC4QEiEAMAALACACAGAACuAgAgDQAArwIAILoBAACqAgAwuwEAACcAELwBAACqAgAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHTAQEAqwIAIdQBAQCrAgAh1QEBAKwCACHWAQEArAIAIYICAAAnACCDAgAAJwAgA9cBAAAUACDYAQAAFAAg2QEAABQAIBQFAADuAgAgCAAA6AIAIAsAAOkCACAQAADbAgAgugEAAOoCADC7AQAACwAQvAEAAOoCADC9AQEAqwIAIcMBAADtAusBIsUBQACtAgAhxgFAAK0CACHVAQEArAIAIdYBAQCsAgAh2wECAN8CACHdAQEAqwIAIeMBAQCrAgAh5AEgANUCACHmAQAA6wLmASLnAQEAqwIAIekBAADsAukBIgTHAQAAAOYBAsgBAAAA5gEIyQEAAADmAQjOAQAAwgLmASIExwEAAADpAQLIAQAAAOkBCMkBAAAA6QEIzgEAAMAC6QEiBMcBAAAA6wECyAEAAADrAQjJAQAAAOsBCM4BAAC-AusBIg0DAACwAgAgBgAArgIAILoBAADvAgAwuwEAAAcAELwBAADvAgAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh1gEBAKsCACHrAQEAqwIAIewBAQCrAgAhggIAAAcAIIMCAAAHACALAwAAsAIAIAYAAK4CACC6AQAA7wIAMLsBAAAHABC8AQAA7wIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdYBAQCrAgAh6wEBAKsCACHsAQEAqwIAIREDAACwAgAgugEAAPACADC7AQAAAwAQvAEAAPACADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHSAQEAqwIAId0BAQCrAgAh8AEBAKsCACHxAQEArAIAIfIBAQCsAgAh8wEBAKwCACH0AUAA8QIAIfUBQADxAgAh9gEBAKwCACH3AQEArAIAIQjHAUAAAAAByAFAAAAABckBQAAAAAXKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAAAABzgFAAMsCACEAAAAAAAABhwIBAAAAAQWHAgIAAAABjQICAAAAAY4CAgAAAAGPAgIAAAABkAICAAAAAQGHAgAAAMMBAgGHAkAAAAABAYcCAQAAAAEFHgAArwUAIB8AALkFACCEAgAAsAUAIIUCAAC4BQAgigIAAAEAIAUeAACtBQAgHwAAtgUAIIQCAACuBQAghQIAALUFACCKAgAADQAgBx4AAKsFACAfAACzBQAghAIAAKwFACCFAgAAsgUAIIgCAAAcACCJAgAAHAAgigIAAB4AIAseAACBAwAwHwAAhgMAMIQCAACCAwAwhQIAAIMDADCGAgAAhAMAIIcCAACFAwAwiAIAAIUDADCJAgAAhQMAMIoCAACFAwAwiwIAAIcDADCMAgAAiAMAMAsHAACNAwAgCQAAjgMAIA8AAI8DACC9AQEAAAABvgEBAAAAAb8BAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAECAAAAHgAgHgAAjAMAIAMAAAAeACAeAACMAwAgHwAAiwMAIAEXAACxBQAwEAcAALACACAJAADhAgAgDgAA4gIAIA8AANsCACC6AQAA3gIAMLsBAAAcABC8AQAA3gIAML0BAQAAAAG-AQEAqwIAIb8BAQCrAgAhwAEBAKwCACHBAQIA3wIAIcMBAADgAsMBIsQBAQCrAgAhxQFAAK0CACHGAUAArQIAIQIAAAAeACAXAACLAwAgAgAAAIkDACAXAACKAwAgDLoBAACIAwAwuwEAAIkDABC8AQAAiAMAML0BAQCrAgAhvgEBAKsCACG_AQEAqwIAIcABAQCsAgAhwQECAN8CACHDAQAA4ALDASLEAQEAqwIAIcUBQACtAgAhxgFAAK0CACEMugEAAIgDADC7AQAAiQMAELwBAACIAwAwvQEBAKsCACG-AQEAqwIAIb8BAQCrAgAhwAEBAKwCACHBAQIA3wIAIcMBAADgAsMBIsQBAQCrAgAhxQFAAK0CACHGAUAArQIAIQi9AQEA-AIAIb4BAQD4AgAhvwEBAPgCACHBAQIA-QIAIcMBAAD6AsMBIsQBAQD4AgAhxQFAAPsCACHGAUAA-wIAIQsHAAD9AgAgCQAA_gIAIA8AAIADACC9AQEA-AIAIb4BAQD4AgAhvwEBAPgCACHBAQIA-QIAIcMBAAD6AsMBIsQBAQD4AgAhxQFAAPsCACHGAUAA-wIAIQsHAACNAwAgCQAAjgMAIA8AAI8DACC9AQEAAAABvgEBAAAAAb8BAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEDHgAArwUAIIQCAACwBQAgigIAAAEAIAMeAACtBQAghAIAAK4FACCKAgAADQAgBB4AAIEDADCEAgAAggMAMIYCAACEAwAgigIAAIUDADADHgAAqwUAIIQCAACsBQAgigIAAB4AIAAAAAseAAC3AwAwHwAAvAMAMIQCAAC4AwAwhQIAALkDADCGAgAAugMAIIcCAAC7AwAwiAIAALsDADCJAgAAuwMAMIoCAAC7AwAwiwIAAL0DADCMAgAAvgMAMAseAACXAwAwHwAAnAMAMIQCAACYAwAwhQIAAJkDADCGAgAAmgMAIIcCAACbAwAwiAIAAJsDADCJAgAAmwMAMIoCAACbAwAwiwIAAJ0DADCMAgAAngMAMAUeAACNBQAgHwAAqQUAIIQCAACOBQAghQIAAKgFACCKAgAAAQAgDAcAALUDACALAAC2AwAgvQEBAAAAAb4BAQAAAAHDAQAAAOEBAsUBQAAAAAHGAUAAAAAB1AEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAECAAAAEgAgHgAAtAMAIAMAAAASACAeAAC0AwAgHwAAogMAIAEXAACnBQAwEQcAALACACAIAADoAgAgCwAA6QIAILoBAADmAgAwuwEAABAAELwBAADmAgAwvQEBAAAAAb4BAQCrAgAhwwEAAOcC4QEixQFAAK0CACHGAUAArQIAIdQBAQCrAgAh3QEBAKsCACHeAQEArAIAId8BAQCsAgAh4QECAN8CACHiAQEArAIAIQIAAAASACAXAACiAwAgAgAAAJ8DACAXAACgAwAgDroBAACeAwAwuwEAAJ8DABC8AQAAngMAML0BAQCrAgAhvgEBAKsCACHDAQAA5wLhASLFAUAArQIAIcYBQACtAgAh1AEBAKsCACHdAQEAqwIAId4BAQCsAgAh3wEBAKwCACHhAQIA3wIAIeIBAQCsAgAhDroBAACeAwAwuwEAAJ8DABC8AQAAngMAML0BAQCrAgAhvgEBAKsCACHDAQAA5wLhASLFAUAArQIAIcYBQACtAgAh1AEBAKsCACHdAQEAqwIAId4BAQCsAgAh3wEBAKwCACHhAQIA3wIAIeIBAQCsAgAhCr0BAQD4AgAhvgEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHeAQEA_AIAId8BAQD8AgAh4QECAPkCACHiAQEA_AIAIQGHAgAAAOEBAgwHAACjAwAgCwAApAMAIL0BAQD4AgAhvgEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHeAQEA_AIAId8BAQD8AgAh4QECAPkCACHiAQEA_AIAIQUeAACcBQAgHwAApQUAIIQCAACdBQAghQIAAKQFACCKAgAAAQAgCx4AAKUDADAfAACqAwAwhAIAAKYDADCFAgAApwMAMIYCAACoAwAghwIAAKkDADCIAgAAqQMAMIkCAACpAwAwigIAAKkDADCLAgAAqwMAMIwCAACsAwAwBwkAALMDACC9AQEAAAABvwEBAAAAAcUBQAAAAAHGAUAAAAAB2wEIAAAAAdwBAgAAAAECAAAAFgAgHgAAsgMAIAMAAAAWACAeAACyAwAgHwAAsAMAIAEXAACjBQAwDAkAAOECACAKAADlAgAgugEAAOMCADC7AQAAFAAQvAEAAOMCADC9AQEAAAABvwEBAKsCACHFAUAArQIAIcYBQACtAgAh2gEBAKsCACHbAQgA5AIAIdwBAgDfAgAhAgAAABYAIBcAALADACACAAAArQMAIBcAAK4DACAKugEAAKwDADC7AQAArQMAELwBAACsAwAwvQEBAKsCACG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACEKugEAAKwDADC7AQAArQMAELwBAACsAwAwvQEBAKsCACG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACEGvQEBAPgCACG_AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHbAQgArwMAIdwBAgD5AgAhBYcCCAAAAAGNAggAAAABjgIIAAAAAY8CCAAAAAGQAggAAAABBwkAALEDACC9AQEA-AIAIb8BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdsBCACvAwAh3AECAPkCACEFHgAAngUAIB8AAKEFACCEAgAAnwUAIIUCAACgBQAgigIAAA0AIAcJAACzAwAgvQEBAAAAAb8BAQAAAAHFAUAAAAABxgFAAAAAAdsBCAAAAAHcAQIAAAABAx4AAJ4FACCEAgAAnwUAIIoCAAANACAMBwAAtQMAIAsAALYDACC9AQEAAAABvgEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3gEBAAAAAd8BAQAAAAHhAQIAAAAB4gEBAAAAAQMeAACcBQAghAIAAJ0FACCKAgAAAQAgBB4AAKUDADCEAgAApgMAMIYCAACoAwAgigIAAKkDADAPBQAA3gMAIAsAAN8DACAQAADgAwAgvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHjAQEAAAAB5AEgAAAAAeYBAAAA5gEC5wEBAAAAAekBAAAA6QECAgAAAA0AIB4AAN0DACADAAAADQAgHgAA3QMAIB8AAMUDACABFwAAmwUAMBQFAADuAgAgCAAA6AIAIAsAAOkCACAQAADbAgAgugEAAOoCADC7AQAACwAQvAEAAOoCADC9AQEAAAABwwEAAO0C6wEixQFAAK0CACHGAUAArQIAIdUBAQCsAgAh1gEBAKwCACHbAQIA3wIAId0BAQCrAgAh4wEBAKsCACHkASAA1QIAIeYBAADrAuYBIucBAQCrAgAh6QEAAOwC6QEiAgAAAA0AIBcAAMUDACACAAAAvwMAIBcAAMADACAQugEAAL4DADC7AQAAvwMAELwBAAC-AwAwvQEBAKsCACHDAQAA7QLrASLFAUAArQIAIcYBQACtAgAh1QEBAKwCACHWAQEArAIAIdsBAgDfAgAh3QEBAKsCACHjAQEAqwIAIeQBIADVAgAh5gEAAOsC5gEi5wEBAKsCACHpAQAA7ALpASIQugEAAL4DADC7AQAAvwMAELwBAAC-AwAwvQEBAKsCACHDAQAA7QLrASLFAUAArQIAIcYBQACtAgAh1QEBAKwCACHWAQEArAIAIdsBAgDfAgAh3QEBAKsCACHjAQEAqwIAIeQBIADVAgAh5gEAAOsC5gEi5wEBAKsCACHpAQAA7ALpASIMvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh4wEBAPgCACHkASAAwQMAIeYBAADCA-YBIucBAQD4AgAh6QEAAMMD6QEiAYcCIAAAAAEBhwIAAADmAQIBhwIAAADpAQIBhwIAAADrAQIPBQAAxgMAIAsAAMcDACAQAADIAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh4wEBAPgCACHkASAAwQMAIeYBAADCA-YBIucBAQD4AgAh6QEAAMMD6QEiBR4AAI8FACAfAACZBQAghAIAAJAFACCFAgAAmAUAIIoCAAAJACALHgAA0gMAMB8AANYDADCEAgAA0wMAMIUCAADUAwAwhgIAANUDACCHAgAAqQMAMIgCAACpAwAwiQIAAKkDADCKAgAAqQMAMIsCAADXAwAwjAIAAKwDADALHgAAyQMAMB8AAM0DADCEAgAAygMAMIUCAADLAwAwhgIAAMwDACCHAgAAhQMAMIgCAACFAwAwiQIAAIUDADCKAgAAhQMAMIsCAADOAwAwjAIAAIgDADALBwAAjQMAIA4AAJADACAPAACPAwAgvQEBAAAAAb4BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABAgAAAB4AIB4AANEDACADAAAAHgAgHgAA0QMAIB8AANADACABFwAAlwUAMAIAAAAeACAXAADQAwAgAgAAAIkDACAXAADPAwAgCL0BAQD4AgAhvgEBAPgCACHAAQEA_AIAIcEBAgD5AgAhwwEAAPoCwwEixAEBAPgCACHFAUAA-wIAIcYBQAD7AgAhCwcAAP0CACAOAAD_AgAgDwAAgAMAIL0BAQD4AgAhvgEBAPgCACHAAQEA_AIAIcEBAgD5AgAhwwEAAPoCwwEixAEBAPgCACHFAUAA-wIAIcYBQAD7AgAhCwcAAI0DACAOAACQAwAgDwAAjwMAIL0BAQAAAAG-AQEAAAABwAEBAAAAAcEBAgAAAAHDAQAAAMMBAsQBAQAAAAHFAUAAAAABxgFAAAAAAQcKAADcAwAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB2gEBAAAAAdsBCAAAAAHcAQIAAAABAgAAABYAIB4AANsDACADAAAAFgAgHgAA2wMAIB8AANkDACABFwAAlgUAMAIAAAAWACAXAADZAwAgAgAAAK0DACAXAADYAwAgBr0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdoBAQD4AgAh2wEIAK8DACHcAQIA-QIAIQcKAADaAwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh2gEBAPgCACHbAQgArwMAIdwBAgD5AgAhBR4AAJEFACAfAACUBQAghAIAAJIFACCFAgAAkwUAIIoCAAASACAHCgAA3AMAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdoBAQAAAAHbAQgAAAAB3AECAAAAAQMeAACRBQAghAIAAJIFACCKAgAAEgAgDwUAAN4DACALAADfAwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB4wEBAAAAAeQBIAAAAAHmAQAAAOYBAucBAQAAAAHpAQAAAOkBAgMeAACPBQAghAIAAJAFACCKAgAACQAgBB4AANIDADCEAgAA0wMAMIYCAADVAwAgigIAAKkDADAEHgAAyQMAMIQCAADKAwAwhgIAAMwDACCKAgAAhQMAMAQeAAC3AwAwhAIAALgDADCGAgAAugMAIIoCAAC7AwAwBB4AAJcDADCEAgAAmAMAMIYCAACaAwAgigIAAJsDADADHgAAjQUAIIQCAACOBQAgigIAAAEAIAAACQQAAOQEACAFAADlBAAgCAAA5gQAIA0AAOUDACAQAADnBAAgEQAA6AQAINYBAADyAgAg4gEAAPICACD9AQAA8gIAIAAAAAAAAAAAAAAFHgAAiAUAIB8AAIsFACCEAgAAiQUAIIUCAACKBQAgigIAAOcBACADHgAAiAUAIIQCAACJBQAgigIAAOcBACAAAAAAAAUeAACDBQAgHwAAhgUAIIQCAACEBQAghQIAAIUFACCKAgAA5wEAIAMeAACDBQAghAIAAIQFACCKAgAA5wEAIAAAAAUeAAD9BAAgHwAAgQUAIIQCAAD-BAAghQIAAIAFACCKAgAAAQAgCx4AAP8DADAfAACDBAAwhAIAAIAEADCFAgAAgQQAMIYCAACCBAAghwIAALsDADCIAgAAuwMAMIkCAAC7AwAwigIAALsDADCLAgAAhAQAMIwCAAC-AwAwDwgAAPkDACALAADfAwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLpAQAAAOkBAgIAAAANACAeAACHBAAgAwAAAA0AIB4AAIcEACAfAACGBAAgARcAAP8EADACAAAADQAgFwAAhgQAIAIAAAC_AwAgFwAAhQQAIAy9AQEA-AIAIcMBAADEA-sBIsUBQAD7AgAhxgFAAPsCACHVAQEA_AIAIdYBAQD8AgAh2wECAPkCACHdAQEA-AIAIeMBAQD4AgAh5AEgAMEDACHmAQAAwgPmASLpAQAAwwPpASIPCAAA-AMAIAsAAMcDACAQAADIAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi6QEAAMMD6QEiDwgAAPkDACALAADfAwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLpAQAAAOkBAgMeAAD9BAAghAIAAP4EACCKAgAAAQAgBB4AAP8DADCEAgAAgAQAMIYCAACCBAAgigIAALsDADAAAAAAAAABhwJAAAAAAQUeAAD4BAAgHwAA-wQAIIQCAAD5BAAghQIAAPoEACCKAgAAAQAgAx4AAPgEACCEAgAA-QQAIIoCAAABACAAAAAFHgAA8wQAIB8AAPYEACCEAgAA9AQAIIUCAAD1BAAgigIAAAEAIAMeAADzBAAghAIAAPQEACCKAgAAAQAgAAAAAYcCAAAA_wECAYcCAAAAgQICCx4AANIEADAfAADXBAAwhAIAANMEADCFAgAA1AQAMIYCAADVBAAghwIAANYEADCIAgAA1gQAMIkCAADWBAAwigIAANYEADCLAgAA2AQAMIwCAADZBAAwCx4AAMYEADAfAADLBAAwhAIAAMcEADCFAgAAyAQAMIYCAADJBAAghwIAAMoEADCIAgAAygQAMIkCAADKBAAwigIAAMoEADCLAgAAzAQAMIwCAADNBAAwCx4AAL0EADAfAADBBAAwhAIAAL4EADCFAgAAvwQAMIYCAADABAAghwIAAJsDADCIAgAAmwMAMIkCAACbAwAwigIAAJsDADCLAgAAwgQAMIwCAACeAwAwBx4AALgEACAfAAC7BAAghAIAALkEACCFAgAAugQAIIgCAAAnACCJAgAAJwAgigIAAOcBACALHgAArwQAMB8AALMEADCEAgAAsAQAMIUCAACxBAAwhgIAALIEACCHAgAAhQMAMIgCAACFAwAwiQIAAIUDADCKAgAAhQMAMIsCAAC0BAAwjAIAAIgDADALHgAAowQAMB8AAKgEADCEAgAApAQAMIUCAAClBAAwhgIAAKYEACCHAgAApwQAMIgCAACnBAAwiQIAAKcEADCKAgAApwQAMIsCAACpBAAwjAIAAKoEADAHvQEBAAAAAcUBQAAAAAHGAUAAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQIAAAAsACAeAACuBAAgAwAAACwAIB4AAK4EACAfAACtBAAgARcAAPIEADAMAwAAsAIAILoBAADdAgAwuwEAACoAELwBAADdAgAwvQEBAAAAAcUBQACtAgAhxgFAAK0CACHSAQEAqwIAIe8BQACtAgAh-AEBAAAAAfkBAQCsAgAh-gEBAKwCACECAAAALAAgFwAArQQAIAIAAACrBAAgFwAArAQAIAu6AQAAqgQAMLsBAACrBAAQvAEAAKoEADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHSAQEAqwIAIe8BQACtAgAh-AEBAKsCACH5AQEArAIAIfoBAQCsAgAhC7oBAACqBAAwuwEAAKsEABC8AQAAqgQAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh7wFAAK0CACH4AQEAqwIAIfkBAQCsAgAh-gEBAKwCACEHvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh7wFAAPsCACH4AQEA-AIAIfkBAQD8AgAh-gEBAPwCACEHvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh7wFAAPsCACH4AQEA-AIAIfkBAQD8AgAh-gEBAPwCACEHvQEBAAAAAcUBQAAAAAHGAUAAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQsJAACOAwAgDgAAkAMAIA8AAI8DACC9AQEAAAABvwEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAECAAAAHgAgHgAAtwQAIAMAAAAeACAeAAC3BAAgHwAAtgQAIAEXAADxBAAwAgAAAB4AIBcAALYEACACAAAAiQMAIBcAALUEACAIvQEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACELCQAA_gIAIA4AAP8CACAPAACAAwAgvQEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACELCQAAjgMAIA4AAJADACAPAACPAwAgvQEBAAAAAb8BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABCQYAAOEDACANAADiAwAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAQIAAADnAQAgHgAAuAQAIAMAAAAnACAeAAC4BAAgHwAAvAQAIAsAAAAnACAGAACUAwAgDQAAlQMAIBcAALwEACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHTAQEA-AIAIdQBAQD4AgAh1QEBAPwCACHWAQEA_AIAIQkGAACUAwAgDQAAlQMAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhDAgAAPIDACALAAC2AwAgvQEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAECAAAAEgAgHgAAxQQAIAMAAAASACAeAADFBAAgHwAAxAQAIAEXAADwBAAwAgAAABIAIBcAAMQEACACAAAAnwMAIBcAAMMEACAKvQEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhDAgAAPEDACALAACkAwAgvQEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhDAgAAPIDACALAAC2AwAgvQEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAEGBgAAiQQAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdYBAQAAAAHsAQEAAAABAgAAAAkAIB4AANEEACADAAAACQAgHgAA0QQAIB8AANAEACABFwAA7wQAMAsDAACwAgAgBgAArgIAILoBAADvAgAwuwEAAAcAELwBAADvAgAwvQEBAAAAAcUBQACtAgAhxgFAAK0CACHWAQEAqwIAIesBAQCrAgAh7AEBAAAAAQIAAAAJACAXAADQBAAgAgAAAM4EACAXAADPBAAgCboBAADNBAAwuwEAAM4EABC8AQAAzQQAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdYBAQCrAgAh6wEBAKsCACHsAQEAqwIAIQm6AQAAzQQAMLsBAADOBAAQvAEAAM0EADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHWAQEAqwIAIesBAQCrAgAh7AEBAKsCACEFvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh1gEBAPgCACHsAQEA-AIAIQYGAAD-AwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh1gEBAPgCACHsAQEA-AIAIQYGAACJBAAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB1gEBAAAAAewBAQAAAAEMvQEBAAAAAcUBQAAAAAHGAUAAAAAB3QEBAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AUAAAAAB9QFAAAAAAfYBAQAAAAH3AQEAAAABAgAAAAUAIB4AAN0EACADAAAABQAgHgAA3QQAIB8AANwEACABFwAA7gQAMBEDAACwAgAgugEAAPACADC7AQAAAwAQvAEAAPACADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh3QEBAKsCACHwAQEAqwIAIfEBAQCsAgAh8gEBAKwCACHzAQEArAIAIfQBQADxAgAh9QFAAPECACH2AQEArAIAIfcBAQCsAgAhAgAAAAUAIBcAANwEACACAAAA2gQAIBcAANsEACAQugEAANkEADC7AQAA2gQAELwBAADZBAAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHdAQEAqwIAIfABAQCrAgAh8QEBAKwCACHyAQEArAIAIfMBAQCsAgAh9AFAAPECACH1AUAA8QIAIfYBAQCsAgAh9wEBAKwCACEQugEAANkEADC7AQAA2gQAELwBAADZBAAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHdAQEAqwIAIfABAQCrAgAh8QEBAKwCACHyAQEArAIAIfMBAQCsAgAh9AFAAPECACH1AUAA8QIAIfYBAQCsAgAh9wEBAKwCACEMvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh3QEBAPgCACHwAQEA-AIAIfEBAQD8AgAh8gEBAPwCACHzAQEA_AIAIfQBQACQBAAh9QFAAJAEACH2AQEA_AIAIfcBAQD8AgAhDL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAId0BAQD4AgAh8AEBAPgCACHxAQEA_AIAIfIBAQD8AgAh8wEBAPwCACH0AUAAkAQAIfUBQACQBAAh9gEBAPwCACH3AQEA_AIAIQy9AQEAAAABxQFAAAAAAcYBQAAAAAHdAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBQAAAAAH1AUAAAAAB9gEBAAAAAfcBAQAAAAEEHgAA0gQAMIQCAADTBAAwhgIAANUEACCKAgAA1gQAMAQeAADGBAAwhAIAAMcEADCGAgAAyQQAIIoCAADKBAAwBB4AAL0EADCEAgAAvgQAMIYCAADABAAgigIAAJsDADADHgAAuAQAIIQCAAC5BAAgigIAAOcBACAEHgAArwQAMIQCAACwBAAwhgIAALIEACCKAgAAhQMAMAQeAACjBAAwhAIAAKQEADCGAgAApgQAIIoCAACnBAAwAAAFAwAA5gMAIAYAAOQDACANAADlAwAg1QEAAPICACDWAQAA8gIAIAAABgUAAO0EACAIAADmBAAgCwAA7AQAIBAAAOcEACDVAQAA8gIAINYBAADyAgAgBQcAAOYDACAJAADpBAAgDgAA6gQAIA8AAOcEACDAAQAA8gIAIAYHAADmAwAgCAAA5gQAIAsAAOwEACDeAQAA8gIAIN8BAADyAgAg4gEAAPICACAAAgMAAOYDACAGAADkAwAgDL0BAQAAAAHFAUAAAAABxgFAAAAAAd0BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AFAAAAAAfUBQAAAAAH2AQEAAAAB9wEBAAAAAQW9AQEAAAABxQFAAAAAAcYBQAAAAAHWAQEAAAAB7AEBAAAAAQq9AQEAAAABwwEAAADhAQLFAUAAAAABxgFAAAAAAdQBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHhAQIAAAAB4gEBAAAAAQi9AQEAAAABvwEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEHvQEBAAAAAcUBQAAAAAHGAUAAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAREEAADeBAAgBQAA3wQAIAgAAOEEACANAADgBAAgEAAA4gQAIL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABAgAAAAEAIB4AAPMEACADAAAANAAgHgAA8wQAIB8AAPcEACATAAAANAAgBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBAAAKEEACAXAAD3BAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBAAAKEEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD8AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIREFAADfBAAgCAAA4QQAIA0AAOAEACAQAADiBAAgEQAA4wQAIL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABAgAAAAEAIB4AAPgEACADAAAANAAgHgAA-AQAIB8AAPwEACATAAAANAAgBQAAngQAIAgAAKAEACANAACfBAAgEAAAoQQAIBEAAKIEACAXAAD8BAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBQAAngQAIAgAAKAEACANAACfBAAgEAAAoQQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD8AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIREEAADeBAAgCAAA4QQAIA0AAOAEACAQAADiBAAgEQAA4wQAIL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABAgAAAAEAIB4AAP0EACAMvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHdAQEAAAAB4wEBAAAAAeQBIAAAAAHmAQAAAOYBAukBAAAA6QECAwAAADQAIB4AAP0EACAfAACCBQAgEwAAADQAIAQAAJ0EACAIAACgBAAgDQAAnwQAIBAAAKEEACARAACiBAAgFwAAggUAIL0BAQD4AgAhwwEAAJwEgQIixQFAAPsCACHGAUAA-wIAIdYBAQD8AgAh4gEBAPwCACHsAQEA-AIAIfsBAQD4AgAh_AEgAMEDACH9AQEA_AIAIf8BAACbBP8BIoECIADBAwAhEQQAAJ0EACAIAACgBAAgDQAAnwQAIBAAAKEEACARAACiBAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACEKAwAA4wMAIA0AAOIDACC9AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAQIAAADnAQAgHgAAgwUAIAMAAAAnACAeAACDBQAgHwAAhwUAIAwAAAAnACADAACWAwAgDQAAlQMAIBcAAIcFACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhCgMAAJYDACANAACVAwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh0gEBAPgCACHTAQEA-AIAIdQBAQD4AgAh1QEBAPwCACHWAQEA_AIAIQoDAADjAwAgBgAA4QMAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAABAgAAAOcBACAeAACIBQAgAwAAACcAIB4AAIgFACAfAACMBQAgDAAAACcAIAMAAJYDACAGAACUAwAgFwAAjAUAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh0wEBAPgCACHUAQEA-AIAIdUBAQD8AgAh1gEBAPwCACEKAwAAlgMAIAYAAJQDACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhEQQAAN4EACAFAADfBAAgDQAA4AQAIBAAAOIEACARAADjBAAgvQEBAAAAAcMBAAAAgQICxQFAAAAAAcYBQAAAAAHWAQEAAAAB4gEBAAAAAewBAQAAAAH7AQEAAAAB_AEgAAAAAf0BAQAAAAH_AQAAAP8BAoECIAAAAAECAAAAAQAgHgAAjQUAIAcDAACIBAAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB1gEBAAAAAesBAQAAAAHsAQEAAAABAgAAAAkAIB4AAI8FACANBwAAtQMAIAgAAPIDACC9AQEAAAABvgEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAECAAAAEgAgHgAAkQUAIAMAAAAQACAeAACRBQAgHwAAlQUAIA8AAAAQACAHAACjAwAgCAAA8QMAIBcAAJUFACC9AQEA-AIAIb4BAQD4AgAhwwEAAKED4QEixQFAAPsCACHGAUAA-wIAIdQBAQD4AgAh3QEBAPgCACHeAQEA_AIAId8BAQD8AgAh4QECAPkCACHiAQEA_AIAIQ0HAACjAwAgCAAA8QMAIL0BAQD4AgAhvgEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhBr0BAQAAAAHFAUAAAAABxgFAAAAAAdoBAQAAAAHbAQgAAAAB3AECAAAAAQi9AQEAAAABvgEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEDAAAABwAgHgAAjwUAIB8AAJoFACAJAAAABwAgAwAA_QMAIBcAAJoFACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHWAQEA-AIAIesBAQD4AgAh7AEBAPgCACEHAwAA_QMAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdYBAQD4AgAh6wEBAPgCACHsAQEA-AIAIQy9AQEAAAABwwEAAADrAQLFAUAAAAABxgFAAAAAAdUBAQAAAAHWAQEAAAAB2wECAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLnAQEAAAAB6QEAAADpAQIRBAAA3gQAIAUAAN8EACAIAADhBAAgEAAA4gQAIBEAAOMEACC9AQEAAAABwwEAAACBAgLFAUAAAAABxgFAAAAAAdYBAQAAAAHiAQEAAAAB7AEBAAAAAfsBAQAAAAH8ASAAAAAB_QEBAAAAAf8BAAAA_wECgQIgAAAAAQIAAAABACAeAACcBQAgEAUAAN4DACAIAAD5AwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLnAQEAAAAB6QEAAADpAQICAAAADQAgHgAAngUAIAMAAAALACAeAACeBQAgHwAAogUAIBIAAAALACAFAADGAwAgCAAA-AMAIBAAAMgDACAXAACiBQAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIQBQAAxgMAIAgAAPgDACAQAADIAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIGvQEBAAAAAb8BAQAAAAHFAUAAAAABxgFAAAAAAdsBCAAAAAHcAQIAAAABAwAAADQAIB4AAJwFACAfAACmBQAgEwAAADQAIAQAAJ0EACAFAACeBAAgCAAAoAQAIBAAAKEEACARAACiBAAgFwAApgUAIL0BAQD4AgAhwwEAAJwEgQIixQFAAPsCACHGAUAA-wIAIdYBAQD8AgAh4gEBAPwCACHsAQEA-AIAIfsBAQD4AgAh_AEgAMEDACH9AQEA_AIAIf8BAACbBP8BIoECIADBAwAhEQQAAJ0EACAFAACeBAAgCAAAoAQAIBAAAKEEACARAACiBAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACEKvQEBAAAAAb4BAQAAAAHDAQAAAOEBAsUBQAAAAAHGAUAAAAAB1AEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAEDAAAANAAgHgAAjQUAIB8AAKoFACATAAAANAAgBAAAnQQAIAUAAJ4EACANAACfBAAgEAAAoQQAIBEAAKIEACAXAACqBQAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBAAAnQQAIAUAAJ4EACANAACfBAAgEAAAoQQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD8AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIQwHAACNAwAgCQAAjgMAIA4AAJADACC9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABAgAAAB4AIB4AAKsFACAQBQAA3gMAIAgAAPkDACALAADfAwAgvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHdAQEAAAAB4wEBAAAAAeQBIAAAAAHmAQAAAOYBAucBAQAAAAHpAQAAAOkBAgIAAAANACAeAACtBQAgEQQAAN4EACAFAADfBAAgCAAA4QQAIA0AAOAEACARAADjBAAgvQEBAAAAAcMBAAAAgQICxQFAAAAAAcYBQAAAAAHWAQEAAAAB4gEBAAAAAewBAQAAAAH7AQEAAAAB_AEgAAAAAf0BAQAAAAH_AQAAAP8BAoECIAAAAAECAAAAAQAgHgAArwUAIAi9AQEAAAABvgEBAAAAAb8BAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEDAAAAHAAgHgAAqwUAIB8AALQFACAOAAAAHAAgBwAA_QIAIAkAAP4CACAOAAD_AgAgFwAAtAUAIL0BAQD4AgAhvgEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACEMBwAA_QIAIAkAAP4CACAOAAD_AgAgvQEBAPgCACG-AQEA-AIAIb8BAQD4AgAhwAEBAPwCACHBAQIA-QIAIcMBAAD6AsMBIsQBAQD4AgAhxQFAAPsCACHGAUAA-wIAIQMAAAALACAeAACtBQAgHwAAtwUAIBIAAAALACAFAADGAwAgCAAA-AMAIAsAAMcDACAXAAC3BQAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIQBQAAxgMAIAgAAPgDACALAADHAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIDAAAANAAgHgAArwUAIB8AALoFACATAAAANAAgBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBEAAKIEACAXAAC6BQAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA_AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD8AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIQcEBgIFCgMIKAUMAA8NJgYQKQoRLQ4BAwABAwMAAQYOBAwADQUFAAMIAAULGwcMAAwQHwoEAwABBg8EDAAJDRMGBAcAAQgABQsXBwwACAIJAAQKAAYBCxgAAgYZAA0aAAUHAAEJAAQMAAsOIAoPIQoBDyIAAgsjABAkAAEGJQABAwABBQQuAAUvAA0wABAxABEyAAAAAAMMABQkABUlABYAAAADDAAUJAAVJQAWAQMAAQEDAAEDDAAbJAAcJQAdAAAAAwwAGyQAHCUAHQEDAAEBAwABAwwAIiQAIyUAJAAAAAMMACIkACMlACQAAAADDAAqJAArJQAsAAAAAwwAKiQAKyUALAEDAAEBAwABAwwAMSQAMiUAMwAAAAMMADEkADIlADMCBQADCAAFAgUAAwgABQUMADgkADslADx2ADl3ADoAAAAAAAUMADgkADslADx2ADl3ADoCBwABCAAFAgcAAQgABQUMAEEkAEQlAEV2AEJ3AEMAAAAAAAUMAEEkAEQlAEV2AEJ3AEMCCQAECgAGAgkABAoABgUMAEokAE0lAE52AEt3AEwAAAAAAAUMAEokAE0lAE52AEt3AEwBAwABAQMAAQMMAFMkAFQlAFUAAAADDABTJABUJQBVAwcAAQkABA6JAgoDBwABCQAEDo8CCgUMAFokAF0lAF52AFt3AFwAAAAAAAUMAFokAF0lAF52AFt3AFwSAgETMwEUNgEVNwEWOAEYOgEZPBAaPREbPwEcQRAdQhIgQwEhRAEiRRAmSBMnSRcoSg4pSw4qTA4rTQ4sTg4tUA4uUhAvUxgwVQ4xVxAyWBkzWQ40Wg41WxA2Xho3Xx44YAI5YQI6YgI7YwI8ZAI9ZgI-aBA_aR9AawJBbRBCbiBDbwJEcAJFcRBGdCFHdSVIdyZJeCZKeyZLfCZMfSZNfyZOgQEQT4IBJ1CEASZRhgEQUocBKFOIASZUiQEmVYoBEFaNASlXjgEtWI8BA1mQAQNakQEDW5IBA1yTAQNdlQEDXpcBEF-YAS5gmgEDYZwBEGKdAS9jngEDZJ8BA2WgARBmowEwZ6QBNGilAQRppgEEaqcBBGuoAQRsqQEEbasBBG6tARBvrgE1cLABBHGyARByswE2c7QBBHS1AQR1tgEQeLkBN3m6AT16uwEGe7wBBny9AQZ9vgEGfr8BBn_BAQaAAcMBEIEBxAE-ggHGAQaDAcgBEIQByQE_hQHKAQaGAcsBBocBzAEQiAHPAUCJAdABRooB0QEHiwHSAQeMAdMBB40B1AEHjgHVAQePAdcBB5AB2QEQkQHaAUeSAdwBB5MB3gEQlAHfAUiVAeABB5YB4QEHlwHiARCYAeUBSZkB5gFPmgHoAQWbAekBBZwB6wEFnQHsAQWeAe0BBZ8B7wEFoAHxARChAfIBUKIB9AEFowH2ARCkAfcBUaUB-AEFpgH5AQWnAfoBEKgB_QFSqQH-AVaqAf8BCqsBgAIKrAGBAgqtAYICCq4BgwIKrwGFAgqwAYcCELEBiAJXsgGLAgqzAY0CELQBjgJYtQGQAgq2AZECCrcBkgIQuAGVAlm5AZYCXw"
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
import { bearer } from "better-auth/plugins";
console.log(process.env.FRONTEND_URL, "s");
console.log(process.env.BETTER_AUTH_SECRET, "s");
var auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.FRONTEND_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.FRONTEND_URL],
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
    bearer()
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
      redirectURI: `${process.env.FRONTEND_URL}/api/auth/callback/google`,
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
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
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

// src/app/middleware/globalErrorHandeller.ts
function errorHandler(err, req, res, next) {
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation Error";
    errorSources.push({ message: err.message });
  } else if (err?.code === "ETIMEDOUT" || err?.code === "PROTOCOL_TIMEOUT") {
    statusCode = status.GATEWAY_TIMEOUT;
    message = "Database request timed out. Please retry after a short while.";
    errorSources.push({ message });
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode || status.BAD_REQUEST;
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
import { Router as Router8 } from "express";

// src/app/modules/meal/meal.route.ts
import { Router } from "express";

// src/app/middleware/auth.ts
import status2 from "http-status";

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
      throw new AppError_default(status2.UNAUTHORIZED, "Unauthorized! Please login to continue.");
    } catch (error) {
      next(new AppError_default(error.statusCode || status2.BAD_REQUEST, error.message));
    }
  };
};
var validateUserStatus = (userStatus) => {
  const forbiddenStatus = ["suspend", "BLOCKED", "DELETED"];
  if (forbiddenStatus.includes(userStatus)) {
    throw new AppError_default(status2.UNAUTHORIZED, "Access denied! Your account is not active.");
  }
};
var validateUserRole = (userRole, allowedRoles) => {
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    throw new AppError_default(status2.FORBIDDEN, "Forbidden! You don't have permission.");
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
import status3 from "http-status";
var createMeal = async (data, userid) => {
  const providerid = await prisma.user.findUnique({
    where: { id: userid },
    include: { provider: { select: { id: true } } }
  });
  if (!providerid) {
    throw new AppError_default(status3.NOT_FOUND, "provider not found");
  }
  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name
    }
  });
  if (!categoryCheck) {
    throw new AppError_default(status3.NOT_FOUND, "category not found");
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
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0
      },
      parentId: null,
      meal: {
        provider: {
          userId: result.provider.userId
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
    ...result,
    providerRating: {
      totalReview: totalReview ?? 0,
      averageRating: averageRating ?? 0
    }
  };
};
var UpdateMeals = async (data, mealid) => {
  const { category_name } = data;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid }
  });
  if (!existmeal) {
    throw new AppError_default(status3.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError_default(status3.CONFLICT, "category_name is already up to date.");
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
    throw new AppError_default(status3.NOT_FOUND, "meal not found");
  }
  const result = await prisma.meal.delete({
    where: {
      id: mealid
    }
  });
  console.log(result, "result");
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
  const { status: status19 } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (existmeal?.status === status19) {
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
      status: status19
    }
  });
  return result;
};
var getAllMealsForAdmin = async (data, page, limit, skip, sortBy, sortOrder) => {
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
  }
  const result = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED"
    },
    orderBy: {
      [sortBy]: sortOrder
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
  updateStatus,
  getAllMealsForAdmin
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
import status4 from "http-status";
var createMeal2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await mealService.createMeal(req.body, user.id);
  sendResponse(res, {
    httpStatusCode: status4.CREATED,
    success: true,
    message: "your meal has been created",
    data: result
  });
});
var UpdateMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status4.UNAUTHORIZED).json({ success: false, message: "you are not authorized" });
  }
  const result = await mealService.UpdateMeals(req.body, req.params.id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "meal update successfully",
    data: result
  });
});
var DeleteMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status4.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await mealService.DeleteMeals(req.params.id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
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
    httpStatusCode: status4.OK,
    success: true,
    message: " retrieve all meals successfully",
    data: result
  });
});
var getAllMealsForAdmin2 = catchAsync(async (req, res, next) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await mealService.getAllMealsForAdmin(req.query, page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: " retrieve all meals for admin successfully",
    data: result
  });
});
var GetSignlemeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mealService.getSinglemeals(id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: " retrieve single meal successfully",
    data: result
  });
});
var getownmeals = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status4.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await mealService.getOwnMeals(user.id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "your own meal retrieve has been successfully",
    data: result
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  console.log(req.body, "req,body");
  const user = req.user;
  if (!user) {
    return res.status(status4.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { id } = req.params;
  const result = await mealService.updateStatus(req.body, id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
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
  getAllMealsForAdmin: getAllMealsForAdmin2
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
    console.log(zodSchema, "zod");
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
var mealupdateStatus = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

// src/app/modules/meal/meal.route.ts
var router = Router();
router.get("/meals", mealController.Getallmeals);
router.get("/admin/meals", auth_default([UserRoles.Admin]), mealController.getAllMealsForAdmin);
router.get("/provider/meals/own", auth_default([UserRoles.Provider]), mealController.getownmeals);
router.post("/provider/meal", auth_default([UserRoles.Provider]), validateRequest(CreatemealData), mealController.createMeal);
router.delete("/provider/meal/:id", auth_default([UserRoles.Provider, UserRoles.Admin]), mealController.DeleteMeals);
router.put("/provider/meal/:id", auth_default([UserRoles.Provider]), validateRequest(UpdatemealData), mealController.UpdateMeals);
router.get("/meal/:id", mealController.GetSignlemeals);
router.put("/admin/meal/:id", auth_default([UserRoles.Admin]), mealController.updateStatus);
var mealRouter = { router };

// src/app/modules/provider/provider.route.ts
import { Router as Router2 } from "express";

// src/app/modules/provider/provider.service.ts
import status5 from "http-status";
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
  let i = 0;
  const userid = providers.map((p) => p.userId);
  console.log(userid.length, "userid");
  for (i = 0; i < userid.length; i++) {
    console.log(userid.length, "leng");
    console.log(i, "idss");
    const ratings = await prisma.review.aggregate({
      where: {
        rating: {
          gt: 0
        },
        parentId: null,
        meal: {
          provider: {
            userId: userid[i]
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
    console.log(i, "id");
    console.log(userid[i], "ratingdata");
    const providerWithRating = providers.map((provider) => {
      const totalReview = ratings._count.rating;
      const averageRating = ratings._avg.rating;
      return {
        ...provider,
        rating: {
          totalReview,
          averageRating
        }
      };
    });
    return providerWithRating;
  }
};
var getProviderWithMeals = async (id) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id }
  });
  if (!existprovider) {
    throw new AppError_default(status5.NOT_FOUND, "provider not found for this id");
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
    throw new AppError_default(status5.NOT_FOUND, "provider not found for this id");
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
      totalReview: totalReview || 0,
      averageRating: Number(averageRating.toFixed(1)) || 0
    }
  };
};
var UpateProviderProfile = async (data, userid) => {
  if (!data) {
    throw new AppError_default(status5.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      provider: true
    }
  });
  if (!providerinfo) {
    throw new AppError_default(status5.NOT_FOUND, "user not found");
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

// src/app/modules/provider/provider.controller.ts
import status6 from "http-status";
var createProvider2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await providerService.createProvider(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status6.CREATED,
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
      httpStatusCode: status6.OK,
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
      httpStatusCode: status6.OK,
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
      httpStatusCode: status6.BAD_REQUEST,
      success: false,
      message: "update provider profile failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "update provider profile successfully",
    data: result
  });
});
var providerController = { createProvider: createProvider2, gelAllprovider, getProviderWithMeals: getProviderWithMeals2, UpateProviderProfile: UpateProviderProfile2 };

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
router2.put("/providers/update", auth_default([UserRoles.Provider]), validateRequest(UpdateproviderData), providerController.UpateProviderProfile);
router2.get("/providers", providerController.gelAllprovider);
router2.get("/providers/:id", providerController.getProviderWithMeals);
var providerRouter = { router: router2 };

// src/app/modules/order/order.route.ts
import { Router as Router3 } from "express";

// src/app/modules/order/order.service.ts
import status7 from "http-status";
var CreateOrder = async (payload, customerId) => {
  const mealId = payload.items.find((i) => i.mealId);
  const existingmeals = await prisma.meal.findMany({
    where: {
      id: mealId?.mealId
    }
  });
  const mealdata = existingmeals.find((meal) => meal.id == mealId?.mealId);
  const orderexisting = await prisma.order.findMany({
    where: {
      customerId,
      orderitem: {
        some: {
          mealId: mealId?.mealId
        }
      }
    }
  });
  const existingOrder = orderexisting.filter((item, index) => item.status == "PLACED");
  try {
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
    if (result.orderitem.length == 0) {
      await prisma.order.delete({
        where: {
          id: result.id
        }
      });
      throw new AppError_default(400, "order created failed");
    }
    return result;
  } catch (error) {
    throw new AppError_default(500, "something went wrong,please try again");
  }
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
  const { status: status19 } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED"
  ];
  if (!statusValue.includes(status19)) {
    throw new AppError_default(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError_default(404, "no order found for this id");
  }
  if (existingOrder?.status == status19) {
    throw new AppError_default(409, `order already ${status19}`);
  }
  if (role == "Customer" && status19 !== "CANCELLED") {
    throw new AppError_default(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status19 == "CANCELLED") {
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
        status: status19
      }
    });
    return result;
  }
  if (role == "Provider" && status19 === "CANCELLED") {
    return "CANCELLED only Customer Change";
  }
  if (role == "Provider") {
    if (status19 == "PLACED" || status19 == "PREPARING" || status19 == "READY" || status19 == "DELIVERED") {
      const result = await prisma.order.update({
        where: {
          id
        },
        data: {
          status: status19
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
    throw new AppError_default(status7.NOT_FOUND, "no order found for this meal");
  }
  console.log(existingOrder, "data");
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder
  };
};
var CustomerRunningAndOldOrder = async (userid, status19) => {
  const andConditions = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status19;
  if (status19 == "DELIVERED") {
    andConditions.push({ status: status19 });
    message = "Recent order information retrieved successfully.", currentStatus = status19;
  }
  if (status19 == "CANCELLED") {
    andConditions.push({ status: status19 });
    message = "CANCELLED order information retrieved successfully.", currentStatus = status19;
  }
  if (status19 == "PLACED" || status19 == "PREPARING" || status19 == "READY") {
    andConditions.push({ status: status19 });
    message = "running order retrieved successfully.", currentStatus = status19;
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
    throw new AppError_default(status7.NOT_FOUND, "no order found for this id");
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

// src/app/modules/order/order.controller.ts
import status8 from "http-status";
var createOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status8.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status8.CREATED,
      success: true,
      message: "your order has been created successfully",
      data: result
    });
  }
);
var getOwnmealsOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status8.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ServiceOrder.getOwnmealsOrder(user.id);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: result?.success,
    message: result?.message,
    data: result?.result
  });
});
var UpdateOrderStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status8.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.UpdateOrderStatus(req.params.id, req.body, user.role);
    sendResponse(res, {
      httpStatusCode: status8.OK,
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
      return res.status(status8.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.getAllorder(user.role);
    if (!result) {
      sendResponse(res, {
        httpStatusCode: status8.BAD_REQUEST,
        success: false,
        message: "retrieve all orders failed",
        data: result
      });
    }
    sendResponse(res, {
      httpStatusCode: status8.OK,
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
        httpStatusCode: status8.BAD_REQUEST,
        success: false,
        message: result?.message,
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status8.OK,
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
      return res.status(status8.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id, req.query.status);
    if (!result.success) {
      sendResponse(res, {
        httpStatusCode: status8.BAD_REQUEST,
        success: false,
        message: "customer order status track failed",
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status8.OK,
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
      httpStatusCode: status8.BAD_REQUEST,
      success: false,
      message: "retrieve single order failed",
      data: result?.result
    });
  }
  sendResponse(res, {
    httpStatusCode: status8.OK,
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
router3.patch("/provider/orders/:id", auth_default([UserRoles.Provider, UserRoles.Customer]), OrderController.UpdateOrderStatus);
router3.get("/orders/:id", auth_default([UserRoles.Customer]), OrderController.getSingleOrder);
var OrderRouter = { router: router3 };

// src/app/modules/category/category.route.ts
import { Router as Router4 } from "express";

// src/app/modules/category/category.service.ts
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

// src/app/modules/category/category.controller.ts
import { status as status9 } from "http-status";
var CreateCategory2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status9.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await categoryService.CreateCategory(
      req.body,
      user.id
    );
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "your category has been created",
      data: result
    });
  }
);
var getCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.getCategory();
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "retrieve category successfully",
    data: result
  });
});
var SingleCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.SingleCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
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
    httpStatusCode: status9.OK,
    success: true,
    message: "your category has beed changed",
    data: result
  });
});
var DeleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.DeleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
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
  image: z4.string()
}).strict();
var UpdatecategoryData = z4.object({
  name: z4.string().optional(),
  image: z4.string().optional()
}).strict();

// src/app/modules/category/category.route.ts
var router4 = Router4();
router4.post("/admin/category", auth_default([UserRoles.Admin]), validateRequest(createcategoryData), CategoryController.CreateCategory);
router4.get("/category", CategoryController.getCategory);
router4.get("/category/:id", CategoryController.SingleCategory);
router4.put("/admin/category/:id", auth_default([UserRoles.Admin]), validateRequest(UpdatecategoryData), CategoryController.UpdateCategory);
router4.delete("/admin/category/:id", auth_default([UserRoles.Admin]), CategoryController.DeleteCategory);
var CategoryRouter = { router: router4 };

// src/app/modules/user/user.route.ts
import { Router as Router5 } from "express";

// src/app/modules/user/user.service.ts
import status10 from "http-status";
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
    throw new AppError_default(status10.NOT_FOUND, "user not found for this id");
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

// src/app/modules/user/user.controller.ts
import status11 from "http-status";
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
    httpStatusCode: status11.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result
  });
});
var getUserprofile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status11.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.getUserprofile(req.params.id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
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
    httpStatusCode: status11.OK,
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
      httpStatusCode: status11.OK,
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
      httpStatusCode: status11.OK,
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
    httpStatusCode: status11.OK,
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
  image: z5.string().optional(),
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
  const { status: status19 } = data;
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
      status: status19
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

// src/app/modules/reviews/reviews.controller.ts
import status12 from "http-status";
var CreateReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsService.CreateReviews(user.id, req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
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
    httpStatusCode: status12.OK,
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
      httpStatusCode: status12.OK,
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
    httpStatusCode: status12.OK,
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
      httpStatusCode: status12.OK,
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
      httpStatusCode: status12.OK,
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
import status13 from "http-status";
var getCurrentUser = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { provider: true }
  });
  if (!user) {
    throw new AppError_default(status13.NOT_FOUND, "User not found");
  }
  if (!user.isActive) {
    throw new AppError_default(status13.UNAUTHORIZED, "User account is not active");
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
var signup = async (payload) => {
  const { name, email, password, phone, image } = payload;
  const userExist = await prisma.user.findUnique({
    where: { email }
  });
  if (!image) {
    throw new AppError_default(status13.BAD_REQUEST, "Image is required to register a user.");
  }
  if (userExist) {
    throw new AppError_default(409, "user already exist,please try another email");
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      phone,
      image
    }
  });
  console.log(data, "data");
  if (!data.user) {
    throw new AppError_default(400, "User register failed");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    token: data.token,
    accessToken,
    refreshToken
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
    throw new AppError_default(status13.UNAUTHORIZED, "User is suspend");
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
    throw new AppError_default(status13.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status13.UNAUTHORIZED, "Invalid refresh token");
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
};
var authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken,
  verifyEmail
};

// src/app/modules/auth/auth.controller.ts
import status14 from "http-status";
var getCurrentUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.email);
  sendResponse(res, {
    httpStatusCode: status14.OK,
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
    httpStatusCode: status14.OK,
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
  console.log(payload, "apy");
  const result = await authService.signup(payload);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  sendResponse(res, {
    httpStatusCode: status14.CREATED,
    success: true,
    message: "user signup successfully",
    data: result
  });
});
var signin2 = catchAsync(async (req, res) => {
  const result = await authService.signin(req.body);
  const { accessToken, refreshToken, token } = result;
  console.log(token, "token");
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status14.OK,
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
      throw new AppError_default(status14.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status14.OK,
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
    httpStatusCode: status14.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var authController = {
  getCurrentUser: getCurrentUser2,
  signoutUser: signoutUser2,
  signup: signup2,
  signin: signin2,
  getNewToken: getNewToken2,
  verifyEmail: verifyEmail2
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
  image: z7.string().optional(),
  bgimage: z7.string().optional(),
  phone: z7.string().optional(),
  role: z7.string().optional(),
  restaurantName: z7.string().optional(),
  address: z7.string().optional(),
  description: z7.string().optional()
});

// src/app/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";

// src/app/config/env.ts
import dotenv from "dotenv";
import status15 from "http-status";
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
    "CLOUDINARY_API_SECRET"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status15.INTERNAL_SERVER_ERROR,
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
    }
  };
};
var envVars = loadEnvVariables();

// src/app/config/cloudinary.config.ts
import status16 from "http-status";
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

// src/app/modules/auth/auth.route.ts
var router7 = Router7();
router7.get("/me", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.getCurrentUser);
router7.post("/logout", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.signoutUser);
router7.post("/register", multerUpload.single("file"), validateRequest(createUserSchema), authController.signup);
router7.post("/login", authController.signin);
router7.post("/refresh-token", authController.getNewToken);
router7.post("/verify-email", authController.verifyEmail);
var authRouter = { router: router7 };

// src/app/modules/stats/stats.route.ts
import express from "express";

// src/app/modules/stats/stats.controller.ts
import status18 from "http-status";

// src/app/modules/stats/stats.service.ts
import status17 from "http-status";
var getDashboardStatsData = async (user) => {
  const existuser = await prisma.user.findUnique({
    where: {
      email: user.email
    }
  });
  if (!existuser) {
    throw new AppError_default(status17.UNAUTHORIZED, "User does not exist or is unauthorized");
  }
  let statsData;
  switch (user.role) {
    case "Admin":
      statsData = getAdminStats(existuser.id);
      break;
    case "Provider":
      statsData = getProviderStats(existuser.id);
      break;
    default:
      throw new AppError_default(status17.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getAdminStats = async (adminId) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: { id: adminId }
  });
  if (existuser.id !== adminId) {
    throw new Error("you are unauthorize");
  }
  return {
    userStats: await getUserStatsInternal(),
    mealStats: await getMealStatsInternal(),
    orderStats: await getOrderStatsInternal(),
    revenueStats: await getRevenueStatsInternal(),
    reviewStats: await getReviewStatsInternal(),
    categoryStats: await getCategoryStatsInternal()
  };
};
var getProviderStats = async (userId) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      provider: { select: { id: true } }
    }
  });
  if (existuser.id !== userId) {
    throw new Error("you are unauthorize");
  }
  return {
    revenueStats: await getProviderRevenueInternal(existuser.provider.id),
    mealStats: await getProviderMealInternal(existuser.provider.id),
    orderStats: await getProviderOrderInternal(existuser.provider.id)
  };
};
var getUserStatsInternal = async () => {
  return prisma.$transaction(async (tx) => {
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
    const [
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
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { status: "suspend" } }),
      tx.user.count({ where: { status: "activate" } }),
      tx.user.count({ where: { role: "Admin" } }),
      tx.user.count({ where: { role: "Customer" } }),
      tx.user.count({ where: { role: "Provider" } }),
      tx.user.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      tx.user.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      tx.user.count({ where: { emailVerified: false } }),
      tx.user.count({ where: { isActive: true } }),
      tx.user.count({ where: { isActive: false } })
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
var getMealStatsInternal = async () => {
  return prisma.$transaction(async (tx) => {
    const [
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals,
      totalapprovedmeals,
      totalpendingmeals,
      totalrejectedmeals
    ] = await Promise.all([
      tx.meal.count(),
      tx.meal.count({ where: { isAvailable: true } }),
      tx.meal.count({ where: { isAvailable: false } }),
      tx.meal.count({ where: { status: "APPROVED" } }),
      tx.meal.count({ where: { status: "PENDING" } }),
      tx.meal.count({ where: { status: "REJECTED" } })
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
var getOrderStatsInternal = async () => {
  return prisma.$transaction(async (tx) => {
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
    const [
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
    ] = await Promise.all([
      tx.order.count(),
      tx.order.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      tx.order.count({ where: { status: "CANCELLED" } }),
      tx.order.count({ where: { status: "PLACED" } }),
      tx.order.count({ where: { status: "PREPARING" } }),
      tx.order.count({ where: { status: "READY" } }),
      tx.order.count({ where: { status: "DELIVERED" } }),
      tx.order.aggregate({ _sum: { totalPrice: true } }),
      tx.orderitem.aggregate({ _sum: { quantity: true } }),
      tx.order.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } })
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
var getRevenueStatsInternal = async () => {
  return prisma.$transaction(async (tx) => {
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
      tx.order.aggregate({ _sum: { totalPrice: true } }),
      tx.order.aggregate({
        _sum: { totalPrice: true },
        where: { createdAt: { gte: startOfToday, lte: endOfToday } }
      }),
      tx.order.aggregate({
        _sum: { totalPrice: true },
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
      }),
      tx.order.aggregate({ _avg: { totalPrice: true } }),
      tx.order.groupBy({
        by: ["providerId"],
        orderBy: { _sum: { totalPrice: "desc" } },
        take: 5
      })
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
var getReviewStatsInternal = async () => {
  return prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const [totalreviews, todayreviews, topRatedMeals] = await Promise.all([
      tx.review.count(),
      tx.review.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      tx.review.groupBy({
        by: ["mealId"],
        _avg: { rating: true },
        orderBy: { _avg: { rating: "desc" } },
        take: 4
      })
    ]);
    return {
      totalreviews,
      todayreviews,
      topRatedMeals
    };
  });
};
var getCategoryStatsInternal = async () => {
  return prisma.$transaction(async (tx) => {
    const [totalcategory, totalcategory_name, mealsPerCategory] = await Promise.all([
      tx.category.count(),
      tx.category.findMany({ select: { name: true } }),
      tx.meal.groupBy({
        by: ["category_name"],
        _count: { _all: true }
      })
    ]);
    return {
      totalcategory,
      totalcategory_name,
      mealsPerCategory
    };
  });
};
var getProviderRevenueInternal = async (providerId) => {
  return prisma.$transaction(async (tx) => {
    const [totalrevenue] = await Promise.all([
      tx.order.aggregate({
        where: { providerId },
        _sum: { totalPrice: true }
      })
    ]);
    return { totalrevenue };
  });
};
var getProviderMealInternal = async (providerId) => {
  return prisma.$transaction(async (tx) => {
    const [totalmeals, totalavailabemeals, totalunavailabemeals] = await Promise.all([
      tx.meal.count({ where: { providerId } }),
      tx.meal.count({ where: { providerId, isAvailable: true } }),
      tx.meal.count({ where: { providerId, isAvailable: false } })
    ]);
    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals
    };
  });
};
var getProviderOrderInternal = async (providerId) => {
  return prisma.$transaction(async (tx) => {
    const [totalorders] = await Promise.all([
      tx.order.count({ where: { providerId } })
    ]);
    return { totalorders };
  });
};
var StatsService = {
  getDashboardStatsData
};

// src/app/modules/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status18.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await StatsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status18.OK,
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

// src/app/routes/index.route.ts
var router9 = Router8();
router9.use("/v1", mealRouter.router);
router9.use("/v1", providerRouter.router);
router9.use("/v1", OrderRouter.router);
router9.use("/v1", CategoryRouter.router);
router9.use("/v1", UserRouter.router);
router9.use("/v1", ReviewsRouter.router);
router9.use("/v1", StatsRoutes);
router9.use("/v1/auth", authRouter.router);
var IndexRouter = router9;

// src/app.ts
var app = express2();
app.use(express2.json());
app.use(cookieParser());
app.use(express2.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
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
var port = process.env.PORT || 4e3;
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
