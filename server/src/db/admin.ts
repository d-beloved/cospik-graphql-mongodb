const adminTable = `
  DROP TABLE IF EXISTS admin CASCADE;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE admin (
    ID uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
  );
`;

export default adminTable;
