const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const specials = '!@#$%^&*()_+[]{}|;:,.<>?';

exports.jwtDecode = (jwtToken) => {
    var decoded = jwt.decode(jwtToken);
    return decoded;
}

exports.generateDummyEmail = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';
  for (let i = 0; i < 4; i++) {
    name += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // 8‑digit number
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${name}_${number}@test.zoom.us`;
}

// utils/random.js

exports.generateDummyEmail = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';
  for (let i = 0; i < 4; i++) {
    name += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // 8‑digit number
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${name}_${number}@test.zoom.us`;
};

exports.generateDummyPassword = () => {
  const prefix = 'Atiquezoom';

  // 4 random digits
  let digits = '';
  for (let i = 0; i < 4; i++) {
    digits += Math.floor(Math.random() * 10);
  }

  // 3 random specials
  let specs = '';
  for (let i = 0; i < 3; i++) {
    specs += specials.charAt(Math.floor(Math.random() * specials.length));
  }

  return prefix + digits + specs;
};
