---
name: database-skill
description: Create tables, manage migrations, and design database schemas for modern applications.
---

# Database Skill

## Instructions

1. **Schema Design**
   - Plan tables, relationships, and constraints
   - Normalize data for efficiency and integrity
   - Use primary and foreign keys appropriately
   - Define indexes for performance-critical queries

2. **Migrations**
   - Create safe migration scripts
   - Version control schema changes
   - Apply migrations consistently across environments
   - Rollback changes safely if needed

3. **Table Creation**
   - Define column types correctly
   - Apply constraints like NOT NULL, UNIQUE
   - Include default values where applicable
   - Ensure referential integrity between tables

4. **Database Maintenance**
   - Optimize queries and indexes
   - Monitor data growth and performance
   - Handle backups and restores safely
   - Enforce security and access control

---

## Best Practices

- Keep table and column names consistent  
- Avoid redundant data and duplication  
- Use meaningful indexes for frequently queried fields  
- Write migration scripts to be idempotent  
- Test schema changes in a staging environment  
- Protect sensitive data with proper permissions  

---

## Example Structure

```sql
-- Users table example
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table example
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
