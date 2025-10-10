// Test database connection and check survey submissions
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✓ Database connected successfully!');
    console.log('Current time:', result[0].current_time);

    // Check if survey_responses table exists
    console.log('\n2. Checking if survey_responses table exists...');
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'survey_responses'
      ) as table_exists
    `;

    if (tableCheck[0].table_exists) {
      console.log('✓ survey_responses table exists');

      // Count survey submissions
      console.log('\n3. Counting survey submissions...');
      const count = await sql`SELECT COUNT(*) as total FROM survey_responses`;
      console.log(`Total survey submissions: ${count[0].total}`);

      // Get recent submissions
      console.log('\n4. Fetching recent submissions...');
      const recent = await sql`
        SELECT id, email, phone, region, score, "timestamp", "ipAddress", "isAdminSubmission"
        FROM survey_responses
        ORDER BY "timestamp" DESC
        LIMIT 5
      `;

      if (recent.length > 0) {
        console.log(`\nRecent ${recent.length} submission(s):`);
        recent.forEach((row, i) => {
          console.log(`\n${i + 1}. Submission ID: ${row.id}`);
          console.log(`   Email: ${row.email || 'N/A'}`);
          console.log(`   Phone: ${row.phone}`);
          console.log(`   Region: ${row.region}`);
          console.log(`   Score: ${row.score}`);
          console.log(`   IP: ${row.ipAddress || 'N/A'}`);
          console.log(`   Admin: ${row.isAdminSubmission ? 'Yes' : 'No'}`);
          console.log(`   Time: ${row.timestamp}`);
        });
      } else {
        console.log('No submissions found yet.');
      }

      // Check schema
      console.log('\n5. Checking table schema...');
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'survey_responses'
        ORDER BY ordinal_position
      `;
      console.log('\nTable columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
      });

    } else {
      console.log('✗ survey_responses table does NOT exist!');
      console.log('You need to run database migrations.');
    }

  } catch (error) {
    console.error('\n✗ Database test failed:');
    console.error('Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.detail) console.error('Detail:', error.detail);
  }
}

testDatabase();
