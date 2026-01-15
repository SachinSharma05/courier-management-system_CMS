// apps/api/src/scripts/import-pincodes.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { db } from '../db'; // Use your existing DB instance
import { pincodes } from '../db/schema';

async function run() {
  const csvFilePath = path.resolve(process.cwd(), '../data/pincodes.csv');
  const results: any[] = [];
  
  console.log('🚀 Reading CSV...');

  const parser = fs.createReadStream(csvFilePath).pipe(csv());
  for await (const record of parser) {
    results.push({
      provider: 'DELHIVERY',
      pincode: record.pincode,
      city: record.city,
      state: record.state,
      cod_delivery: record.cod_delivery,
      prepaid_delivery: record.prepaid_delivery,
      pickup: record.pickup,
      zone_group: record.zone_group,
      zone_code: record.zone_code,
      created_at: new Date(),
    });
  }

  console.log(`📦 Found ${results.length} rows. Starting chunked upload...`);

  // --- START CHUNKING LOGIC ---
  const CHUNK_SIZE = 500; // Small enough to stay under Neon's limits
  for (let i = 0; i < results.length; i += CHUNK_SIZE) {
    const chunk = results.slice(i, i + CHUNK_SIZE);
    
    try {
      await db.insert(pincodes).values(chunk).onConflictDoNothing();
      console.log(`✅ Uploaded rows ${i} to ${Math.min(i + CHUNK_SIZE, results.length)}`);
    } catch (err) {
      console.error(`❌ Failed at chunk starting at index ${i}:`, err);
    }
  }
  // --- END CHUNKING LOGIC ---

  console.log('✨ SUCCESS! All data processed.');
  process.exit(0);
}

run();