import {formatError} from '../utils/formatError.js';
import dotenv from 'dotenv';
dotenv.config();

import Clarifai from 'clarifai';
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const PAT = process.env.CLARIFAI_PAT;
const USER_ID = process.env.CLARIFAI_USERID;
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

// Handle API call to Clarifai for face detection
export const handleApiCall = (req, res) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json(formatError("please provide image url"));
  }
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        { data: { image: { url: input, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(400).json(formatError("something is wrong"));
      }

      if (response.status.code !== 10000) {
        console.log(response.status.description);
        res.status(400).json(formatError("something is wrong"));
      }
      res.json(response);
    }
  );
};
 
export const handleImage = async (req, res, db) => {
  const { Id } = req.body;
  const userEntries = await db
    .table("users")
    .where({ id: Id })
    .increment({ entries: 1 })
    .returning("entries");

  if (userEntries.length) {
    res.json(userEntries[0].entries);
  } else {
    res.status(404).json(formatError("user not found"));
  }
};