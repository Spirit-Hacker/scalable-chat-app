import dotenv from "dotenv";
dotenv.config();

import { Kafka, Producer } from "kafkajs";
import axios from "axios";

const kafka = new Kafka({
  brokers: [process.env.KAFKA_HOST || ""],
});

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) {
    return producer;
  }

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  console.log("New message produced to kafka", message);
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });

  return true;
}

export async function startMessageConsumer() {
  console.log("Consumer is running...");

  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;

      console.log("New message received on kafka", message.value.toString());
      try {
        // TODO: Add database query
        console.log("Message in kafka consumer", message.value.toString());

        const data = JSON.parse(message.value.toString());
        const response = await axios
          .post(
            `http://localhost:8000/api/v1/messages/sendMessage/${data.receiverId}`,
            {
              message: data.message,
              senderId: data.senderId,
              messageId: data.messageId,
            }
          )
          .then((res) => res.data)
          .catch((err) => console.log(err));

        console.log("Response: ", response);
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
