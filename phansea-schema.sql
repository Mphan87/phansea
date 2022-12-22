CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  img TEXT,
  bio TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE saltwaterfish (
  handle TEXT PRIMARY KEY,
  name TEXT,
  taxonomy TEXT UNIQUE NOT NULL,
  image TEXT UNIQUE NOT NULL,
  reefsafe TEXT,
  maxsize TEXT,
  description TEXT,
  type TEXT
);

CREATE TABLE freshwaterfish (
  handle TEXT PRIMARY KEY,
  name TEXT,
  taxonomy TEXT UNIQUE NOT NULL,
  image TEXT UNIQUE NOT NULL,
  maxsize TEXT,
  description TEXT,
  type TEXT
);

CREATE TABLE coral (
  handle TEXT PRIMARY KEY,
  name TEXT,
  image TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT
);

