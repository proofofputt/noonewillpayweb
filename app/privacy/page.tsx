import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-900 via-steel-800 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/95 rounded-lg shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 text-steel-900 border-b-4 border-orange pb-4">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 className="font-bold text-lg mb-2">Your Privacy Matters</h3>
          <p className="text-gray-700">
            This Privacy Policy explains how No One Will Pay collects, uses, discloses, and protects
            your personal information when you participate in our Common Knowledge Survey. We are
            committed to transparency and protecting your privacy rights.
          </p>
        </div>

        <div className="space-y-8 text-gray-800">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3">1.1 Information You Provide Directly</h3>
            <p className="mb-4">When you participate in the Survey, we collect:</p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Contact Information:</strong> Email address, phone number, and region
              (Washington D.C., Maryland, Virginia, or Other)</li>
              <li><strong>Survey Responses:</strong> Your answers to quiz questions about Bitcoin
              and financial literacy</li>
              <li><strong>Consent Preferences:</strong> Whether you consent to being recorded on
              camera and whether you wish to receive newsletters</li>
              <li><strong>Timestamp:</strong> The date and time of your survey submission</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">1.2 Information Collected Automatically</h3>
            <p className="mb-4">
              For fraud prevention and security purposes, we automatically collect:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>IP Address:</strong> Your device's Internet Protocol address, used to prevent
              duplicate submissions and identify fraudulent activity</li>
              <li><strong>User Agent:</strong> Information about your browser and device type</li>
              <li><strong>Submission Metadata:</strong> Whether the survey was submitted by an authorized
              administrator (for street interview mode) or by a public participant</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="font-semibold mb-2">Why We Track IP Addresses:</p>
              <p className="text-sm">
                We collect IP addresses solely to prevent fraudulent duplicate submissions. Each device/IP
                address is limited to one survey submission to ensure data integrity and prevent survey
                manipulation. This is a standard anti-fraud measure used by legitimate research organizations.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">1.3 Audio and Visual Information</h3>
            <p className="mb-4">
              If you consent to being recorded on camera (via the Photo/Video Release Waiver checkbox):
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Video Recordings:</strong> Visual recordings of you taking the survey</li>
              <li><strong>Audio Recordings:</strong> Voice recordings of your responses and reactions</li>
              <li><strong>Photographs:</strong> Still images captured from video recordings</li>
            </ul>
            <p className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-4">
              <strong>You Have Control:</strong> Camera recording is entirely optional. If you do not check
              the camera consent checkbox, no audio or visual recordings will be made.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">2. How We Use Your Information</h2>

            <h3 className="text-xl font-semibold mb-3">2.1 Primary Uses</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Research and Analysis:</strong> To measure Bitcoin and financial literacy levels
              in the D.C. metro area and produce statistical reports</li>
              <li><strong>Educational Content Creation:</strong> To create educational materials, blog posts,
              and resources about common knowledge gaps in financial literacy</li>
              <li><strong>Allocation Points Distribution:</strong> To calculate and distribute allocation
              points based on your survey performance, which may be linked to your email address</li>
              <li><strong>Communication:</strong> To send you your survey results, allocation points balance,
              and access to educational resources (if you provided your email)</li>
              <li><strong>Newsletter (Optional):</strong> To send Bitcoin education and community updates
              if you consented to receive newsletters</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Fraud Prevention and Security</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Duplicate Detection:</strong> IP addresses are checked against our database to
              prevent multiple submissions from the same device</li>
              <li><strong>Abuse Prevention:</strong> User agent and IP data help us identify and block
              automated bots and fraudulent survey submissions</li>
              <li><strong>Data Integrity:</strong> Metadata tracking helps us distinguish between legitimate
              public submissions and admin-conducted street interviews</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Video and Content Creation</h3>
            <p className="mb-4">
              If you consented to camera recording, your image and responses may be used in:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li>Documentary films about Bitcoin adoption and financial literacy</li>
              <li>YouTube videos and social media content</li>
              <li>Educational materials and presentations</li>
              <li>Marketing and promotional materials for Bitcoin education initiatives</li>
              <li>News media appearances and press coverage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">3. Legal Basis for Processing (GDPR)</h2>
            <p className="mb-4">
              If you are located in the European Economic Area (EEA), UK, or other jurisdictions with data
              protection laws similar to GDPR, we process your personal information based on:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Consent:</strong> You have given explicit consent for us to collect and process
              your information for the purposes stated in this policy</li>
              <li><strong>Legitimate Interests:</strong> We have a legitimate interest in preventing fraud
              and ensuring data integrity (IP address tracking)</li>
              <li><strong>Performance of Contract:</strong> Processing is necessary to fulfill our agreement
              to provide you with survey results and allocation points</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">4. How We Share Your Information</h2>

            <h3 className="text-xl font-semibold mb-3">4.1 We May Share Information With:</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> Database hosting (Neon/PostgreSQL), email service
              providers, video hosting platforms, and analytics tools</li>
              <li><strong>Research Partners:</strong> Anonymized, aggregated survey data may be shared with
              Bitcoin education organizations for research purposes (no personally identifiable information)</li>
              <li><strong>Legal Compliance:</strong> Law enforcement or regulatory authorities if required
              by law or to protect our rights</li>
              <li><strong>Public Distribution:</strong> If you consented to camera recording, your video/audio
              may be published publicly on YouTube, social media, and other platforms</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2 We Will NOT:</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li>Sell your personal information to third parties</li>
              <li>Share your email address or phone number with marketers without your consent</li>
              <li>Use your data for purposes unrelated to the Survey without notifying you</li>
              <li>Share your IP address publicly or with unauthorized parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">5. Data Retention</h2>
            <p className="mb-4">We retain your information for the following periods:</p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Survey Responses & Contact Info:</strong> Indefinitely, or until you request deletion,
              to maintain allocation points records and research data integrity</li>
              <li><strong>IP Addresses:</strong> Retained for fraud prevention purposes; may be anonymized
              after 12 months</li>
              <li><strong>Video/Audio Recordings:</strong> Retained indefinitely for content creation purposes
              if you consented to recording</li>
              <li><strong>User Agent & Metadata:</strong> Retained for 24 months for security analysis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">6. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>

            <h3 className="text-xl font-semibold mb-3">6.1 General Rights</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to
              legal retention requirements)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from newsletters at any time</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.2 GDPR Rights (EEA/UK Residents)</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Restriction of Processing:</strong> Request limitation of processing in certain
              circumstances</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (note: video recordings
              already published may not be fully retractable)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.3 CCPA Rights (California Residents)</h3>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Know:</strong> Request disclosure of categories and specific pieces of personal
              information collected</li>
              <li><strong>Delete:</strong> Request deletion of personal information</li>
              <li><strong>Opt-Out of Sale:</strong> We do not sell personal information</li>
              <li><strong>Non-Discrimination:</strong> You will not receive discriminatory treatment for
              exercising your rights</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold mb-2">To Exercise Your Rights:</p>
              <p className="text-sm">
                Email us at <strong>privacy@noonewillpay.com</strong> with your request. We will respond
                within 30 days (or as required by applicable law). You may need to verify your identity
                before we process your request.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">7. Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Encryption:</strong> Data is encrypted in transit (HTTPS/TLS) and at rest in our
              PostgreSQL database</li>
              <li><strong>Access Controls:</strong> Only authorized administrators can access personal
              information, protected by JWT authentication</li>
              <li><strong>Regular Audits:</strong> Periodic security reviews and vulnerability assessments</li>
              <li><strong>Secure Hosting:</strong> Data stored on Neon serverless PostgreSQL with SOC 2
              compliance</li>
            </ul>
            <p className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <strong>No Absolute Security:</strong> While we implement strong security measures, no system
              is 100% secure. We cannot guarantee absolute security of data transmitted over the internet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">8. Children's Privacy</h2>
            <p className="mb-4">
              The Survey is not intended for individuals under 18 years of age. We do not knowingly collect
              personal information from children. If we discover that we have collected information from a
              child under 18, we will delete it immediately.
            </p>
            <p className="mb-4">
              If you are a parent or guardian and believe your child has provided us with personal information,
              please contact us at <strong>privacy@noonewillpay.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">9. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in the United States, where our servers
              are located. The U.S. may have different data protection laws than your country of residence.
            </p>
            <p className="mb-4">
              For EEA/UK residents: We rely on your explicit consent for international transfers. You have
              the right to withdraw consent, though this may prevent us from providing survey services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">10. Third-Party Links</h2>
            <p className="mb-4">
              The Survey may contain links to third-party websites or services (e.g., Bitcoin wallets,
              educational resources). We are not responsible for the privacy practices of these third parties.
              Please review their privacy policies before providing them with personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">11. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with
              an updated "Last Updated" date. Material changes will be communicated via email if we have your
              contact information.
            </p>
            <p className="mb-4">
              Your continued participation in the Survey after changes are posted constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">12. Do Not Track Signals</h2>
            <p className="mb-4">
              Our website does not currently respond to "Do Not Track" browser signals. We collect minimal
              tracking data (IP address and user agent) solely for fraud prevention, not for behavioral
              advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">13. Contact Us</h2>
            <p className="mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal
              information:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="mb-2"><strong>Privacy Inquiries:</strong> privacy@noonewillpay.com</p>
              <p className="mb-2"><strong>General Contact:</strong> legal@noonewillpay.com</p>
              <p className="mb-2"><strong>Mailing Address:</strong> No One Will Pay, Washington, D.C. Metro Area</p>
              <p className="mb-2"><strong>Data Protection Officer:</strong> dpo@noonewillpay.com (EEA/UK inquiries)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">14. Supervisory Authority</h2>
            <p className="mb-4">
              If you are located in the EEA or UK and have concerns about our data processing practices that
              we have not resolved, you have the right to lodge a complaint with your local data protection
              supervisory authority.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
            <h3 className="font-bold text-lg mb-2">Summary of Key Points</h3>
            <ul className="text-sm space-y-1">
              <li>✓ We collect email, phone, region, survey answers, IP address, and user agent</li>
              <li>✓ IP addresses are used ONLY for fraud prevention (one submission per device)</li>
              <li>✓ Video recording is optional and requires explicit consent</li>
              <li>✓ We do not sell your personal information</li>
              <li>✓ You can request access, correction, or deletion of your data</li>
              <li>✓ Contact privacy@noonewillpay.com for privacy-related questions</li>
            </ul>
          </div>

          <p className="text-center text-gray-600 mb-6">
            By participating in the Survey, you acknowledge that you have read and understood this Privacy Policy.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/terms"
              className="inline-block px-8 py-3 bg-steel-700 text-white font-bold rounded-lg hover:bg-steel-800 transition-colors"
            >
              View Terms of Service
            </Link>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors"
            >
              Return to Survey
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
