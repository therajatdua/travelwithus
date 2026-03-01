import * as dotenv from "dotenv";
dotenv.config();
import { generateItinerary } from "./services/ai";
generateItinerary({ destination: "health-check", origin: "test", transport: "Flight", adults: 1, children: 0, seniors: 0, nights: 1 }).then(console.log).catch(console.error);
