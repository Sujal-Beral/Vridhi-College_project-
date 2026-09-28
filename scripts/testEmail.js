// scripts/testEmail.js
// Standalone Email Diagnostic & Test Harness for Vridhi
require('dotenv').config();
const emailService = require('../services/emailService');

async function testEmailPipeline() {
    console.log('====================================================');
    console.log('       Vridhi Email Pipeline Diagnostic Test');
    console.log('====================================================\n');

    // 1. Diagnostics check (Masks all sensitive passwords)
    emailService.logTransporterDiagnostics();
    console.log('\n----------------------------------------------------');

    // 2. Transporter Verification
    console.log('[Step 1] Verifying SMTP Transporter Connection...');
    const verifyRes = await emailService.verifyTransporter();

    if (!verifyRes.success) {
        console.log('\n❌ SMTP Verification FAILED.');
        console.log(`Reason: ${verifyRes.reason || verifyRes.error || 'Unknown error'}`);
        if (verifyRes.code) console.log(`Error Code: ${verifyRes.code}`);
        if (verifyRes.response) console.log(`Server Response: ${verifyRes.response}`);
        console.log('\nPlease check your .env SMTP credentials:');
        console.log('- EMAIL_HOST (e.g., smtp.gmail.com)');
        console.log('- EMAIL_PORT (e.g., 587)');
        console.log('- EMAIL_USER (e.g., your_email@gmail.com)');
        console.log('- EMAIL_PASSWORD (e.g., your 16-character App Password)');
        process.exit(1);
    }

    console.log('✅ SMTP verification successful.\n');

    // 3. Send Test Email
    const targetRecipient = process.argv[2] || process.env.EMAIL_USER;
    if (!targetRecipient) {
        console.log('⚠️ No EMAIL_USER found in .env and no recipient passed as CLI arg.');
        console.log('Usage: node scripts/testEmail.js <recipient@example.com>');
        process.exit(0);
    }

    console.log(`[Step 2] Sending test goal completion email to: ${targetRecipient}...`);
    const sendRes = await emailService.sendGoalCompletedEmail({
        to: targetRecipient,
        name: 'Vridhi Test User',
        goalName: 'Emergency Reserve (Test)',
        targetAmount: 50000,
        savedAmount: 50000
    });

    if (sendRes.success) {
        console.log('\n🎉 TEST EMAIL PIPELINE VERIFIED SUCCESSFULLY!');
        console.log(`Message ID: ${sendRes.messageId}`);
        console.log(`Recipient: ${targetRecipient}`);
    } else {
        console.log('\n❌ Test email delivery failed.');
        console.log(`Error: ${sendRes.error}`);
        if (sendRes.code) console.log(`Code: ${sendRes.code}`);
        if (sendRes.response) console.log(`Response: ${sendRes.response}`);
    }

    process.exit(sendRes.success ? 0 : 1);
}

testEmailPipeline().catch((err) => {
    console.error('Fatal test error:', err.message);
    process.exit(1);
});
