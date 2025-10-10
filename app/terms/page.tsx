import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-900 via-steel-800 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/95 rounded-lg shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 text-steel-900 border-b-4 border-orange pb-4">
          Terms of Service
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-800">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and participating in the No One Will Pay Common Knowledge Survey (the "Survey"),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please
              do not participate in the Survey.
            </p>
            <p className="mb-4">
              The Survey is operated by No One Will Pay ("we," "us," or "our"), a research initiative
              focused on measuring Bitcoin and financial literacy in the Washington, D.C. metropolitan area.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">2. Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years of age to participate in this Survey. By participating, you
              represent and warrant that you meet this age requirement and have the legal capacity to
              enter into this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">3. Survey Purpose and Use</h2>
            <p className="mb-4 font-semibold">
              This Survey is conducted for the following purposes:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Research and Education:</strong> To measure common knowledge about Bitcoin,
              cryptocurrency, and financial literacy</li>
              <li><strong>Content Creation:</strong> To create educational materials, reports, and
              potentially documentary content about financial literacy</li>
              <li><strong>Community Building:</strong> To connect participants with Bitcoin educational
              resources, decentralized community initiatives, and networking opportunity for projects and partnerships</li>
              <li><strong>Points Distribution:</strong> To determine knowledge, skills, participation, and performance of a variety of quizes, as well as on going research and review content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">4. Participant Responsibilities</h2>
            <p className="mb-4">By participating in the Survey, you agree to:</p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li>Provide truthful and accurate information</li>
              <li>Answer questions to the best of your knowledge</li>
              <li>Not use automated tools, bots, or fraudulent means to complete the Survey</li>
              <li>Submit the Survey only once (duplicate submissions from the same device/IP address
              may be rejected)</li>
              <li>Respect the intellectual property rights of all survey content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">5. Video and Photo Release</h2>
            <p className="mb-4">
              If you consent to being recorded on camera (by checking the Photo/Video Release Waiver
              checkbox), you grant us the following rights:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>Unrestricted Use:</strong> The right to use, reproduce, distribute, and display
              your image, likeness, voice, and responses in any media format (including but not limited to
              documentary films, YouTube videos, social media, educational materials, and promotional content)</li>
              <li><strong>No Compensation:</strong> You acknowledge that you will not receive any financial
              compensation for the use of your image or responses</li>
              <li><strong>Perpetual License:</strong> This license is worldwide, royalty-free, and perpetual</li>
              <li><strong>Waiver of Privacy Rights:</strong> You waive any right to inspect or approve the
              finished product or any promotional materials in which your image appears</li>
              <li><strong>Release of Liability:</strong> You release us from any claims arising from the use
              of your image, including but not limited to defamation, invasion of privacy, or rights of publicity</li>
            </ul>
            <p className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <strong>Important:</strong> If you do not wish to be recorded, simply leave the camera
              consent checkbox unchecked. You may still participate in the Survey without appearing on camera.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">6. Allocation Points System</h2>
            <p className="mb-4">
              Participants who provide contact information may receive allocation points based on their
              survey performance. These points may be used for:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li>Future Bitcoin or digital asset distributions</li>
              <li>Access to educational resources and materials</li>
              <li>Participation in community initiatives</li>
              <li>Eligibility for future programs and opportunities</li>
            </ul>
            <p className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-4">
              <strong>No Guarantee of Value:</strong> Allocation points have no guaranteed monetary value.
              We reserve the right to modify, suspend, or terminate the allocation points system at any time
              without prior notice. Points are not transferable and have no cash value.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">7. Data Collection and Security</h2>
            <p className="mb-4">
              We collect and process personal information as described in our{' '}
              <Link href="/privacy" className="text-orange hover:underline font-semibold">
                Privacy Policy
              </Link>. By participating in the Survey, you consent to such collection and processing.
            </p>
            <p className="mb-4">
              We implement reasonable security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>IP address tracking for fraud prevention (see Privacy Policy)</li>
              <li>Limited access to personal information by authorized personnel only</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">8. Intellectual Property</h2>
            <p className="mb-4">
              All survey questions, content, design elements, and materials are the intellectual property
              of No One Will Pay or our licensors. Your responses become our property upon submission and
              may be used for research, educational, and promotional purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">9. Disclaimers and Limitations of Liability</h2>
            <p className="mb-4 font-semibold">THE SURVEY IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li><strong>No Professional Advice:</strong> Survey content is for educational purposes only
              and does not constitute financial, investment, tax, or legal advice</li>
              <li><strong>No Guarantee of Accuracy:</strong> While we strive for accuracy, we do not
              guarantee that survey questions or explanations are error-free</li>
              <li><strong>Third-Party Links:</strong> We are not responsible for any third-party websites,
              services, or resources referenced in the Survey</li>
              <li><strong>Limitation of Liability:</strong> We are not liable for any direct, indirect,
              incidental, consequential, or punitive damages arising from your participation in the Survey</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">10. Termination and Modification</h2>
            <p className="mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4">
              <li>Terminate or suspend the Survey at any time without prior notice</li>
              <li>Modify these Terms of Service at our discretion (changes will be posted with an updated
              "Last Updated" date)</li>
              <li>Reject, remove, or disqualify any survey submission that violates these terms or appears
              fraudulent</li>
              <li>Ban participants who engage in abusive, fraudulent, or inappropriate behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">11. Governing Law and Dispute Resolution</h2>
            <p className="mb-4">
              These Terms of Service are governed by the laws of Montgomery County, Maryland, United States,
              without regard to conflict of law principles.
            </p>
            <p className="mb-4">
              Any disputes arising from these terms or your participation in the Survey shall be resolved
              through binding arbitration in Montgomery County, Maryland, in accordance with the American Arbitration
              Association rules. You waive your right to participate in class action lawsuits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">12. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> noonewillpay21@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">13. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms of Service is found to be unenforceable or invalid, that
              provision shall be limited or eliminated to the minimum extent necessary so that these terms
              shall otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-steel-900">14. Entire Agreement</h2>
            <p className="mb-4">
              These Terms of Service, together with our Privacy Policy, constitute the entire agreement
              between you and No One Will Pay regarding the Survey and supersede all prior agreements and
              understandings.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <p className="text-center text-gray-600">
            By clicking "Complete Sign Up" on the Survey, you acknowledge that you have read, understood,
            and agree to be bound by these Terms of Service.
          </p>
          <div className="mt-6 text-center">
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
