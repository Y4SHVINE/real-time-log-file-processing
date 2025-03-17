# Real-Time Log File Processing

## Overview

This project is a real-time log file processing system built using Node.js, Next.js 15, React 18, BullMQ, Supabase, and Docker. It enables users to upload log files, processes them asynchronously using a queue system, and updates a dashboard with live statistics using WebSockets.

## Features

- Log Uploading: Users can upload log files via a frontend interface.

- Queue-Based Processing: Logs are processed asynchronously using BullMQ.

- WebSocket Updates: Real-time updates on log statistics.

- Supabase Storage: Logs are stored in Supabase for persistence.

- Authentication: Secure user authentication using Supabase Auth.

- Redux State Management: WebSocket data updates stored using Redux.

- Docker Support: Containerized for easy deployment.

## Tech Stack

- Frontend: Next.js 15, React 18, Redux

- Backend: Express.js, Supabase, BullMQ

- Database: Supabase (PostgreSQL)

- Queue System: BullMQ (Redis-based)

- Testing: Jest (Unit & Integration Tests)

- Deployment: Docker

## Development

Using Docker Compose:

`docker-compose up --build`