import { SchemaType } from '@kafkajs/confluent-schema-registry';

const {
  SchemaRegistry,
  avdlToAVSCAsync,
} = require('@kafkajs/confluent-schema-registry');

const registry = new SchemaRegistry({ host: 'http://localhost:8081' });

const run = async () => {
  try {
    const schema = await avdlToAVSCAsync('./avro/events.avdl');
    const { id } = await registry.register({
      type: SchemaType.AVRO,
      schema: JSON.stringify(schema),
    });
  } catch (err) {
    console.log(err);
  }
};

run().catch(console.error);
