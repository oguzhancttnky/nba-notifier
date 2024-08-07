SELECT 'CREATE DATABASE nba-notifier' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nba-notifier')\gexec
\c nba-notifier
