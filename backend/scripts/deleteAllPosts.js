#!/usr/bin/env node
const readline = require('readline');
const connectDB = require('../config/database');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const argv = process.argv.slice(2);
const autoYes = argv.includes('--yes') || argv.includes('-y');

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('This script will permanently DELETE ALL documents in the posts collection.');
  console.log('Make sure you have a backup or are pointed at the correct database.');

  if (!autoYes) {
    const answer = await prompt('Type DELETE to confirm or cancel to abort: ');
    if (answer !== 'DELETE') {
      console.log('Aborted by user. No changes were made.');
      process.exit(0);
    }
  } else {
    console.log('--yes flag detected: proceeding without interactive confirmation.');
  }

  // Connect to DB
  await connectDB();

  try {
    const countBefore = await Post.countDocuments();
    if (countBefore === 0) {
      console.log('No posts found — nothing to delete.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Found ${countBefore} posts. Deleting...`);

    const res = await Post.deleteMany({});
    console.log(`Deleted ${res.deletedCount || countBefore} posts.`);
  } catch (err) {
    console.error('Error deleting posts:', err);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
    process.exit();
  }
}

main();
