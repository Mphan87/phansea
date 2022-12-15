\echo 'Delete and recreate phansea db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE phansea;
CREATE DATABASE phansea;
\connect phansea

\i phansea-schema.sql
\i phansea-seed.sql

\echo 'Delete and recreate phansea_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE phansea_test;
CREATE DATABASE phansea_test;
\connect phansea_test

\i phansea-schema.sql
