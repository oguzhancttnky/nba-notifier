SELECT 'CREATE DATABASE nba_notifier' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nba_notifier')\gexec
\c nba_notifier
