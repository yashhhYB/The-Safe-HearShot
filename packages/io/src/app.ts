// dotenv
const _l = console.log;
console.log = (...params) => _l("\x1b[35m" + "[io]", ...params);

import express, { Request, Response } from "express";
import { createServer } from "http";
import * as admin from "firebase-admin";
import * as serviceAccount from "./service-account.json";
import { Server } from "socket.io";

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const app = express();
const server = createServer(app);

const io = new Server(server);

const PORT = +(process?.env?.IO_PORT ?? 5556);

app.get("/", (req: Request, res: Response) => {
  res.redirect("https://devpost.com/software/hearshot");
  // res.send("hello world :)");
});

const TOKEN =
  "fzyzlrbQlEArr3ecFBKogh:APA91bGAIDLOwH2r75Yv40msYKC7_HjyGbyU5la03YByLwyVgyLwhaBGvwW9lGVMMJBYU2AK8-JczrJBsZqeqU20pxhr66rTEFElaNcuEvtY_zXliruvgWc2lqhj7-DVmu__DWS3kMDT";
app.get("/send-notification", async (req: Request, res: Response) => {
  const { token = TOKEN, title = "hi", body = "body" } = req.query;

  if (!token || !title || !body) {
    res.status(400).send("bad request");
    return;
  }

  try {
    console.log("sending notification", { token, title, body });
    await firebaseAdmin.messaging().send({
      token: token as string,
      notification: {
        title: title as string,
        body: body as string,
      },
    });

    res.status(200).send("ok");
  } catch (e) {
    res.status(500).send("error");
  }
});

app.post("/create-alert", async (req: Request, res: Response) => {
  // get data from request
  const { address, lat, long, date, label, name, raw_address, severity } = req.body;

  const db = firebaseAdmin.firestore();
  const docRef = db.collection("alerts").doc();

  res.status(200).json({
    id: docRef.id,
  });

  await docRef.set({
    address,
    coords: [lat, long],
    date,
    label,
    name,
    raw_address,
    severity,
  });

  // get all tokens
  const tokens = await db.collection("tokens").doc("alerts").get();
  const tokensData = tokens.data();
  const tokensList = tokensData?.tokens ?? [];

  // send notification to all tokens
  await Promise.all(
    tokensList.map(async (token: string) => {
      try {
        console.log("sending notification", { token, title: "New Alert", body: `New alert at ${address}` });
        await firebaseAdmin.messaging().send({
          token: token as string,
          notification: {
            title: `🚨 ${label}`,
            body: `at ${address}. Open the app for more details!`,
          },
        });
      } catch (e) {
        console.log("error sending notification", e);
      }
    })
  );
});

// app.get("/mock", (req, res) => {
//   const db = firebaseAdmin.firestore();
//   const docRef = db.collection("transcriptions").doc("lapd");
//   docRef.set({
//     name: "LAPD Radio Transcript #001",
//     sections: [
//       {
//         start: "2021-08-17 08:00:00",
//         end: "2021-08-17 08:01:00",
//         content: "Unit 5 requesting backup at 123 Main St.",
//       },
//       {
//         start: "2021-08-17 08:02:00",
//         end: "2021-08-17 08:03:00",
//         content: "Unit 10 responding to 123 Main St.",
//       },
//       {
//         start: "2021-08-17 08:05:00",
//         end: "2021-08-17 08:05:30",
//         content: "Suspect in custody at 123 Main St.",
//       },
//     ],
//   });
//   res.json("ok");
// });

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
});

server.listen(PORT, () => {
  console.log(`io listening on http://localhost:${PORT}`);
});
