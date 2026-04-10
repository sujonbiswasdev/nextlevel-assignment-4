import z from "zod";
import { CreateproviderData } from "./provider.validation";

// create provider type
export type ICreateproviderData=z.infer<typeof CreateproviderData>